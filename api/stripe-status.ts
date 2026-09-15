import Stripe from "stripe";

// TEMPORARY diagnostic, to be deleted once checkout is confirmed working.
// Reports only non-secret facts: the key's prefix (sk_live, rk_live, pk_live,
// sk_test…) and which Stripe account it authenticates as. It never returns
// the key itself or any part of it beyond the prefix.

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

export default async function handler(_req: unknown, res: ApiResponse): Promise<void> {
  const key = process.env.STRIPE_SECRET_KEY || "";
  const keyType = key.match(/^(sk|rk|pk)_(live|test)/)?.[0] ?? (key ? "unrecognised-format" : "missing");

  if (!key.startsWith("sk_") && !key.startsWith("rk_")) {
    res.status(200).json({ keyType, account: null, note: "Server key must start with sk_ or rk_." });
    return;
  }

  const stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  try {
    const account = await stripe.accounts.retrieve();
    res.status(200).json({
      keyType,
      account: account.id,
      chargesEnabled: account.charges_enabled,
      businessName: account.settings?.dashboard?.display_name ?? null,
    });
  } catch (error) {
    const e = error as { type?: string; code?: string; statusCode?: number };
    res.status(200).json({ keyType, account: null, stripeErrorType: e.type ?? null, stripeErrorCode: e.code ?? null, status: e.statusCode ?? null });
  }
}
