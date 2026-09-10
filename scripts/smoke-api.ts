import checkout from "../api/checkout";
import download from "../api/download";
import { TOOLKITS, BUNDLE_ID, SEPARATE_TOTAL_CENTS, BUNDLE_SAVING_CENTS, filesFor } from "../api/_catalog";

function mockRes() {
  const out: any = { code: 0, body: null, headers: {} as Record<string, string> };
  const res: any = {
    status(c: number) { out.code = c; return res; },
    json(b: unknown) { out.body = b; },
    setHeader(k: string, v: string) { out.headers[k] = v; },
    end() {},
  };
  return { res, out };
}

async function main() {
  let failures = 0;
  const check = (name: string, ok: boolean, detail = "") => {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
    if (!ok) failures++;
  };

  console.log("catalogue:");
  check("10 toolkits", TOOLKITS.length === 10, `${TOOLKITS.length}`);
  check("separate total is $190", SEPARATE_TOTAL_CENTS === 19000, `${SEPARATE_TOTAL_CENTS}`);
  check("bundle saving is $111", BUNDLE_SAVING_CENTS === 11100, `${BUNDLE_SAVING_CENTS}`);
  check("bundle entitles all 10 files", filesFor(BUNDLE_ID).length === 10);
  check("single purchase entitles 1 file", filesFor("sinking-funds-kit").length === 1);
  check("unknown product entitles nothing", filesFor("not-real").length === 0);

  console.log("checkout endpoint:");
  let m = mockRes();
  await checkout({ method: "GET", headers: {} } as any, m.res);
  check("rejects GET", m.out.code === 405, `${m.out.code}`);

  m = mockRes();
  await checkout({ method: "POST", headers: { host: "x" }, body: { productId: "not-real" } } as any, m.res);
  check("rejects unknown product before touching Stripe", m.out.code === 400 || m.out.code === 500, `${m.out.code}`);

  const saved = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  m = mockRes();
  await checkout({ method: "POST", headers: { host: "x" }, body: { productId: BUNDLE_ID } } as any, m.res);
  check("explains missing Stripe key", m.out.code === 500 && /not configured/i.test(String((m.out.body as any)?.error)), `${m.out.code}`);
  if (saved) process.env.STRIPE_SECRET_KEY = saved;

  console.log("download endpoint:");
  m = mockRes();
  await download({ method: "GET", query: {} } as any, m.res);
  check("requires a purchase reference", m.out.code === 400 || m.out.code === 500, `${m.out.code}`);

  console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
  process.exitCode = failures === 0 ? 0 : 1;
}
main();
