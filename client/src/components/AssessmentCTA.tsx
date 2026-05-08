import { Link } from "wouter";

interface AssessmentCTAProps {
  variant?: "banner" | "card" | "inline";
  className?: string;
}

export default function AssessmentCTA({ variant = "banner", className = "" }: AssessmentCTAProps) {
  if (variant === "inline") {
    return (
      <div className={`bg-emerald-50 border border-emerald-200 rounded-xl p-6 my-8 ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-800 mb-1">
              💡 Not sure where your money is going each month?
            </p>
            <p className="text-sm text-emerald-700">
              Take the Money Reset Score to find your biggest money leaks in 3 minutes.
            </p>
          </div>
          <Link href="/assessment">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
              Find My Money Leaks
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="text-xl font-bold mb-2">Know Your Money Reset Score</h3>
          <p className="text-emerald-100 text-sm mb-6">
            Take the 10-question assessment and get personalized toolkit recommendations based on your financial situation.
          </p>
          <Link href="/assessment">
            <button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-6 py-3 rounded-xl transition-colors">
              Take the Assessment →
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Default: banner
  return (
    <div className={`bg-emerald-600 text-white py-3 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm font-medium">
          📊 Know exactly where your money stands —
        </p>
        <Link href="/assessment">
          <button className="bg-white text-emerald-600 hover:bg-emerald-50 text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Get Your Free Money Reset Score →
          </button>
        </Link>
      </div>
    </div>
  );
}
