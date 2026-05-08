interface StanStoreCTAProps {
  toolkitName?: string;
  toolkitLink?: string;
  variant?: "card" | "inline" | "banner";
  className?: string;
}

const STAN_STORE_BASE = "https://stan.store/sheklaai";

const TOOLKITS = [
  {
    emoji: "📦",
    name: "Budget Toolkit Bundle",
    description: "Get all 10 toolkits and trackers in one complete bundle. The ultimate financial reset package.",
    price: "$79",
    originalPrice: "$209 if bought separately",
    savings: "Save $130",
    isBestValue: true,
    link: STAN_STORE_BASE,
  },
  {
    emoji: "💵",
    name: "Paycheck Breakdown Toolkit",
    description: "See exactly where every dollar goes each paycheck. Stop wondering, start knowing.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "🛡️",
    name: "No-Overdraft System",
    description: "Never pay another overdraft fee. Know exactly what is safe to spend at all times.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "📅",
    name: "2-Paycheck Budget System",
    description: "A complete system for managing your money across two paychecks per month.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "📋",
    name: "Bill Catch-Up Plan",
    description: "A step-by-step plan to catch up on overdue bills and stop late fees for good.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "🛒",
    name: "Food Budget Reset Kit",
    description: "Take control of your grocery and dining spending with this proven reset system.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "⛄",
    name: "Debt Payoff Plan",
    description: "Track and crush your debt using the proven snowball or avalanche method.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "✂️",
    name: "Spending Cuts Habit Tracker",
    description: "Find painless ways to cut spending and build better money habits that stick.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "📊",
    name: "Irregular Income Budget Kit",
    description: "Budget confidently even when your income changes month to month.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "🪣",
    name: "Sinking Funds Kit",
    description: "Build targeted savings buckets so unexpected expenses never derail your budget.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
  {
    emoji: "🗓️",
    name: "Annual Bills Planner",
    description: "Plan ahead for yearly expenses so they never catch you off guard.",
    price: "$19",
    link: STAN_STORE_BASE,
  },
];

export { TOOLKITS, STAN_STORE_BASE };

export default function StanStoreCTA({
  toolkitName,
  toolkitLink = STAN_STORE_BASE,
  variant = "card",
  className = "",
}: StanStoreCTAProps) {
  if (variant === "inline") {
    return (
      <div className={`bg-amber-50 border border-amber-200 rounded-xl p-5 my-6 ${className}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🛒</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-900 text-sm mb-1">
              {toolkitName ? `Get the ${toolkitName}` : "Get the Full Toolkit"}
            </p>
            <p className="text-amber-800 text-xs mb-3">
              Instant download spreadsheet system — start in 10 minutes.
            </p>
            <a
              href={toolkitLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Get the Toolkit →
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-6 ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg">🛒 Money Reset Lab Toolkits</p>
            <p className="text-amber-100 text-sm">
              Every article links to a hands-on toolkit. Get the complete bundle of all 10 systems for $79.
            </p>
          </div>
          <a
            href={STAN_STORE_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-amber-600 hover:bg-amber-50 font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap text-sm"
          >
            Browse All Toolkits →
          </a>
        </div>
      </div>
    );
  }

  // Default: card
  return (
    <div className={`border border-amber-200 rounded-xl p-6 bg-amber-50 ${className}`}>
      <div className="text-center">
        <div className="text-3xl mb-2">🛒</div>
        <h3 className="font-bold text-amber-900 mb-2">
          {toolkitName ? toolkitName : "Money Reset Lab Toolkits"}
        </h3>
        <p className="text-amber-800 text-sm mb-4">
          Practical, done-for-you spreadsheet systems. Instant download, start in 10 minutes.
        </p>
        <a
          href={toolkitLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          Get the Toolkit →
        </a>
      </div>
    </div>
  );
}
