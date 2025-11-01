import { supabaseAdmin } from '../src/config/supabase.js';

/**
 * Скрипт для инициализации базы данных тестовыми данными через Supabase
 */
async function initDatabase() {
  if (!supabaseAdmin) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY не настроен в .env');
    process.exit(1);
  }

  try {
    console.log('🔄 Инициализация базы данных через Supabase...');

    // Создаем тестовых участников
    const participantsData = [
      {
        username: 'SkyRacer',
        avatar: '🚁',
        rating: 1540,
        wins: 12,
        losses: 3,
        draws: 1
      },
      {
        username: 'DroneMaster',
        avatar: '⚡',
        rating: 1420,
        wins: 8,
        losses: 5,
        draws: 2
      },
      {
        username: 'ArcticFlyer',
        avatar: '❄️',
        rating: 1380,
        wins: 6,
        losses: 4,
        draws: 0
      }
    ];

    for (const participant of participantsData) {
      const { data, error } = await supabaseAdmin
        .from('participants')
        .upsert(participant, { onConflict: 'username' })
        .select();

      if (error) {
        console.error(`Ошибка при создании участника ${participant.username}:`, error.message);
      }
    }

    console.log(`✅ Создано/обновлено ${participantsData.length} участников`);

    // Создаем тестовые события
    const eventsData = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        title: 'Гонка дронов 2024',
        description: 'Главное событие сезона',
        event_date: '2024-06-15',
        location: 'Якутск, стадион "Туймаада"',
        status: 'registration_open',
        registration_open: true
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        title: 'Чемпионат Якутии',
        description: 'Региональный чемпионат',
        event_date: '2024-07-20',
        location: 'Нерюнгри, парк культуры',
        status: 'registration_open',
        registration_open: true
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        title: 'Кубок Севера',
        description: 'Соревнование среди северных регионов',
        event_date: '2024-08-25',
        location: 'Мирный, аэродром',
        status: 'preparation',
        registration_open: false
      }
    ];

    for (const event of eventsData) {
      const { data, error } = await supabaseAdmin
        .from('events')
        .upsert(event, { onConflict: 'id' })
        .select();

      if (error) {
        console.error(`Ошибка при создании события ${event.title}:`, error.message);
      }
    }

    console.log(`✅ Создано/обновлено ${eventsData.length} событий`);

    // Создаем тестовые новости
    const newsData = [
      {
        id: '00000000-0000-0000-0000-000000000010',
        title: 'Новый сезон гонок',
        content: 'Открытие сезона 2024 состоится 15 июня. Мы рады приветствовать всех участников!',
        excerpt: 'Открытие сезона 2024 состоится 15 июня...',
        published: true,
        published_at: new Date().toISOString()
      },
      {
        id: '00000000-0000-0000-0000-000000000011',
        title: 'Набор участников',
        content: 'Объявляем набор новых участников в федерацию. Присоединяйтесь к нашему сообществу!',
        excerpt: 'Объявляем набор новых участников в федерацию...',
        published: true,
        published_at: new Date().toISOString()
      }
    ];

    for (const news of newsData) {
      const { data, error } = await supabaseAdmin
        .from('news')
        .upsert(news, { onConflict: 'id' })
        .select();

      if (error) {
        console.error(`Ошибка при создании новости ${news.title}:`, error.message);
      }
    }

    console.log(`✅ Создано/обновлено ${newsData.length} новостей`);

    console.log('✅ База данных успешно инициализирована!');
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
    process.exit(1);
  }
}

initDatabase();
