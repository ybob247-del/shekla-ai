// Captures an email in exchange for the Money Pattern Checklist.
//
// Deliberately provider-agnostic. Set LEADS_WEBHOOK_URL to any endpoint that
// accepts a JSON POST — Kit, Mailchimp, Zapier, Make, a Google Apps Script —
// and addresses start flowing there. With nothing configured the address is
// written to the function log instead, so a signup is never silently dropped
// and the visitor still gets their download either way.

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
}

// Deliberately permissive. The job is to catch typos like a missing @, not to
// adjudicate the RFC and reject somebody's perfectly valid address.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = (typeof req.body === "string" ? safeParse(req.body) : req.body) as
    | { email?: unknown; source?: unknown }
    | undefined;

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const source = typeof body?.source === "string" ? body.source.slice(0, 60) : "patterns";

  if (!EMAIL.test(email) || email.length > 254) {
    res.status(400).json({ error: "That does not look like an email address." });
    return;
  }

  const lead = { email, source, capturedAt: new Date().toISOString() };
  const webhook = process.env.LEADS_WEBHOOK_URL;

  if (webhook) {
    try {
      const forwarded = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!forwarded.ok) {
        // Log rather than fail: the visitor has done their part and should not
        // be punished for our integration being down.
        console.error("Lead webhook rejected the signup:", forwarded.status, email);
      }
    } catch (error) {
      console.error("Lead webhook unreachable:", error instanceof Error ? error.message : error);
    }
  } else {
    console.log("LEAD (no LEADS_WEBHOOK_URL set):", JSON.stringify(lead));
  }

  res.status(200).json({ ok: true, downloadUrl: "/api/checklist" });
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
