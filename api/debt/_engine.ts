/**
 * Debt payoff maths. Pure functions, no I/O, no AI anywhere near it.
 *
 * This is the half of the tool that has exactly one right answer. A payoff date
 * or an interest total that is wrong by a month is the kind of error that ends
 * trust in a money site permanently, so none of it is left to a language model:
 * the code computes every number and the model is only ever handed the result
 * to describe.
 *
 * Everything is in integer cents. Floating point dollars drift by a cent or two
 * over a few hundred iterations, and "debt free in 31 months" turning into
 * "$0.03 remaining in month 32" is not a bug anyone should have to explain.
 */

export interface DebtInput {
  /** What the person calls it, shown back to them. */
  name: string;
  /** Current balance in dollars. */
  balance: number;
  /** Annual percentage rate, as a percentage: 24.99 means 24.99%. */
  apr: number;
  /** Required minimum payment in dollars per month. */
  minimum: number;
}

export interface DebtState {
  name: string;
  startingCents: number;
  aprPercent: number;
  minimumCents: number;
}

export interface PaidOffDebt {
  name: string;
  /** 1-based month in which this debt hit zero. */
  month: number;
  interestPaidCents: number;
}

export interface PayoffResult {
  method: "avalanche" | "snowball";
  /** Months until every debt is clear. */
  months: number;
  totalInterestCents: number;
  totalPaidCents: number;
  /** Debts in the order they are cleared. */
  order: PaidOffDebt[];
  /** Per-month totals, for the paid schedule. */
  schedule: ScheduleMonth[];
}

export interface ScheduleMonth {
  month: number;
  /** Which debt the extra money is aimed at this month. */
  focus: string | null;
  payments: { name: string; paidCents: number; interestCents: number; balanceCents: number }[];
  totalPaidCents: number;
  remainingCents: number;
}

export interface ComparisonResult {
  avalanche: PayoffResult;
  snowball: PayoffResult;
  /** Which method costs less. Ties resolve to avalanche, which is never worse. */
  recommended: "avalanche" | "snowball";
  /** Interest the recommended method saves against the other one. */
  interestSavedCents: number;
  /** Months the recommended method saves. Can be zero or negative. */
  monthsSaved: number;
  totalStartingBalanceCents: number;
  totalMinimumCents: number;
  extraPerMonthCents: number;
}

/** Longer than this and the answer is "this does not pay off", not a number. */
const MAX_MONTHS = 600;

export class DebtInputError extends Error {}

/**
 * A balance that never clears is the single most important case to get right.
 * If the monthly budget does not cover the interest, the debt grows forever and
 * a naive loop runs until it hits the cap and then reports a wrong, enormous
 * number. Better to say plainly that it does not pay off at this payment.
 */
export class NeverClearsError extends Error {
  constructor(public readonly monthlyInterestCents: number, public readonly budgetCents: number) {
    super("These payments do not cover the interest, so the balance never clears.");
  }
}

function toCents(dollars: number, label: string): number {
  if (typeof dollars !== "number" || !Number.isFinite(dollars)) {
    throw new DebtInputError(`${label} must be a number.`);
  }
  return Math.round(dollars * 100);
}

export function normalise(debts: DebtInput[], extraPerMonth = 0): {
  states: DebtState[];
  extraCents: number;
} {
  if (!Array.isArray(debts) || debts.length === 0) {
    throw new DebtInputError("Add at least one debt.");
  }
  if (debts.length > 20) {
    throw new DebtInputError("That is more than 20 debts. Combine the small ones.");
  }

  const states = debts.map((d, i) => {
    const label = (d?.name || `Debt ${i + 1}`).toString().slice(0, 60).trim() || `Debt ${i + 1}`;
    const startingCents = toCents(d?.balance, `${label} balance`);
    const minimumCents = toCents(d?.minimum, `${label} minimum payment`);
    const aprPercent = typeof d?.apr === "number" && Number.isFinite(d.apr) ? d.apr : NaN;

    if (startingCents <= 0) throw new DebtInputError(`${label}: balance must be more than zero.`);
    if (startingCents > 100_000_000) throw new DebtInputError(`${label}: that balance looks wrong.`);
    if (!Number.isFinite(aprPercent) || aprPercent < 0 || aprPercent > 100) {
      throw new DebtInputError(`${label}: APR must be between 0 and 100.`);
    }
    if (minimumCents <= 0) throw new DebtInputError(`${label}: minimum payment must be more than zero.`);

    return { name: label, startingCents, aprPercent, minimumCents };
  });

  const extraCents = Math.max(0, toCents(extraPerMonth || 0, "Extra payment"));
  return { states, extraCents };
}

function monthlyInterest(balanceCents: number, aprPercent: number): number {
  if (aprPercent <= 0 || balanceCents <= 0) return 0;
  return Math.round((balanceCents * (aprPercent / 100)) / 12);
}

/**
 * Runs one method to completion.
 *
 * The monthly outlay is held constant at (all minimums + extra), which is what
 * makes either method work: when a debt clears, its minimum is not saved, it
 * rolls onto the next target. That rolling is the whole mechanism.
 */
