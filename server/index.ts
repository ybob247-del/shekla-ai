import express from "express";
import Stripe from "stripe";
import { createServer } from "http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3001;

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDir = path.join(rootDir, "dist", "public");

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

// Raw body needed for Stripe webhook signature verification
app.use("/api/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// ─── Health Check ───────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Create Checkout Session ─────────────────────────────────────────────────
app.post("/api/create-checkout-session", async (req, res) => {
  const { priceId, successUrl, cancelUrl, customerEmail } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: "priceId is required" });
  }

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/pricing`,
      allow_promotion_codes: true,
    };

    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Create Subscription Checkout ────────────────────────────────────────────
app.post("/api/create-subscription", async (req, res) => {
  const { priceId, successUrl, cancelUrl, customerEmail } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: "priceId is required" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/pricing`,
      customer_email: customerEmail,
      allow_promotion_codes: true,
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe subscription error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Stripe Webhook ───────────────────────────────────────────────────────────
app.post("/api/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
    return res.json({ received: true });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Payment completed:", session.id, "| Customer:", session.customer_email);
      // TODO: Grant access, send confirmation email, update DB
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("📋 Subscription updated:", subscription.id, "| Status:", subscription.status);
      // TODO: Update user subscription status in DB
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("❌ Subscription cancelled:", subscription.id);
      // TODO: Revoke access
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("💳 Payment failed for invoice:", invoice.id);
      // TODO: Notify customer, retry logic
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// ─── Get Session Details ──────────────────────────────────────────────────────
app.get("/api/session/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
    });
  } catch (err: any) {
    res.status(404).json({ error: "Session not found" });
  }
});

// ─── Static Site ──────────────────────────────────────────────────────────────
// The build prerenders every public route to dist/public/<route>/index.html.
// Those files carry the per-page title, description, canonical, and the fully
// rendered markup, so they must be served in preference to the SPA shell.
// Serving the shell for every path is what made all pages look identical to
// crawlers.
if (fs.existsSync(staticDir)) {
  // Hashed build assets never change contents, so they can be cached hard.
  app.use(
    "/assets",
    express.static(path.join(staticDir, "assets"), {
      immutable: true,
      maxAge: "1y",
    }),
  );

  // Everything else (logo.png, manifest.json, robots.txt, sitemap.xml …).
  // `index: false` plus `redirect: false` keeps directory requests flowing to
  // the handler below instead of being answered with a trailing-slash
  // redirect, so prerendered pages are resolved consistently and each route
  // keeps a single canonical URL.
  app.use(express.static(staticDir, { index: false, redirect: false, maxAge: "1h" }));

  const notFoundPage = path.join(staticDir, "404.html");

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();

    // Resolve inside staticDir only — never let "../" escape the build output.
    const requested = path.join(staticDir, req.path, "index.html");
    const resolved = path.resolve(requested);
    const withinStaticDir =
      resolved === path.resolve(staticDir) || resolved.startsWith(path.resolve(staticDir) + path.sep);

    if (withinStaticDir && fs.existsSync(resolved)) {
      return res.sendFile(resolved);
    }

    // Unknown route: serve the prerendered, noindexed 404 page with a real
    // 404 status. Matches what Vercel does with 404.html.
    return res.status(404).sendFile(notFoundPage);
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────
const httpServer = createServer(app);
httpServer.listen(PORT, () => {
  console.log(`🚀 Shekla AI server running on port ${PORT}`);
});

export default app;
