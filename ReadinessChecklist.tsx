import React, { useState } from 'react';
import { useData } from '../content/ContentProvider';
import { CheckSquare, Square, CheckCircle, AlertCircle, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReadinessChecklistProps {
  onOpenAudit: () => void;
}

export const ReadinessChecklist: React.FC<ReadinessChecklistProps> = ({ onOpenAudit }) => {
  const { CHECKLIST_DATA } = useData();
  const [checkedIds, setCheckedIds] = useState<string[]>(['google-business', 'mobile-speed']);

  const toggleItem = (id: string) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((item) => item !== id));
    } else {
      const nextChecked = [...checkedIds, id];
      setCheckedIds(nextChecked);
      if (nextChecked.length === CHECKLIST_DATA.length) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    }
  };

  const totalScore = checkedIds.reduce((sum, id) => {
    const item = CHECKLIST_DATA.find((c) => c.id === id);
    return sum + (item ? item.weight : 0);
  }, 0);

  const getVerdict = () => {
    if (totalScore >= 80) {
      return {
        level: 'Отличная готовность (80–100%)',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/30 border-emerald-800/60',
        text: 'Ваш сайт обладает всеми базовыми триггерами доверия для удержания горячих клиентов из Google. Пора масштабировать трафик!',
      };
    }
    if (totalScore >= 45) {
      return {
        level: 'Средняя готовность (45–75%)',
        color: 'text-amber-400',
        bg: 'bg-amber-950/30 border-amber-800/60',
        text: 'Вы уже привлекаете клиентов, но теряете от 30% до 50% заказов из-за отсутствия узких посадочных или скрытых условий покупки.',
      };
    }
    return {
      level: 'Критический риск потери заявок (<45%)',
      color: 'text-red-400',
      bg: 'bg-red-950/30 border-red-800/60',
      text: 'Вливание бюджета в поиск прямо сейчас будет неэффективным: клиенты приходят с деньгами, но закрывают вкладку из-за недоверия или неудобства.',
    };
  };

  const verdict = getVerdict();

  return (
    <section id="readiness-checklist" className="my-16 scroll-mt-24">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8 lg:p-10 shadow-xl">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
            <CheckSquare className="h-4 w-4" />
            <span>ДИАГНОСТИКА БИЗНЕСА</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400">Интерактивный аудит готовности</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            Готов ли ваш бизнес принимать покупателей из Google? Проверьте за 60 секунд
          </h2>
          <p className="mt-2 text-neutral-300 text-sm md:text-base">
            Поисковый клиент не прощает неудобств. Отметьте пункты, которые уже реализованы на вашем сайте, чтобы узнать коэффициент готовности к приему транзакционного трафика.
          </p>
        </div>

        {/* Scorecard Widget */}
        <div className={`p-5 rounded-xl border mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 ${verdict.bg}`}>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Award className={`h-5 w-5 ${verdict.color}`} />
              <span className={`text-sm font-bold ${verdict.color}`}>{verdict.level}</span>
            </div>
            <p className="text-xs text-neutral-300 max-w-xl">{verdict.text}</p>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <div className="text-3xl font-black text-white tabular-nums">
              {totalScore}<span className="text-neutral-500 text-base font-normal"> / 100</span>
            </div>
            <div className="text-[11px] text-neutral-400">Индекс конверсионной силы</div>
          </div>
        </div>

        {/* Interactive Checkbox Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {CHECKLIST_DATA.map((item) => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-neutral-950/90 border-blue-500/70 shadow-xs'
                    : 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-blue-500 focus:outline-none shrink-0"
                  aria-label={isChecked ? 'Снять отметку' : 'Отметить'}
                >
                  {isChecked ? (
                    <CheckCircle className="h-5 w-5 text-blue-500 fill-blue-500/20" />
                  ) : (
                    <Square className="h-5 w-5 text-neutral-600" />
                  )}
                </button>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-bold ${isChecked ? 'text-white' : 'text-neutral-300'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono tabular-nums shrink-0">
                      +{item.weight} б.
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-blue-300/80 font-medium pt-1">
                    💡 {item.whyCrucial}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA banner within checklist */}
        <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-white">
              Нужна помощь в закрытии пробелов и захвате ТОП-1?
            </div>
            <p className="text-xs text-neutral-400">
              Наши специалисты бесплатно проанализируют ваш сайт и составят список из 10 критических точек роста конверсии.
            </p>
          </div>
          <button
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap transition-colors shrink-0"
          >
            <span>Запросить аудит</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
