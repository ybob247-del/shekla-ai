import { useState } from "react";
import { formatUsd, getToolkit } from "@catalog";
import { startCheckout } from "@/lib/checkout";
import { track } from "@/lib/analytics";

// Shown directly under a calculator result. The moment someone has just seen
// their own number is the moment a plan for that number is most useful, so the
// offer names the toolkit that turns the result into next steps.

interface CalculatorUpsellProps {
  calculator: string;
  toolkitId: string;
  headline: string;
}

export default function CalculatorUpsell({ calculator, toolkitId, headline }: CalculatorUpsellProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toolkit = getToolkit(toolkitId);

  if (!toolkit) return null;

  const buy = async () => {
    track("calculator_upsell_click", { calculator, item_id: toolkit.id });
    setLoading(true);
    setError("");
    try {
      await startCheckout(toolkit.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 border border-amber-200 bg-amber-50 rounded-xl p-4 flex gap-4 items-center">
      <img
        src={`/toolkit-previews/${toolkit.id}-cover.jpg`}
        alt={`Cover page of the ${toolkit.name}`}
        width={640}
        height={828}
        loading="lazy"
        className="w-16 sm:w-20 h-auto rounded border border-amber-100 shadow-sm shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-amber-900">{headline}</p>
        <p className="text-xs text-amber-800 mt-0.5 mb-3">
          {toolkit.name} · {formatUsd(toolkit.priceCents)} · instant PDF download
        </p>
        <button
          type="button"
          onClick={buy}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "Loading…" : `Get the ${toolkit.name} →`}
        </button>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
}
