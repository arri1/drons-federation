-- SQL схема для Supabase
-- Выполните этот SQL в Supabase Dashboard -> SQL Editor

-- Таблица участников
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) NOT NULL UNIQUE,
  avatar VARCHAR(50) DEFAULT '🚁',
  rating INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для быстрого поиска по рейтингу
CREATE INDEX IF NOT EXISTS idx_participants_rating ON participants(rating DESC);

-- Таблица событий
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'preparation',
  registration_open BOOLEAN DEFAULT false,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для фильтрации по дате
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date DESC);

-- Таблица новостей
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url VARCHAR(500),
  author VARCHAR(100),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индекс для фильтрации опубликованных новостей
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published, published_at DESC);

-- Таблица регистраций на события
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'registered',
  UNIQUE(event_id, participant_id)
);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) политики
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Политики для participants: все могут читать
CREATE POLICY "Participants are viewable by everyone"
  ON participants FOR SELECT
  USING (true);

-- Политики для events: все могут читать
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Политики для news: все могут читать опубликованные новости
CREATE POLICY "Published news are viewable by everyone"
  ON news FOR SELECT
  USING (published = true);

-- Политики для event_registrations: все могут читать
CREATE POLICY "Event registrations are viewable by everyone"
  ON event_registrations FOR SELECT
  USING (true);

-- Тестовые данные (опционально)
INSERT INTO participants (username, avatar, rating, wins) VALUES
  ('SkyRacer', '🚁', 1540, 12),
  ('DroneMaster', '⚡', 1420, 8),
  ('ArcticFlyer', '❄️', 1380, 6)
ON CONFLICT (username) DO NOTHING;

INSERT INTO events (title, description, event_date, location, status, registration_open) VALUES
  ('Гонка дронов 2024', 'Главное событие сезона', '2024-06-15', 'Якутск, стадион "Туймаада"', 'registration_open', true),
  ('Чемпионат Якутии', 'Региональный чемпионат', '2024-07-20', 'Нерюнгри, парк культуры', 'registration_open', true),
  ('Кубок Севера', 'Соревнование среди северных регионов', '2024-08-25', 'Мирный, аэродром', 'preparation', false)
ON CONFLICT DO NOTHING;

INSERT INTO news (title, content, excerpt, published, published_at) VALUES
  ('Новый сезон гонок', 'Открытие сезона 2024 состоится 15 июня. Мы рады приветствовать всех участников!', 'Открытие сезона 2024 состоится 15 июня...', true, NOW()),
  ('Набор участников', 'Объявляем набор новых участников в федерацию. Присоединяйтесь к нашему сообществу!', 'Объявляем набор новых участников в федерацию...', true, NOW())
ON CONFLICT DO NOTHING;

