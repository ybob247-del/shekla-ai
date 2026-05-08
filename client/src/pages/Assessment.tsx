import MoneyResetScore from "@/components/MoneyResetScore";
import { Link } from "wouter";

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

        {/* Assessment Form */}
        <MoneyResetScore />

        {/* Bottom info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your answers are not stored or shared. This assessment is for educational purposes only and does not constitute financial advice.
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
