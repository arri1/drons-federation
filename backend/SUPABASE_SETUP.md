# Получение ключей Supabase

## Пошаговая инструкция:

### 1. Создайте проект (если еще не создан)
1. Перейдите на [https://supabase.com](https://supabase.com)
2. Нажмите "Start your project" или войдите в существующий аккаунт
3. Создайте новый проект:
   - Выберите организацию
   - Введите имя проекта (например, "drons-federation")
   - Выберите регион (ближайший к вам)
   - Установите пароль для базы данных (сохраните его!)
   - Дождитесь создания проекта (2-3 минуты)

### 2. Получите API ключи
1. В панели управления проекта перейдите в **Settings** (Настройки)
2. Выберите раздел **API**
3. Скопируйте следующие значения:

   - **Project URL** → `SUPABASE_URL`
     ```
     https://xxxxxxxxxxxxx.supabase.co
     ```
   
   - **anon public** key → `SUPABASE_ANON_KEY`
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
     ⚠️ **ВАЖНО**: Service Role Key имеет полный доступ к БД, не публикуйте его!

### 3. Получите Connection String для PostgreSQL
1. В том же проекте перейдите в **Settings** → **Database**
2. Найдите раздел **Connection string**
3. Выберите вкладку **URI**
4. Скопируйте connection string и замените `[YOUR-PASSWORD]` на пароль, который вы установили при создании проекта:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
   → Это значение для `DATABASE_URL`

### 4. Обновите .env файл
Добавьте или обновите следующие строки в `backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Используйте Supabase PostgreSQL вместо локального
DATABASE_URL=postgresql://postgres:your_password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres?schema=public
```

### 5. Примените миграции Prisma к Supabase
```bash
cd backend
npm run prisma:migrate
```

### 6. Инициализируйте базу данных (опционально)
```bash
npm run init:db
```

## Полезные ссылки:
- [Документация Supabase](https://supabase.com/docs)
- [API Keys документация](https://supabase.com/docs/guides/api/api-keys)
- [Database Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)

