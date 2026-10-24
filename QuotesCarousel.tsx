import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../content/ContentProvider';
import { Quote, ChevronLeft, ChevronRight, Star, TrendingUp, Sparkles } from 'lucide-react';


export const QuotesCarousel: React.FC = () => {
  const { CLIENT_QUOTES } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 5.5s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CLIENT_QUOTES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CLIENT_QUOTES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CLIENT_QUOTES.length) % CLIENT_QUOTES.length);
  };

  const current = CLIENT_QUOTES[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-14 pt-10 border-t border-neutral-800/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header of the Carousel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Голос бизнеса · Доверие и результаты</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Что говорят владельцы компаний, перешедшие на Google Search
          </h3>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-neutral-400 tabular-nums mr-2 font-mono">
            0{currentIndex + 1} / 0{CLIENT_QUOTES.length}
          </span>
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-800 transition-all cursor-pointer active:scale-95"
            aria-label="Предыдущий отзыв"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 hover:bg-neutral-800 transition-all cursor-pointer active:scale-95"
            aria-label="Следующий отзыв"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Carousel Display Card with Smooth Transitions */}
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden min-h-[260px] flex flex-col justify-between">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-6"
          >
            {/* Top row: Niche, Star Rating, and Highlight Metric */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-neutral-500 font-medium">·</span>
                <span className="text-xs font-semibold text-neutral-400">
                  {current.niche}
                </span>
              </div>

              {/* Verified Result Metric Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-xs font-bold text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{current.highlightMetric}</span>
              </div>
            </div>

            {/* Quote Body */}
            <div className="relative">
              <Quote className="absolute -top-3 -left-3 h-8 w-8 text-neutral-800/80 -z-10" />
              <p className="text-base sm:text-lg md:text-xl text-neutral-200 font-medium leading-relaxed italic">
                «{current.quote}»
              </p>
            </div>

            {/* Author Footer Lockup */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-neutral-900">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                {current.avatarText}
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {current.name}
                </div>
                <div className="text-xs text-neutral-400">
                  {current.role} <span className="text-neutral-500">·</span> {current.company}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-neutral-900/60">
          {CLIENT_QUOTES.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 bg-blue-500'
                  : 'w-2 bg-neutral-800 hover:bg-neutral-700'
              }`}
              aria-label={`Перейти к отзыву ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
