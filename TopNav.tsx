import React from 'react';
import { ArrowUpRight, Search } from 'lucide-react';

interface TopNavProps {
  onOpenAudit: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onOpenAudit }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-blue-400 transition-colors"
        >
          <Search className="h-4 w-4 text-blue-500" />
          <span>SearchDemand</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a
            href="#why-google"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Почему Google
          </a>
          <a
            href="#live-search"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Симулятор спроса
          </a>
          <a
            href="#roi-calculator"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Калькулятор окупаемости
          </a>
          <a
            href="#case-studies"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Кейсы и цифры
          </a>
          <a
            href="#readiness-checklist"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Чек-лист готовности
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAudit}
            className="group inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all shadow-sm hover:shadow-blue-500/20 whitespace-nowrap shrink-0 active:scale-[0.98]"
          >
            <span>Получить расчет ниши</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
