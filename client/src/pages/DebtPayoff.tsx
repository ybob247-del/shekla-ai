import { useEffect, useState } from "react";
import { Link } from "wouter";

/**
 * The debt payoff plan generator.
 *
 * Every number here is computed by code on the server (api/debt/_engine.ts),
 * never by a language model. The free view shows the payoff date and the saving;
 * $19 adds the month-by-month schedule and a written explanation of it.
 *
 * Nothing is stored on the server. The debts live in component state, and the
 * one exception is the handoff to Stripe: paying means leaving the site, so the
 * figures are parked in this browser's localStorage and picked back up on the
 * way in. They never travel to Stripe and they are cleared once the plan opens.
 */

interface DebtRow {
  id: number;
  name: string;
  balance: string;
  apr: string;
  minimum: string;
}

interface Summary {
  method: string;
  months: number;
  duration: string;
  debtFreeBy: string;
  totalInterestCents: number;
  totalPaidCents: number;
  order: { name: string; month: number }[];
}

interface PlanOk {
  ok: true;
  recommended: "avalanche" | "snowball";
  interestSavedCents: number;
  monthsSaved: number;
  totalStartingBalanceCents: number;
  monthlyOutlayCents: number;
  firstTarget: string | null;
  avalanche: Summary;
  snowball: Summary;
}

interface UnlockedPlan {
  ok: true;
  duration: string;
  debtFreeBy: string;
  months: number;
  totalInterestCents: number;
  monthlyOutlayCents: number;
  order: { name: string; month: number }[];
  schedule: {
    month: number;
    focus: string | null;
    totalPaidCents: number;
    remainingCents: number;
    payments: { name: string; paidCents: number; interestCents: number; balanceCents: number }[];
  }[];
  narrative: string[];
  narrativeSource: string;
}

interface PlanFail {
  ok: false;
  reason: string;
  message: string;
}

const usd = (cents: number) =>
  `$${Math.round(cents / 100).toLocaleString("en-US")}`;

const DRAFT_KEY = "shekla.debtPlan.draft";

let nextId = 4;
const BLANK: DebtRow[] = [
  { id: 1, name: "Credit card", balance: "", apr: "", minimum: "" },
  { id: 2, name: "", balance: "", apr: "", minimum: "" },
  { id: 3, name: "", balance: "", apr: "", minimum: "" },
];

