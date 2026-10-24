import React, { useEffect, useMemo, useState } from 'react';
import {
  cmsConfigured,
  fetchOverrides,
  getSession,
  saveOverrides,
  signIn,
  signOut,
  Overrides,
} from '../lib/cms';
import { TEXT_DEFAULTS } from '../content/texts';
import { DATA_DEFAULTS, DATA_LABELS, DataKey } from '../content/ContentProvider';

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const FIELD_LABELS: Record<string, string> = {
  id: 'ID (лучше не менять)',
  number: 'Номер',
  title: 'Заголовок',
  subtitle: 'Подзаголовок',
  badge: 'Бейдж',
  color: 'Градиент (CSS-классы)',
  accentColor: 'Акцентный цвет',
  description: 'Описание',
  metrics: 'Метрики',
  label: 'Название',
  value: 'Значение',
  takeaway: 'Вывод',
  query: 'Поисковый запрос',
  intentType: 'Тип интента',
  temperature: 'Температура (0–100)',
  avgCpcEstimate: 'Средний CPC',
  expectedCr: 'Ожидаемая конверсия',
  buyerMindset: 'Мышление покупателя',
  mustHaveOnPage: 'Что обязательно на странице',
  fatalMistake: 'Фатальная ошибка',
  name: 'Название / имя',
  defaultAvgCheck: 'Средний чек',
  defaultMonthlySearches: 'Запросов в месяц',
  typicalColdCr: 'Конверсия холодного трафика, %',
  typicalSearchCr: 'Конверсия поиска, %',
  currency: 'Валюта',
  weight: 'Вес',
  whyCrucial: 'Почему это важно',
  industry: 'Отрасль',
  client: 'Клиент',
  duration: 'Срок',
  before: 'До',
  after: 'После',
  channel: 'Канал',
  cpa: 'CPA',
  monthlyRevenue: 'Выручка в месяц',
  leadQuality: 'Качество лидов',
  roi: 'ROI',
  strategy: 'Стратегия (шаги)',
  quote: 'Цитата',
  author: 'Автор',
  authorRole: 'Должность автора',
  role: 'Должность',
  company: 'Компания',
  avatarText: 'Инициалы',
  rating: 'Рейтинг (1–5)',
  highlightMetric: 'Главный результат',
  niche: 'Ниша',
};
const INTENTS = ['Транзакционный', 'Коммерческий', 'Локальный', 'Срочный'];

const itemTitle = (it: Json, i: number): string => {
  if (it && typeof it === 'object' && !Array.isArray(it)) {
    for (const k of ['title', 'name', 'query', 'client', 'label']) {
      const v = (it as Record<string, Json>)[k];
      if (typeof v === 'string' && v) return `${i + 1}. ${v}`;
    }
  }
  return `Элемент ${i + 1}`;
};

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';
const btnCls =
  'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40';

function blankLike(v: Json): Json {
  if (typeof v === 'string') return '';
  if (typeof v === 'number') return 0;
  if (typeof v === 'boolean') return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blankLike(x)]));
  return null;
}

