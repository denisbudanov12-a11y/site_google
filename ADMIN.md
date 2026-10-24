# Админка сайта

Адрес админки: `https://ВАШ-САЙТ/#/admin`

## Настройка (один раз, ~10 минут)
1. Зарегистрируйтесь на supabase.com и создайте проект (New project, бесплатный тариф).
2. SQL Editor -> New query -> вставьте содержимое `supabase-setup.sql` -> Run.
3. **Отключите регистрацию посторонних:** Authentication -> Sign In / Providers -> Email ->
   выключите «Allow new users to sign up». Без этого любой сможет создать аккаунт и править сайт.
4. Authentication -> Users -> Add user -> Create new user: введите свой email и пароль
   (поставьте галочку Auto Confirm User). Это ваш логин и пароль для админки.
5. Project Settings -> API: скопируйте `Project URL` и ключ `anon public`.
6. В Netlify: Site configuration -> Environment variables -> добавьте
   `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`, затем Deploys -> Trigger deploy -> Clear cache and deploy.
   (Локально: скопируйте `.env.example` в `.env.local` и заполните.)

## Использование
Откройте `/#/admin`, войдите, правьте тексты и данные блоков, нажмите «Сохранить».
Правки применяются сразу, пересборка сайта не нужна.
