import { Link } from "wouter";

const INSIGHTS_SECTIONS = [
  {
    id: "spending-breakdown",
    title: "Average American Spending Breakdown",
    description: "How the average household allocates their income across major categories.",
    data: [
      { category: "Housing", percentage: 33, color: "blue", amount: "$1,784/mo" },
      { category: "Transportation", percentage: 16, color: "purple", amount: "$866/mo" },
      { category: "Food", percentage: 13, color: "emerald", amount: "$703/mo" },
      { category: "Healthcare", percentage: 8, color: "red", amount: "$433/mo" },
      { category: "Entertainment", percentage: 5, color: "yellow", amount: "$270/mo" },
      { category: "Clothing", percentage: 3, color: "pink", amount: "$162/mo" },
      { category: "Other", percentage: 22, color: "gray", amount: "$1,189/mo" },
    ],
    source: "Bureau of Labor Statistics, Consumer Expenditure Survey 2023",
  },
  {
    id: "savings-stats",
    title: "American Savings Statistics",
    description: "Key data points about how Americans save — and struggle to save.",
    stats: [
      { value: "57%", label: "of Americans can't cover a $1,000 emergency", color: "red" },
      { value: "$65K", label: "median retirement savings for Americans 55-64", color: "orange" },
      { value: "22%", label: "of Americans have no emergency savings at all", color: "red" },
      { value: "$8,863", label: "average American credit card debt", color: "orange" },
      { value: "3.5%", label: "average personal savings rate (2024)", color: "blue" },
      { value: "54%", label: "of Americans live paycheck to paycheck", color: "red" },
    ],
    source: "Federal Reserve, Bankrate, CNBC 2024",
  },
  {
    id: "debt-stats",
    title: "American Debt Landscape",
    description: "The current state of consumer debt in America.",
    stats: [
      { value: "$17.5T", label: "Total household debt in the US", color: "gray" },
      { value: "$1.77T", label: "Total student loan debt", color: "purple" },
      { value: "$1.61T", label: "Total auto loan debt", color: "blue" },
      { value: "$1.13T", label: "Total credit card debt", color: "red" },
      { value: "20.68%", label: "Average credit card interest rate (2024)", color: "orange" },
      { value: "3.7%", label: "Average 30-year mortgage rate (2024)", color: "emerald" },
    ],
    source: "Federal Reserve Bank of New York, 2024",
  },
];

const FINANCIAL_TIPS = [
  {
    emoji: "💡",
    title: "The 1% Rule",
    tip: "Increase your savings rate by just 1% each month. In 12 months, you'll be saving 12% more without feeling the pinch.",
  },
  {
    emoji: "⚡",
    title: "Pay Yourself First",
    tip: "Automate your savings transfer on payday — before you have a chance to spend it. Even $50/month builds a $600 emergency fund in a year.",
  },
  {
    emoji: "🎯",
    title: "The 24-Hour Rule",
    tip: "For any non-essential purchase over $50, wait 24 hours. Most impulse purchases feel unnecessary the next day.",
  },
  {
    emoji: "📊",
    title: "Track Net Worth Monthly",
    tip: "Your net worth is your true financial health score. Track it monthly — even a small increase is motivation to keep going.",
  },
  {
    emoji: "🔄",
    title: "Automate Everything",
    tip: "Automate savings, bill payments, and debt payments. Willpower is limited — systems are reliable.",
  },
  {
    emoji: "💳",
    title: "The Debt Avalanche Math",
    tip: "Paying off a $5,000 credit card at 20% APR saves you $1,000+ in interest vs. paying minimums for 5 years.",
  },
];

export default function Insights() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            📊 Financial Insights
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Financial Data & Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Key statistics, spending benchmarks, and actionable insights to help you understand
            where you stand financially.
          </p>
        </div>

        {/* Insights Sections */}
        {INSIGHTS_SECTIONS.map((section) => (
          <div key={section.id} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
            <p className="text-gray-600 mb-6">{section.description}</p>

            {section.data && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="space-y-4">
                  {section.data.map((item) => (
                    <div key={item.category} className="flex items-center gap-4">
                      <div className="w-28 text-sm font-medium text-gray-700 shrink-0">
                        {item.category}
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-${item.color}-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm font-semibold text-gray-900 text-right shrink-0">
                        {item.percentage}%
                      </div>
                      <div className="w-24 text-xs text-gray-500 text-right shrink-0 hidden sm:block">
                        {item.amount}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">Source: {section.source}</p>
              </div>
            )}

            {section.stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {section.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`bg-white border rounded-xl p-5 ${
                      stat.color === "red"
                        ? "border-red-200"
                        : stat.color === "orange"
                        ? "border-orange-200"
                        : stat.color === "emerald"
                        ? "border-emerald-200"
                        : stat.color === "blue"
                        ? "border-blue-200"
                        : stat.color === "purple"
                        ? "border-purple-200"
                        : "border-gray-200"
                    }`}
                  >
                    <p
                      className={`text-2xl font-extrabold mb-1 ${
                        stat.color === "red"
                          ? "text-red-600"
                          : stat.color === "orange"
                          ? "text-orange-600"
                          : stat.color === "emerald"
                          ? "text-emerald-600"
                          : stat.color === "blue"
                          ? "text-blue-600"
                          : stat.color === "purple"
                          ? "text-purple-600"
                          : "text-gray-700"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {section.source && section.stats && (
              <p className="text-xs text-gray-400 mt-3">Source: {section.source}</p>
            )}
          </div>
        ))}

        {/* Financial Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Financial Wins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FINANCIAL_TIPS.map((tip) => (
              <div key={tip.title} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-2xl mb-2">{tip.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            How Does Your Financial Health Compare?
          </h3>
          <p className="text-gray-600 mb-5">
            Take the Money Reset Score to see how you stack up and get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                Get My Free Score →
              </button>
            </Link>
            <Link href="/calculators">
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-3 rounded-xl transition-colors">
                Try the Calculators
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
