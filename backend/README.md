# Backend для Федерации гонок дронов

Бэкенд построен на основе Supabase - Backend-as-a-Service платформы.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Скопируйте `env.example` в `.env` и заполните настройки:
```bash
cp env.example .env
```

3. Настройте Supabase:
   - Создайте проект на [supabase.com](https://supabase.com)
   - Получите ключи из Project Settings > API
   - Добавьте в `.env`:
     - `SUPABASE_URL` - URL вашего проекта
     - `SUPABASE_ANON_KEY` - anon public key
     - `SUPABASE_SERVICE_ROLE_KEY` - service_role key (для админ операций)

4. Создайте таблицы в Supabase:
   - Используйте SQL Editor в Supabase Dashboard
   - Или выполните SQL из файла `database/schema.sql` (если есть)

5. (Опционально) Инициализируйте тестовые данные:
```bash
npm run init:db
```

## Запуск сервера

```bash
npm run dev
```

Сервер запустится на порту, указанном в `PORT` (по умолчанию 3001).

## Структура проекта

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js       # Конфигурация Supabase клиента
│   ├── services/
│   │   ├── participants.js   # Сервис для работы с участниками
│   │   ├── events.js         # Сервис для работы с событиями
│   │   └── news.js           # Сервис для работы с новостями
│   └── index.js              # Express сервер
├── scripts/
│   └── init-db.js            # Скрипт инициализации тестовых данных
├── env.example               # Пример переменных окружения
└── package.json
```

## Использование Supabase

Проект использует Supabase API для всех операций с базой данных:

- **Чтение данных** - через anon key (публичный доступ)
- **Запись данных** - через service_role key (только на сервере)

Supabase автоматически предоставляет REST API для всех таблиц. Вы можете использовать Supabase клиент во фронтенде для доступа к данным напрямую или через Express API.

## API Endpoints

- `GET /health` - проверка работы сервера
- `GET /api/participants` - получить всех участников
- `GET /api/participants/top` - получить топ участников
- `GET /api/participants/:id` - получить участника по ID
- `GET /api/events` - получить все события
- `GET /api/events/upcoming` - получить предстоящие события
- `GET /api/events/:id` - получить событие по ID
- `GET /api/news` - получить все опубликованные новости
- `GET /api/news/latest` - получить последние новости
- `GET /api/news/:id` - получить новость по ID

## Пример использования Supabase клиента

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
)

// Получить участников
const { data, error } = await supabase
  .from('participants')
  .select('*')
  .order('rating', { ascending: false })
```
