// Single router: wouter only (react-router-dom removed to fix dual-router conflict)
import { Switch, Route, Link, useLocation } from "wouter";
import { useState } from "react";
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import Assessment from "@/pages/Assessment";
import Learn from "@/pages/Learn";
import ArticlePage from "@/pages/ArticlePage";
import Calculators from "@/pages/Calculators";
import DebtPayoff from "@/pages/DebtPayoff";
import Resources from "@/pages/Resources";
import Insights from "@/pages/Insights";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Success from "@/pages/Success";
import Patterns from "@/pages/Patterns";
import SeoHead from "@/components/SeoHead";

function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/assessment", label: "Money Reset Score" },
    { href: "/calculators", label: "Calculators" },
    { href: "/learn", label: "Learn" },
    { href: "/insights", label: "Insights" },
    { href: "/resources", label: "Toolkits" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="/logo-mark.png"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-bold text-gray-900 text-lg">Shekla AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    location === link.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/assessment">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Get Free Score →
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      location === link.href
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link href="/assessment">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 w-full bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
                >
                  Get Free Score →
                </button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// Every account that is actually being posted to. Leaving these out of the
// footer made every visitor who would have followed into a dead end.
const SOCIALS = [
  {
    name: "Pinterest",
    href: "https://www.pinterest.com/SheklaAI/",
    path: "M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.19-2.38.04-3.4.21-.92 1.37-5.85 1.37-5.85s-.35-.7-.35-1.73c0-1.62.94-2.83 2.11-2.83 1 0 1.48.75 1.48 1.64 0 1-.64 2.5-.97 3.89-.27 1.16.58 2.1 1.73 2.1 2.08 0 3.67-2.19 3.67-5.35 0-2.8-2-4.75-4.88-4.75-3.32 0-5.27 2.49-5.27 5.07 0 1 .39 2.08.87 2.66.1.12.11.22.08.34l-.33 1.33c-.05.21-.17.26-.39.16-1.46-.68-2.37-2.81-2.37-4.52 0-3.68 2.67-7.06 7.71-7.06 4.05 0 7.19 2.88 7.19 6.74 0 4.02-2.53 7.25-6.05 7.25-1.18 0-2.29-.61-2.67-1.34l-.73 2.78c-.26 1.01-.97 2.280-1.45 3.05A12 12 0 1 0 12 0Z",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/shekla.ai/",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.9 5.9 0 0 0 1.38 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@shekla.ai",
    path: "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06v-3.1a5.66 5.66 0 0 0-.77-.05A5.68 5.68 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38v-3.1a4.28 4.28 0 0 1-3.24-1.47Z",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590632499322",
    path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07Z",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@SheklaAI",
    path: "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z",
  },
];

function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Shekla AI on ${s.name}`}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/logo-mark.png"
                alt=""
                width={28}
                height={28}
                className="w-7 h-7 rounded-full"
              />
              <span className="font-bold text-white">Shekla AI</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Free financial education, tools, and done-for-you systems to help you reset your money.
            </p>
            <SocialLinks />
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Free Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/assessment" className="hover:text-white transition-colors">Money Reset Score</Link></li>
              <li><Link href="/calculators" className="hover:text-white transition-colors">Budget Calculators</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Financial Insights</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/learn" className="hover:text-white transition-colors">All Articles</Link></li>
              <li><Link href="/learn/50-30-20-rule" className="hover:text-white transition-colors">50/30/20 Rule</Link></li>
              <li><Link href="/learn/debt-snowball-vs-avalanche" className="hover:text-white transition-colors">Snowball vs. Avalanche</Link></li>
              <li><Link href="/learn/how-to-build-emergency-fund" className="hover:text-white transition-colors">Emergency Fund</Link></li>
            </ul>
          </div>

          {/* Toolkits */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Toolkits</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources" className="hover:text-white transition-colors">All Toolkits</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/learn" className="hover:text-white transition-colors">Toolkit Guides</Link></li>
              <li><Link href="/patterns" className="hover:text-white transition-colors">Money Pattern Checklist</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} Shekla AI. For educational purposes only. Not financial advice.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NotFound() {
  return (
    <div className="py-20 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 — Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <Link href="/">
        <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">
          Go Home
        </button>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SeoHead />
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/assessment" component={Assessment} />
          <Route path="/calculators" component={Calculators} />
          <Route path="/debt-payoff" component={DebtPayoff} />
          <Route path="/learn" component={Learn} />
          <Route path="/learn/:slug" component={ArticlePage} />
          <Route path="/insights" component={Insights} />
          <Route path="/resources" component={Resources} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/success" component={Success} />
          <Route path="/patterns" component={Patterns} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
