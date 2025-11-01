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

3. Настройте базу данных:

   **Вариант 1: Локальный PostgreSQL через Docker (рекомендуется для разработки)**
   ```bash
   # Запустите PostgreSQL в Docker
   docker-compose up -d
   
   # Примените миграции Prisma
   npm run prisma:migrate
   ```

   **Вариант 2: Supabase PostgreSQL**
   - Создайте проект на [supabase.com](https://supabase.com)
   - Получите connection string из Project Settings > Database > Connection string
   - Добавьте `DATABASE_URL` в `.env`
   - Примените миграции: `npm run prisma:migrate`

4. Сгенерируйте Prisma клиент:
```bash
npm run prisma:generate
```

## Запуск сервера

```bash
npm run dev
```

Сервер запустится на порту, указанном в `PORT` (по умолчанию 3001).

## Работа с базой данных

### Prisma команды

- `npm run prisma:generate` - Сгенерировать Prisma клиент
- `npm run prisma:migrate` - Создать и применить миграцию
- `npm run prisma:studio` - Открыть Prisma Studio (GUI для БД)
- `npm run prisma:push` - Синхронизировать схему с БД без миграций

### Docker команды

- `docker-compose up -d` - Запустить PostgreSQL
- `docker-compose down` - Остановить PostgreSQL
- `docker-compose logs postgres` - Просмотр логов PostgreSQL

## Структура проекта

```
backend/
├── src/
│   ├── config/
│   │   ├── supabase.js       # Конфигурация Supabase клиента
│   │   └── prisma.js         # Конфигурация Prisma клиента
│   ├── services/
│   │   ├── participants.js   # Сервис для работы с участниками (Supabase)
│   │   ├── participants.prisma.js  # Сервис для работы с участниками (Prisma)
│   │   ├── events.js         # Сервис для работы с событиями (Supabase)
│   │   ├── events.prisma.js  # Сервис для работы с событиями (Prisma)
│   │   ├── news.js           # Сервис для работы с новостями (Supabase)
│   │   └── news.prisma.js    # Сервис для работы с новостями (Prisma)
│   └── index.js              # Express сервер (опционально)
├── prisma/
│   └── schema.prisma         # Prisma схема базы данных
├── docker-compose.yml        # Docker конфигурация для PostgreSQL
├── env.example               # Пример переменных окружения
└── package.json
```

## Использование Prisma vs Supabase

Проект поддерживает оба подхода:

- **Supabase сервисы** (`*.js`) - для работы напрямую с Supabase API
- **Prisma сервисы** (`*.prisma.js`) - для работы через Prisma ORM с любой PostgreSQL БД

Вы можете использовать любой из подходов в зависимости от ваших потребностей.

## API Endpoints

Supabase автоматически предоставляет REST API для всех таблиц. Используйте Supabase клиент во фронтенде для доступа к данным.

Пример:
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

