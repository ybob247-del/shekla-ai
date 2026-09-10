import Stripe from "stripe";
import { BUNDLE_ID, displayName, isPurchasable, priceCentsFor } from "../shared/catalog";

// Prices are sent inline as price_data rather than referencing Stripe Product
// objects. The catalogue in shared/catalog.ts stays the single source of truth,
// and changing a price needs no dashboard work — just a deploy.

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
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

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    // Deliberately explicit: this is the one failure a deploy is most likely to
    // hit, and a generic 500 would send someone hunting through Stripe instead.
    console.error("STRIPE_SECRET_KEY is not set");
    res.status(500).json({ error: "Payments are not configured yet." });
    return;
  }

  const body = (typeof req.body === "string" ? safeParse(req.body) : req.body) as
    | { productId?: unknown }
    | undefined;
  const productId = typeof body?.productId === "string" ? body.productId : "";

  if (!isPurchasable(productId)) {
    res.status(400).json({ error: "Unknown product." });
    return;
  }

  const amount = priceCentsFor(productId);
  if (!amount) {
    res.status(400).json({ error: "Unknown product." });
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
            unit_amount: amount,
            product_data: {
              name: displayName(productId),
              description:
                productId === BUNDLE_ID
                  ? "All 10 Money Reset Lab toolkits, delivered as instant downloads."
                  : "Instant download from Money Reset Lab.",
            },
          },
        },
      ],
      // The download endpoint reads this back off the paid session to decide
      // what the buyer is entitled to, so it must not be trusted from the client.
      metadata: { productId },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      allow_promotion_codes: true,
      // Needed so we can email the buyer their download link later.
      customer_creation: "always",
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout failed:", error instanceof Error ? error.message : error);
    res.status(502).json({ error: "Could not start checkout. Please try again." });
  }
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
