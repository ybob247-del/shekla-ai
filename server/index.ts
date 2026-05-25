import express from "express";
import Stripe from "stripe";
import { createServer } from "http";

const app = express();
const PORT = process.env.PORT || 3001;

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

// ─── Start Server ─────────────────────────────────────────────────────────────
const httpServer = createServer(app);
httpServer.listen(PORT, () => {
  console.log(`🚀 Shekla AI server running on port ${PORT}`);
});

export default app;
