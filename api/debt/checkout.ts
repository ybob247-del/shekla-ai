/**
 * POST /api/debt/checkout
 *
 * Starts a $19 Stripe Checkout for the personalised debt payoff plan.
 *
 * The debts are deliberately NOT sent to Stripe or stored anywhere. They stay
 * in the buyer's browser and are posted back to /api/debt/unlock alongside the
 * session id once payment clears. A list of someone's balances and rates is the
 * most sensitive thing this site could hold, and the surest way never to leak
 * it is never to keep it.
 *
 * What the session does carry is a marker saying what was bought, so unlock can
 * check the session is one of ours rather than any paid session on the account.
 */
import Stripe from "stripe";
import { readStripeKey } from "../_stripeKey";
import { rateLimited } from "../_rateLimit";

export const DEBT_PLAN_PRODUCT = "debt-payoff-plan";
export const DEBT_PLAN_PRICE_CENTS = 1900;

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface ApiResponse {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

function originFrom(req: ApiRequest): string {
  const forwardedHost = req.headers["x-forwarded-host"] || req.headers.host;
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost;
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  return `${proto || "https"}://${host}`;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Creating checkout sessions is cheap but not free, and a loop here would
  // litter the Stripe dashboard with abandoned sessions.
  if (await rateLimited(req, res, { name: "debt-checkout", limit: 10, windowSeconds: 3600 })) {
    return;
  }

  const secretKey = readStripeKey();
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    res.status(500).json({ error: "Payments are not configured yet." });
    return;
  }

  const origin = originFrom(req);
  const stripe = new Stripe(secretKey, { apiVersion: "2025-02-24.acacia" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: DEBT_PLAN_PRICE_CENTS,
            product_data: {
              name: "Your Personalised Debt Payoff Plan",
              description:
                "Month-by-month payment schedule built from your own balances and rates, with the reasoning written out.",
            },
          },
        },
      ],
      // Read back by unlock. Never trusted from the client.
      metadata: { productId: DEBT_PLAN_PRODUCT },
      success_url: `${origin}/debt-payoff?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/debt-payoff`,
      allow_promotion_codes: true,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    const stripeError = error as { message?: string; type?: string; code?: string };
    console.error("[debt/checkout] Stripe failed:", stripeError.type, stripeError.code, stripeError.message);
    res.status(502).json({
      error: "Could not start checkout. Please try again.",
      code: stripeError.code ?? stripeError.type ?? null,
    });
  }
}
