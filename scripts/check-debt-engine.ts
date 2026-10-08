/**
 * Checks for the debt payoff engine. Run with: npx tsx scripts/check-debt-engine.ts
 *
 * There is no test framework in this repo and adding one for a single module is
 * not worth the dependency, but this maths is the part a wrong answer would be
 * most damaging in, so it does not ship unchecked. Each case below is one thing
 * that could plausibly be got wrong.
 */
import {
  compare,
  DebtInputError,
  formatDuration,
  NeverClearsError,
  normalise,
  simulate,
} from "../api/debt/_engine";

let failures = 0;

function check(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.log(`  FAIL ${name}${detail ? "  — " + detail : ""}`);
  }
}

function throws(name: string, fn: () => unknown, type: Function) {
  try {
    fn();
    failures++;
    console.log(`  FAIL ${name} — expected ${type.name}, nothing thrown`);
  } catch (e) {
    check(name, e instanceof type, `got ${(e as Error).constructor.name}`);
  }
}

console.log("\nA single debt, no interest, pays off on simple division");
{
  // $1,200 at 0% with $100/month is exactly 12 months and no interest.
  const r = compare([{ name: "Card", balance: 1200, apr: 0, minimum: 100 }], 0);
  check("12 months", r.avalanche.months === 12, `got ${r.avalanche.months}`);
  check("no interest", r.avalanche.totalInterestCents === 0);
  check("paid equals balance", r.avalanche.totalPaidCents === 120000, `got ${r.avalanche.totalPaidCents}`);
}

console.log("\nInterest actually accrues");
{
  const r = compare([{ name: "Card", balance: 5000, apr: 20, minimum: 200 }], 0);
  check("costs more than the balance", r.avalanche.totalPaidCents > 500000);
  check("interest is the difference", r.avalanche.totalPaidCents - r.avalanche.totalInterestCents === 500000,
    `paid ${r.avalanche.totalPaidCents}, interest ${r.avalanche.totalInterestCents}`);
  // First month's interest on $5,000 at 20% is 5000 * 0.2 / 12 = $83.33
  check("first month interest is $83.33", r.avalanche.schedule[0].payments[0].interestCents === 8333,
    `got ${r.avalanche.schedule[0].payments[0].interestCents}`);
}

console.log("\nAvalanche beats snowball when the small debt is the cheap one");
{
  // The smallest balance has the lowest rate, so the two methods must differ.
  const debts = [
    { name: "Store card", balance: 600, apr: 6, minimum: 25 },
    { name: "Credit card", balance: 2400, apr: 24.99, minimum: 60 },
  ];
  const r = compare(debts, 200);
  check("avalanche costs less interest", r.avalanche.totalInterestCents < r.snowball.totalInterestCents,
    `avalanche ${r.avalanche.totalInterestCents} vs snowball ${r.snowball.totalInterestCents}`);
  check("avalanche is recommended", r.recommended === "avalanche");
  check("saving is positive", r.interestSavedCents > 0, `got ${r.interestSavedCents}`);
  check("avalanche clears the expensive card first", r.avalanche.order[0].name === "Credit card",
    `got ${r.avalanche.order[0].name}`);
  check("snowball clears the small one first", r.snowball.order[0].name === "Store card",
    `got ${r.snowball.order[0].name}`);
  check("both clear everything", r.avalanche.order.length === 2 && r.snowball.order.length === 2);
}

console.log("\nThe two methods tie when there is only one debt");
{
  const r = compare([{ name: "Loan", balance: 3000, apr: 12, minimum: 150 }], 50);
  check("same months", r.avalanche.months === r.snowball.months);
  check("same interest", r.avalanche.totalInterestCents === r.snowball.totalInterestCents);
  check("no saving claimed", r.interestSavedCents === 0);
  check("ties go to avalanche", r.recommended === "avalanche");
}

console.log("\nFreed-up minimums roll onto the next debt");
{
  // Once the small debt clears, the monthly outlay must stay the same.
  const r = compare(
    [
      { name: "A", balance: 500, apr: 0, minimum: 100 },
      { name: "B", balance: 2000, apr: 0, minimum: 100 },
    ],
    0,
  );
  // Total outlay is $200/month against $2,500 with no interest: 13 months
  // (12 full months plus a $100 final payment).
  check("13 months", r.avalanche.months === 13, `got ${r.avalanche.months}`);
  const m = r.avalanche.schedule[6]; // well after A is gone
  check("still paying the full $200 after A clears", m.totalPaidCents === 20000,
    `month ${m.month} paid ${m.totalPaidCents}`);
}

