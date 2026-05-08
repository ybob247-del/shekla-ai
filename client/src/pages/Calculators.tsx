import { useState } from "react";
import { Link } from "wouter";
import BudgetCalculator from "@/components/calculators/BudgetCalculator";
import { formatCurrency } from "@/lib/utils";

// Debt Payoff Calculator
function DebtPayoffCalculator() {
  const [balance, setBalance] = useState("");
  const [rate, setRate] = useState("");
  const [payment, setPayment] = useState("");
  const [result, setResult] = useState<{ months: number; totalInterest: number; totalPaid: number } | null>(null);

  const calculate = () => {
    const b = parseFloat(balance);
    const r = parseFloat(rate) / 100 / 12;
    const p = parseFloat(payment);

    if (!b || !r || !p || p <= b * r) {
      return;
    }

    let remaining = b;
    let months = 0;
    let totalInterest = 0;

    while (remaining > 0 && months < 600) {
      const interest = remaining * r;
      totalInterest += interest;
      remaining = remaining + interest - p;
      months++;
      if (remaining < 0) remaining = 0;
    }

    setResult({ months, totalInterest, totalPaid: b + totalInterest });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Debt Payoff Calculator</h3>
      <p className="text-gray-500 text-sm mb-5">See how long it will take to pay off your debt.</p>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Balance</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="5,000"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Interest Rate (%)</label>
          <div className="relative">
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="18.9"
              className="w-full pr-7 pl-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Payment</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              placeholder="200"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mb-5"
      >
        Calculate Payoff
      </button>

      {result && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-blue-700">Months to Pay Off</p>
            <p className="font-bold text-blue-800">
              {result.months} months ({Math.floor(result.months / 12)}y {result.months % 12}m)
            </p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-red-700">Total Interest Paid</p>
            <p className="font-bold text-red-800">{formatCurrency(result.totalInterest)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-gray-700">Total Amount Paid</p>
            <p className="font-bold text-gray-900">{formatCurrency(result.totalPaid)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Emergency Fund Calculator
function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [months, setMonths] = useState("3");
  const [result, setResult] = useState<{ target: number; gap: number; monthsToGoal: number } | null>(null);
  const [monthlySaving, setMonthlySaving] = useState("");

  const calculate = () => {
    const expenses = parseFloat(monthlyExpenses);
    const saved = parseFloat(currentSavings) || 0;
    const targetMonths = parseInt(months);
    const saving = parseFloat(monthlySaving) || 0;

    if (!expenses) return;

    const target = expenses * targetMonths;
    const gap = Math.max(0, target - saved);
    const monthsToGoal = saving > 0 ? Math.ceil(gap / saving) : 0;

    setResult({ target, gap, monthsToGoal });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Emergency Fund Calculator</h3>
      <p className="text-gray-500 text-sm mb-5">Calculate your emergency fund target and timeline.</p>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Expenses</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              placeholder="3,000"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Coverage</label>
          <select
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="1">1 month (starter)</option>
            <option value="3">3 months (recommended)</option>
            <option value="6">6 months (ideal)</option>
            <option value="12">12 months (maximum security)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Savings</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="500"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Saving Amount (optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={monthlySaving}
              onChange={(e) => setMonthlySaving(e.target.value)}
              placeholder="200"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mb-5"
      >
        Calculate
      </button>

      {result && (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-emerald-700">Target Emergency Fund</p>
            <p className="font-bold text-emerald-800">{formatCurrency(result.target)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-blue-700">Amount Still Needed</p>
            <p className="font-bold text-blue-800">{formatCurrency(result.gap)}</p>
          </div>
          {result.monthsToGoal > 0 && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex justify-between">
              <p className="text-sm text-purple-700">Months to Goal</p>
              <p className="font-bold text-purple-800">{result.monthsToGoal} months</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Net Worth Calculator
function NetWorthCalculator() {
  const [assets, setAssets] = useState({ checking: "", savings: "", investments: "", home: "", car: "", other: "" });
  const [liabilities, setLiabilities] = useState({ mortgage: "", carLoan: "", studentLoans: "", creditCards: "", other: "" });
  const [result, setResult] = useState<{ totalAssets: number; totalLiabilities: number; netWorth: number } | null>(null);

  const calculate = () => {
    const totalAssets = Object.values(assets).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
    setResult({ totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Net Worth Calculator</h3>
      <p className="text-gray-500 text-sm mb-5">Assets minus liabilities = your financial health score.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">Assets (What You Own)</h4>
          <div className="space-y-2">
            {Object.entries(assets).map(([key, value]) => (
              <div key={key} className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setAssets({ ...assets, [key]: e.target.value })}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                  className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">Liabilities (What You Owe)</h4>
          <div className="space-y-2">
            {Object.entries(liabilities).map(([key, value]) => (
              <div key={key} className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setLiabilities({ ...liabilities, [key]: e.target.value })}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                  className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mb-5"
      >
        Calculate Net Worth
      </button>

      {result && (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-emerald-700">Total Assets</p>
            <p className="font-bold text-emerald-800">{formatCurrency(result.totalAssets)}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-red-700">Total Liabilities</p>
            <p className="font-bold text-red-800">{formatCurrency(result.totalLiabilities)}</p>
          </div>
          <div
            className={`border rounded-xl p-4 flex justify-between ${
              result.netWorth >= 0
                ? "bg-blue-50 border-blue-100"
                : "bg-orange-50 border-orange-100"
            }`}
          >
            <p className={`text-sm font-semibold ${result.netWorth >= 0 ? "text-blue-700" : "text-orange-700"}`}>
              Net Worth
            </p>
            <p className={`font-bold text-lg ${result.netWorth >= 0 ? "text-blue-800" : "text-orange-800"}`}>
              {formatCurrency(result.netWorth)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Savings Goal Calculator
function SavingsGoalCalculator() {
  const [goal, setGoal] = useState("");
  const [current, setCurrent] = useState("");
  const [months, setMonths] = useState("");
  const [result, setResult] = useState<{ monthlyNeeded: number; gap: number } | null>(null);

  const calculate = () => {
    const g = parseFloat(goal);
    const c = parseFloat(current) || 0;
    const m = parseInt(months);

    if (!g || !m) return;

    const gap = Math.max(0, g - c);
    const monthlyNeeded = gap / m;

    setResult({ monthlyNeeded, gap });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Savings Goal Calculator</h3>
      <p className="text-gray-500 text-sm mb-5">Find out how much to save each month to hit your goal.</p>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Savings Goal</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="10,000"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Savings</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="0"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Months to Goal</label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            placeholder="12"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mb-5"
      >
        Calculate
      </button>

      {result && (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-emerald-700">Monthly Savings Needed</p>
            <p className="font-bold text-emerald-800">{formatCurrency(result.monthlyNeeded)}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between">
            <p className="text-sm text-blue-700">Amount Still to Save</p>
            <p className="font-bold text-blue-800">{formatCurrency(result.gap)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const CALCULATORS = [
  { id: "budget", label: "50/30/20 Budget", emoji: "💰" },
  { id: "debt", label: "Debt Payoff", emoji: "📉" },
  { id: "emergency", label: "Emergency Fund", emoji: "🏦" },
  { id: "networth", label: "Net Worth", emoji: "💪" },
  { id: "savings", label: "Savings Goal", emoji: "🎯" },
];

export default function Calculators() {
  const [activeCalc, setActiveCalc] = useState("budget");

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Free Financial Calculators
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Budget, debt payoff, emergency fund, net worth, and savings goal calculators.
            No sign-up required.
          </p>
        </div>

        {/* Calculator Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {CALCULATORS.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalc(calc.id)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                activeCalc === calc.id
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {calc.emoji} {calc.label}
            </button>
          ))}
        </div>

        {/* Active Calculator */}
        <div className="mb-10">
          {activeCalc === "budget" && <BudgetCalculator />}
          {activeCalc === "debt" && <DebtPayoffCalculator />}
          {activeCalc === "emergency" && <EmergencyFundCalculator />}
          {activeCalc === "networth" && <NetWorthCalculator />}
          {activeCalc === "savings" && <SavingsGoalCalculator />}
        </div>

        {/* Bottom CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Want a Personalized Financial Plan?
          </h3>
          <p className="text-gray-600 mb-5">
            Take the Money Reset Score to get specific recommendations based on your situation.
          </p>
          <Link href="/assessment">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Get My Free Score →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
