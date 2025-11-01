# Создание таблиц в Supabase

## Проблема
Ошибка: `Could not find the table 'public.participants' in the schema cache`

Это означает, что таблицы еще не созданы в Supabase.

## Решение

### Вариант 1: Через SQL Editor (рекомендуется)

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект: `vvraqgfnvlczwbaxywmz`
3. Перейдите в **SQL Editor** в левом меню
4. Нажмите **New query**
5. Скопируйте весь код из файла `database/schema.sql`
6. Вставьте в SQL Editor
7. Нажмите **Run** (или Ctrl+Enter)
8. Дождитесь успешного выполнения

### Вариант 2: Через Table Editor

1. В Supabase Dashboard перейдите в **Table Editor**
2. Создайте каждую таблицу вручную:
   - `participants`
   - `events`
   - `news`
   - `event_registrations`

Это займет больше времени, но вы сможете увидеть структуру таблиц визуально.

## Проверка

После создания таблиц проверьте:

```bash
curl http://localhost:3001/api/participants/top?limit=3
```

Должен вернуться список участников вместо ошибки.

## Альтернатива: Использовать init-db.js

После создания таблиц через SQL, вы можете инициализировать тестовые данные:

```bash
cd backend
node scripts/init-db.js
```

Примечание: Скрипт `init-db.js` требует, чтобы таблицы уже существовали в Supabase.

