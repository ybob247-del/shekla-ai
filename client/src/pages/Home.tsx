import { Link } from "wouter";
import { motion } from "framer-motion";
import MoneyResetScore from "@/components/MoneyResetScore";
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
    quote: "I finally understand where my money goes every month. The budget calculator alone saved me $400 in the first month.",
    name: "Sarah M.",
    role: "Teacher, Atlanta GA",
    avatar: "SM",
  },
  {
    quote: "The Money Reset Score was eye-opening. I scored a 42 and now I know exactly what to fix first.",
    name: "James T.",
    role: "Freelancer, Chicago IL",
    avatar: "JT",
  },
  {
    quote: "The debt payoff toolkit is incredible. I paid off $8,000 in credit card debt in 14 months following the plan.",
    name: "Maria L.",
    role: "Nurse, Houston TX",
    avatar: "ML",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                🚀 Free Financial Reset Tools — No Sign-Up Required
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight"
            >
              Reset Your Money.
              <br />
              <span className="text-emerald-400">Take Back Control.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              Free tools, calculators, and done-for-you systems to help you budget better,
              pay off debt, and build real financial security.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/assessment">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-emerald-500/25">
                  Get My Free Money Reset Score →
                </button>
              </Link>
              <Link href="/calculators">
                <button className="border border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-lg transition-colors">
                  Try Free Calculators
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-emerald-500 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-emerald-100 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Reset Score Widget */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              What's Your Money Reset Score?
            </h2>
            <p className="text-gray-600 text-lg">
              Answer 6 quick questions. Get your score (0–100) and a personalized action plan.
            </p>
          </div>
          <MoneyResetScore />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Everything You Need to Reset Your Finances
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Free tools and education — no subscriptions, no bank account syncing, no fluff.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-5 flex-1">{feature.description}</p>
                <Link href={feature.href}>
                  <button
                    className={`w-full text-sm font-semibold py-2.5 rounded-lg transition-colors ${
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Latest from the Learning Center</h2>
              <p className="text-gray-500 mt-1">Free financial education, no fluff.</p>
            </div>
            <Link href="/learn">
              <button className="text-emerald-600 font-semibold text-sm hover:underline hidden sm:block">
                View all 67 articles →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {FEATURED_ARTICLES.map((article) => (
              <Link key={article.slug} href={`/learn/${article.slug}`}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug">{article.title}</h3>
                  <p className="text-gray-500 text-xs">{article.readTime} read</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link href="/learn">
              <button className="text-emerald-600 font-semibold text-sm hover:underline">
                View all 67 articles →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Real Results</h2>
            <p className="text-gray-600">From people who used Shekla AI to reset their finances.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-6">
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-emerald-500">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Reset Your Money?</h2>
          <p className="text-emerald-100 text-lg mb-8">
            Take the free Money Reset Score — 3 minutes, no sign-up, instant results.
          </p>
          <Link href="/assessment">
            <button className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg">
              Get My Free Score →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
