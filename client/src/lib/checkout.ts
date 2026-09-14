import { track } from "@/lib/analytics";

// Starts a Stripe Checkout session for one catalogue item and hands the browser
// over to Stripe. The server decides the price, so nothing here can be tampered
// with to buy a $79 bundle for $19.
export async function startCheckout(productId: string): Promise<void> {
  track("begin_checkout", { item_id: productId });
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error || "Could not start checkout. Please try again.");
  }

  window.location.href = data.url;
}
