/**
 * Guard checks for /api/debt/unlock. Run: npx tsx scripts/check-debt-unlock.ts
 *
 * The property worth protecting is the ORDER of the checks: Stripe is verified
 * before anything expensive happens, so nobody can reach the model without
 * paying first. A refactor that moves the payment check below the generation
 * would not break any feature, which is exactly why it needs a test.
 */
process.env.STRIPE_SECRET_KEY = "sk_test_placeholder_not_a_real_key";

const realFetch = globalThis.fetch;
let openaiCalls = 0;
globalThis.fetch = ((url: Parameters<typeof realFetch>[0], init?: Parameters<typeof realFetch>[1]) => {
  if (String(url).includes("api.openai.com")) openaiCalls++;
  return realFetch(url, init);
}) as typeof fetch;

import handler from "../api/debt/unlock";

function mockRes() {
  const out: { code?: number; body?: Record<string, unknown> } = {};
  const res = {
    setHeader: () => undefined,
    status(c: number) { out.code = c; return res; },
    json(b: Record<string, unknown>) { out.body = b; },
  };
  return { res, out };
}

const DEBTS = [{ name: "Visa", balance: 2400, apr: 24.99, minimum: 60 }];
let fails = 0;
const check = (n: string, ok: boolean, d = "") => {
  console.log((ok ? "  ok   " : "  FAIL ") + n + (ok ? "" : "  — " + d));
  if (!ok) fails++;
};

async function call(body: unknown, method = "POST") {
  const m = mockRes();
  await handler({ method, headers: {}, body } as never, m.res as never);
  return m.out;
}

(async () => {
  console.log("\nThe paywall is checked before anything expensive runs");

  check("GET is rejected", (await call(null, "GET")).code === 405);
  check("a missing session is refused", (await call({ debts: DEBTS })).code === 400);
  check("a malformed session is refused", (await call({ sessionId: "not-a-session", debts: DEBTS })).code === 400);
  check("an oversized session id is refused", (await call({ sessionId: "cs_" + "x".repeat(300), debts: DEBTS })).code === 400);

  const unknown = await call({ sessionId: "cs_test_doesnotexist", debts: DEBTS });
  check("an unpaid or unknown session stops at Stripe", unknown.code === 502, String(unknown.code));

  check("no schedule leaks on any refusal", unknown.body?.schedule === undefined);
  check("the model was never called", openaiCalls === 0, `${openaiCalls} call(s)`);

  console.log(fails === 0 ? "\nAll guard checks passed.\n" : `\n${fails} CHECK(S) FAILED.\n`);
  process.exit(fails === 0 ? 0 : 1);
})();
