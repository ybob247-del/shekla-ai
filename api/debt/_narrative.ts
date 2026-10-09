/**
 * The written half of the debt payoff plan.
 *
 * The one architectural rule: the model never calculates anything. It is handed
 * numbers that api/debt/_engine.ts has already computed, pre-formatted as
 * strings, and asked to explain them. A bad generation can therefore produce a
 * clumsy sentence, but it cannot produce a wrong payoff date. That is what
 * makes "AI-powered" an honest claim here rather than a liability.
 *
 * It also never has to work. Someone who has paid $19 gets their plan whether
 * or not OpenAI is reachable, so there is a written fallback assembled from the
 * same facts. The model is an improvement on that text, not the product.
 */
import { formatDuration, formatUsd, payoffDate, type ComparisonResult } from "./_engine";

export const NARRATIVE_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export interface PlanFacts {
  recommended: "avalanche" | "snowball";
  recommendedLabel: string;
  firstTarget: string;
  firstTargetApr: string;
  monthlyOutlay: string;
  totalBalance: string;
  duration: string;
  debtFreeBy: string;
  interestPaid: string;
  interestSaved: string;
  monthsSaved: number;
  payoffOrder: { name: string; when: string }[];
  biggestRate: { name: string; apr: string } | null;
  hasExtra: boolean;
}

/** Turns the computed result into plain facts. No judgement, no prose. */
export function buildFacts(
  result: ComparisonResult,
  debts: { name: string; apr: number }[],
): PlanFacts {
  const best = result.recommended === "avalanche" ? result.avalanche : result.snowball;
  const sortedByRate = [...debts].sort((a, b) => b.apr - a.apr);
  const first = best.order[0];

  return {
    recommended: result.recommended,
    recommendedLabel:
      result.recommended === "avalanche" ? "highest interest rate first" : "smallest balance first",
    firstTarget: first?.name ?? "your first debt",
    firstTargetApr: `${(debts.find((d) => d.name === first?.name)?.apr ?? 0).toFixed(2)}%`,
    monthlyOutlay: formatUsd(result.totalMinimumCents + result.extraPerMonthCents),
    totalBalance: formatUsd(result.totalStartingBalanceCents),
    duration: formatDuration(best.months),
    debtFreeBy: payoffDate(best.months),
    interestPaid: formatUsd(best.totalInterestCents),
    interestSaved: formatUsd(result.interestSavedCents),
    monthsSaved: result.monthsSaved,
    payoffOrder: best.order.map((o) => ({ name: o.name, when: payoffDate(o.month) })),
    biggestRate: sortedByRate[0]
      ? { name: sortedByRate[0].name, apr: `${sortedByRate[0].apr.toFixed(2)}%` }
      : null,
    hasExtra: result.extraPerMonthCents > 0,
  };
}

/** Written by code, from the same facts. Always available. */
export function fallbackNarrative(f: PlanFacts): string[] {
  const paras: string[] = [];

  paras.push(
    `Paying ${f.monthlyOutlay} a month, you clear ${f.totalBalance} of debt in ${f.duration}, which puts your last payment in ${f.debtFreeBy}. Along the way you pay ${f.interestPaid} in interest.`,
  );

  paras.push(
    `Start with ${f.firstTarget}. Pay the minimum on everything else and put every spare dollar there until it is gone. Then take the whole amount you were paying on it and move that onto the next debt in the list, without reducing your monthly total. That rolling is what makes this work: your payment to the next debt is always bigger than its minimum.`,
  );

  if (f.interestSaved !== "$0") {
    paras.push(
      `Going ${f.recommendedLabel} rather than the other way round saves you ${f.interestSaved} in interest${f.monthsSaved > 0 ? ` and finishes ${f.monthsSaved} month${f.monthsSaved === 1 ? "" : "s"} sooner` : ""}. That saving is the whole reason the order matters.`,
    );
  } else {
    paras.push(
      `Both orders cost you about the same here, so pick the one you will actually stick with. If clearing a small debt quickly keeps you going, start there instead.`,
    );
  }

  if (!f.hasExtra) {
    paras.push(
      `This plan assumes you pay only the minimums. If you can find even $25 a month to add, put it all on ${f.firstTarget} and the whole timeline shortens, because that money comes straight off the balance rather than the interest.`,
    );
  }

  paras.push(
    `In a month where you cannot manage the extra, pay the minimums on everything and carry on the following month. The order does not reset and nothing is undone. Missing a minimum is the only thing that genuinely sets you back, because that is where late fees and rate rises come from.`,
  );

  return paras;
}

/**
 * Asks the model to rewrite the same facts more personally. Returns null on any
 * failure, including a response that looks like it invented figures.
 */
export async function aiNarrative(f: PlanFacts): Promise<string[] | null> {
  const apiKey = (process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    console.error("[debt/narrative] OPENAI_API_KEY is not set — using the written fallback.");
    return null;
  }

  const system = [
    "You write short, plain, practical money guidance for people who are not confident with money.",
    "Tone: direct, warm, never patronising. No shame, no lectures about coffee, no exclamation marks.",
    "You are given figures that have already been calculated. Use them EXACTLY as written.",
    "Never invent, recalculate, round or adjust any number, date or percentage.",
    "Do not add figures that are not in the facts given to you.",
    "Return 4 to 5 short paragraphs as a JSON array of strings, and nothing else.",
  ].join(" ");

  const user = [
    "Write the explanation for this debt payoff plan.",
    "",
    `Monthly payment: ${f.monthlyOutlay}`,
    `Total debt: ${f.totalBalance}`,
    `Time to clear: ${f.duration}, finishing ${f.debtFreeBy}`,
    `Interest paid: ${f.interestPaid}`,
    `Recommended order: ${f.recommendedLabel}`,
    `First debt to attack: ${f.firstTarget} at ${f.firstTargetApr}`,
    `Interest saved versus the other order: ${f.interestSaved}`,
    `Months saved versus the other order: ${f.monthsSaved}`,
    `Payoff order: ${f.payoffOrder.map((o) => `${o.name} (${o.when})`).join(", ")}`,
    f.hasExtra ? "They are paying extra on top of minimums." : "They are paying minimums only.",
    "",
    "Cover: what the plan is, why this debt first, what to do when a debt clears, and what to do in a month they fall short.",
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: NARRATIVE_MODEL,
        temperature: 0.6,
        max_tokens: 900,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[debt/narrative] OpenAI", response.status, detail.slice(0, 160));
      return null;
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned) as unknown;
    if (!Array.isArray(parsed) || parsed.some((p) => typeof p !== "string")) return null;

    const paragraphs = (parsed as string[]).map((p) => p.trim()).filter(Boolean);
    return paragraphs.length >= 2 ? paragraphs.slice(0, 6) : null;
  } catch (error) {
    console.error("[debt/narrative] call failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
