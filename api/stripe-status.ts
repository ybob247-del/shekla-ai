import Stripe from "stripe";
import { describeStripeKey, readStripeKey } from "./_stripeKey";

// TEMPORARY diagnostic, to be deleted once checkout is confirmed working.
// Returns only non-secret facts about the key and which account it reaches.

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

export default async function handler(_req: unknown, res: ApiResponse): Promise<void> {
  const facts = describeStripeKey();
  const key = readStripeKey();

  if (!key.startsWith("sk_") && !key.startsWith("rk_")) {
    res.status(200).json({ ...facts, account: null });
    return;
  }

  try {
    const account = await new Stripe(key, { apiVersion: "2025-02-24.acacia" }).accounts.retrieve();
    res.status(200).json({ ...facts, account: account.id, chargesEnabled: account.charges_enabled });
  } catch (error) {
    const e = error as { type?: string; code?: string };
    res.status(200).json({ ...facts, account: null, stripeErrorType: e.type ?? null, stripeErrorCode: e.code ?? null });
  }
}
