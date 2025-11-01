import prisma from '../src/config/prisma.js';

/**
 * Скрипт для инициализации базы данных тестовыми данными
 */
async function initDatabase() {
  try {
    console.log('🔄 Инициализация базы данных...');

    // Создаем тестовых участников
    const participants = await Promise.all([
      prisma.participant.upsert({
        where: { username: 'SkyRacer' },
        update: {},
        create: {
          username: 'SkyRacer',
          avatar: '🚁',
          rating: 1540,
          wins: 12,
          losses: 3,
          draws: 1
        }
      }),
      prisma.participant.upsert({
        where: { username: 'DroneMaster' },
        update: {},
        create: {
          username: 'DroneMaster',
          avatar: '⚡',
          rating: 1420,
          wins: 8,
          losses: 5,
          draws: 2
        }
      }),
      prisma.participant.upsert({
        where: { username: 'ArcticFlyer' },
        update: {},
        create: {
          username: 'ArcticFlyer',
          avatar: '❄️',
          rating: 1380,
          wins: 6,
          losses: 4,
          draws: 0
        }
      })
    ]);

    console.log(`✅ Создано/обновлено ${participants.length} участников`);

    // Создаем тестовые события
    const events = await Promise.all([
      prisma.event.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
          id: '00000000-0000-0000-0000-000000000001',
          title: 'Гонка дронов 2024',
          description: 'Главное событие сезона',
          eventDate: new Date('2024-06-15'),
          location: 'Якутск, стадион "Туймаада"',
          status: 'registration_open',
          registrationOpen: true
        }
      }),
      prisma.event.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' },
        update: {},
        create: {
          id: '00000000-0000-0000-0000-000000000002',
          title: 'Чемпионат Якутии',
          description: 'Региональный чемпионат',
          eventDate: new Date('2024-07-20'),
          location: 'Нерюнгри, парк культуры',
          status: 'registration_open',
          registrationOpen: true
        }
      }),
      prisma.event.upsert({
        where: { id: '00000000-0000-0000-0000-000000000003' },
        update: {},
        create: {
          id: '00000000-0000-0000-0000-000000000003',
          title: 'Кубок Севера',
          description: 'Соревнование среди северных регионов',
          eventDate: new Date('2024-08-25'),
          location: 'Мирный, аэродром',
          status: 'preparation',
          registrationOpen: false
        }
      })
    ]);

    console.log(`✅ Создано/обновлено ${events.length} событий`);

    // Создаем тестовые новости
    const news = await Promise.all([
      prisma.news.upsert({
        where: { id: '00000000-0000-0000-0000-000000000010' },
        update: {},
        create: {
          id: '00000000-0000-0000-0000-000000000010',
          title: 'Новый сезон гонок',
          content: 'Открытие сезона 2024 состоится 15 июня. Мы рады приветствовать всех участников!',
          excerpt: 'Открытие сезона 2024 состоится 15 июня...',
          published: true,
          publishedAt: new Date()
        }
      }),
      prisma.news.upsert({
        where: { id: '00000000-0000-0000-0000-000000000011' },
        update: {},
        create: {
          id: '00000000-0000-0000-0000-000000000011',
          title: 'Набор участников',
          content: 'Объявляем набор новых участников в федерацию. Присоединяйтесь к нашему сообществу!',
          excerpt: 'Объявляем набор новых участников в федерацию...',
          published: true,
          publishedAt: new Date()
        }
      })
    ]);

    console.log(`✅ Создано/обновлено ${news.length} новостей`);

    console.log('✅ База данных успешно инициализирована!');
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();

