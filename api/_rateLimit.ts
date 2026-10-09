/**
 * Per-IP rate limiting backed by Upstash Redis.
 *
 * A TypeScript port of the limiter written for Not Imagining It on 8 Oct 2026,
 * with the lessons from that day kept rather than rediscovered:
 *
 *  - The counter lives in Redis, not in module memory. Every serverless
 *    instance has its own memory, and a burst spreads across many instances,
 *    so an in-memory counter is trivially bypassed by the traffic it exists to
 *    stop. A shared counter is the same counter whichever instance answers.
 *  - It fails OPEN. Nobody should be blocked from a free calculator because a
 *    cache is down.
 *  - When it cannot reach Redis it says WHY, in a response header. Vercel's
 *    runtime log API returns 403 on these projects, so without that header a
 *    misconfiguration is invisible. Finding one cost an hour; the header makes
 *    it one curl. The value is a failure category only, never a credential.
 *
 * Environment (both from the Upstash console, set in Vercel):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

interface LimitedRequest {
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface LimitedResponse {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => LimitedResponse;
  json: (body: unknown) => void;
}

export interface RateLimitOptions {
  /** Namespaces the counter, so two endpoints never share a quota. */
  name: string;
  limit?: number;
  windowSeconds?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetSeconds: number;
  degraded: boolean;
  reason?: string;
}

const DEFAULTS = { limit: 20, windowSeconds: 3600 };

/**
 * On Vercel, x-forwarded-for is a comma-separated chain whose first entry is
 * the original client. Vercel overwrites the header rather than appending to a
 * caller-supplied one, so this cannot be spoofed from outside (verified by
 * sending a forged header against production).
 */
export function clientIp(req: LimitedRequest): string {
  const header = req.headers?.["x-forwarded-for"] || req.headers?.["x-real-ip"] || "";
  const value = Array.isArray(header) ? header[0] : header;
  const first = String(value).split(",")[0].trim();
  return first || req.socket?.remoteAddress || "unknown";
}

export async function checkRateLimit(
  req: LimitedRequest,
  { name, limit, windowSeconds }: RateLimitOptions,
): Promise<RateLimitResult> {
  const max = limit ?? DEFAULTS.limit;
  const window = windowSeconds ?? DEFAULTS.windowSeconds;
  const open = (reason: string): RateLimitResult => ({
    allowed: true,
    remaining: max,
    limit: max,
    resetSeconds: window,
    degraded: true,
    reason,
  });

  // Upstash shows the endpoint as a bare hostname, so the variable often gets
  // set without a scheme. fetch() needs an absolute URL.
  let url = (process.env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/+$/, "");
  if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();

  if (!url || !token) {
    return open(`no-config url:${Boolean(url)} token:${Boolean(token)}`);
  }

  // Fixed window: the bucket number changes every `window` seconds, so the key
  // expires on its own and nothing needs cleaning up.
  const bucket = Math.floor(Date.now() / 1000 / window);
  const key = `rl:${name}:${clientIp(req)}:${bucket}`;

  try {
    // INCR then EXPIRE ... NX in one round trip. NX means the TTL is set only
    // on the first request of a window, so a later request cannot extend it.
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(window), "NX"],
      ]),
    });

    if (!response.ok) {
      // 401 here almost always means the read-only token was pasted instead of
      // the read-write one. That exact mistake is what the header is for.
      const detail = await response.text().catch(() => "");
      console.error("[rateLimit] Upstash", response.status, new URL(url).host, detail.slice(0, 120));
      return open(`http-${response.status}`);
    }

    const body = (await response.json()) as { result?: number }[];
    const count = Number(body?.[0]?.result ?? 0);

    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      limit: max,
      resetSeconds: window - (Math.floor(Date.now() / 1000) % window),
      degraded: false,
    };
  } catch (error) {
    const message = String(error instanceof Error ? error.message : error);
    console.error("[rateLimit] Upstash call failed:", message);
    return open(`fetch-failed: ${message.slice(0, 80)}`);
  }
}

/**
 * Applies the limit and, when the caller is over it, writes the 429 itself.
 * Returns true when the handler should stop.
 */
export async function rateLimited(
  req: LimitedRequest,
  res: LimitedResponse,
  options: RateLimitOptions,
): Promise<boolean> {
  const result = await checkRateLimit(req, options);

  res.setHeader("X-RateLimit-Limit", String(result.limit));
  res.setHeader("X-RateLimit-Remaining", String(result.remaining));
  if (result.degraded) res.setHeader("X-RateLimit-Degraded", result.reason || "unknown");

  if (result.allowed) return false;

  res.setHeader("Retry-After", String(result.resetSeconds));
  res.status(429).json({
    ok: false,
    reason: "rate-limit",
    message: `You have run this ${result.limit} times in the last hour. Try again shortly.`,
    retryAfterSeconds: result.resetSeconds,
  });
  return true;
}
