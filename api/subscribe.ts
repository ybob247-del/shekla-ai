// Captures an email in exchange for the Money Pattern Checklist.
//
// Where the address goes, in order of preference:
//   1. Kit, when KIT_API_KEY and KIT_FORM_ID are set. The subscriber is created
//      (or found) and then added to the form, which is how Kit's v4 API wants it.
//   2. LEADS_WEBHOOK_URL, any endpoint that accepts a JSON POST.
//   3. The function log, so a signup is never silently dropped.
// Whatever happens downstream, the visitor still gets their download: the
// page delivers the PDF directly, so a Kit hiccup never costs them the file.

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
const KIT_API = "https://api.kit.com/v4";

async function sendToKit(email: string, referrer: string, apiKey: string, formId: string): Promise<boolean> {
  const headers = { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey };

  // Kit only adds existing subscribers to a form, so create first. An address
  // that is already on the list comes back as success, not an error.
  const created = await fetch(`${KIT_API}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email }),
  });
  if (!created.ok) {
    console.error("Kit create subscriber failed:", created.status, await created.text().catch(() => ""));
    return false;
  }

  const added = await fetch(`${KIT_API}/forms/${encodeURIComponent(formId)}/subscribers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email_address: email, referrer }),
  });
  if (!added.ok) {
    console.error("Kit add to form failed:", added.status, await added.text().catch(() => ""));
    return false;
  }
  return true;
}

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
  const kitKey = (process.env.KIT_API_KEY || "").trim();
  const kitForm = (process.env.KIT_FORM_ID || "").trim();
  const webhook = process.env.LEADS_WEBHOOK_URL;

  try {
    if (kitKey && kitForm) {
      const ok = await sendToKit(email, `https://www.shekla.ai/${source}`, kitKey, kitForm);
      if (!ok) console.log("LEAD (Kit failed, kept here):", JSON.stringify(lead));
    } else if (webhook) {
      const forwarded = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!forwarded.ok) console.error("Lead webhook rejected the signup:", forwarded.status, email);
    } else {
      console.log("LEAD (no Kit or webhook configured):", JSON.stringify(lead));
    }
  } catch (error) {
    // Log rather than fail: the visitor has done their part.
    console.error("Lead delivery failed:", error instanceof Error ? error.message : error, JSON.stringify(lead));
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
