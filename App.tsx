import React, { useState } from 'react';
import { T, useText } from './content/ContentProvider';
import { TopNav } from './components/TopNav';
import { ReadingProgress } from './components/ReadingProgress';
import { InfographicSpotlight } from './components/InfographicSpotlight';
import { SearchSimulator } from './components/SearchSimulator';
import { RoiCalculator } from './components/RoiCalculator';
import { ReadinessChecklist } from './components/ReadinessChecklist';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { AuditModal } from './components/AuditModal';
import { Footer } from './components/Footer';
import {
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Building,
  Target,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

export default function App() {
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [selectedSearchQuery, setSelectedSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [copiedQuote, setCopiedQuote] = useState(false);
  const copyQuoteText = useText('hero.copyQuote');

  const getArticleTextClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'huge':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-relaxed';
    }
  };

  const handleCopyQuote = () => {
    const quoteText = copyQuoteText;
    navigator.clipboard.writeText(quoteText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Nav (Honoring 3-Zone Contract) */}
      <TopNav onOpenAudit={() => setIsAuditOpen(true)} />

      {/* Reading Progress Indicator & Floating Utilities */}
      <ReadingProgress fontSize={fontSize} setFontSize={setFontSize} />

      <main className="flex-1 w-full" id="top">
        {/* Article Container */}
        <article className="mx-auto max-w-4xl px-5 sm:px-8 py-12 lg:py-16">
          {/* Article Header & Editorial Metadata */}
          <header className="mb-12 border-b border-neutral-800/80 pb-10">
            {/* Metadata (Clean unboxed text separated by dots - anti-slop zero-pill rule) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-400 mb-4">
              <span className="text-blue-400 font-semibold"><T k="hero.meta1" /></span>
              <span aria-hidden="true">·</span>
              <span><T k="hero.meta2" /></span>
              <span aria-hidden="true">·</span>
              <span><T k="hero.meta3" /></span>
              <span aria-hidden="true">·</span>
              <span><T k="hero.meta4" /></span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6"
              style={{ textWrap: 'balance' }}
            >
              <T k="hero.title" />
            </h1>

            {/* Subhead / Lead Paragraph */}
            <p className="text-lg md:text-xl text-neutral-300 font-normal leading-relaxed mb-8">
              <T k="hero.lead" />
            </p>

            {/* Author Byline */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-neutral-900">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                  <T k="hero.authorInitials" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white"><T k="hero.authorName" /></div>
                  <div className="text-xs text-neutral-400">
                    <T k="hero.authorRole" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyQuote}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                title="Скопировать главную мысль"
              >
                {copiedQuote ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium"><T k="hero.copyDone" /></span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span><T k="hero.copyBtn" /></span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Section 1: The Core Paradox */}
          <section id="why-google" className="space-y-6 scroll-mt-24 mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <T k="s1.title" />
            </h2>

            <p className={`${getArticleTextClass()} text-neutral-300`}>
              <T k="s1.p1" />
            </p>

            <p className={`${getArticleTextClass()} text-neutral-300`}>
              <T k="s1.p2" />
            </p>

            {/* Visual Contrast Callout */}
            <div className="my-8 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 md:p-8 space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                <T k="s1.compareTitle" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cold World */}
                <div className="space-y-3 p-4 rounded-lg bg-neutral-950/80 border border-neutral-800">
                  <div className="flex items-center gap-2 text-neutral-400 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                    <span><T k="s1.coldTitle" /></span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <T k="s1.coldText" />
                  </p>
                  <div className="text-xs font-semibold text-neutral-400 pt-2 border-t border-neutral-900">
                    <T k="s1.coldResult" />
                  </div>
                </div>

                {/* Hot World */}
                <div className="space-y-3 p-4 rounded-lg bg-blue-950/20 border border-blue-900/50">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span><T k="s1.hotTitle" /></span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <T k="s1.hotText" />
                  </p>
                  <div className="text-xs font-semibold text-emerald-400 pt-2 border-t border-blue-900/40">
                    <T k="s1.hotResult" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-neutral-950 p-4 border border-neutral-800 text-xs sm:text-sm text-neutral-300 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <T k="s1.axiom" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Interactive Infographic Spotlight */}
          <InfographicSpotlight onSelectQuery={(q) => setSelectedSearchQuery(q)} />

          {/* Section 3: Deep Dive into the 4 Pillars */}
          <section className="space-y-8 my-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <T k="s3.title" />
            </h2>

            <div className="space-y-6 text-neutral-300">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-blue-500">1.</span> <T k="s3.h1" />
              </h3>
              <p className={getArticleTextClass()}>
                <T k="s3.p1a" />
              </p>
              <p className={getArticleTextClass()}>
                <T k="s3.p1b" />
              </p>
            </div>

            <div className="space-y-6 text-neutral-300 pt-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-cyan-400">2.</span> <T k="s3.h2" />
              </h3>
              <p className={getArticleTextClass()}>
                <T k="s3.p2a" />
              </p>
              <p className={getArticleTextClass()}>
                <T k="s3.p2b" />
              </p>
            </div>

            {/* Blockquote feature */}
            <div className="my-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 md:p-8 relative">
              <div className="text-3xl text-blue-500 font-serif leading-none mb-3">“</div>
              <blockquote className="text-lg md:text-xl font-semibold text-white leading-relaxed mb-4">
                <T k="s3.quote" />
              </blockquote>
              <div className="text-xs text-neutral-400">
                <T k="s3.quoteAuthor" />
              </div>
            </div>

            <div className="space-y-6 text-neutral-300 pt-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">3.</span> <T k="s3.h3" />
              </h3>
              <p className={getArticleTextClass()}>
                <T k="s3.p3a" />
              </p>
              <p className={getArticleTextClass()}>
                <T k="s3.p3b" />
              </p>
            </div>
          </section>

          {/* Section 4: Live Google Search Intent Simulator */}
          <SearchSimulator externalSelectedQuery={selectedSearchQuery} />

          {/* Section 5: Economic Proof & ROI Calculator */}
          <RoiCalculator onOpenAudit={() => setIsAuditOpen(true)} />

          {/* Section 6: Real Evidence & Case Studies */}
          <CaseStudiesSection />

          {/* Section 7: Interactive Readiness Checklist */}
          <ReadinessChecklist onOpenAudit={() => setIsAuditOpen(true)} />

          {/* Section 8: Final Takeaway & Lead Magnet */}
          <section className="my-16 rounded-2xl border border-blue-500/40 bg-gradient-to-b from-blue-950/40 via-neutral-900 to-neutral-950 p-8 sm:p-10 lg:p-12 shadow-2xl relative text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span><T k="s8.badge" /></span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight" style={{ textWrap: 'balance' }}>
                <T k="s8.title" />
              </h2>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
                <T k="s8.text" />
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setIsAuditOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer active:scale-[0.98]"
                >
                  <span><T k="s8.btn" /></span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#top"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <T k="s8.back" />
                </a>
              </div>

              <p className="text-xs text-neutral-500 pt-2">
                <T k="s8.note" />
              </p>
            </div>
          </section>
        </article>
      </main>

      {/* Footer (Clean & quiet) */}
      <Footer onOpenAudit={() => setIsAuditOpen(true)} />

      {/* Modal Lead Capture */}
      <AuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
    </div>
  );
}
