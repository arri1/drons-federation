# Настройка Supabase ключей

✅ **Уже настроено:**
- SUPABASE_URL: https://vvraqgfnvlczwbaxywmz.supabase.co
- SUPABASE_ANON_KEY: настроен

## Что нужно добавить:

### 1. Service Role Key

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект: `vvraqgfnvlczwbaxywmz`
3. Перейдите в **Settings** → **API**
4. Найдите секцию **Project API keys**
5. Скопируйте **service_role** key (Secret key)
6. Обновите в `.env`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
   ```

### 2. Database Connection String

1. В том же проекте перейдите в **Settings** → **Database**
2. Найдите секцию **Connection string**
3. Выберите вкладку **URI**
4. Скопируйте connection string
5. Замените `[YOUR-PASSWORD]` на пароль, который вы установили при создании проекта
6. Обновите в `.env`:
   ```
   DATABASE_URL=postgresql://postgres:ваш_пароль@db.vvraqgfnvlczwbaxywmz.supabase.co:5432/postgres?schema=public
   ```

## После настройки:

1. **Примените миграции Prisma к Supabase:**
   ```bash
   cd backend
   npm run prisma:migrate
   ```

2. **Инициализируйте данные (опционально):**
   ```bash
   npm run init:db
   ```

3. **Перезапустите сервер:**
   ```bash
   npm run dev
   ```

## Важно:

- Service Role Key даёт полный доступ к БД - **не публикуйте его!**
- Пароль БД - это пароль, который вы установили при создании проекта Supabase
- Если забыли пароль, можно сбросить его в настройках проекта

