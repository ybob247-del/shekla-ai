// The one place that knows what is for sale, what it costs, and which file a
// buyer receives. The storefront, the checkout function and the download
// function all read from here, so a price can never disagree with itself the
// way the old "$209 / save $130" copy did.

export interface Toolkit {
  id: string;
  name: string;
  description: string;
  /** Price in cents. Stripe works in the smallest currency unit. */
  priceCents: number;
  /** Filename under assets/toolkits. Never served from a public directory. */
  file: string;
}

export const TOOLKIT_PRICE_CENTS = 1900;
export const BUNDLE_PRICE_CENTS = 7900;
export const BUNDLE_ID = "budget-toolkit-bundle";

export const TOOLKITS: Toolkit[] = [
  {
    id: "paycheck-breakdown-toolkit",
    name: "Paycheck Breakdown Toolkit",
    description: "See exactly where every dollar goes each paycheck. Stop wondering, start knowing.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "paycheck-breakdown-toolkit.pdf",
  },
  {
    id: "no-overdraft-system",
    name: "No-Overdraft System",
    description: "Never pay another overdraft fee. Know exactly what is safe to spend at all times.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "no-overdraft-system.pdf",
  },
  {
    id: "2-paycheck-budget-system",
    name: "2-Paycheck Budget System",
    description: "A complete system for managing your money across two paychecks per month.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "2-paycheck-budget-system.pdf",
  },
  {
    id: "bill-catch-up-plan",
    name: "Bill Catch-Up Plan",
    description: "A step-by-step plan to catch up on overdue bills and stop late fees for good.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "bill-catch-up-plan.pdf",
  },
  {
    id: "food-budget-reset-kit",
    name: "Food Budget Reset Kit",
    description: "Take control of your grocery and dining spending with this proven reset system.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "food-budget-reset-kit.pdf",
  },
  {
    id: "debt-payoff-plan",
    name: "Debt Payoff Plan",
    description: "Track and crush your debt using the proven snowball or avalanche method.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "debt-payoff-plan.pdf",
  },
  {
    id: "spending-cuts-that-dont-hurt",
    name: "Spending Cuts Habit Tracker",
    description: "Find painless ways to cut spending and build better money habits that stick.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "spending-cuts-that-dont-hurt.pdf",
  },
  {
    id: "irregular-income-budget-kit",
    name: "Irregular Income Budget Kit",
    description: "Budget confidently even when your income changes month to month.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "irregular-income-budget-kit.pdf",
  },
  {
    id: "sinking-funds-kit",
    name: "Sinking Funds Kit",
    description: "Build targeted savings buckets so unexpected expenses never derail your budget.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "sinking-funds-kit.pdf",
  },
  {
    id: "annual-bills-planner",
    name: "Annual Bills Planner",
    description: "Plan ahead for yearly expenses so they never catch you off guard.",
    priceCents: TOOLKIT_PRICE_CENTS,
    file: "annual-bills-planner.pdf",
  },
];

/** What the ten toolkits would cost bought one at a time. */
export const SEPARATE_TOTAL_CENTS = TOOLKITS.reduce((sum, t) => sum + t.priceCents, 0);
export const BUNDLE_SAVING_CENTS = SEPARATE_TOTAL_CENTS - BUNDLE_PRICE_CENTS;

export function formatUsd(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}

export function getToolkit(id: string): Toolkit | undefined {
  return TOOLKITS.find((toolkit) => toolkit.id === id);
}

/** Files a completed purchase of `id` entitles the buyer to download. */
export function filesFor(id: string): Toolkit[] {
  if (id === BUNDLE_ID) return TOOLKITS;
  const toolkit = getToolkit(id);
  return toolkit ? [toolkit] : [];
}

export function isPurchasable(id: string): boolean {
  return id === BUNDLE_ID || Boolean(getToolkit(id));
}

export function displayName(id: string): string {
  return id === BUNDLE_ID ? "Budget Toolkit Bundle" : getToolkit(id)?.name || id;
}

export function priceCentsFor(id: string): number | undefined {
  if (id === BUNDLE_ID) return BUNDLE_PRICE_CENTS;
  return getToolkit(id)?.priceCents;
}
