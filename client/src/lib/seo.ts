import { ARTICLES } from "@/lib/articles";

export const SITE_ORIGIN = "https://www.shekla.ai";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export type SeoMetadata = {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

const HOME_METADATA: SeoMetadata = {
  title: "Shekla AI — Free Personal Finance Tools, Budget Calculators & AI Money Coach",
  description:
    "Take your free Money Reset Score in 3 minutes. Find out exactly where your money is leaking and get a personalized plan to fix it — no sign-up required.",
  keywords:
    "money reset score, personal finance app, budget calculator, debt payoff calculator, AI financial coach, budgeting tools, free budgeting app",
  canonical: "/",
};

const CORE_METADATA: Record<string, SeoMetadata> = {
  "/": HOME_METADATA,
  "/assessment": {
    title: "Money Reset Score Assessment | Shekla AI",
    description:
      "Take the free Money Reset Score assessment to identify money leaks and receive practical next steps for your budget, debt, and savings.",
    keywords:
      "financial health assessment, money reset score, budgeting assessment, debt assessment, savings assessment",
    canonical: "/assessment",
  },
  "/calculators": {
    title: "Free Budget & Debt Calculators | Shekla AI",
    description:
      "Use free personal-finance calculators to plan your budget, pay down debt, and make clearer money decisions.",
    keywords:
      "budget calculator, debt payoff calculator, paycheck calculator, emergency fund calculator, personal finance tools",
    canonical: "/calculators",
  },
  "/learn": {
    title: "Personal Finance Guides & Budgeting Articles | Shekla AI",
    description:
      "Read practical personal-finance guides about budgeting, debt payoff, saving, credit, and building healthier money habits.",
    keywords:
      "personal finance guides, budgeting articles, debt payoff guide, savings tips, financial education",
    canonical: "/learn",
  },
  "/insights": {
    title: "Financial Insights & Money Tools | Shekla AI",
    description:
      "Explore practical financial insights and free tools designed to help you understand and improve your money habits.",
    keywords:
      "financial insights, money habits, personal finance tools, budgeting insights",
    canonical: "/insights",
  },
  "/resources": {
    title: "Personal Finance Toolkits & Resources | Shekla AI",
    description:
      "Explore practical personal-finance toolkits and resources for budgeting, saving, debt payoff, and money organization.",
    keywords:
      "budget toolkit, debt payoff tracker, savings toolkit, personal finance resources",
    canonical: "/resources",
  },
  "/pricing": {
    title: "Shekla AI Pricing | Free Personal Finance Tools",
    description:
      "Explore Shekla AI’s free personal-finance tools, calculators, learning resources, and available premium options.",
    keywords:
      "personal finance app pricing, free budgeting app, personal finance tools, Shekla AI pricing",
    canonical: "/pricing",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Shekla AI",
    description:
      "Read the Shekla AI Privacy Policy and learn how we collect, use, and protect information.",
    keywords: "Shekla AI privacy policy, data privacy, personal finance app privacy",
    canonical: "/privacy-policy",
  },
  "/terms-of-service": {
    title: "Terms of Service | Shekla AI",
    description:
      "Read the terms and conditions governing use of Shekla AI’s educational personal-finance tools and resources.",
    keywords: "Shekla AI terms of service, personal finance education terms",
    canonical: "/terms-of-service",
  },
};

export const PUBLIC_PATHS = [
  ...Object.keys(CORE_METADATA),
  ...ARTICLES.map((article) => `/learn/${article.slug}`),
];

export function normalisePath(pathname: string): string {
  const withoutQueryOrHash = pathname.split(/[?#]/, 1)[0] || "/";
  if (withoutQueryOrHash === "/") return "/";
  return withoutQueryOrHash.replace(/\/+$/, "") || "/";
}

export function toAbsoluteUrl(pathname: string): string {
  const normalised = normalisePath(pathname);
  return normalised === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalised}`;
}

export function getSeoMetadata(pathname: string): SeoMetadata {
  const normalised = normalisePath(pathname);
  const coreMetadata = CORE_METADATA[normalised];
  if (coreMetadata) return coreMetadata;

  const articlePrefix = "/learn/";
  if (normalised.startsWith(articlePrefix)) {
    const slug = normalised.slice(articlePrefix.length);
    const article = ARTICLES.find((entry) => entry.slug === slug);
    if (article) {
      return {
        title: article.seoTitle || `${article.title} | Shekla AI`,
        description: article.seoDescription || article.description,
        keywords: article.seoKeyword || `${article.title}, personal finance, ${article.category}, money management`,
        canonical: normalised,
        ogType: "article",
      };
    }
  }

  return {
    title: "Page Not Found | Shekla AI",
    description: "The page you requested could not be found.",
    keywords: "",
    noIndex: true,
  };
}
