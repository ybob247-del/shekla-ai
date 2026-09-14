import { useState } from "react";
import { Link } from "wouter";
import { track } from "@/lib/analytics";

// The landing page for Hidden Patterns viewers. It opens in the channel's
// charcoal and gold rather than Shekla's emerald, so arriving from an
// eighteenth-century documentary does not feel like hitting a different
// company's budgeting quiz. The palette hands over to Shekla further down.

const RULES = [
  "Wait seventy-two hours on anything you did not plan to buy",
  "Ask whether you want it, or just want in",
  "Write the exit before the entry",
  "Separate the money you cannot afford to lose",
  "Ban your own re-entry for thirty days",
  "Automate the boring part so discipline never has to show up",
  "Five minutes a month to see your own pattern",
];

export default function Patterns() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setState("sending");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "patterns" }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Something went wrong. Try again?");
      track("generate_lead", { source: "patterns" });
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("idle");
    }
  };

  return (
    <div className="bg-[#17181c]">
      {/* Hero — the channel's world */}
      <section className="px-4 pt-16 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#b88f3d] text-xs font-semibold tracking-[0.25em] mb-6">HIDDEN PATTERNS</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
            Newton could calculate the motion of the planets.
            <span className="block text-[#d4a94f] mt-2">He could not calculate his own FOMO.</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            He sold. He watched it climb without him. He bought back in near the top, and lost a fortune.
            His intelligence was never the problem. The order of events was.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The pattern is not that smart people are secretly stupid with money. It is that decisions made
            during the feeling are always worse than decisions made before it.
          </p>
        </div>
      </section>

      {/* The offer */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1f2027] border border-[#3a3324] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">The Money Pattern Checklist</h2>
            <p className="text-[#d4a94f] mb-6">Seven rules you set once, while calm, so they run when you are not.</p>

            <ul className="space-y-2.5 mb-8">
              {RULES.map((rule, index) => (
                <li key={rule} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                  <span className="text-[#b88f3d] font-semibold shrink-0">{index + 1}</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>

            {state === "done" ? (
              <div className="text-center">
                <p className="text-white font-semibold mb-4">Your checklist is ready.</p>
                <a
                  href="/api/checklist"
                  className="inline-block bg-[#d4a94f] hover:bg-[#c19a45] text-[#17181c] font-bold px-8 py-3.5 rounded-xl transition-colors"
                >
                  Download the checklist
                </a>
                <p className="text-gray-500 text-xs mt-4">
                  Fill in the blanks and put it where you will see it before you spend, not after.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <label htmlFor="patterns-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="patterns-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@email.com"
                  className="w-full bg-[#17181c] border border-[#3a3a42] focus:border-[#d4a94f] outline-none text-white placeholder-gray-600 rounded-xl px-4 py-3.5 transition-colors"
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="w-full bg-[#d4a94f] hover:bg-[#c19a45] disabled:opacity-60 text-[#17181c] font-bold py-3.5 rounded-xl transition-colors"
                >
                  {state === "sending" ? "Sending…" : "Send me the checklist"}
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <p className="text-gray-500 text-xs text-center">
                  Free. One email, then the weekly pattern. Unsubscribe whenever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Handover to Shekla */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-400 text-sm italic mb-6">
            The pattern was always there. Now you can see it.
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Which pattern is running in your money right now?
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The rules above work best when you know which one you actually need. The free Money Reset Score
            takes three minutes, finds where your money is leaking, and tells you what to fix first.
          </p>
          <Link href="/assessment?ref=patterns">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
              Get my free Money Reset Score →
            </button>
          </Link>
          <p className="text-gray-400 text-xs mt-4">No sign-up required · Takes 3 minutes</p>
        </div>
      </section>
    </div>
  );
}
