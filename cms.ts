// Минимальный клиент Supabase через REST (без внешних библиотек).
const URL_ = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const cmsConfigured = Boolean(URL_ && KEY);

export interface Overrides {
  texts: Record<string, string>;
  data: Record<string, unknown>;
}

const CACHE_KEY = 'cms-cache-v1';
const SESSION_KEY = 'cms-session-v1';

export function readCache(): Overrides | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Overrides) : null;
  } catch {
    return null;
  }
}

function writeCache(o: Overrides) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(o));
  } catch {
    /* ignore */
  }
}

export async function fetchOverrides(): Promise<Overrides> {
  const res = await fetch(`${URL_}/rest/v1/site_content?select=key,value`, {
    headers: { apikey: KEY!, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`Не удалось загрузить контент (${res.status})`);
  const rows = (await res.json()) as { key: string; value: unknown }[];
  const out: Overrides = { texts: {}, data: {} };
  for (const r of rows) {
    if (r.key === 'texts' && r.value && typeof r.value === 'object') out.texts = r.value as Record<string, string>;
    if (r.key === 'data' && r.value && typeof r.value === 'object') out.data = r.value as Record<string, unknown>;
  }
  writeCache(out);
  return out;
}

// ---------- Авторизация ----------
interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
  email: string;
}

function saveSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

async function tokenRequest(grant: 'password' | 'refresh_token', body: Record<string, string>): Promise<Session> {
  const res = await fetch(`${URL_}/auth/v1/token?grant_type=${grant}`, {
    method: 'POST',
    headers: { apikey: KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      json?.error_code === 'invalid_credentials' || res.status === 400
        ? 'Неверный email или пароль'
        : json?.msg || json?.error_description || `Ошибка входа (${res.status})`,
    );
  }
  const s: Session = {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (json.expires_in ?? 3600),
    email: json.user?.email ?? body.email ?? '',
  };
  saveSession(s);
  return s;
}

export async function signIn(email: string, password: string) {
  return tokenRequest('password', { email, password });
}

export function signOut() {
  saveSession(null);
}

export async function getSession(): Promise<Session | null> {
  const s = loadSession();
  if (!s) return null;
  if (s.expires_at - 60 > Date.now() / 1000) return s;
  try {
    const n = await tokenRequest('refresh_token', { refresh_token: s.refresh_token });
    return { ...n, email: n.email || s.email };
  } catch {
    saveSession(null);
    return null;
  }
}

export async function saveOverrides(o: Overrides): Promise<void> {
  const s = await getSession();
  if (!s) throw new Error('Сессия истекла, войдите заново');
  const now = new Date().toISOString();
  const res = await fetch(`${URL_}/rest/v1/site_content?on_conflict=key`, {
    method: 'POST',
    headers: {
      apikey: KEY!,
      Authorization: `Bearer ${s.access_token}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify([
      { key: 'texts', value: o.texts, updated_at: now },
      { key: 'data', value: o.data, updated_at: now },
    ]),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Не удалось сохранить (${res.status}) ${t}`.trim());
  }
  writeCache(o);
}