console.log("\nExtra payments shorten the term");
{
  const base = compare([{ name: "Card", balance: 4000, apr: 18, minimum: 120 }], 0);
  const extra = compare([{ name: "Card", balance: 4000, apr: 18, minimum: 120 }], 200);
  check("fewer months with extra", extra.avalanche.months < base.avalanche.months,
    `${extra.avalanche.months} vs ${base.avalanche.months}`);
  check("less interest with extra", extra.avalanche.totalInterestCents < base.avalanche.totalInterestCents);
}

console.log("\nNothing is ever overpaid");
{
  const r = compare(
    [
      { name: "A", balance: 1000, apr: 15, minimum: 50 },
      { name: "B", balance: 1500, apr: 22, minimum: 60 },
    ],
    300,
  );
  const last = r.avalanche.schedule[r.avalanche.schedule.length - 1];
  check("ends at exactly zero", last.remainingCents === 0, `got ${last.remainingCents}`);
  check("no negative balance in any month",
    r.avalanche.schedule.every((m) => m.payments.every((p) => p.balanceCents >= 0)));
  check("final payment is not a full budget", last.totalPaidCents <= 41000);
}

console.log("\nA balance that cannot clear says so instead of looping");
{
  // $10,000 at 25% accrues about $208 a month. A $100 minimum never touches it.
  throws("throws NeverClearsError",
    () => compare([{ name: "Card", balance: 10000, apr: 25, minimum: 100 }], 0),
    NeverClearsError);
}

console.log("\nBad input is rejected, not quietly accepted");
{
  throws("no debts", () => compare([], 0), DebtInputError);
  throws("zero balance", () => compare([{ name: "X", balance: 0, apr: 10, minimum: 50 }], 0), DebtInputError);
  throws("negative balance", () => compare([{ name: "X", balance: -5, apr: 10, minimum: 50 }], 0), DebtInputError);
  throws("APR over 100", () => compare([{ name: "X", balance: 100, apr: 150, minimum: 50 }], 0), DebtInputError);
  throws("zero minimum", () => compare([{ name: "X", balance: 100, apr: 10, minimum: 0 }], 0), DebtInputError);
  throws("non-numeric balance",
    () => compare([{ name: "X", balance: "lots" as unknown as number, apr: 10, minimum: 50 }], 0),
    DebtInputError);
}

console.log("\nNames are kept and defaulted");
{
  const { states } = normalise([{ name: "", balance: 100, apr: 1, minimum: 10 }], 0);
  check("blank name gets a default", states[0].name === "Debt 1", `got "${states[0].name}"`);
}

console.log("\nDurations read like English");
{
  check("11 months", formatDuration(11) === "11 months");
  check("12 months is 1 year", formatDuration(12) === "1 year", formatDuration(12));
  check("31 months", formatDuration(31) === "2 years 7 months", formatDuration(31));
}

console.log("\nA realistic case runs and holds together");
{
  const r = compare(
    [
      { name: "Visa", balance: 2400, apr: 24.99, minimum: 60 },
      { name: "Store card", balance: 600, apr: 6.0, minimum: 25 },
      { name: "Car loan", balance: 8200, apr: 7.5, minimum: 240 },
      { name: "Medical", balance: 1100, apr: 0, minimum: 50 },
    ],
    150,
  );
  const a = r.avalanche;
  check("clears all four", a.order.length === 4);
  check("under 5 years", a.months < 60, `got ${a.months}`);
  check("totals reconcile",
    a.totalPaidCents === r.totalStartingBalanceCents + a.totalInterestCents,
    `paid ${a.totalPaidCents} vs balance ${r.totalStartingBalanceCents} + interest ${a.totalInterestCents}`);
  check("schedule length matches months", a.schedule.length === a.months);
  console.log(
    `       avalanche: ${a.months} months, interest ${(a.totalInterestCents / 100).toFixed(2)} | ` +
      `snowball: ${r.snowball.months} months, interest ${(r.snowball.totalInterestCents / 100).toFixed(2)} | ` +
      `saving ${(r.interestSavedCents / 100).toFixed(2)}`,
  );
}

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} CHECK(S) FAILED.\n`);
process.exit(failures === 0 ? 0 : 1);
