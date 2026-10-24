import React from 'react';
import { Search } from 'lucide-react';

interface FooterProps {
  onOpenAudit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAudit }) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 px-6 lg:px-8 text-neutral-400">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-bold text-white tracking-tight">SearchDemand Growth</span>
          <span className="text-xs text-neutral-500">· Аналитика поискового спроса</span>
        </div>

        <nav className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
          <a href="#why-google" className="hover:text-white transition-colors">
            Почему Google
          </a>
          <a href="#live-search" className="hover:text-white transition-colors">
            Симулятор спроса
          </a>
          <a href="#roi-calculator" className="hover:text-white transition-colors">
            Калькулятор окупаемости
          </a>
          <a href="#case-studies" className="hover:text-white transition-colors">
            Кейсы
          </a>
          <button
            onClick={onOpenAudit}
            className="hover:text-blue-400 text-neutral-300 font-medium transition-colors cursor-pointer"
          >
            Заказать аудит
          </button>
        </nav>

        <div className="text-xs text-neutral-500 text-center md:text-right">
          © {new Date().getFullYear()} SearchDemand. «Будь там, где ищут».
        </div>
      </div>
    </footer>
  );
};
