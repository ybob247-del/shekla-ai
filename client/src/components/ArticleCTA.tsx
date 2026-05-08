import { Link } from "wouter";
import AssessmentCTA from "./AssessmentCTA";
import StanStoreCTA from "./StanStoreCTA";

interface ArticleCTAProps {
  type: "assessment" | "toolkit" | "calculator";
  toolkitName?: string;
  toolkitLink?: string;
  className?: string;
}

export default function ArticleCTA({ type, toolkitName, toolkitLink, className = "" }: ArticleCTAProps) {
  if (type === "assessment") {
    return <AssessmentCTA variant="inline" className={className} />;
  }

  if (type === "toolkit") {
    return (
      <StanStoreCTA
        variant="inline"
        toolkitName={toolkitName}
        toolkitLink={toolkitLink}
        className={className}
      />
    );
  }

  if (type === "calculator") {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-xl p-6 my-8 ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-800 mb-1">
              🧮 Try the Budget Calculator
            </p>
            <p className="text-sm text-blue-700">
              Calculate your exact 50/30/20 split based on your income.
            </p>
          </div>
          <Link href="/calculators">
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
              Open Calculator
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
