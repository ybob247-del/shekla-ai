// No imports on purpose. If this responds but the others do not, the problem
// is a dependency or an import path, not the function runtime itself.
export default function handler(_req: unknown, res: { status: (c: number) => { json: (b: unknown) => void } }): void {
  res.status(200).json({ ok: true, stripeKeyPresent: Boolean(process.env.STRIPE_SECRET_KEY) });
}
