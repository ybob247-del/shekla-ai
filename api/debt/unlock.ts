/**
 * POST /api/debt/unlock
 *
 * The paid half. Verifies a Stripe session is genuinely paid, recomputes the
 * plan from the debts the browser posts back, and returns the month-by-month
 * schedule plus the written explanation.
 *
 * Order matters here: Stripe is checked FIRST, before anything expensive runs.
 * The model is only ever called for a session that has actually been paid for,
 * so nobody can burn tokens without paying $19 first. That is a far harder gate
 * than a rate limit, and it is why this endpoint does not need a tight one.
 *
 * Replay is capped rather than blocked. A buyer should be able to refresh,
 * reopen the tab, or come back tomorrow, but a paid session should not become
 * an unlimited generator. The counter lives in Redis; if Redis is unreachable
 * the request is allowed, because a paying customer must never be locked out
 * of what they bought by a cache outage.
 */
import Stripe from "stripe";
import { readStripeKey } from "../_stripeKey";
import { DEBT_PLAN_PRODUCT } from "./checkout";
import { compare, DebtInputError, NeverClearsError, formatDuration, payoffDate, type DebtInput } from "./_engine";
import { aiNarrative, buildFacts, fallbackNarrative, NARRATIVE_MODEL } from "./_narrative";

const MAX_UNLOCKS_PER_SESSION = 15;
const UNLOCK_TTL_SECONDS = 60 * 60 * 24 * 60; // 60 days

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface ApiResponse {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

/** Counts unlocks for one paid session. Allows the request if Redis is down. */
async function withinReplayCap(sessionId: string): Promise<boolean> {
  let url = (process.env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/+$/, "");
  if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  if (!url || !token) return true;

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", `unlock:${sessionId}`],
        ["EXPIRE", `unlock:${sessionId}`, String(UNLOCK_TTL_SECONDS), "NX"],
      ]),
    });
    if (!response.ok) return true;
    const body = (await response.json()) as { result?: number }[];
    return Number(body?.[0]?.result ?? 0) <= MAX_UNLOCKS_PER_SESSION;
  } catch {
    return true;
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (typeof req.body === "string" ? safeParse(req.body) : req.body) as
    | { sessionId?: unknown; debts?: DebtInput[]; extraPerMonth?: number }
    | undefined;

  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  if (!sessionId || !sessionId.startsWith("cs_") || sessionId.length > 200) {
    res.status(400).json({ ok: false, reason: "session", message: "Missing or malformed checkout session." });
    return;
  }

  const secretKey = readStripeKey();
  if (!secretKey) {
    console.error("[debt/unlock] STRIPE_SECRET_KEY is not set");
    res.status(500).json({ ok: false, reason: "server", message: "Payments are not configured yet." });
    return;
  }

  // ── Payment first. Nothing expensive runs above this line. ────────────────
  try {
    const stripe = new Stripe(secretKey, { apiVersion: "2025-02-24.acacia" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      res.status(402).json({
        ok: false,
        reason: "unpaid",
        message: "That checkout has not been paid for yet.",
      });
      return;
    }
    // Any paid session on the account would otherwise unlock this, including
    // one for a $19 toolkit.
    if (session.metadata?.productId !== DEBT_PLAN_PRODUCT) {
      res.status(403).json({
        ok: false,
        reason: "wrong-product",
        message: "That purchase was for something else.",
      });
      return;
    }
  } catch (error) {
    const stripeError = error as { code?: string; type?: string };
    console.error("[debt/unlock] Stripe lookup failed:", stripeError.type, stripeError.code);
    res.status(502).json({ ok: false, reason: "stripe", message: "Could not verify that purchase." });
    return;
  }

  if (!(await withinReplayCap(sessionId))) {
    res.status(429).json({
      ok: false,
      reason: "replay",
      message: "This plan has been opened many times. Save or print it, or get in touch and we will help.",
    });
    return;
  }

  // ── Recompute. The schedule is never taken from the client. ───────────────
  let result;
  try {
    result = compare(body?.debts ?? [], Number(body?.extraPerMonth) || 0);
  } catch (error) {
    if (error instanceof NeverClearsError || error instanceof DebtInputError) {
      res.status(400).json({ ok: false, reason: "input", message: error.message });
      return;
    }
    console.error("[debt/unlock] unexpected failure:", error instanceof Error ? error.message : error);
    res.status(500).json({ ok: false, reason: "server", message: "Something went wrong building that plan." });
    return;
  }

  const best = result.recommended === "avalanche" ? result.avalanche : result.snowball;
  const facts = buildFacts(result, (body?.debts ?? []).map((d) => ({ name: d.name, apr: Number(d.apr) || 0 })));

  const ai = await aiNarrative(facts);

  // An access log, not a record of the plan. Digital-goods disputes turn on
  // being able to show the buyer received what they paid for, and this is the
  // evidence for that: session, time, and whether delivery succeeded. It
  // deliberately holds no balances, rates or payoff figures, so it is a log
  // rather than a copy of anyone's finances.
  console.log(
    "[debt/unlock] delivered",
    JSON.stringify({
      session: sessionId,
      at: new Date().toISOString(),
      months: best.months,
      narrative: ai ? "model" : "written",
    }),
  );

  res.status(200).json({
    ok: true,
    recommended: result.recommended,
    duration: formatDuration(best.months),
    debtFreeBy: payoffDate(best.months),
    months: best.months,
    totalInterestCents: best.totalInterestCents,
    totalPaidCents: best.totalPaidCents,
    interestSavedCents: result.interestSavedCents,
    monthlyOutlayCents: result.totalMinimumCents + result.extraPerMonthCents,
    order: best.order,
    schedule: best.schedule,
    narrative: ai ?? fallbackNarrative(facts),
    // Honest about which one the buyer got, rather than implying AI either way.
    narrativeSource: ai ? NARRATIVE_MODEL : "written",
  });
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
