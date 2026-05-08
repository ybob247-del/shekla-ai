import { useState } from "react";
import { Link } from "wouter";
import { ARTICLES, CATEGORIES, type Article } from "@/lib/articles";

const FEATURED_ARTICLES = [
  "50-30-20-rule",
  "debt-snowball",
  "emergency-fund",
  "net-worth",
  "budgeting-for-beginners",
  "how-to-pay-off-debt",
  "how-to-invest",
];

const NEW_TOOLKIT_ARTICLES = [
  "paycheck-breakdown-toolkit",
  "2-paycheck-budget-system",
  "irregular-income-budget",
  "annual-bills-planner",
  "bill-catch-up-plan",
  "sinking-funds",
  "food-budget-reset",
  "spending-cuts",
  "no-overdraft-system",
  "budget-toolkit-bundle",
  "how-to-build-emergency-fund",
  "debt-snowball-vs-avalanche",
  "what-is-good-credit-score",
  "stop-living-paycheck-to-paycheck",
  "how-to-save-money-fast",
  "budgeting-for-beginners",
  "how-to-pay-off-debt",
  "personal-finance-tips",
  "zero-based-budgeting",
  "how-to-invest",
];

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = ARTICLES.filter((a) => FEATURED_ARTICLES.includes(a.slug));
  const newToolkitArticles = ARTICLES.filter((a) => NEW_TOOLKIT_ARTICLES.includes(a.slug));

  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: cat.id === "all" ? ARTICLES.length : ARTICLES.filter((a) => a.category === cat.id).length,
  }));

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            📖 Learning Center
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Your Financial Education Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {ARTICLES.length} articles across 7 pillars — from budgeting basics to financial security and account sync.
            Every article links to a tool and a Money Reset Lab toolkit.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/assessment">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                ☆ Take Your Money Reset Score
              </button>
            </Link>
            <Link href="/calculators">
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                🧮 Try the Calculators
              </button>
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categoryCounts.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                activeCategory === cat.id
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.emoji} {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Featured Articles (only when no filter/search) */}
        {activeCategory === "all" && !searchQuery && (
          <>
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Featured Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredArticles.slice(0, 4).map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>

            {/* New Toolkit Articles */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl font-bold text-gray-900">New: Stan Store Toolkit Articles</h2>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {newToolkitArticles.length} New
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {newToolkitArticles.slice(0, 8).map((article) => (
                  <ArticleCard key={article.slug} article={article} showNew />
                ))}
              </div>
            </div>
          </>
        )}

        {/* All Articles */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            {searchQuery
              ? `Search Results (${filteredArticles.length})`
              : activeCategory === "all"
              ? `All Articles (${ARTICLES.length} articles)`
              : `${categoryCounts.find((c) => c.id === activeCategory)?.emoji} ${
                  categoryCounts.find((c) => c.id === activeCategory)?.label
                } (${filteredArticles.length} articles)`}
          </h2>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No articles found</p>
              <p className="text-sm">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTAs */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white text-center">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-bold text-lg mb-2">Know Your Money Reset Score</h3>
            <p className="text-emerald-100 text-sm mb-5">
              Take the 10-question assessment and get personalized toolkit recommendations.
            </p>
            <Link href="/assessment">
              <button className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                Take the Assessment →
              </button>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center">
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="font-bold text-lg mb-2">Money Reset Lab Toolkits</h3>
            <p className="text-amber-100 text-sm mb-5">
              Every article links to a hands-on toolkit. Get the complete bundle of all 10 systems for $79.
            </p>
            <a
              href="https://stan.store/sheklaai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-amber-600 hover:bg-amber-50 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              Browse All Toolkits →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article, showNew }: { article: Article; showNew?: boolean }) {
  return (
    <Link href={`/learn/${article.slug}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2.5">
          {(showNew || article.isNew) && (
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
              New
            </span>
          )}
          <span className="text-xs font-medium text-gray-500">
            {article.categoryEmoji} {article.category.replace(/-/g, " ")}
          </span>
          <span className="text-xs text-gray-400">{article.readTime}m</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1.5 flex-1">{article.title}</h3>
        <p className="text-gray-500 text-xs">{article.description}</p>
        {article.toolkitName && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-amber-600 font-medium">🛒 {article.toolkitName}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
