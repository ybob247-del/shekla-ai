import { useState } from "react";
import { Link } from "wouter";

// Stripe Price IDs — replace with your actual Stripe price IDs from the dashboard
const STRIPE_PRICE_IDS = {
  bundle: "price_bundle_all_toolkits", // Replace with real Stripe price ID
  individual: "price_individual_toolkit", // Replace with real Stripe price ID
};

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
    isExternal: false,
    stripePrice: null,
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
    stripePrice: STRIPE_PRICE_IDS.bundle,
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
    isExternal: false,
    stripePrice: null,
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

function PlanCard({ plan }: { plan: typeof PLANS[0] }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (plan.isExternal) {
      window.open(plan.href, "_blank");
      return;
    }
    if (!plan.stripePrice) {
      window.location.href = plan.href;
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan.stripePrice,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-2xl p-8 relative flex flex-col ${
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
        <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
          {plan.name}
        </h3>
        <p className={`text-sm mb-4 ${plan.highlighted ? "text-emerald-100" : "text-gray-500"}`}>
          {plan.description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
            {plan.price}
          </span>
          <span className={`text-sm ${plan.highlighted ? "text-emerald-200" : "text-gray-400"}`}>
            {plan.period}
          </span>
        </div>
      </div>

      <ul className="space-y-2.5 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <svg
              className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-emerald-200" : "text-emerald-500"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className={`text-sm ${plan.highlighted ? "text-emerald-50" : "text-gray-600"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full font-bold py-3.5 rounded-xl transition-colors text-sm ${
          plan.highlighted
            ? "bg-white text-emerald-600 hover:bg-emerald-50"
            : "bg-emerald-500 text-white hover:bg-emerald-600"
        } disabled:opacity-60`}
      >
        {loading ? "Loading..." : plan.cta}
      </button>
    </div>
  );
}

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-start">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Guarantee */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center mb-16">
          <div className="text-3xl mb-2">🛡️</div>
          <h3 className="font-bold text-gray-900 mb-1">30-Day Money-Back Guarantee</h3>
          <p className="text-gray-600 text-sm max-w-lg mx-auto">
            Not satisfied with your toolkit purchase? Contact us within 30 days for a full refund — no questions asked.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-500 mb-4">Still not sure? Start with the free tools.</p>
          <Link href="/assessment">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
              Get My Free Money Reset Score →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
