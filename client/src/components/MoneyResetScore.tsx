import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScoreResult {
  score: number;
  grade: string;
  color: string;
  summary: string;
  recommendations: string[];
  toolkits: string[];
}

function calculateScore(answers: Record<string, string>): ScoreResult {
  let score = 0;
  const recommendations: string[] = [];
  const toolkits: string[] = [];

  // Budget
  if (answers.budget === "yes-written") score += 20;
  else if (answers.budget === "yes-mental") score += 10;
  else {
    recommendations.push("Create a written budget to track your spending");
    toolkits.push("Paycheck Breakdown Toolkit");
  }

  // Emergency fund
  if (answers.emergency === "3-plus-months") score += 20;
  else if (answers.emergency === "1-3-months") score += 12;
  else if (answers.emergency === "less-than-1-month") {
    score += 5;
    recommendations.push("Build your emergency fund to at least 1 month of expenses");
    toolkits.push("Sinking Funds Kit");
  } else {
    recommendations.push("Start building an emergency fund immediately");
    toolkits.push("Sinking Funds Kit");
  }

  // Debt
  if (answers.debt === "no-debt") score += 20;
  else if (answers.debt === "manageable") score += 12;
  else if (answers.debt === "high-interest") {
    score += 5;
    recommendations.push("Focus on paying off high-interest debt first");
    toolkits.push("Debt Payoff Plan");
  } else {
    recommendations.push("Create a debt payoff plan immediately");
    toolkits.push("Bill Catch-Up Plan");
    toolkits.push("Debt Payoff Plan");
  }

  // Overdraft
  if (answers.overdraft === "never") score += 20;
  else if (answers.overdraft === "rarely") score += 12;
  else if (answers.overdraft === "sometimes") {
    score += 5;
    recommendations.push("Set up a buffer system to avoid overdraft fees");
    toolkits.push("No-Overdraft System");
  } else {
    recommendations.push("Stop overdraft fees immediately with a cash buffer system");
    toolkits.push("No-Overdraft System");
  }

  // Income type
  if (answers.income === "stable-salary") score += 10;
  else if (answers.income === "hourly") score += 8;
  else if (answers.income === "variable") {
    score += 5;
    recommendations.push("Use an irregular income budget to handle variable pay");
    toolkits.push("Irregular Income Budget Kit");
  } else if (answers.income === "freelance") {
    score += 4;
    recommendations.push("Budget for irregular freelance income with a dedicated system");
    toolkits.push("Irregular Income Budget Kit");
  }

  // Savings goal
  if (answers.savingsGoal === "yes-on-track") score += 10;
  else if (answers.savingsGoal === "yes-behind") {
    score += 5;
    recommendations.push("Get back on track with your savings goal");
  } else {
    recommendations.push("Set a specific savings goal and create a plan to reach it");
  }

  // Determine grade
  let grade: string;
  let color: string;
  let summary: string;

  if (score >= 85) {
    grade = "A";
    color = "emerald";
    summary = "Excellent! Your finances are in great shape. Focus on optimizing and growing your wealth.";
  } else if (score >= 70) {
    grade = "B";
    color = "blue";
    summary = "Good foundation! A few targeted improvements will put you in excellent financial health.";
  } else if (score >= 55) {
    grade = "C";
    color = "yellow";
    summary = "You're making progress but have some important gaps to address. Focus on the recommendations below.";
  } else if (score >= 40) {
    grade = "D";
    color = "orange";
    summary = "Your finances need attention. The good news: the toolkits below can help you turn things around quickly.";
  } else {
    grade = "F";
    color = "red";
    summary = "Your finances are under significant stress. Start with the most urgent recommendations below.";
  }

  // Deduplicate toolkits
  const uniqueToolkits = [...new Set(toolkits)];

  return { score, grade, color, summary, recommendations, toolkits: uniqueToolkits };
}

const STAN_STORE_BASE = "https://stan.store/sheklaai";

export default function MoneyResetScore() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreResult = calculateScore(answers);
    setResult(scoreResult);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setIncome("");
    setResult(null);
    setSubmitted(false);
  };

  if (submitted && result) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-bold mb-4 ${
              result.color === "emerald"
                ? "bg-emerald-100 text-emerald-600"
                : result.color === "blue"
                ? "bg-blue-100 text-blue-600"
                : result.color === "yellow"
                ? "bg-yellow-100 text-yellow-600"
                : result.color === "orange"
                ? "bg-orange-100 text-orange-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {result.score}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Your Money Reset Score: {result.grade}
          </h3>
          <p className="text-gray-600">{result.summary}</p>
        </div>

        {result.recommendations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Your Top Priorities:</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-emerald-500 mt-0.5">→</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.toolkits.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Recommended Toolkits:</h4>
            <div className="flex flex-wrap gap-2">
              {result.toolkits.map((toolkit, i) => (
                <a
                  key={i}
                  href={STAN_STORE_BASE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors"
                >
                  🛒 {toolkit}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={STAN_STORE_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl text-center text-sm transition-colors"
          >
            Get My Recommended Toolkits →
          </a>
          <button
            onClick={handleReset}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl text-sm transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Money Reset Score</h3>
      <p className="text-gray-600 text-sm mb-6">
        Get personalized toolkit recommendations based on your financial situation
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you have an active budget?
          </label>
          <Select onValueChange={(v) => setAnswers({ ...answers, budget: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes-written">Yes, written/tracked</SelectItem>
              <SelectItem value="yes-mental">Yes, in my head</SelectItem>
              <SelectItem value="no">No budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency fund status?
          </label>
          <Select onValueChange={(v) => setAnswers({ ...answers, emergency: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3-plus-months">3+ months saved</SelectItem>
              <SelectItem value="1-3-months">1–3 months saved</SelectItem>
              <SelectItem value="less-than-1-month">Less than 1 month</SelectItem>
              <SelectItem value="none">No emergency fund</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current debt situation?
          </label>
          <Select onValueChange={(v) => setAnswers({ ...answers, debt: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-debt">No debt (except mortgage)</SelectItem>
              <SelectItem value="manageable">Manageable debt, paying it down</SelectItem>
              <SelectItem value="high-interest">High-interest debt (credit cards)</SelectItem>
              <SelectItem value="behind-on-bills">Behind on bills</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How often do you overdraft?
          </label>
          <Select onValueChange={(v) => setAnswers({ ...answers, overdraft: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="rarely">Rarely (1–2x per year)</SelectItem>
              <SelectItem value="sometimes">Sometimes (monthly)</SelectItem>
              <SelectItem value="often">Often (weekly)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Income type?
          </label>
          <Select onValueChange={(v) => setAnswers({ ...answers, income: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stable-salary">Stable salary</SelectItem>
              <SelectItem value="hourly">Hourly / part-time</SelectItem>
              <SelectItem value="variable">Variable / commission</SelectItem>
              <SelectItem value="freelance">Freelance / self-employed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you have a savings goal?
          </label>
          <Select onValueChange={(v) => setAnswers({ ...answers, savingsGoal: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes-on-track">Yes, and I'm on track</SelectItem>
              <SelectItem value="yes-behind">Yes, but I'm behind</SelectItem>
              <SelectItem value="no">No savings goal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly take-home income (optional)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="e.g. 3500"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        Calculate My Money Reset Score
      </button>
    </form>
  );
}
