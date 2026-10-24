-- Выполните целиком в Supabase: SQL Editor -> New query -> Run
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Читать контент может любой посетитель сайта
create policy "site_content public read"
  on public.site_content for select
  using (true);

-- Менять контент может только вошедший пользователь (админ)
create policy "site_content admin insert"
  on public.site_content for insert
  to authenticated
  with check (true);

create policy "site_content admin update"
  on public.site_content for update
  to authenticated
  using (true) with check (true);
