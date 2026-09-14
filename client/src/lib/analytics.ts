// Sends funnel events to Google Analytics 4, which is already loaded in
// index.html. This replaces the old Manus weekly digest: assessment
// completions, lead captures, checkout starts and calculator upsell clicks all
// show up under Reports, then Engagement, then Events.
//
// Safe to call during prerendering and before gtag has loaded — it simply
// does nothing in those cases.

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

export function track(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", name, params);
}
