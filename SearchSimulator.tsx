import React, { useState } from 'react';
import { useData } from '../content/ContentProvider';
import { SearchQueryAnalysis } from '../types';
import { Search, Flame, AlertTriangle, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';

interface SearchSimulatorProps {
  externalSelectedQuery?: string;
}

export const SearchSimulator: React.FC<SearchSimulatorProps> = ({ externalSelectedQuery }) => {
  const { SEARCH_QUERIES_DEMO } = useData();
  const [selectedId, setSelectedId] = useState<string>(
    externalSelectedQuery
      ? SEARCH_QUERIES_DEMO.find((q) => q.query === externalSelectedQuery)?.id || SEARCH_QUERIES_DEMO[0].id
      : SEARCH_QUERIES_DEMO[0].id
  );
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const activeQuery: SearchQueryAnalysis = isCustomMode
    ? {
        id: 'custom',
        query: customInput || 'купить диван в Киеве',
        intentType: 'Транзакционный',
        temperature: 95,
        avgCpcEstimate: '$0.90 – $1.80',
        expectedCr: '7.8% – 12.0%',
        buyerMindset: `Клиент ввел «${customInput || 'купить...'}». Это целевое намерение: человек знает, что хочет, и ищет надежного продавца с лучшими условиями и быстрой связью.`,
        mustHaveOnPage: [
          'Прямое попадание заголовка H1 в запрос',
          'Точная цена с указанием скидки или спецпредложения',
          'Сроки доставки и прозрачные гарантии',
        ],
        fatalMistake: 'Вести человека на общую главную страницу вместо узкой страницы товара или категории.',
      }
    : SEARCH_QUERIES_DEMO.find((q) => q.id === selectedId) || SEARCH_QUERIES_DEMO[0];

  const handleSelectPreset = (q: SearchQueryAnalysis) => {
    setSelectedId(q.id);
    setIsCustomMode(false);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setIsCustomMode(true);
    }
  };

  return (
    <section id="live-search" className="my-16 scroll-mt-24">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8 lg:p-10 shadow-xl">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
            <Search className="h-4 w-4" />
            <span>АНАТОМИЯ ПОИСКОВОГО ИНТЕНТА</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400">Интерактивный симулятор выдачи</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Что на самом деле происходит в голове клиента, когда он вводит запрос в Google?
          </h2>
          <p className="mt-2 text-neutral-300 text-sm md:text-base">
            Выберите запрос из списка ниже или протестируйте свой. Посмотрите, с какой психологией человек приходит на сайт и почему транзакционный трафик конвертируется в заказы в 5–8 раз лучше любого таргета.
          </p>
        </div>

        {/* Interactive Google Search Bar Mockup */}
        <div className="max-w-2xl mx-auto mb-8">
          <form
            onSubmit={handleCustomSearch}
            className="relative flex items-center w-full rounded-2xl bg-neutral-950 border border-neutral-700/80 px-4 py-3 shadow-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
          >
            <div className="mr-3 text-neutral-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={isCustomMode ? customInput : activeQuery.query}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setIsCustomMode(true);
              }}
              placeholder="Введите коммерческий запрос (например: купить диван в рассрочку)"
              className="w-full bg-transparent text-sm md:text-base text-white placeholder-neutral-500 focus:outline-none font-medium"
            />
            {isCustomMode && (
              <button
                type="submit"
                className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
              >
                Анализ
              </button>
            )}
          </form>

          {/* Preset Buttons underneath */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="text-xs text-neutral-500 mr-1">Примеры из плаката:</span>
            {SEARCH_QUERIES_DEMO.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSelectPreset(q)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  !isCustomMode && selectedId === q.id
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold shadow-xs'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                {q.query}
              </button>
            ))}
          </div>
        </div>

        {/* Diagnostic Panel for Active Query */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Temperature & Metrics Box */}
          <div className="lg:col-span-4 rounded-xl border border-neutral-800 bg-neutral-950/70 p-6 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                  Тип интента:
                </span>
                <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-900/60 px-2 py-0.5 rounded">
                  {activeQuery.intentType}
                </span>
              </div>

              {/* Temperature Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-neutral-300 font-medium">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span>Температура готовности к покупке</span>
                  </span>
                  <span className="font-extrabold text-amber-400 tabular-nums text-sm">
                    {activeQuery.temperature}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${activeQuery.temperature}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 leading-tight">
                  {activeQuery.temperature > 90
                    ? 'Максимальная готовность (Low-Funnel). Клиент выбирает конкретного поставщика для сделки.'
                    : 'Высокая коммерческая готовность. Требуется быстрое подтверждение цены и условий.'}
                </p>
              </div>

              {/* Conversion Stats */}
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Ожидаемая конверсия (CR):</span>
                  <span className="font-bold text-emerald-400 tabular-nums">
                    {activeQuery.expectedCr}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Ориентировочная цена клика:</span>
                  <span className="font-bold text-neutral-200 tabular-nums">
                    {activeQuery.avgCpcEstimate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Цикл принятия решения:</span>
                  <span className="font-semibold text-neutral-300">
                    От 30 минут до 2 дней
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-3 text-xs text-neutral-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                Трафик по этому запросу окупается в среднем в <strong>4.8 раза быстрее</strong> таргетированной рекламы.
              </span>
            </div>
          </div>

          {/* Psychology & What User Expects */}
          <div className="lg:col-span-8 rounded-xl border border-neutral-800 bg-neutral-950/70 p-6 space-y-6">
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Мысли клиента в момент поиска:
              </div>
              <p className="text-base text-neutral-200 font-medium leading-relaxed bg-neutral-900/60 p-4 rounded-lg border border-neutral-800/80">
                «{activeQuery.buyerMindset}»
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Must-have */}
              <div className="rounded-lg bg-emerald-950/20 border border-emerald-900/40 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Что ОБЯЗАНО быть на первом экране:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {activeQuery.mustHaveOnPage.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fatal mistake */}
              <div className="rounded-lg bg-red-950/20 border border-red-900/40 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Фатальная ошибка конкурентов:</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeQuery.fatalMistake}
                </p>
                <div className="mt-2 text-[11px] text-red-300/80 font-medium">
                  Следствие: клиент жмет «Назад» за 3 секунды и покупает у следующего в выдаче Google.
                </div>
              </div>
            </div>

            {/* Bottom Insight */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>
                Клиент в Google не нуждается в прогреве контентом. Ему нужен быстрый, честный и качественный сервис.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
