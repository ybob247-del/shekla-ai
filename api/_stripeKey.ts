// Reads STRIPE_SECRET_KEY defensively. Keys pasted into a dashboard often
// arrive with surrounding spaces, a trailing newline, wrapping quotes, or the
// "STRIPE_SECRET_KEY=" label copied along with them. Stripe then answers with
// an authentication error that looks exactly like a wrong key.

const LABEL = "STRIPE_SECRET_KEY=";
const KNOWN_PREFIXES = ["sk_live_", "sk_test_", "rk_live_", "rk_test_", "pk_live_", "pk_test_", "whsec_"];

function stripQuotes(value: string): string {
  const first = value.charAt(0);
  const last = value.charAt(value.length - 1);
  return (first === '"' || first === "'") && first === last ? value.slice(1, -1).trim() : value;
}

export function readStripeKey(raw: string = process.env.STRIPE_SECRET_KEY || ""): string {
  let key = raw.trim();
  if (key.startsWith(LABEL)) key = key.slice(LABEL.length).trim();
  return stripQuotes(key);
}

/** Non-secret facts about the configured key, for diagnosing a bad paste. */
export function describeStripeKey(raw: string = process.env.STRIPE_SECRET_KEY || "") {
  const normalised = readStripeKey(raw);
  return {
    present: raw.length > 0,
    length: normalised.length,
    hadSurroundingWhitespace: raw !== raw.trim(),
    hadVariableNameLabel: raw.trim().startsWith(LABEL),
    hadWrappingQuotes: normalised !== raw.trim().replace(LABEL, "").trim(),
    prefix: KNOWN_PREFIXES.find((p) => normalised.startsWith(p)) ?? "none-recognised",
    containsSkLiveSomewhere: raw.includes("sk_live_"),
    containsInnerWhitespace: /\s/.test(normalised),
  };
}
