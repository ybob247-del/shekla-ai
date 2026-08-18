// Single router: wouter only (react-router-dom removed to fix dual-router conflict)
import { Switch, Route, Link, useLocation } from "wouter";
import { useState } from "react";
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import Assessment from "@/pages/Assessment";
import Learn from "@/pages/Learn";
import ArticlePage from "@/pages/ArticlePage";
import Calculators from "@/pages/Calculators";
import Resources from "@/pages/Resources";
import Insights from "@/pages/Insights";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
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
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
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

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="font-bold text-white">Shekla AI</span>
            </div>
            <p className="text-sm leading-relaxed">
              Free financial education, tools, and done-for-you systems to help you reset your money.
            </p>
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
              <li><Link href="/learn/debt-snowball" className="hover:text-white transition-colors">Debt Snowball</Link></li>
              <li><Link href="/learn/emergency-fund" className="hover:text-white transition-colors">Emergency Fund</Link></li>
            </ul>
          </div>

          {/* Toolkits */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Toolkits</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources" className="hover:text-white transition-colors">All Toolkits</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li>
                <a
                  href="https://stan.store/sheklaai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Stan Store →
                </a>
              </li>
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
          <Route path="/learn" component={Learn} />
          <Route path="/learn/:slug" component={ArticlePage} />
          <Route path="/insights" component={Insights} />
          <Route path="/resources" component={Resources} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
