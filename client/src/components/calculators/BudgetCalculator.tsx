import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface BudgetResult {
  needs: number;
  wants: number;
  savings: number;
}

export default function BudgetCalculator() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<BudgetResult | null>(null);

  const calculate = () => {
    const amount = parseFloat(income.replace(/,/g, ""));
    if (!isNaN(amount) && amount > 0) {
      setResult({
        needs: amount * 0.5,
        wants: amount * 0.3,
        savings: amount * 0.2,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">50/30/20 Budget Calculator</h3>
      <p className="text-gray-500 text-sm mb-5">
        Enter your monthly take-home pay to see your ideal budget split.
      </p>

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Monthly Take-Home Pay
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculate()}
              placeholder="3,500"
              className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={calculate}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Calculate
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">Needs (50%)</p>
              <p className="text-sm text-blue-700">Housing, utilities, groceries, transport</p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(result.needs)}</p>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-0.5">Wants (30%)</p>
              <p className="text-sm text-purple-700">Dining, entertainment, shopping</p>
            </div>
            <p className="text-2xl font-bold text-purple-700">{formatCurrency(result.wants)}</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">Savings (20%)</p>
              <p className="text-sm text-emerald-700">Emergency fund, retirement, debt payoff</p>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(result.savings)}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Monthly Income</span>
              <span className="font-semibold text-gray-900">{formatCurrency(parseFloat(income))}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
