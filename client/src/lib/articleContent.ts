export interface ArticleSection {
  type: "heading" | "subheading" | "paragraph" | "keyLesson" | "tip" | "list" | "example" | "cta";
  content?: string;
  items?: string[];
  ctaType?: "assessment" | "toolkit" | "calculator";
}

export interface ArticleContent {
  slug: string;
  title: string;
  subtitle: string;
  keyLesson: string;
  sections: ArticleSection[];
}

export const ARTICLE_CONTENT: Record<string, ArticleContent> = {
  "50-30-20-rule": {
    slug: "50-30-20-rule",
    title: "The 50/30/20 Budget Rule: The Simplest Framework for Managing Your Money",
    subtitle: "Learn how to allocate 50% needs, 30% wants, 20% savings",
    keyLesson: "50% of your take-home pay goes to needs, 30% to wants, and 20% to savings and debt repayment. The power is in the simplicity — you only need to track three numbers.",
    sections: [
      {
        type: "heading",
        content: "What Is the 50/30/20 Rule?",
      },
      {
        type: "paragraph",
        content: "Managing your money can feel overwhelming, especially when you're just starting out or if past attempts at budgeting haven't quite stuck. But what if there was a simple, straightforward guideline that could help you take control of your finances without feeling restrictive? That's exactly what the 50/30/20 budget rule offers.",
      },
      {
        type: "paragraph",
        content: "It's a popular and easy-to-understand budgeting method designed to help you allocate your after-tax income into three main categories: 50% for Needs, 30% for Wants, and 20% for Savings & Debt Repayment. This rule, popularized by Senator Elizabeth Warren in her book All Your Worth: The Ultimate Lifetime Money Plan, provides a flexible framework that can be adapted to almost any income level and financial situation.",
      },
      {
        type: "heading",
        content: "Breaking Down the Three Categories",
      },
      {
        type: "subheading",
        content: "Needs (50%)",
      },
      {
        type: "paragraph",
        content: "Your \"Needs\" are the non-negotiable expenses that are absolutely essential for living and working. These are the things you can't realistically live without. This category should ideally consume no more than 50% of your after-tax income.",
      },
      {
        type: "list",
        content: "Examples of Needs:",
        items: [
          "Housing: Rent or mortgage payments, property taxes, homeowner's insurance",
          "Utilities: Electricity, gas, water, basic internet",
          "Food: Groceries for home-cooked meals",
          "Transportation: Car payments, car insurance, gas, public transit",
          "Healthcare: Health insurance premiums, necessary medical expenses",
          "Minimum loan payments: Credit cards, student loans",
        ],
      },
      {
        type: "subheading",
        content: "Wants (30%)",
      },
      {
        type: "paragraph",
        content: "\"Wants\" are all the things that improve your quality of life but aren't strictly necessary for survival. These are discretionary expenses that you could cut back on if you needed to.",
      },
      {
        type: "list",
        content: "Examples of Wants:",
        items: [
          "Entertainment: Streaming services, movies, concerts, video games",
          "Dining out: Restaurants, coffee shops, takeout",
          "Hobbies: Gym memberships, craft supplies, sports equipment",
          "Vacations: Travel, weekend getaways",
          "Shopping: New clothes (beyond basic necessities), gadgets, home decor",
        ],
      },
      {
        type: "subheading",
        content: "Savings & Debt Repayment (20%)",
      },
      {
        type: "paragraph",
        content: "This crucial category is dedicated to building your financial future and reducing your debt. Aim to allocate at least 20% of your after-tax income here.",
      },
      {
        type: "list",
        content: "Examples of Savings & Debt Repayment:",
        items: [
          "Emergency fund: Building up 3-6 months of living expenses",
          "Retirement contributions: 401(k), IRA, Roth IRA",
          "Investments: Brokerage accounts, mutual funds",
          "Extra debt payments: Credit cards, student loans, car loans",
          "Down payments: Saving for a house, car, or other large purchase",
        ],
      },
      {
        type: "heading",
        content: "How to Calculate Your 50/30/20 Budget",
      },
      {
        type: "list",
        content: "Step-by-step guide:",
        items: [
          "Calculate your after-tax income: This is your net pay — the amount you actually receive after taxes",
          "Determine your \"Needs\" budget (50%): Multiply your after-tax income by 0.50",
          "Determine your \"Wants\" budget (30%): Multiply your after-tax income by 0.30",
          "Determine your \"Savings & Debt Repayment\" budget (20%): Multiply by 0.20",
        ],
      },
      {
        type: "cta",
        ctaType: "calculator",
      },
      {
        type: "heading",
        content: "Real-World Example",
      },
      {
        type: "example",
        content: "Sarah brings home $4,000 per month after taxes:\n\n**Needs (50%): $2,000**\n- Rent: $1,200\n- Utilities: $200\n- Groceries: $400\n- Transportation: $200\n\n**Wants (30%): $1,200**\n- Dining out: $300\n- Streaming services: $50\n- Shopping: $400\n- Gym membership: $50\n- Entertainment: $400\n\n**Savings & Debt Repayment (20%): $800**\n- Emergency fund: $300\n- Student loan extra payment: $200\n- Investment account: $300",
      },
      {
        type: "heading",
        content: "Adjusting the Rule for Your Situation",
      },
      {
        type: "paragraph",
        content: "The 50/30/20 budget rule is a guideline, not a rigid law. Life happens, and your financial situation will change. If your rent eats up more than 50% of your income, you might need to temporarily adjust. Perhaps your \"Wants\" become 20% and \"Needs\" become 60%, with \"Savings\" remaining at 20%.",
      },
      {
        type: "heading",
        content: "Common Mistakes",
      },
      {
        type: "list",
        content: "Avoid these pitfalls:",
        items: [
          "Confusing Needs and Wants: Be honest with yourself about what's truly essential",
          "Ignoring After-Tax Income: Always base your percentages on your net income, not gross",
          "Not Tracking At All: You still need to review your spending regularly",
          "Giving Up Too Soon: Budgeting is a journey — adjust and keep going",
        ],
      },
      {
        type: "cta",
        ctaType: "assessment",
      },
    ],
  },
};

export function getArticleContent(slug: string): ArticleContent | undefined {
  return ARTICLE_CONTENT[slug];
}
