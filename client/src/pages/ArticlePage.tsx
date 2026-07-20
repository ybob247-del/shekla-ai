import { Link, useParams } from "wouter";
import { getArticleBySlug, ARTICLES, type Article } from "@/lib/articles";
import { getArticleContent, type ArticleSection } from "@/lib/articleContent";
import ArticleCTA from "@/components/ArticleCTA";
import AssessmentCTA from "@/components/AssessmentCTA";
import StanStoreCTA from "@/components/StanStoreCTA";

function ArticleNotFound() {
  return (
    <div className="py-16 px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
      <p className="text-gray-600 mb-8">This article doesn't exist or may have been moved.</p>
      <Link href="/learn">
        <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
          Browse All Articles
        </button>
      </Link>
    </div>
  );
}

function RelatedArticles({ currentSlug, category }: { currentSlug: string; category: string }) {
  const related = ARTICLES.filter(
    (a) => a.category === category && a.slug !== currentSlug
  ).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Related Articles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((article) => (
          <Link key={article.slug} href={`/learn/${article.slug}`}>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">
                  {article.categoryEmoji} {article.readTime}m
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{article.title}</h4>
              <p className="text-gray-500 text-xs mt-1">{article.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Generic article content generator based on article data
function generateArticleContent(article: Article): React.ReactNode {
  return (
    <div className="prose prose-gray max-w-none">
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-xl mb-8">
        <p className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-1">KEY LESSON</p>
        <p className="text-emerald-900 font-medium">{article.description}</p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        What Is {article.title}?
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Understanding {article.title.toLowerCase()} is one of the most important steps you can take toward financial health.
        Whether you're just starting out or looking to optimize your existing approach, this guide will give you
        the practical knowledge and tools you need to take action.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        {article.description} This concept is fundamental to building a solid financial foundation
        and is something that anyone — regardless of income level — can implement starting today.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why It Matters</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Most people struggle with their finances not because they don't earn enough, but because they
        lack a clear system. {article.title} provides exactly that — a clear, actionable framework
        that removes the guesswork and helps you make better financial decisions consistently.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Get Started</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        The best time to start is right now. Here's a simple framework to begin:
      </p>
      <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
        <li className="leading-relaxed">
          <strong>Assess your current situation</strong> — Take the Money Reset Score to understand where you stand today.
        </li>
        <li className="leading-relaxed">
          <strong>Set a clear goal</strong> — Define what success looks like for you in the next 30, 60, and 90 days.
        </li>
        <li className="leading-relaxed">
          <strong>Use the right tools</strong> — Our calculators and toolkits make implementation fast and straightforward.
        </li>
        <li className="leading-relaxed">
          <strong>Track your progress</strong> — Review your numbers weekly to stay on track and make adjustments.
        </li>
      </ol>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Mistakes to Avoid</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>Trying to change everything at once — start with one area</li>
        <li>Not tracking your progress — what gets measured gets managed</li>
        <li>Giving up after one setback — consistency over perfection</li>
        <li>Skipping the planning phase — a few minutes of planning saves hours of stress</li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Next Steps</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Now that you understand the fundamentals, it's time to take action. Use the tools below
        to put this knowledge into practice and start seeing real results in your financial life.
      </p>
    </div>
  );
}

function renderArticleSection(section: ArticleSection, index: number, article: Article): React.ReactNode {
  const key = `${section.type}-${index}`;

  switch (section.type) {
    case "heading":
      return <h2 key={key} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{section.content}</h2>;
    case "subheading":
      return <h3 key={key} className="text-xl font-bold text-gray-900 mt-6 mb-3">{section.content}</h3>;
    case "paragraph":
      return <p key={key} className="text-gray-700 leading-relaxed mb-4">{section.content}</p>;
    case "keyLesson":
      return (
        <aside key={key} className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-xl my-6">
          <p className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-1">Key lesson</p>
          <p className="text-emerald-900 font-medium">{section.content}</p>
        </aside>
      );
    case "tip":
      return (
        <aside key={key} className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
          <p className="text-sm font-bold text-amber-800 uppercase tracking-wide mb-1">Practical tip</p>
          <p className="text-amber-900 leading-relaxed">{section.content}</p>
        </aside>
      );
    case "example":
      return (
        <aside key={key} className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-6">
          <p className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-1">Example</p>
          <p className="text-blue-950 leading-relaxed">{section.content}</p>
        </aside>
      );
    case "list":
      return (
        <div key={key} className="mb-6">
          {section.content && <p className="font-semibold text-gray-900 mb-2">{section.content}</p>}
          <ul className="list-disc list-outside pl-6 space-y-2 text-gray-700">
            {(section.items ?? []).map((item) => <li key={item} className="leading-relaxed">{item}</li>)}
          </ul>
        </div>
      );
    case "cta":
      return (
        <ArticleCTA
          key={key}
          type={section.ctaType ?? "assessment"}
          toolkitName={article.toolkitName}
          toolkitLink={article.toolkitLink}
          className="my-8"
        />
      );
    default:
      return null;
  }
}

function renderArticleContent(article: Article): React.ReactNode {
  const articleContent = getArticleContent(article.slug);

  if (!articleContent) {
    return generateArticleContent(article);
  }

  return (
    <div className="prose prose-gray max-w-none">
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-xl mb-8">
        <p className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-1">Key lesson</p>
        <p className="text-emerald-900 font-medium">{articleContent.keyLesson}</p>
      </div>
      {articleContent.sections.map((section, index) => renderArticleSection(section, index, article))}
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return <ArticleNotFound />;
  }

  const categoryLabel = article.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div>
      {/* Assessment Banner */}
      <AssessmentCTA variant="banner" />

      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/learn" className="hover:text-emerald-600 transition-colors">
              📖 Learning Center
            </Link>
            <span>›</span>
            <span className="text-gray-700">
              {article.categoryEmoji} {categoryLabel}
            </span>
            <span>›</span>
            <span className="text-gray-900 font-medium truncate">{article.title}</span>
          </nav>

          {/* Back button */}
          <Link href="/learn">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors mb-6 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-emerald-300">
              ← Back to Learning Center
            </button>
          </Link>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {article.categoryEmoji} {categoryLabel}
              </span>
              <span className="text-gray-400 text-sm">🕐 {article.readTime} min read</span>
              {article.isNew && (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-gray-600">{article.description}</p>
          </div>

          {/* Article Content */}
          {renderArticleContent(article)}

          {/* Fallback CTA for legacy metadata-only articles */}
          {!getArticleContent(article.slug) && <AssessmentCTA variant="inline" className="my-8" />}

          {/* Toolkit CTA if applicable */}
          {!getArticleContent(article.slug) && article.toolkitName && article.toolkitLink && (
            <StanStoreCTA
              variant="inline"
              toolkitName={article.toolkitName}
              toolkitLink={article.toolkitLink}
              className="my-8"
            />
          )}

          {/* Related Articles */}
          <RelatedArticles currentSlug={article.slug} category={article.category} />

          {/* Bottom CTAs */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <p className="font-semibold text-emerald-900 mb-2">⭐ Know Your Money Reset Score</p>
              <p className="text-emerald-700 text-sm mb-4">
                Get personalized recommendations based on your situation.
              </p>
              <Link href="/assessment">
                <button className="bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                  Take the Assessment →
                </button>
              </Link>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              <p className="font-semibold text-amber-900 mb-2">🛒 Money Reset Lab Toolkits</p>
              <p className="text-amber-700 text-sm mb-4">
                Done-for-you spreadsheet systems. Instant download.
              </p>
              <a
                href="https://stan.store/sheklaai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-amber-500 text-white hover:bg-amber-600 text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                Browse All Toolkits →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