export function simulate(
  states: DebtState[],
  extraCents: number,
  method: "avalanche" | "snowball",
): PayoffResult {
  const balances = states.map((s) => s.startingCents);
  const interestPaid = states.map(() => 0);
  const cleared: PaidOffDebt[] = [];
  const schedule: ScheduleMonth[] = [];

  const budget = states.reduce((sum, s) => sum + s.minimumCents, 0) + extraCents;

  let totalInterest = 0;
  let totalPaid = 0;

  for (let month = 1; month <= MAX_MONTHS; month++) {
    const active = states.map((_, i) => i).filter((i) => balances[i] > 0);
    if (active.length === 0) break;

    // 1. Interest first, on what is still owed.
    let interestThisMonth = 0;
    const interestByDebt = new Map<number, number>();
    for (const i of active) {
      const interest = monthlyInterest(balances[i], states[i].aprPercent);
      interestByDebt.set(i, interest);
      balances[i] += interest;
      interestPaid[i] += interest;
      totalInterest += interest;
      interestThisMonth += interest;
    }

    const owed = active.reduce((sum, i) => sum + balances[i], 0);
    if (budget <= interestThisMonth && budget < owed) {
      throw new NeverClearsError(interestThisMonth, budget);
    }

    // 2. Priority order. Avalanche attacks the highest rate, which always costs
    //    least; snowball attacks the smallest balance, which clears a debt
    //    sooner and is easier to keep going with.
    const priority = [...active].sort((a, b) =>
      method === "avalanche"
        ? states[b].aprPercent - states[a].aprPercent || balances[a] - balances[b]
        : balances[a] - balances[b] || states[b].aprPercent - states[a].aprPercent,
    );
    const focus = priority[0];

    // 3. Minimums on everything that is not the target.
    let pool = Math.min(budget, owed);
    const payments: ScheduleMonth["payments"] = [];
    const paidThisMonth = new Map<number, number>();

    for (const i of priority) {
      if (i === focus) continue;
      const pay = Math.min(states[i].minimumCents, balances[i], pool);
      balances[i] -= pay;
      pool -= pay;
      paidThisMonth.set(i, pay);
    }

    // 4. Everything left goes at the target, then cascades down the order if
    //    the target clears with money to spare.
    for (const i of priority) {
      if (pool <= 0) break;
      const pay = Math.min(pool, balances[i]);
      balances[i] -= pay;
      pool -= pay;
      paidThisMonth.set(i, (paidThisMonth.get(i) || 0) + pay);
    }

    let monthTotal = 0;
    for (const i of active) {
      const paid = paidThisMonth.get(i) || 0;
      monthTotal += paid;
      payments.push({
        name: states[i].name,
        paidCents: paid,
        interestCents: interestByDebt.get(i) || 0,
        balanceCents: balances[i],
      });
      if (balances[i] === 0 && !cleared.some((c) => c.name === states[i].name)) {
        cleared.push({ name: states[i].name, month, interestPaidCents: interestPaid[i] });
      }
    }
    totalPaid += monthTotal;

    schedule.push({
      month,
      focus: states[focus].name,
      payments,
      totalPaidCents: monthTotal,
      remainingCents: balances.reduce((a, b) => a + b, 0),
    });

    if (balances.every((b) => b === 0)) break;
  }

  if (balances.some((b) => b > 0)) {
    throw new NeverClearsError(0, budget);
  }

  return {
    method,
    months: schedule.length,
    totalInterestCents: totalInterest,
    totalPaidCents: totalPaid,
    order: cleared,
    schedule,
  };
}

export function compare(debts: DebtInput[], extraPerMonth = 0): ComparisonResult {
  const { states, extraCents } = normalise(debts, extraPerMonth);

  const avalanche = simulate(states, extraCents, "avalanche");
  const snowball = simulate(states, extraCents, "snowball");

  // Avalanche is never worse on interest, so a tie goes to it rather than
  // flipping on rounding.
  const recommended = snowball.totalInterestCents < avalanche.totalInterestCents ? "snowball" : "avalanche";
  const other = recommended === "avalanche" ? snowball : avalanche;
  const best = recommended === "avalanche" ? avalanche : snowball;

  return {
    avalanche,
    snowball,
    recommended,
    interestSavedCents: other.totalInterestCents - best.totalInterestCents,
    monthsSaved: other.months - best.months,
    totalStartingBalanceCents: states.reduce((sum, s) => sum + s.startingCents, 0),
    totalMinimumCents: states.reduce((sum, s) => sum + s.minimumCents, 0),
    extraPerMonthCents: extraCents,
  };
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/** "31 months" reads worse than "2 years 7 months" past a year. */
export function formatDuration(months: number): string {
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = `${years} year${years === 1 ? "" : "s"}`;
  return rest === 0 ? y : `${y} ${rest} month${rest === 1 ? "" : "s"}`;
}

/** Calendar month the last payment lands in, from today. */
export function payoffDate(months: number, from = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth() + months, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
