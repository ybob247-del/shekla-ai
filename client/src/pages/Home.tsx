import { Link } from "wouter";
import MoneyResetScore from "@/components/MoneyResetScore";
import AssessmentCTA from "@/components/AssessmentCTA";
import { ARTICLES } from "@/lib/articles";

const FEATURED_ARTICLES = ARTICLES.slice(0, 3);

const FEATURES = [
  {
    emoji: "⭐",
    title: "Money Reset Score",
    description: "Take our free 3-minute assessment to find out exactly where your money is leaking and get a personalized action plan.",
    cta: "Get My Score",
    href: "/assessment",
    color: "emerald",
  },
  {
    emoji: "🧮",
    title: "Budget Calculators",
    description: "Free calculators for budgeting, debt payoff, savings goals, and more. No sign-up required.",
    cta: "Try Calculators",
    href: "/calculators",
    color: "blue",
  },
  {
    emoji: "📚",
    title: "Learning Center",
    description: "67 free articles across 7 financial pillars — from budgeting basics to financial security.",
    cta: "Start Learning",
    href: "/learn",
    color: "purple",
  },
  {
    emoji: "🧪",
    title: "Money Reset Lab",
    description: "Done-for-you spreadsheet toolkits to reset your finances. Instant download, start in 10 minutes.",
    cta: "Browse Toolkits",
    href: "/resources",
    color: "amber",
  },
];

const STATS = [
  { value: "67", label: "Free Articles" },
  { value: "10+", label: "Budget Calculators" },
  { value: "10", label: "Downloadable Toolkits" },
  { value: "3 min", label: "Money Reset Score" },
];

const TESTIMONIALS = [
  {
    quote: "The Money Reset Score showed me I was spending 40% of my income on wants. I had no idea. Fixed it in 2 weeks.",
    name: "Sarah M.",
    role: "Teacher, Ohio",
  },
  {
    quote: "The Paycheck Breakdown Toolkit changed everything. I finally know where every dollar goes.",
    name: "Marcus T.",
    role: "Freelancer, Texas",
  },
  {
    quote: "I paid off $8,400 in credit card debt in 11 months using the Debt Payoff Plan toolkit.",
    name: "Jennifer K.",
    role: "Nurse, Florida",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>✨</span>
            <span>Free · No Sign-Up Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            What's Your{" "}
            <span className="text-emerald-400">Money Reset Score?</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Find out in 3 minutes where your money is leaking and get a personalized plan to fix it.
            Free, no sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment">
              <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/25">
                Get My Free Score →
              </button>
            </Link>
            <Link href="/learn">
              <button className="border border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 rounded-xl transition-colors">
                Browse Free Articles
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold text-emerald-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Reset Score Widget */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Take Your Money Reset Score
            </h2>
            <p className="text-gray-600">
              Answer 6 quick questions and get personalized recommendations in seconds.
            </p>
          </div>
          <MoneyResetScore />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything You Need to Reset Your Money
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Free tools, calculators, articles, and downloadable systems — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <Link href={feature.href}>
                  <button
                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                      feature.color === "emerald"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : feature.color === "blue"
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : feature.color === "purple"
                        ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {feature.cta} →
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            <Link href="/learn" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View all 67 articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURED_ARTICLES.map((article) => (
              <Link key={article.slug} href={`/learn/${article.slug}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {article.categoryEmoji} {article.category.replace("-", " ")}
                    </span>
                    <span className="text-xs text-gray-400">{article.readTime} min</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm">{article.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Real Results</h2>
            <p className="text-gray-600">People who used Shekla to reset their finances.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Reset Your Money?</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Take the free Money Reset Score and get your personalized financial action plan in 3 minutes.
          </p>
          <Link href="/assessment">
            <button className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg">
              Get My Free Score →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
