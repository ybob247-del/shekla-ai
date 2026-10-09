/**
 * POST /api/debt/plan
 *
 * The free half of the debt payoff tool. Takes a list of debts and returns the
 * headline numbers for both methods: how long each takes, what each costs in
 * interest, and the difference between them.
 *
 * Deliberately free, and deliberately real. Seeing "debt free in 26 months,
 * and paying the highest rate first saves you $251" is the proof the tool
 * works. Charging before anyone sees a number asks people to gamble $19; this
 * way the $19 buys acting on a number they already trust.
 *
 * What it does NOT return is the month-by-month schedule or the written plan.
 * Those come from /api/debt/unlock after payment.
 *
 * Nothing is stored. The debts arrive in the request, are turned into numbers,
 * and are gone when the function returns. Debt balances are the most sensitive
 * thing this site could hold, and the surest way never to leak them is never
 * to keep them.
 */
import { rateLimited } from "../_rateLimit";
import {
  compare,
  DebtInputError,
  formatDuration,
  NeverClearsError,
  payoffDate,
  type DebtInput,
  type PayoffResult,
} from "./_engine";

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

/** The summary view: everything except the schedule, which is the paid part. */
function summarise(r: PayoffResult) {
  return {
    method: r.method,
    months: r.months,
    duration: formatDuration(r.months),
    debtFreeBy: payoffDate(r.months),
    totalInterestCents: r.totalInterestCents,
    totalPaidCents: r.totalPaidCents,
    order: r.order.map((o) => ({ name: o.name, month: o.month })),
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // This endpoint costs nothing per call: the maths is local and no model is
  // involved. The limit is only to stop someone hammering it for CPU, so it is
  // generous. The paid narrative endpoint will sit behind Stripe, which is a
  // far harder gate than any rate limit.
  if (await rateLimited(req, res, { name: "debt-plan", limit: 30, windowSeconds: 3600 })) {
    return;
  }

  const body = (typeof req.body === "string" ? safeParse(req.body) : req.body) as
    | { debts?: DebtInput[]; extraPerMonth?: number }
    | undefined;

  try {
    const result = compare(body?.debts ?? [], Number(body?.extraPerMonth) || 0);
    const best = result.recommended === "avalanche" ? result.avalanche : result.snowball;

    res.status(200).json({
      ok: true,
      recommended: result.recommended,
      interestSavedCents: result.interestSavedCents,
      monthsSaved: result.monthsSaved,
      totalStartingBalanceCents: result.totalStartingBalanceCents,
      totalMinimumCents: result.totalMinimumCents,
      extraPerMonthCents: result.extraPerMonthCents,
      monthlyOutlayCents: result.totalMinimumCents + result.extraPerMonthCents,
      firstTarget: best.order[0]?.name ?? null,
      avalanche: summarise(result.avalanche),
      snowball: summarise(result.snowball),
    });
  } catch (error) {
    if (error instanceof NeverClearsError) {
      // Not an error from the visitor's point of view. It is the most useful
      // thing the tool can tell them, so it gets its own shape rather than a
      // generic failure.
      res.status(200).json({
        ok: false,
        reason: "never-clears",
        message:
          "At these payments the interest grows faster than the balance comes down, so these debts never clear. The fix is a bigger monthly payment or a lower rate, not a different payoff order.",
        monthlyInterestCents: error.monthlyInterestCents,
        budgetCents: error.budgetCents,
      });
      return;
    }
    if (error instanceof DebtInputError) {
      res.status(400).json({ ok: false, reason: "input", message: error.message });
      return;
    }
    console.error("[debt/plan] unexpected failure:", error instanceof Error ? error.message : error);
    res.status(500).json({ ok: false, reason: "server", message: "Something went wrong working that out." });
  }
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
