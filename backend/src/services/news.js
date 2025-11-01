import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * Получить все опубликованные новости
 */
export async function getPublishedNews(orderBy = 'published_at', ascending = false) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order(orderBy, { ascending });

  if (error) {
    throw new Error(`Error fetching news: ${error.message}`);
  }

  return data;
}

/**
 * Получить последние новости
 */
export async function getLatestNews(limit = 10) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching latest news: ${error.message}`);
  }

  return data;
}

/**
 * Получить все новости (включая неопубликованные) - требует админ права
 */
export async function getAllNews() {
  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching all news: ${error.message}`);
  }

  return data;
}

/**
 * Получить новость по ID
 */
export async function getNewsById(id) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error) {
    throw new Error(`Error fetching news: ${error.message}`);
  }

  return data;
}

/**
 * Создать новую новость
 */
export async function createNews(newsData) {
  const { title, content, excerpt, image_url, author } = newsData;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from('news')
    .insert({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200),
      image_url,
      author,
      published: false
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating news: ${error.message}`);
  }

  return data;
}

/**
 * Обновить новость
 */
export async function updateNews(id, updates) {
  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from('news')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating news: ${error.message}`);
  }

  return data;
}

/**
 * Опубликовать новость
 */
export async function publishNews(id) {
  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from('news')
    .update({
      published: true,
      published_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error publishing news: ${error.message}`);
  }

  return data;
}

/**
 * Удалить новость
 */
export async function deleteNews(id) {
  const client = supabaseAdmin || supabase;
  
  const { error } = await client
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting news: ${error.message}`);
  }

  return { success: true };
}

