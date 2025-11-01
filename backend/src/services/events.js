import { supabase, supabaseAdmin } from '../config/supabase.js';

/**
 * Получить все события
 */
export async function getEvents(orderBy = 'event_date', ascending = true) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order(orderBy, { ascending });

  if (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }

  return data;
}

/**
 * Получить события по статусу
 */
export async function getEventsByStatus(status) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', status)
    .order('event_date', { ascending: true });

  if (error) {
    throw new Error(`Error fetching events by status: ${error.message}`);
  }

  return data;
}

/**
 * Получить предстоящие события
 */
export async function getUpcomingEvents(limit = 10) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', today)
    .order('event_date', { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching upcoming events: ${error.message}`);
  }

  return data;
}

/**
 * Получить событие по ID
 */
export async function getEventById(id) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching event: ${error.message}`);
  }

  return data;
}

/**
 * Создать новое событие
 */
export async function createEvent(eventData) {
  const { title, description, event_date, event_time, location, status, registration_open, max_participants } = eventData;

  if (!title || !event_date || !location) {
    throw new Error('Title, event_date, and location are required');
  }

  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from('events')
    .insert({
      title,
      description,
      event_date,
      event_time,
      location,
      status: status || 'preparation',
      registration_open: registration_open || false,
      max_participants
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating event: ${error.message}`);
  }

  return data;
}

/**
 * Обновить событие
 */
export async function updateEvent(id, updates) {
  const client = supabaseAdmin || supabase;
  
  const { data, error } = await client
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating event: ${error.message}`);
  }

  return data;
}

/**
 * Удалить событие
 */
export async function deleteEvent(id) {
  const client = supabaseAdmin || supabase;
  
  const { error } = await client
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Error deleting event: ${error.message}`);
  }

  return { success: true };
}

/**
 * Зарегистрировать участника на событие
 */
export async function registerParticipantForEvent(eventId, participantId) {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      participant_id: participantId,
      status: 'registered'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error registering participant: ${error.message}`);
  }

  return data;
}

/**
 * Получить регистрации на событие
 */
export async function getEventRegistrations(eventId) {
  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
      *,
      participants (*)
    `)
    .eq('event_id', eventId);

  if (error) {
    throw new Error(`Error fetching registrations: ${error.message}`);
  }

  return data;
}

