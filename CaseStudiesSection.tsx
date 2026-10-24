import React from 'react';
import { useData } from '../content/ContentProvider';
import { QuotesCarousel } from './QuotesCarousel';
import { TrendingUp, CheckCircle2, Quote } from 'lucide-react';

export const CaseStudiesSection: React.FC = () => {
  const { CASE_STUDIES } = useData();
  return (
    <section id="case-studies" className="my-16 scroll-mt-24">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8 lg:p-10 shadow-xl">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
            <TrendingUp className="h-4 w-4" />
            <span>ДОКАЗАТЕЛЬСТВА И ЦИФРЫ</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400">Реальные бизнес-результаты</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Как бизнес умножает продажи, когда переключает фокус на поисковый трафик
          </h2>
          <p className="mt-2 text-neutral-300 text-sm md:text-base">
            Опыт компаний, которые перестали жечь бюджеты на навязанную рекламу в лентах и встали прямо на пути готового к покупке спроса.
          </p>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.id}
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 lg:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header of Card */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                      {cs.industry}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {cs.client}
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">
                    {cs.duration}
                  </span>
                </div>

                {/* Before / After Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="rounded-lg bg-neutral-900/80 border border-neutral-800/80 p-3.5 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                      Было (Холодный трафик):
                    </span>
                    <div className="text-xs text-neutral-300">
                      <strong>Канал:</strong> {cs.before.channel}
                    </div>
                    <div className="text-xs text-neutral-300">
                      <strong>Стоимость лида:</strong> {cs.before.cpa}
                    </div>
                    <div className="text-xs text-neutral-300">
                      <strong>Выручка:</strong> <span className="tabular-nums font-semibold">{cs.before.monthlyRevenue}</span>
                    </div>
                  </div>

                  {/* After */}
                  <div className="rounded-lg bg-blue-950/20 border border-blue-900/40 p-3.5 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Стало (Google Search):
                    </span>
                    <div className="text-xs text-neutral-300">
                      <strong>Канал:</strong> {cs.after.channel}
                    </div>
                    <div className="text-xs text-neutral-300">
                      <strong>Стоимость сделки:</strong> <span className="text-emerald-400 font-bold">{cs.after.cpa}</span>
                    </div>
                    <div className="text-xs text-neutral-300">
                      <strong>Выручка:</strong> <span className="text-white font-extrabold tabular-nums">{cs.after.monthlyRevenue}</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold pt-0.5">
                      Результат: {cs.after.roi}
                    </div>
                  </div>
                </div>

                {/* Key Strategies */}
                <div>
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                    Что было внедрено:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {cs.strategy.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Author Quote */}
              <div className="pt-4 border-t border-neutral-800/80">
                <div className="flex items-start gap-3">
                  <Quote className="h-5 w-5 text-neutral-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs text-neutral-300 italic leading-relaxed">
                      «{cs.quote}»
                    </p>
                    <div className="text-xs font-semibold text-white">
                      {cs.author}{' '}
                      <span className="font-normal text-neutral-400">
                        · {cs.authorRole}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Quotes Carousel of Satisfied Clients */}
        <QuotesCarousel />
      </div>
    </section>
  );
};
