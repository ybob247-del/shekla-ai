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

  "how-to-open-roth-ira": {
    slug: "how-to-open-roth-ira",
    title: "How to Open a Roth IRA: A Beginner's Guide",
    subtitle: "Start building tax-free wealth for your future today.",
    keyLesson: "A Roth IRA is one of the most powerful retirement accounts available because your money grows tax-free, and you won't pay taxes on withdrawals in retirement.",
    sections: [
      {
        type: "heading",
        content: "What Is a Roth IRA?",
      },
      {
        type: "paragraph",
        content: "A Roth IRA (Individual Retirement Account) is a special type of retirement account that you fund with after-tax dollars. This means you've already paid taxes on the money you put in. The massive benefit comes later: all the growth and your future withdrawals in retirement are completely tax-free.",
      },
      {
        type: "paragraph",
        content: "Think of it like planting a seed. With a traditional account, you pay taxes on the harvest — the large sum at retirement. With a Roth IRA, you pay taxes on the seed — the small amount you invest now — and the entire harvest is yours to keep. This makes the Roth IRA especially valuable for younger people who expect to be in a higher tax bracket later in life.",
      },
      {
        type: "heading",
        content: "Why You Need a Roth IRA",
      },
      {
        type: "paragraph",
        content: "Beyond the tax-free growth, the Roth IRA has several features that make it uniquely flexible compared to other retirement accounts. Unlike a traditional 401(k) or IRA, you are never required to take money out during your lifetime, which means your investments can continue compounding for as long as you live.",
      },
      {
        type: "list",
        content: "Key advantages of a Roth IRA:",
        items: [
          "Tax-free growth: Compound interest works its magic without the drag of taxes.",
          "Tax-free withdrawals: In retirement, every dollar you take out is yours to keep.",
          "Contribution flexibility: You can withdraw your contributions (not earnings) at any time without penalty.",
          "No Required Minimum Distributions (RMDs): You are never forced to take money out at a certain age.",
          "Estate planning benefits: Roth IRAs can be passed to heirs with significant tax advantages.",
        ],
      },
      {
        type: "heading",
        content: "Am I Eligible for a Roth IRA?",
      },
      {
        type: "paragraph",
        content: "To contribute to a Roth IRA, you must have earned income — wages, salary, freelance income, or self-employment income. Investment income and Social Security do not count. There are also income limits: for 2024, the ability to contribute phases out starting at $146,000 for single filers and $230,000 for married couples filing jointly. If you earn above these thresholds, you may still be able to use a strategy called the \"backdoor Roth IRA.\"",
      },
      {
        type: "heading",
        content: "How to Open Your Roth IRA in 5 Steps",
      },
      {
        type: "subheading",
        content: "Step 1: Choose a Provider",
      },
      {
        type: "paragraph",
        content: "You need a brokerage or financial institution to hold your account. Popular choices include Vanguard, Fidelity, and Charles Schwab. All three offer no-fee Roth IRAs with excellent investment options. Look for low expense ratios on index funds, no account minimums, and a user-friendly interface.",
      },
      {
        type: "subheading",
        content: "Step 2: Complete the Application",
      },
      {
        type: "paragraph",
        content: "Go to the provider's website and complete the online application. You'll need your Social Security number, date of birth, employment information, and your bank account details to fund the account. The process typically takes 10 to 15 minutes.",
      },
      {
        type: "subheading",
        content: "Step 3: Fund the Account",
      },
      {
        type: "paragraph",
        content: "Link your bank account and transfer money. For 2024, the maximum annual contribution is $7,000 (or $8,000 if you're 50 or older). You don't have to contribute the maximum right away — even $50 or $100 a month is a great start. Set up automatic monthly contributions to make saving effortless.",
      },
      {
        type: "subheading",
        content: "Step 4: Choose Your Investments",
      },
      {
        type: "paragraph",
        content: "This is the most critical step that many beginners miss. Simply depositing money into the account isn't enough — it will just sit in cash, earning almost nothing. You must choose investments. For most beginners, a low-cost, diversified index fund (like a total stock market fund or an S&P 500 index fund) is an excellent starting point.",
      },
      {
        type: "subheading",
        content: "Step 5: Set Up Automatic Contributions",
      },
      {
        type: "paragraph",
        content: "The best strategy is to automate your contributions so you never have to think about it. Set up a recurring transfer from your checking account to your Roth IRA each month. This pays your future self first and removes the temptation to spend the money elsewhere.",
      },
      {
        type: "tip",
        content: "Start as early as possible. Thanks to compound interest, a 25-year-old who contributes $200 a month will end up with significantly more money than a 35-year-old who contributes $400 a month, even though the 35-year-old is saving twice as much.",
      },
      {
        type: "heading",
        content: "Roth IRA vs. Traditional IRA: Which Is Better?",
      },
      {
        type: "paragraph",
        content: "The main difference is the timing of the tax benefit. With a traditional IRA, you get a tax deduction now but pay taxes on withdrawals in retirement. With a Roth IRA, you get no deduction now but pay no taxes on withdrawals. Generally, if you expect to be in a higher tax bracket in retirement than you are today, a Roth IRA is the better choice. For most young people just starting their careers, the Roth IRA wins.",
      },
      {
        type: "cta",
        ctaType: "assessment",
      },
    ],
  },

  "what-is-a-mortgage": {
    slug: "what-is-a-mortgage",
    title: "What Is a Mortgage and How Does It Work?",
    subtitle: "A simple, jargon-free guide to understanding home loans.",
    keyLesson: "A mortgage is a loan used to buy a home, where the property itself serves as collateral. Understanding how mortgages work is essential before making the biggest financial decision of your life.",
    sections: [
      {
        type: "heading",
        content: "What Is a Mortgage?",
      },
      {
        type: "paragraph",
        content: "For most people, buying a home is the largest financial transaction they will ever make. Unless you have hundreds of thousands of dollars in cash, you'll need a loan to make it happen. That specific type of loan is called a mortgage.",
      },
      {
        type: "paragraph",
        content: "When you take out a mortgage, a lender — usually a bank or mortgage company — gives you the money to buy the house. You agree to pay back that money, plus interest, over a set period of time, typically 15 or 30 years. The house itself acts as collateral, meaning if you stop making payments, the lender has the legal right to take the property back through a process called foreclosure.",
      },
      {
        type: "heading",
        content: "The 4 Parts of a Mortgage Payment (PITI)",
      },
      {
        type: "paragraph",
        content: "Your monthly mortgage payment is usually made up of four components, commonly referred to by the acronym PITI. Understanding each part helps you budget accurately for homeownership.",
      },
      {
        type: "list",
        content: "PITI stands for:",
        items: [
          "Principal: The portion of your payment that reduces the actual loan balance.",
          "Interest: The cost of borrowing the money, paid to the lender.",
          "Taxes: Property taxes assessed by your local government, often collected monthly and held in escrow.",
          "Insurance: Homeowners insurance to protect the property, plus private mortgage insurance (PMI) if your down payment was less than 20%.",
        ],
      },
      {
        type: "heading",
        content: "Fixed-Rate vs. Adjustable-Rate Mortgages",
      },
      {
        type: "subheading",
        content: "Fixed-Rate Mortgage",
      },
      {
        type: "paragraph",
        content: "With a fixed-rate mortgage, the interest rate stays the same for the entire life of the loan. This means your principal and interest payment will never change, providing stability and predictability. A 30-year fixed-rate mortgage is the most popular option in the United States because it offers the lowest monthly payment, though you pay more interest over time.",
      },
      {
        type: "subheading",
        content: "Adjustable-Rate Mortgage (ARM)",
      },
      {
        type: "paragraph",
        content: "With an ARM, the interest rate is fixed for an initial period — often 5, 7, or 10 years — and then adjusts periodically based on a market index. ARMs often start with a lower rate than fixed mortgages, which can be attractive, but they carry the risk that your payment could increase significantly if interest rates rise.",
      },
      {
        type: "heading",
        content: "How Much House Can You Afford?",
      },
      {
        type: "paragraph",
        content: "A common rule of thumb is to keep your total housing costs (including PITI) below 28% of your gross monthly income. Lenders also look at your debt-to-income (DTI) ratio, which is your total monthly debt payments divided by your gross monthly income. Most lenders prefer a DTI of 43% or less.",
      },
      {
        type: "heading",
        content: "The Mortgage Application Process",
      },
      {
        type: "list",
        content: "Key steps to getting a mortgage:",
        items: [
          "Check your credit score: A higher score means a lower interest rate. Aim for 740 or above for the best rates.",
          "Save for a down payment: Most conventional loans require 3-20% down. A 20% down payment eliminates PMI.",
          "Get pre-approved: A lender reviews your finances and tells you how much they'll lend you.",
          "Shop for rates: Compare offers from at least 3 lenders to find the best rate.",
          "Close on the home: Sign the paperwork, pay closing costs (typically 2-5% of the loan amount), and get your keys.",
        ],
      },
      {
        type: "tip",
        content: "Before applying for a mortgage, spend 6-12 months improving your credit score, paying down existing debt, and saving for a down payment. Even a 0.5% reduction in your interest rate can save you tens of thousands of dollars over the life of the loan.",
      },
      {
        type: "heading",
        content: "Key Mortgage Terms to Know",
      },
      {
        type: "list",
        content: "Important vocabulary:",
        items: [
          "Amortization: The process of paying off a loan through regular payments over time.",
          "Equity: The portion of the home's value that you actually own (home value minus loan balance).",
          "Escrow: An account held by the lender to collect and pay your property taxes and insurance.",
          "Points: Upfront fees paid to lower your interest rate. One point equals 1% of the loan amount.",
          "Refinancing: Replacing your existing mortgage with a new one, often to get a lower rate.",
        ],
      },
      {
        type: "cta",
        ctaType: "assessment",
      },
    ],
  },

  "best-side-hustles": {
    slug: "best-side-hustles",
    title: "Best Side Hustles to Make Extra Money",
    subtitle: "Accelerate your financial goals with these proven income streams.",
    keyLesson: "A side hustle is not just about making extra money — it's a strategic tool to pay off debt faster, build your emergency fund, or invest for the future.",
    sections: [
      {
        type: "heading",
        content: "Why Start a Side Hustle?",
      },
      {
        type: "paragraph",
        content: "In today's economy, relying on a single source of income can be risky. A side hustle provides a financial buffer, helps you reach your money goals faster, and can even turn into a full-time business. Whether you need an extra $200 a month to cover groceries or $1,000 a month to aggressively pay down student loans, there is a side hustle out there for you.",
      },
      {
        type: "paragraph",
        content: "The key to a successful side hustle is matching it to your existing skills, schedule, and goals. Someone with a full-time job and two kids needs a very different side hustle than a recent college graduate with evenings free. Let's explore the best options across different categories.",
      },
      {
        type: "heading",
        content: "Best Online Side Hustles",
      },
      {
        type: "subheading",
        content: "1. Freelancing",
      },
      {
        type: "paragraph",
        content: "If you have marketable skills — writing, graphic design, web development, video editing, or social media management — freelancing is one of the highest-earning side hustles available. Platforms like Upwork and Fiverr connect you with clients worldwide. Experienced freelancers can earn $50 to $150+ per hour.",
      },
      {
        type: "subheading",
        content: "2. Virtual Assistant",
      },
      {
        type: "paragraph",
        content: "Many small business owners and entrepreneurs need help with administrative tasks, email management, scheduling, and customer service. As a virtual assistant (VA), you can work from home and set your own hours. Entry-level VAs typically earn $15-25 per hour, while specialized VAs can earn $40-60 per hour.",
      },
      {
        type: "subheading",
        content: "3. Online Tutoring or Teaching",
      },
      {
        type: "paragraph",
        content: "If you have expertise in a particular subject — math, science, a foreign language, or a professional skill — you can tutor students online. Platforms like Wyzant, Tutor.com, and Outschool are great starting points. You can also create and sell courses on Udemy or Teachable for passive income.",
      },
      {
        type: "subheading",
        content: "4. Selling Products Online",
      },
      {
        type: "paragraph",
        content: "Whether it's handmade crafts on Etsy, reselling thrift store finds on eBay, or dropshipping products on Amazon, e-commerce offers significant income potential. The startup costs can be low, and you can scale at your own pace.",
      },
      {
        type: "heading",
        content: "Best Offline Side Hustles",
      },
      {
        type: "subheading",
        content: "1. Rideshare and Delivery",
      },
      {
        type: "paragraph",
        content: "Driving for Uber, Lyft, DoorDash, or Instacart allows you to make money on your own schedule. This is one of the most accessible side hustles because the barrier to entry is low — you just need a reliable car and a clean driving record. Most drivers earn $15-25 per hour after expenses.",
      },
      {
        type: "subheading",
        content: "2. Pet Sitting and Dog Walking",
      },
      {
        type: "paragraph",
        content: "Apps like Rover and Wag connect pet owners with people willing to walk dogs or provide pet sitting services. Dog walkers typically earn $15-25 per walk, while overnight pet sitting can bring in $50-75 per night. It's a fun, low-stress way to earn extra cash if you love animals.",
      },
      {
        type: "subheading",
        content: "3. TaskRabbit and Handyman Services",
      },
      {
        type: "paragraph",
        content: "If you're handy or physically capable, TaskRabbit connects you with people who need help with furniture assembly, moving, home repairs, cleaning, and more. Skilled taskers can earn $40-80 per hour, and the platform handles all the scheduling and payment processing.",
      },
      {
        type: "heading",
        content: "How to Choose the Right Side Hustle",
      },
      {
        type: "list",
        content: "Ask yourself these questions before starting:",
        items: [
          "What skills do I already have that others would pay for?",
          "How many hours per week can I realistically dedicate to this?",
          "Do I need immediate income, or can I build something over time?",
          "What is my goal — pay off debt, build savings, or invest?",
          "Am I willing to learn new skills to increase my earning potential?",
        ],
      },
      {
        type: "heading",
        content: "Managing Taxes on Side Hustle Income",
      },
      {
        type: "paragraph",
        content: "This is a critical point that many new side hustlers overlook. When you earn money from a side hustle, you are considered self-employed, which means you are responsible for paying both income tax and self-employment tax (Social Security and Medicare) on those earnings. As a general rule, set aside 25-30% of every side hustle payment for taxes.",
      },
      {
        type: "tip",
        content: "Open a separate bank account specifically for your side hustle income. This makes it much easier to track earnings, set aside money for taxes, and see your progress toward your financial goals.",
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
