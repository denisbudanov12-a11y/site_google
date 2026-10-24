import React, { useEffect, useState } from 'react';
import { Share2, Check, Bookmark, BookmarkCheck } from 'lucide-react';

interface ReadingProgressProps {
  fontSize: 'normal' | 'large' | 'huge';
  setFontSize: (size: 'normal' | 'large' | 'huge') => void;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  fontSize,
  setFontSize,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      {/* Top thin progress line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Utility Bar (Floating subtle bar at bottom right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 p-1.5 bg-neutral-900/90 border border-neutral-800 rounded-xl backdrop-blur-md shadow-2xl text-xs text-neutral-300">
        <span className="px-2 text-neutral-400 tabular-nums">
          {Math.round(scrollProgress)}% прочитано
        </span>

        <span className="h-4 w-px bg-neutral-800" aria-hidden="true" />

        {/* Font size control */}
        <div className="flex items-center gap-0.5 bg-neutral-950 rounded-lg p-0.5 border border-neutral-800">
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              fontSize === 'normal'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Обычный шрифт"
          >
            A
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
              fontSize === 'large'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Крупный шрифт"
          >
            A+
          </button>
          <button
            onClick={() => setFontSize('huge')}
            className={`px-2 py-1 rounded text-sm font-bold transition-colors ${
              fontSize === 'huge'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Максимальный шрифт"
          >
            A++
          </button>
        </div>

        <span className="h-4 w-px bg-neutral-800" aria-hidden="true" />

        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`p-1.5 rounded-lg transition-colors ${
            bookmarked
              ? 'text-yellow-400 bg-neutral-800'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
          }`}
          title={bookmarked ? 'Статья в закладках' : 'Сохранить статью'}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Скопировать ссылку"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Скопировано</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>Поделиться</span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
