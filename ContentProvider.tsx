import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  PILLARS_DATA,
  SEARCH_QUERIES_DEMO,
  NICHES_DATA,
  CHECKLIST_DATA,
  CASE_STUDIES,
  CLIENT_QUOTES,
} from '../data/articleData';
import { TEXT_DEFAULTS } from './texts';
import { cmsConfigured, fetchOverrides, readCache, Overrides } from '../lib/cms';

export const DATA_DEFAULTS = {
  PILLARS_DATA,
  SEARCH_QUERIES_DEMO,
  NICHES_DATA,
  CHECKLIST_DATA,
  CASE_STUDIES,
  CLIENT_QUOTES,
};
export type DataKey = keyof typeof DATA_DEFAULTS;

export const DATA_LABELS: Record<DataKey, string> = {
  PILLARS_DATA: 'Инфографика: 4 столпа',
  SEARCH_QUERIES_DEMO: 'Симулятор поисковых запросов',
  NICHES_DATA: 'ROI-калькулятор: ниши',
  CHECKLIST_DATA: 'Чек-лист готовности',
  CASE_STUDIES: 'Кейсы клиентов',
  CLIENT_QUOTES: 'Отзывы клиентов (карусель)',
};

interface Ctx {
  texts: Record<string, string>;
  data: Record<string, unknown>;
}
const ContentCtx = createContext<Ctx>({ texts: {}, data: {} });

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const cached = cmsConfigured ? readCache() : null;
  const [state, setState] = useState<Overrides>(cached ?? { texts: {}, data: {} });
  const [ready, setReady] = useState(!cmsConfigured || cached !== null);

  useEffect(() => {
    if (!cmsConfigured) return;
    let alive = true;
    const timer = setTimeout(() => alive && setReady(true), 2500);
    fetchOverrides()
      .then((o) => alive && setState(o))
      .catch(() => {})
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const value = useMemo(() => state, [state]);
  if (!ready) return <div className="min-h-screen bg-neutral-950" />;
  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

/** Данные секций (с учётом правок из админки). */
export function useData() {
  const { data } = useContext(ContentCtx);
  return useMemo(() => {
    const out = { ...DATA_DEFAULTS } as typeof DATA_DEFAULTS;
    (Object.keys(DATA_DEFAULTS) as DataKey[]).forEach((k) => {
      const v = data[k];
      if (Array.isArray(v) && v.length > 0) (out as Record<string, unknown>)[k] = v;
    });
    return out;
  }, [data]);
}

export function useText(key: string): string {
  const { texts } = useContext(ContentCtx);
  const o = texts[key];
  return typeof o === 'string' && o !== '' ? o : TEXT_DEFAULTS[key]?.value ?? '';
}

/** Мини-разметка: **жирный** и *курсив*. */
export function renderRich(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

/** Редактируемый текст: <T k="hero.title" /> */
export function T({ k }: { k: string }) {
  return <>{renderRich(useText(k))}</>;
}
