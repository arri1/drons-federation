import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * Получить всех участников с сортировкой по рейтингу
 */
export async function getParticipants(orderBy = 'rating', ascending = false) {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .order(orderBy, { ascending });

  if (error) {
    throw new Error(`Error fetching participants: ${error.message}`);
  }

  return data;
}

/**
 * Получить топ N участников
 */
export async function getTopParticipants(limit = 10) {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching top participants: ${error.message}`);
  }

  // Добавляем rank (позицию в рейтинге)
  return data.map((participant, index) => ({
    ...participant,
    rank: index + 1
  }));
}

/**
 * Получить участника по ID
 */
export async function getParticipantById(id) {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching participant: ${error.message}`);
  }

  return data;
}

/**
 * Создать нового участника
 */
export async function createParticipant(participantData) {
  const { username, avatar, rating, wins, losses, draws } = participantData;

  if (!username) {
    throw new Error('Username is required');
  }

  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from('participants')
    .insert({
      username,
      avatar: avatar || '🚁',
      rating: rating || 1000,
      wins: wins || 0,
      losses: losses || 0,
      draws: draws || 0
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating participant: ${error.message}`);
  }

  return data;
}

/**
 * Обновить участника
 */
export async function updateParticipant(id, updates) {
  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from('participants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating participant: ${error.message}`);
  }

  return data;
}

/**
 * Удалить участника
 */
export async function deleteParticipant(id) {
  const client = supabaseAdmin || supabase;
  
  const { error } = await client
    .from('participants')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting participant: ${error.message}`);
  }

  return { success: true };
}

