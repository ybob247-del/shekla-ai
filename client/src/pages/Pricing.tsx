import { Link } from "wouter";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get started with your financial reset.",
    features: [
      "Money Reset Score assessment",
      "All budget calculators",
      "67 free learning articles",
      "Financial insights dashboard",
      "No sign-up required",
    ],
    cta: "Get Started Free",
    href: "/assessment",
    highlighted: false,
    badge: null,
  },
  {
    name: "Money Reset Lab",
    price: "$79",
    period: "one-time",
    description: "All 10 done-for-you spreadsheet toolkits in one complete bundle.",
    features: [
      "All 10 financial toolkits",
      "Paycheck Breakdown Toolkit",
      "Debt Payoff Plan",
      "No-Overdraft System",
      "Sinking Funds Kit",
      "Irregular Income Budget Kit",
      "Food Budget Reset Kit",
      "Annual Bills Planner",
      "Bill Catch-Up Plan",
      "2-Paycheck Budget System",
      "Spending Cuts Habit Tracker",
      "Instant download",
      "Lifetime access",
    ],
    cta: "Get All 10 Toolkits",
    href: "https://stan.store/sheklaai",
    highlighted: true,
    badge: "Best Value — Save $130",
    isExternal: true,
  },
  {
    name: "Individual Toolkits",
    price: "$19",
    period: "each",
    description: "Pick the specific toolkit that matches your biggest financial challenge.",
    features: [
      "Choose any single toolkit",
      "Instant download",
      "Lifetime access",
      "Works with any spreadsheet app",
      "Step-by-step instructions included",
    ],
    cta: "Browse Toolkits",
    href: "/resources",
    highlighted: false,
    badge: null,
  },
];

const FAQS = [
  {
    q: "What format are the toolkits in?",
    a: "All toolkits are Google Sheets / Excel-compatible spreadsheet files. They work in Google Sheets (free), Microsoft Excel, or Apple Numbers.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account needed for the free tools (calculators, articles, Money Reset Score). For toolkit purchases, you'll check out through Stan Store.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — all toolkit purchases come with a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
  },
  {
    q: "How is this different from other budgeting apps?",
    a: "Shekla AI focuses on education and done-for-you systems rather than bank account syncing. Our toolkits are one-time purchases with no subscription fees.",
  },
  {
    q: "Can I use the toolkits on my phone?",
    a: "Yes — Google Sheets works on iOS and Android, so you can access your toolkits anywhere.",
  },
];

export default function Pricing() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All core tools are free. Pay once for the toolkits — no subscriptions, no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 relative ${
                plan.highlighted
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/25 scale-105"
                  : "bg-white border border-gray-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-lg font-bold mb-1 ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className={`text-4xl font-extrabold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.highlighted ? "text-emerald-100" : "text-gray-500"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    plan.highlighted ? "text-emerald-100" : "text-gray-600"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <span
                      className={`mt-0.5 ${
                        plan.highlighted ? "text-emerald-200" : "text-emerald-500"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={plan.highlighted ? "text-emerald-50" : "text-gray-700"}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {(plan as any).isExternal ? (
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center font-semibold py-3 px-6 rounded-xl transition-colors ${
                    plan.highlighted
                      ? "bg-white text-emerald-600 hover:bg-emerald-50"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link href={plan.href}>
                  <button
                    className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors ${
                      plan.highlighted
                        ? "bg-white text-emerald-600 hover:bg-emerald-50"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link href="/assessment">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Start with the Free Money Reset Score →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
