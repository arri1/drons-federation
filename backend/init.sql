-- Участники
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('Мужской', 'Женский')),
  rank VARCHAR(50) DEFAULT 'Новичок',
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  category VARCHAR(50) DEFAULT 'Стандарт',
  registration_date DATE DEFAULT CURRENT_DATE,
  location VARCHAR(100),
  pilot_id VARCHAR(50) UNIQUE,
  birth_date DATE,
  email VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Мероприятия
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  location VARCHAR(200),
  image_url TEXT,
  max_participants INTEGER,
  registration_open BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Регистрации на мероприятия
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  registration_date TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  UNIQUE(event_id, participant_id)
);

-- Новости
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Вставляем тестовые данные
INSERT INTO participants (username, full_name, gender, points, wins, location, rank) VALUES
('SkyRacer', 'Иванов Алексей', 'Мужской', 1540, 12, 'Якутск', 'Профессионал'),
('DroneMaster', 'Петрова Мария', 'Женский', 1420, 8, 'Нерюнгри', 'Профессионал'),
('ArcticFlyer', 'Сидоров Дмитрий', 'Мужской', 1380, 6, 'Мирный', 'Продвинутый')
ON CONFLICT (username) DO NOTHING;

INSERT INTO events (title, description, event_date, location, max_participants) VALUES
('Гонка дронов 2024', 'Ежегодная гонка дронов в Якутске', '2024-06-15', 'Якутск, стадион "Туймаада"', 50),
('Чемпионат Якутии', 'Региональный чемпионат по гонкам дронов', '2024-07-20', 'Нерюнгри, парк культуры', 30),
('Кубок Севера', 'Кубок северных регионов по дрон-рейсингу', '2024-08-25', 'Мирный, аэродром', 40)
ON CONFLICT DO NOTHING;