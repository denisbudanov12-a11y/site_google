import React, { useState } from 'react';
import { useData } from '../content/ContentProvider';
import { ZoomIn, CheckCircle2, Flame, ShieldCheck, Compass, ShoppingCart, ArrowRight } from 'lucide-react';

interface InfographicSpotlightProps {
  onSelectQuery?: (queryText: string) => void;
}

export const InfographicSpotlight: React.FC<InfographicSpotlightProps> = ({ onSelectQuery }) => {
  const { PILLARS_DATA } = useData();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const currentPillar = PILLARS_DATA[activeTab];

  const icons = [
    <Compass key="0" className="h-4 w-4" />,
    <ShieldCheck key="1" className="h-4 w-4" />,
    <CheckCircle2 key="2" className="h-4 w-4" />,
    <ShoppingCart key="3" className="h-4 w-4" />,
  ];

  return (
    <section className="my-16 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Header of Section */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-3 tracking-wide">
          <Flame className="h-4 w-4 text-amber-400" />
          <span>КЛЮЧЕВОЙ АНАЛИТИЧЕСКИЙ МАТЕРИАЛ</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="text-neutral-400">Интерактивный разбор плаката</span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4" style={{ textWrap: 'balance' }}>
          4 психологических столпа: почему покупатель в Google выбирает и платит за минуты
        </h2>
        <p className="text-base text-neutral-300 leading-relaxed">
          Посмотрите на инфографику ниже. Это не просто красивая картинка — это фундаментальная психологическая модель пути клиента, на которой строятся миллионные обороты в e-commerce и сфере услуг.
        </p>
      </div>

      {/* Main Interactive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Poster Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative group rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 shadow-2xl max-w-sm w-full">
            <img
              src="/assets/aistudio/image_7788b459.png"
              alt="Почему люди покупают через поиск в Google — инфографика пути клиента"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback attempt to direct public path if needed
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('/public/assets/')) {
                  target.src = '/public/assets/aistudio/image_7788b459.png';
                }
              }}
            />

            {/* Click to Zoom overlay */}
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium backdrop-blur-xs cursor-pointer"
            >
              <ZoomIn className="h-4 w-4" />
              <span>Нажмите для увеличения</span>
            </button>
          </div>

          <p className="mt-3 text-xs text-neutral-400 text-center">
            Нажмите на плакат, чтобы рассмотреть оригинальную инфографику целиком
          </p>

          {/* Quick search shortcut pills based on image queries */}
          <div className="mt-5 w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-950/70 p-4">
            <span className="block text-xs font-semibold text-neutral-400 mb-2">
              Примеры транзакционных запросов из плаката:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                'купить диван',
                'купить диван в Киеве',
                'купить диван с доставкой',
                'купить диван в рассрочку',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    const el = document.getElementById('live-search');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    if (onSelectQuery) onSelectQuery(q);
                  }}
                  className="px-2.5 py-1 text-xs rounded-md bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Deep-Dive Tabs */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Segmented Pillar Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-neutral-950 rounded-xl border border-neutral-800">
            {PILLARS_DATA.map((pillar, idx) => (
              <button
                key={pillar.number}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                {icons[idx]}
                <span>{pillar.number}. {pillar.title}</span>
              </button>
            ))}
          </div>

          {/* Active Pillar Card */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-6 lg:p-7 relative">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Фаза {currentPillar.number} · {currentPillar.badge}
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                Психология покупателя
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {currentPillar.title}: {currentPillar.subtitle}
            </h3>

            <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6">
              {currentPillar.description}
            </p>

            {/* Hard Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {currentPillar.metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-3.5"
                >
                  <div className="text-xs text-neutral-400 mb-1">{m.label}</div>
                  <div className="text-sm font-bold text-neutral-100 tabular-nums">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Takeaway Quote */}
            <div className="rounded-lg bg-blue-950/30 border border-blue-900/40 p-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-lg leading-none">“</span>
                <p className="text-xs md:text-sm text-blue-200/90 italic font-medium leading-relaxed">
                  {currentPillar.takeaway}
                </p>
              </div>
            </div>
          </div>

          {/* Why Search = Trust Callout */}
          <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-neutral-900 to-neutral-950 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-bold text-white">
                Закон органического спроса: «Поиск = Доверие»
              </div>
              <p className="text-xs text-neutral-400">
                Поисковый трафик — это люди, которые уже хотят купить. Осталось только показать им ваш товар или услугу.
              </p>
            </div>
            <a
              href="#roi-calculator"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold whitespace-nowrap transition-colors shrink-0"
            >
              <span>Посчитать выручку</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal for Fullscreen Image Zoom */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto rounded-xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-neutral-900/90 text-white text-xs font-bold border border-neutral-700 hover:bg-neutral-800"
            >
              Закрыть [ESC]
            </button>
            <img
              src="/assets/aistudio/image_7788b459.png"
              alt="Почему люди покупают через Google Поиск - полноразмерный вид"
              className="w-full h-auto rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </section>
  );
};