export default function DebtPayoff() {
  const [rows, setRows] = useState<DebtRow[]>(BLANK);
  const [extra, setExtra] = useState("");
  const [result, setResult] = useState<PlanOk | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState<UnlockedPlan | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockProblem, setUnlockProblem] = useState<string | null>(null);

  // Coming back from Stripe. The debts were parked before the redirect because
  // they are never sent to Stripe, so they have to be picked up again here.
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) return;

    let draft: { debts: unknown; extraPerMonth: number } | null = null;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) draft = JSON.parse(raw);
    } catch {
      draft = null;
    }
    if (!draft) {
      setUnlockProblem(
        "Your payment went through, but this browser no longer has the debts you entered. Enter them again and the plan will open without charging you a second time.",
      );
      return;
    }

    setUnlocking(true);
    fetch("/api/debt/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, ...draft }),
    })
      .then((r) => r.json())
      .then((data: UnlockedPlan | { ok: false; message: string }) => {
        if (data.ok) {
          setPlan(data);
          try {
            window.localStorage.removeItem(DRAFT_KEY);
          } catch {
            /* nothing to clean up */
          }
        } else {
          setUnlockProblem(data.message);
        }
      })
      .catch(() =>
        setUnlockProblem("Your payment went through but the plan did not load. Refresh and it will try again."),
      )
      .finally(() => setUnlocking(false));
  }, []);

  async function buy() {
    setUnlockProblem(null);
    const debts = rows
      .filter((r) => r.balance.trim() !== "")
      .map((r) => ({
        name: r.name.trim() || "Debt",
        balance: Number(r.balance),
        apr: Number(r.apr || 0),
        minimum: Number(r.minimum),
      }));
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ debts, extraPerMonth: Number(extra || 0) }),
      );
    } catch {
      setUnlockProblem("This browser is blocking storage, so the plan cannot be saved across checkout.");
      return;
    }
    try {
      const response = await fetch("/api/debt/checkout", { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (data.url) window.location.href = data.url;
      else setUnlockProblem(data.error || "Could not start checkout.");
    } catch {
      setUnlockProblem("Could not reach checkout. Try again in a moment.");
    }
  }

  const update = (id: number, field: keyof DebtRow, value: string) =>
    setRows((r) => r.map((row) => (row.id === id ? { ...row, [field]: value } : row)));

  const addRow = () =>
    setRows((r) => [...r, { id: nextId++, name: "", balance: "", apr: "", minimum: "" }]);

  const removeRow = (id: number) => setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r));

  async function calculate() {
    setBusy(true);
    setProblem(null);
    setResult(null);

    const debts = rows
      .filter((r) => r.balance.trim() !== "")
      .map((r) => ({
        name: r.name.trim() || "Debt",
        balance: Number(r.balance),
        apr: Number(r.apr || 0),
        minimum: Number(r.minimum),
      }));

    if (debts.length === 0) {
      setProblem("Add at least one debt with a balance.");
      setBusy(false);
      return;
    }

    try {
      const response = await fetch("/api/debt/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debts, extraPerMonth: Number(extra || 0) }),
      });
      const data = (await response.json()) as PlanOk | PlanFail;
      if (data.ok) {
        setResult(data);
      } else {
        setProblem(data.message);
      }
    } catch {
      setProblem("Could not reach the calculator. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const best = result ? (result.recommended === "avalanche" ? result.avalanche : result.snowball) : null;
  const other = result ? (result.recommended === "avalanche" ? result.snowball : result.avalanche) : null;

  return (
    <div className="bg-gray-50 min-h-screen">

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            When will you actually be debt free?
          </h1>
          <p className="text-lg text-gray-300">
            Put in what you owe. See your payoff date, what the interest is costing you, and
            which order saves you more. Free, no sign-up, and nothing is saved.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {unlocking && (
            <div className="bg-white border border-gray-200 rounded-2xl p-7 mb-8 text-center">
              <p className="text-gray-700 font-semibold">Building your plan…</p>
              <p className="text-gray-500 text-sm mt-1">This takes a few seconds.</p>
            </div>
          )}

          {unlockProblem && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
              <p className="text-amber-900 text-sm">{unlockProblem}</p>
            </div>
          )}

          {plan && (
            <div className="mb-10 space-y-6">
              <div className="bg-emerald-600 text-white rounded-2xl p-7 text-center">
                <p className="text-emerald-100 text-sm uppercase tracking-wide font-semibold mb-1">
                  Your plan
                </p>
                <p className="text-3xl font-extrabold">Debt free by {plan.debtFreeBy}</p>
                <p className="text-emerald-100 mt-1">
                  {plan.duration} at {usd(plan.monthlyOutlayCents)} a month
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-7 space-y-4">
                {plan.narrative.map((para, i) => (
                  <p key={i} className="text-gray-800 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 overflow-x-auto">
                <h3 className="font-bold text-gray-900 mb-1">Month by month</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Pay these amounts each month. &ldquo;Focus&rdquo; is where the extra goes.
                </p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="py-2 pr-3 font-semibold">Month</th>
                      <th className="py-2 pr-3 font-semibold">Focus</th>
                      <th className="py-2 pr-3 font-semibold text-right">Paid</th>
                      <th className="py-2 font-semibold text-right">Left owing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.schedule.map((m) => (
                      <tr key={m.month} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 pr-3 text-gray-600">{m.month}</td>
                        <td className="py-2 pr-3 text-gray-900 font-medium">{m.focus}</td>
                        <td className="py-2 pr-3 text-right text-gray-900">{usd(m.totalPaidCents)}</td>
                        <td className="py-2 text-right text-gray-600">{usd(m.remainingCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="mt-5 w-full border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Print or save as PDF
                </button>
              </div>

              <p className="text-center text-gray-400 text-xs">
                Print this now if you want to keep it. Nothing was saved on our side, so we cannot
                send it to you again.
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Your debts</h2>
            <p className="text-gray-500 text-sm mb-6">
              Balance and minimum payment are required. Leave the rate at 0 if it does not charge interest.
            </p>

            <div className="hidden sm:grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
              <div className="col-span-4">What is it</div>
              <div className="col-span-3">Balance</div>
              <div className="col-span-2">Rate %</div>
              <div className="col-span-2">Minimum</div>
              <div className="col-span-1" />
            </div>

            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-3 items-center">
                  <input
                    className="col-span-12 sm:col-span-4 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Visa, car loan…"
                    value={row.name}
                    onChange={(e) => update(row.id, "name", e.target.value)}
                  />
                  <div className="col-span-5 sm:col-span-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="2400"
                      value={row.balance}
                      onChange={(e) => update(row.id, "balance", e.target.value)}
                    />
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="col-span-3 sm:col-span-2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="24.9"
                    value={row.apr}
                    onChange={(e) => update(row.id, "apr", e.target.value)}
                  />
                  <div className="col-span-3 sm:col-span-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      className="w-full pl-7 pr-2 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="60"
                      value={row.minimum}
                      onChange={(e) => update(row.id, "minimum", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    aria-label="Remove this debt"
                    className="col-span-1 text-gray-400 hover:text-red-500 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="mt-4 text-emerald-600 font-semibold text-sm hover:underline"
            >
              + Add another debt
            </button>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Anything extra you can put toward debt each month?
              </label>
              <p className="text-gray-500 text-xs mb-3">
                On top of the minimums. Leave it blank if the answer is nothing right now.
              </p>
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={calculate}
              disabled={busy}
              className="mt-7 w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              {busy ? "Working it out…" : "Show me my payoff date"}
            </button>

            {problem && (
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-900 text-sm">{problem}</p>
              </div>
            )}
          </div>

          {result && best && other && (
            <div className="mt-8 space-y-6">
              <div className="bg-gray-900 text-white rounded-2xl p-7 sm:p-9 text-center">
                <p className="text-gray-400 text-sm uppercase tracking-wide font-semibold mb-2">
                  Paying {usd(result.monthlyOutlayCents)} a month
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold mb-2">{best.debtFreeBy}</p>
                <p className="text-emerald-400 text-lg font-semibold">
                  Debt free in {best.duration}
                </p>
                <p className="text-gray-400 text-sm mt-4">
                  Clearing {usd(result.totalStartingBalanceCents)} of debt, with{" "}
                  {usd(best.totalInterestCents)} of interest along the way.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MethodCard
                  title="Highest rate first"
                  subtitle="Avalanche"
                  summary={result.avalanche}
                  winner={result.recommended === "avalanche"}
                />
                <MethodCard
                  title="Smallest balance first"
                  subtitle="Snowball"
                  summary={result.snowball}
                  winner={result.recommended === "snowball"}
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                {result.interestSavedCents > 0 ? (
                  <p className="text-gray-800">
                    Paying the{" "}
                    <strong>
                      {result.recommended === "avalanche" ? "highest rate" : "smallest balance"}
                    </strong>{" "}
                    first saves you{" "}
                    <strong className="text-emerald-600">{usd(result.interestSavedCents)}</strong> in
                    interest
                    {result.monthsSaved > 0 && (
                      <>
                        {" "}
                        and gets you there{" "}
                        <strong>
                          {result.monthsSaved} month{result.monthsSaved === 1 ? "" : "s"}
                        </strong>{" "}
                        sooner
                      </>
                    )}
                    . Start with <strong>{result.firstTarget}</strong>.
                  </p>
                ) : (
                  <p className="text-gray-800">
                    Both orders cost you the same here, so use the one you will actually stick to.
                    Start with <strong>{result.firstTarget}</strong>.
                  </p>
                )}
              </div>

              <div className="bg-white border-2 border-emerald-400 rounded-2xl p-7">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Want the month-by-month plan?
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  The numbers above are yours to keep, free. The full plan adds what to pay to
                  which debt every single month until you hit zero, written out in your own
                  figures, plus what to do in a month you cannot make the extra payment.
                </p>
                <button
                  type="button"
                  onClick={buy}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  Unlock my plan — $19
                </button>
                <p className="text-gray-500 text-xs text-center mt-2">
                  One payment. No subscription. Your figures are not sent to the payment page.
                </p>
                <p className="text-gray-400 text-xs text-center mt-3">
                  In the meantime, the{" "}
                  <Link href="/resources" className="underline hover:text-gray-600">
                    Debt Payoff Plan toolkit
                  </Link>{" "}
                  covers the same ground as a printable worksheet.
                </p>
              </div>

              <p className="text-center text-gray-400 text-xs">
                Nothing you typed was saved. Reload the page and it is gone.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MethodCard({
  title,
  subtitle,
  summary,
  winner,
}: {
  title: string;
  subtitle: string;
  summary: Summary;
  winner: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border-2 bg-white ${
        winner ? "border-emerald-400" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold">{subtitle}</p>
        </div>
        {winner && (
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
            COSTS LESS
          </span>
        )}
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Debt free</dt>
          <dd className="font-semibold text-gray-900">{summary.debtFreeBy}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Takes</dt>
          <dd className="font-semibold text-gray-900">{summary.duration}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Interest paid</dt>
          <dd className="font-semibold text-gray-900">{usd(summary.totalInterestCents)}</dd>
        </div>
      </dl>
      {summary.order.length > 1 && (
        <p className="text-gray-500 text-xs mt-4 leading-relaxed">
          Order: {summary.order.map((o) => o.name).join(" → ")}
        </p>
      )}
    </div>
  );
}