function JsonField({ name, value, onChange }: { name: string; value: Json; onChange: (v: Json) => void }) {
  const label = FIELD_LABELS[name] ?? name;

  if (typeof value === 'string') {
    if (name === 'intentType')
      return (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
          <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
            {[...new Set([value, ...INTENTS])].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      );
    const long = value.length > 70 || value.includes('\n');
    return (
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
        {long ? (
          <textarea
            className={inputCls}
            rows={Math.min(8, Math.max(3, Math.ceil(value.length / 90)))}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </label>
    );
  }
  if (typeof value === 'number')
    return (
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
        <input
          type="number"
          className={inputCls}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        />
      </label>
    );
  if (typeof value === 'boolean')
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} /> {label}
      </label>
    );
  if (Array.isArray(value)) return <ArrayField name={name} label={label} value={value} onChange={onChange} />;
  if (value && typeof value === 'object')
    return (
      <fieldset className="rounded-lg border border-slate-200 p-3">
        <legend className="px-1 text-xs font-semibold text-slate-700">{label}</legend>
        <div className="space-y-3">
          {Object.entries(value).map(([k, v]) => (
            <JsonField key={k} name={k} value={v} onChange={(nv) => onChange({ ...(value as object), [k]: nv } as Json)} />
          ))}
        </div>
      </fieldset>
    );
  return null;
}

function ArrayField({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: Json[];
  onChange: (v: Json) => void;
}) {
  const isPrimitive = value.length === 0 || typeof value[0] !== 'object';
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const c = [...value];
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  };
  const remove = (i: number) => {
    if (window.confirm('Удалить этот элемент?')) onChange(value.filter((_, x) => x !== i));
  };
  const add = () => {
    if (isPrimitive) return onChange([...value, '']);
    const last = value[value.length - 1] ?? {};
    const copy = JSON.parse(JSON.stringify(last)) as Record<string, Json>;
    // Копия последнего элемента с очищенными текстами; ID делаем уникальным.
    const fresh = blankLike(copy) as Record<string, Json>;
    for (const k of Object.keys(copy)) if (typeof copy[k] === 'number' || typeof copy[k] === 'string') fresh[k] = copy[k];
    if (typeof copy.id === 'string') fresh.id = `${copy.id}-${Date.now().toString(36).slice(-4)}`;
    onChange([...value, fresh]);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
      <div className="mb-2 text-xs font-semibold text-slate-700">{label}</div>
      <div className="space-y-2">
        {value.map((item, i) =>
          isPrimitive ? (
            <div key={i} className="flex gap-2">
              <input
                className={inputCls}
                value={String(item ?? '')}
                onChange={(e) => onChange(value.map((x, xi) => (xi === i ? e.target.value : x)))}
              />
              <button className={btnCls} onClick={() => move(i, -1)}>↑</button>
              <button className={btnCls} onClick={() => move(i, 1)}>↓</button>
              <button className={btnCls} onClick={() => remove(i)}>✕</button>
            </div>
          ) : (
            <details key={i} className="rounded-lg border border-slate-200 bg-white" open={name === 'metrics' || undefined}>
              <summary className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-slate-800">
                <span className="truncate">{itemTitle(item, i)}</span>
                <span className="flex shrink-0 gap-1" onClick={(e) => e.preventDefault()}>
                  <button className={btnCls} onClick={() => move(i, -1)}>↑</button>
                  <button className={btnCls} onClick={() => move(i, 1)}>↓</button>
                  <button className={btnCls} onClick={() => remove(i)}>Удалить</button>
                </span>
              </summary>
              <div className="space-y-3 border-t border-slate-200 p-3">
                {item && typeof item === 'object' && !Array.isArray(item) &&
                  Object.entries(item).map(([k, v]) => (
                    <JsonField
                      key={k}
                      name={k}
                      value={v}
                      onChange={(nv) => onChange(value.map((x, xi) => (xi === i ? { ...(x as object), [k]: nv } : x)))}
                    />
                  ))}
              </div>
            </details>
          ),
        )}
      </div>
      <button className={`${btnCls} mt-2`} onClick={add}>+ Добавить</button>
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mx-auto mt-24 w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr('');
        try {
          await signIn(email.trim(), password);
          onDone();
        } catch (x) {
          setErr((x as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h1 className="text-xl font-bold text-slate-900">Вход в админку</h1>
      <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
      <input className={inputCls} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {err && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      <button disabled={busy} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">
        {busy ? 'Входим…' : 'Войти'}
      </button>
      <a href="#/" className="block text-center text-xs text-slate-500 hover:underline">← На сайт</a>
    </form>
  );
}

export default function Admin() {
  const [auth, setAuth] = useState<'loading' | 'out' | 'in'>('loading');
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [data, setData] = useState<Record<string, Json>>({});
  const [tab, setTab] = useState<'texts' | 'data'>('texts');
  const [dataKey, setDataKey] = useState<DataKey>('PILLARS_DATA');
  const [status, setStatus] = useState<{ kind: 'ok' | 'err' | 'busy'; msg: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  const load = async () => {
    const s = await getSession();
    if (!s) return setAuth('out');
    try {
      const o = await fetchOverrides();
      setTexts({ ...Object.fromEntries(Object.entries(TEXT_DEFAULTS).map(([k, v]) => [k, v.value])), ...o.texts });
      setData({ ...(DATA_DEFAULTS as unknown as Record<string, Json>), ...(o.data as Record<string, Json>) });
      setAuth('in');
    } catch (e) {
      setStatus({ kind: 'err', msg: (e as Error).message });
      setAuth('in');
    }
  };

  useEffect(() => {
    if (cmsConfigured) load();
  }, []);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const groups = useMemo(() => {
    const g: Record<string, string[]> = {};
    Object.entries(TEXT_DEFAULTS).forEach(([k, v]) => (g[v.group] ||= []).push(k));
    return g;
  }, []);

  const save = async () => {
    setStatus({ kind: 'busy', msg: 'Сохраняем…' });
    const o: Overrides = { texts: {}, data: {} };
    Object.entries(texts).forEach(([k, v]) => {
      if (TEXT_DEFAULTS[k] && v !== TEXT_DEFAULTS[k].value) o.texts[k] = v;
    });
    (Object.keys(DATA_DEFAULTS) as DataKey[]).forEach((k) => {
      if (JSON.stringify(data[k]) !== JSON.stringify(DATA_DEFAULTS[k])) o.data[k] = data[k];
    });
    try {
      await saveOverrides(o);
      setDirty(false);
      setStatus({ kind: 'ok', msg: 'Сохранено. Изменения уже на сайте (обновите страницу сайта).' });
    } catch (e) {
      setStatus({ kind: 'err', msg: (e as Error).message });
    }
  };

  if (!cmsConfigured)
    return (
      <Shell>
        <div className="mx-auto mt-24 max-w-lg rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-900">
          <b>Админка ещё не подключена.</b> Задайте переменные <code>VITE_SUPABASE_URL</code> и{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> (инструкция в файле ADMIN.md) и пересоберите сайт.
        </div>
      </Shell>
    );
  if (auth === 'loading') return <Shell><div className="mt-24 text-center text-slate-500">Загрузка…</div></Shell>;
  if (auth === 'out') return <Shell><Login onDone={load} /></Shell>;

  return (
    <Shell>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-3">
          <h1 className="mr-auto text-base font-bold text-slate-900">Админка сайта</h1>
          {dirty && <span className="text-xs text-amber-600">Есть несохранённые изменения</span>}
          <a href="#/" target="_blank" rel="noreferrer" className={btnCls}>Открыть сайт ↗</a>
          <button className={btnCls} onClick={() => { signOut(); setAuth('out'); }}>Выйти</button>
          <button
            onClick={save}
            disabled={status?.kind === 'busy'}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            Сохранить
          </button>
        </div>
        {status && (
          <div className={`px-4 py-2 text-center text-sm ${status.kind === 'err' ? 'bg-red-50 text-red-700' : status.kind === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
            {status.msg}
          </div>
        )}
        <div className="mx-auto flex max-w-4xl gap-1 px-4">
          {(['texts', 'data'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2 text-sm font-medium ${tab === t ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              {t === 'texts' ? 'Тексты страницы' : 'Данные блоков'}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        {tab === 'texts' && (
          <>
            <p className="text-sm text-slate-500">
              В текстах можно использовать <code>**жирный**</code> и <code>*курсив*</code>.
            </p>
            {Object.entries(groups).map(([g, keys]) => (
              <section key={g} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-bold text-slate-900">{g}</h2>
                {keys.map((k) => {
                  const def = TEXT_DEFAULTS[k];
                  const v = texts[k] ?? def.value;
                  return (
                    <label key={k} className="block">
                      <span className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                        {def.label}
                        {v !== def.value && (
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() => { setTexts({ ...texts, [k]: def.value }); setDirty(true); }}
                          >
                            вернуть исходный
                          </button>
                        )}
                      </span>
                      {def.long ? (
                        <textarea className={inputCls} rows={Math.min(8, Math.max(2, Math.ceil(v.length / 90)))} value={v}
                          onChange={(e) => { setTexts({ ...texts, [k]: e.target.value }); setDirty(true); }} />
                      ) : (
                        <input className={inputCls} value={v}
                          onChange={(e) => { setTexts({ ...texts, [k]: e.target.value }); setDirty(true); }} />
                      )}
                    </label>
                  );
                })}
              </section>
            ))}
          </>
        )}

        {tab === 'data' && (
          <>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(DATA_LABELS) as DataKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setDataKey(k)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${dataKey === k ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
                >
                  {DATA_LABELS[k]}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">{DATA_LABELS[dataKey]}</h2>
              <button
                className={btnCls}
                onClick={() => {
                  if (window.confirm('Сбросить этот блок к исходным данным?')) {
                    setData({ ...data, [dataKey]: DATA_DEFAULTS[dataKey] as unknown as Json });
                    setDirty(true);
                  }
                }}
              >
                Сбросить блок
              </button>
            </div>
            <ArrayField
              key={dataKey}
              name={dataKey}
              label="Элементы"
              value={(data[dataKey] as Json[]) ?? []}
              onChange={(v) => { setData({ ...data, [dataKey]: v }); setDirty(true); }}
            />
          </>
        )}
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-100 font-sans text-slate-900">{children}</div>;
}
