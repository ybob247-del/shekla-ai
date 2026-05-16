import { Link } from "wouter";
import MoneyResetScore from "@/components/MoneyResetScore";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Answer 6 Questions",
    description: "Quick questions about your budget, debt, savings, and income situation.",
  },
  {
    step: "2",
    title: "Get Your Score",
    description: "Receive your Money Reset Score (0–100) with a letter grade and summary.",
  },
  {
    step: "3",
    title: "See Your Plan",
    description: "Get personalized recommendations and toolkit suggestions based on your results.",
  },
];

const SCORE_RANGES = [
  { range: "80–100", grade: "A", label: "Strong Foundation", color: "emerald", desc: "You're doing great. Focus on optimization and wealth building." },
  { range: "60–79", grade: "B", label: "On Track", color: "blue", desc: "Good habits in place. A few targeted fixes will accelerate your progress." },
  { range: "40–59", grade: "C", label: "Needs Attention", color: "yellow", desc: "Some gaps to address. Prioritize emergency fund and debt reduction." },
  { range: "20–39", grade: "D", label: "Struggling", color: "orange", desc: "Multiple areas need work. Start with a basic budget and emergency fund." },
  { range: "0–19", grade: "F", label: "Reset Needed", color: "red", desc: "Financial reset required. Take it one step at a time — start with the basics." },
];

export default function Assessment() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <span>⭐</span>
            <span>Free · No Sign-Up Required · 3 Minutes</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Your Money Reset Score
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find out exactly where your money stands and get a personalized plan to improve it.
            Takes less than 3 minutes.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-full mb-3">
                {step.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Assessment Form — MoneyResetScore uses react-hook-form + zod internally */}
        <MoneyResetScore />

        {/* Score Range Guide */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-center">Score Range Guide</h3>
          <div className="space-y-3">
            {SCORE_RANGES.map((s) => (
              <div key={s.grade} className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    s.color === "emerald"
                      ? "bg-emerald-100 text-emerald-700"
                      : s.color === "blue"
                      ? "bg-blue-100 text-blue-700"
                      : s.color === "yellow"
                      ? "bg-yellow-100 text-yellow-700"
                      : s.color === "orange"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.grade}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm">{s.label}</span>
                    <span className="text-gray-400 text-xs">({s.range})</span>
                  </div>
                  <p className="text-gray-600 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your answers are not stored or shared. This assessment is for educational purposes only
            and does not constitute financial advice.
          </p>
          <p className="mt-2">
            Want to learn more?{" "}
            <Link href="/learn" className="text-emerald-600 hover:underline">
              Browse our free financial articles →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
