import prisma from '../config/prisma.js';

/**
 * Получить все опубликованные новости
 */
export async function getPublishedNews(orderBy = 'publishedAt', ascending = false) {
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: {
        [orderBy]: ascending ? 'asc' : 'desc'
      }
    });

    return news;
  } catch (error) {
    throw new Error(`Error fetching news: ${error.message}`);
  }
}

/**
 * Получить последние новости
 */
export async function getLatestNews(limit = 10) {
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    });

    return news;
  } catch (error) {
    throw new Error(`Error fetching latest news: ${error.message}`);
  }
}

/**
 * Получить все новости (включая неопубликованные) - требует админ права
 */
export async function getAllNews() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return news;
  } catch (error) {
    throw new Error(`Error fetching all news: ${error.message}`);
  }
}

/**
 * Получить новость по ID
 */
export async function getNewsById(id) {
  try {
    const news = await prisma.news.findFirst({
      where: {
        id,
        published: true
      }
    });

    if (!news) {
      throw new Error('News not found or not published');
    }

    return news;
  } catch (error) {
    throw new Error(`Error fetching news: ${error.message}`);
  }
}

/**
 * Создать новую новость
 */
export async function createNews(newsData) {
  const { title, content, excerpt, image_url, author } = newsData;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  try {
    const news = await prisma.news.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200),
        imageUrl: image_url,
        author,
        published: false
      }
    });

    return news;
  } catch (error) {
    throw new Error(`Error creating news: ${error.message}`);
  }
}

/**
 * Обновить новость
 */
export async function updateNews(id, updates) {
  try {
    // Преобразуем поля если нужно
    const data = { ...updates };
    if (updates.image_url !== undefined) {
      data.imageUrl = updates.image_url;
      delete data.image_url;
    }

    const news = await prisma.news.update({
      where: { id },
      data
    });

    return news;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('News not found');
    }
    throw new Error(`Error updating news: ${error.message}`);
  }
}

/**
 * Опубликовать новость
 */
export async function publishNews(id) {
  try {
    const news = await prisma.news.update({
      where: { id },
      data: {
        published: true,
        publishedAt: new Date()
      }
    });

    return news;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('News not found');
    }
    throw new Error(`Error publishing news: ${error.message}`);
  }
}

/**
 * Удалить новость
 */
export async function deleteNews(id) {
  try {
    await prisma.news.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('News not found');
    }
    throw new Error(`Error deleting news: ${error.message}`);
  }
}

