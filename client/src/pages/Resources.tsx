import { useState } from "react";
import { Link } from "wouter";
import { TOOLKITS } from "@/components/StanStoreCTA";
import { startCheckout } from "@/lib/checkout";

// Buying happens here now, on our own domain, rather than by handing the
// reader off to a third-party storefront.
function BuyButton({ productId, label, className }: { productId: string; label: string; className: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError("");
          try {
            await startCheckout(productId);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not start checkout.");
            setLoading(false);
          }
        }}
        className={`${className} disabled:opacity-60`}
      >
        {loading ? "Loading…" : label}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

export default function Resources() {
  const bundleToolkit = TOOLKITS.find((t) => t.isBestValue);
  const individualToolkits = TOOLKITS.filter((t) => !t.isBestValue);

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            🧪 Money Reset Lab
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Done-For-You Financial Toolkits
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practical, done-for-you toolkits to reset your finances. Instant download.
            Start in 10 minutes. No subscription required.
          </p>
        </div>

        {/* Bundle - Best Value */}
        {bundleToolkit && (
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 mb-10 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                {bundleToolkit.savings}
              </span>
            </div>
            <div className="max-w-2xl">
              <div className="flex -space-x-6 mb-5" aria-hidden="true">
                {["debt-payoff-plan", "paycheck-breakdown-toolkit", "sinking-funds-kit", "bill-catch-up-plan"].map((id) => (
                  <img
                    key={id}
                    src={`/toolkit-previews/${id}-cover.jpg`}
                    alt=""
                    width={640}
                    height={828}
                    loading="lazy"
                    className="w-20 h-auto rounded-md border-2 border-white shadow-lg"
                  />
                ))}
              </div>
              <h2 className="text-2xl font-bold mb-2">{bundleToolkit.name}</h2>
              <p className="text-emerald-100 mb-4">{bundleToolkit.description}</p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-extrabold">{bundleToolkit.price}</span>
                <span className="text-emerald-200 text-sm line-through">{bundleToolkit.originalPrice}</span>
              </div>
              <BuyButton
                productId={bundleToolkit.id}
                label="Get All 10 Toolkits →"
                className="inline-flex items-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
              />
            </div>
          </div>
        )}

        {/* Individual Toolkits */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Individual Toolkits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {individualToolkits.map((toolkit) => (
              <div
                key={toolkit.name}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <img
                  src={`/toolkit-previews/${toolkit.id}-cover.jpg`}
                  alt={`Cover page of the ${toolkit.name}`}
                  width={640}
                  height={828}
                  loading="lazy"
                  className="w-full h-44 object-cover object-top rounded-lg border border-gray-100 mb-3"
                />
                <a
                  href={`/toolkit-previews/${toolkit.id}-inside.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-emerald-700 hover:underline mb-3 self-start"
                >
                  See an inside page →
                </a>
                <h3 className="font-bold text-gray-900 mb-2">{toolkit.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">{toolkit.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xl font-bold text-gray-900">{toolkit.price}</span>
                  <BuyButton
                    productId={toolkit.id}
                    label="Get Toolkit →"
                    className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Purchase Instantly", desc: "Secure checkout via Stripe. Instant download the moment payment clears." },
              { step: "2", title: "Download Your Toolkit", desc: "A printable PDF workbook — fill it in by hand or on any device." },
              { step: "3", title: "Start in 10 Minutes", desc: "Each toolkit includes step-by-step instructions to get started fast." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-full mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What format are the toolkits?",
                a: "All toolkits are Google Sheets / Excel-compatible files. They work in Google Sheets (free), Microsoft Excel, or Apple Numbers.",
              },
              {
                q: "Do I need any special software?",
                a: "No. Google Sheets is free and works in any browser. You can also use Microsoft Excel or Apple Numbers.",
              },
              {
                q: "Is there a refund policy?",
                a: "Yes — 30-day money-back guarantee on all purchases. If you're not satisfied, contact us for a full refund.",
              },
              {
                q: "Can I share the toolkit with my partner?",
                a: "Yes — each purchase is for personal use and can be shared within your household.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Not Sure Which Toolkit to Start With?</h3>
          <p className="text-gray-300 mb-6">
            Take the free Money Reset Score to get personalized toolkit recommendations based on your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment">
              <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                Get My Free Score →
              </button>
            </Link>
            <Link href="/pricing">
              <button className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-colors">
                Compare Options
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
