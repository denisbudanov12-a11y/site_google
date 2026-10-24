import React, { useState } from 'react';
import { useData } from '../content/ContentProvider';
import { BusinessNiche } from '../types';
import { Calculator, ArrowRight, DollarSign, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

interface RoiCalculatorProps {
  onOpenAudit: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenAudit }) => {
  const { NICHES_DATA } = useData();
  const [selectedNiche, setSelectedNiche] = useState<BusinessNiche>(NICHES_DATA[0]);
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(selectedNiche.defaultMonthlySearches);
  const [avgCheck, setAvgCheck] = useState<number>(selectedNiche.defaultAvgCheck);
  const [marginPercent, setMarginPercent] = useState<number>(35); // 35% margin

  const handleNicheChange = (niche: BusinessNiche) => {
    setSelectedNiche(niche);
    setMonthlyVisitors(niche.defaultMonthlySearches);
    setAvgCheck(niche.defaultAvgCheck);
  };

  // Calculations:
  // Cold traffic:
  const coldOrders = Math.round((monthlyVisitors * (selectedNiche.typicalColdCr / 100)));
  const coldRevenue = coldOrders * avgCheck;
  const coldProfit = Math.round(coldRevenue * (marginPercent / 100));

  // Search traffic:
  const searchOrders = Math.round((monthlyVisitors * (selectedNiche.typicalSearchCr / 100)));
  const searchRevenue = searchOrders * avgCheck;
  const searchProfit = Math.round(searchRevenue * (marginPercent / 100));

  const extraProfitMonthly = Math.max(0, searchProfit - coldProfit);
  const extraProfitYearly = extraProfitMonthly * 12;
  const multiplier = (selectedNiche.typicalSearchCr / selectedNiche.typicalColdCr).toFixed(1);

  return (
    <section id="roi-calculator" className="my-16 scroll-mt-24">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
            <Calculator className="h-4 w-4" />
            <span>ЭКОНОМИКА СПРОСА</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400">Интерактивный симулятор окупаемости</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Сколько чистой прибыли вы теряете прямо сейчас, отдавая поисковый трафик конкурентам?
          </h2>
          <p className="mt-2 text-neutral-300 text-sm md:text-base">
            Один и тот же бюджет в 1 000 посетителей дает кардинально разные результаты в зависимости от источника. Сравните холодный трафик из соцсетей с горячим потоком клиентов из поиска Google.
          </p>
        </div>

        {/* Niche Selector */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">
            1. Выберите вашу нишу бизнеса:
          </label>
          <div className="flex flex-wrap gap-2">
            {NICHES_DATA.map((niche) => (
              <button
                key={niche.id}
                onClick={() => handleNicheChange(niche)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  selectedNiche.id === niche.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                {niche.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 p-6 rounded-xl bg-neutral-950/80 border border-neutral-800">
          {/* Slider 1: Monthly searches */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Посетителей в месяц:</span>
              <span className="font-bold text-white tabular-nums">
                {monthlyVisitors.toLocaleString()} чел.
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={25000}
              step={100}
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>300</span>
              <span>25 000</span>
            </div>
          </div>

          {/* Slider 2: Average Check */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Средний чек сделки:</span>
              <span className="font-bold text-white tabular-nums">
                ${avgCheck.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={10000}
              step={50}
              value={avgCheck}
              onChange={(e) => setAvgCheck(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>$50</span>
              <span>$10 000</span>
            </div>
          </div>

          {/* Slider 3: Margin */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Маржинальность бизнеса:</span>
              <span className="font-bold text-white tabular-nums">
                {marginPercent}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={80}
              step={5}
              value={marginPercent}
              onChange={(e) => setMarginPercent(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>10%</span>
              <span>80%</span>
            </div>
          </div>
        </div>

        {/* Comparative Head-to-Head Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card A: Cold Social Traffic */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 relative opacity-85">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                Канал A
              </span>
              <span className="text-xs text-neutral-400">Холодная реклама в соцсетях</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-300 mb-1">
              Таргет на интерес («Листали ленту»)
            </h3>
            <p className="text-xs text-neutral-400 mb-5">
              Случайные показы между видеороликами. Человек не планировал покупать прямо сейчас.
            </p>

            <div className="space-y-3 pt-3 border-t border-neutral-800/80">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Средняя конверсия в оплату:</span>
                <span className="font-bold text-neutral-300 tabular-nums">
                  {selectedNiche.typicalColdCr}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Закрытых сделок в месяц:</span>
                <span className="font-bold text-neutral-200 tabular-nums">
                  {coldOrders} заказов
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Ежемесячная выручка:</span>
                <span className="font-bold text-neutral-200 tabular-nums">
                  ${coldRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-neutral-900 font-semibold">
                <span className="text-neutral-400">Чистая прибыль:</span>
                <span className="text-neutral-300 tabular-nums">
                  ${coldProfit.toLocaleString()} / мес
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Google Search Traffic */}
          <div className="rounded-xl border border-blue-500/80 bg-gradient-to-b from-blue-950/30 to-neutral-950 p-6 relative shadow-lg">
            <div className="absolute -top-3 right-5 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              в {multiplier}× раз эффективнее
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-bold text-blue-400">
                Канал B (Тема статьи)
              </span>
              <span className="text-xs text-blue-300 font-medium">Google Поиск & Shopping</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Транзакционный поиск («Купить диван...»)
            </h3>
            <p className="text-xs text-neutral-300 mb-5">
              Человек сам вбил запрос, сравнил условия и готов платить за решение своей задачи.
            </p>

            <div className="space-y-3 pt-3 border-t border-blue-900/40">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Средняя конверсия в оплату:</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {selectedNiche.typicalSearchCr}%
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Закрытых сделок в месяц:</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {searchOrders} заказов
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Ежемесячная выручка:</span>
                <span className="font-bold text-white tabular-nums">
                  ${searchRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-neutral-800 font-semibold">
                <span className="text-neutral-300">Чистая прибыль:</span>
                <span className="text-emerald-400 font-extrabold tabular-nums">
                  ${searchProfit.toLocaleString()} / мес
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Total Potential Banner */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-950/40 via-blue-950/40 to-neutral-950 border border-emerald-800/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-400">
              Ваша дополнительная выгода от фокуса на Google Search:
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white tabular-nums">
              +${extraProfitMonthly.toLocaleString()} <span className="text-sm font-normal text-neutral-400">/ месяц чистой прибыли</span>
            </div>
            <div className="text-xs text-neutral-400">
              (или <strong className="text-emerald-300 tabular-nums">+${extraProfitYearly.toLocaleString()}</strong> за 12 месяцев работы с поисковой аудиторией)
            </div>
          </div>

          <button
            onClick={onOpenAudit}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-blue-500/25 cursor-pointer whitespace-nowrap shrink-0 active:scale-[0.98]"
          >
            <span>Заказать аудит поискового спроса</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
