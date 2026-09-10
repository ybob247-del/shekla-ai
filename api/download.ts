import Stripe from "stripe";
import fs from "node:fs";
import path from "node:path";
import { filesFor, getToolkit } from "../shared/catalog";

// Entitlement is decided by asking Stripe whether the session was actually
// paid, and by reading the product id off the session's own metadata. Nothing
// the caller sends decides what they may download, so a guessed file name gets
// a 403 rather than a PDF.

const DOWNLOAD_WINDOW_SECONDS = 60 * 60 * 24 * 30; // 30 days after purchase

interface ApiRequest {
  method?: string;
  query: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: (chunk?: Buffer) => void;
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    res.status(500).json({ error: "Downloads are not configured yet." });
    return;
  }

  const sessionId = first(req.query.session_id);
  const fileId = first(req.query.file);

  if (!sessionId) {
    res.status(400).json({ error: "Missing session_id." });
    return;
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2025-02-24.acacia" });

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    res.status(404).json({ error: "That purchase could not be found." });
    return;
  }

  if (session.payment_status !== "paid") {
    res.status(403).json({ error: "That purchase is not complete." });
    return;
  }

  const purchasedId = session.metadata?.productId || "";
  const entitled = filesFor(purchasedId);
  if (entitled.length === 0) {
    res.status(403).json({ error: "That purchase has nothing to download." });
    return;
  }

  const purchasedAt = session.created || 0;
  if (purchasedAt && Date.now() / 1000 - purchasedAt > DOWNLOAD_WINDOW_SECONDS) {
    res.status(410).json({ error: "This download link has expired. Contact hello@shekla.ai." });
    return;
  }

  // No file requested: tell the success page what this purchase includes.
  if (!fileId) {
    res.status(200).json({
      product: purchasedId,
      files: entitled.map((toolkit) => ({ id: toolkit.id, name: toolkit.name })),
    });
    return;
  }

  const toolkit = getToolkit(fileId);
  if (!toolkit || !entitled.some((entry) => entry.id === toolkit.id)) {
    res.status(403).json({ error: "That file is not part of this purchase." });
    return;
  }

  // toolkit.file comes from our own catalogue, never from the request, so this
  // path cannot be steered outside the toolkits directory.
  const filePath = path.join(process.cwd(), "assets", "toolkits", toolkit.file);
  if (!fs.existsSync(filePath)) {
    console.error("Missing toolkit file on disk:", toolkit.file);
    res.status(500).json({ error: "That file is temporarily unavailable." });
    return;
  }

  const contents = fs.readFileSync(filePath);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${toolkit.file}"`);
  res.setHeader("Content-Length", String(contents.length));
  res.setHeader("Cache-Control", "private, no-store");
  res.end(contents);
}
