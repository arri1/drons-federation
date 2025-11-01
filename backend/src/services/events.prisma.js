import prisma from '../config/prisma.js';

/**
 * Получить все события
 */
export async function getEvents(orderBy = 'eventDate', ascending = true) {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        [orderBy]: ascending ? 'asc' : 'desc'
      }
    });

    return events;
  } catch (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }
}

/**
 * Получить события по статусу
 */
export async function getEventsByStatus(status) {
  try {
    const events = await prisma.event.findMany({
      where: { status },
      orderBy: {
        eventDate: 'asc'
      }
    });

    return events;
  } catch (error) {
    throw new Error(`Error fetching events by status: ${error.message}`);
  }
}

/**
 * Получить предстоящие события
 */
export async function getUpcomingEvents(limit = 10) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const events = await prisma.event.findMany({
      where: {
        eventDate: {
          gte: today
        }
      },
      orderBy: {
        eventDate: 'asc'
      },
      take: limit
    });

    return events;
  } catch (error) {
    throw new Error(`Error fetching upcoming events: ${error.message}`);
  }
}

/**
 * Получить событие по ID
 */
export async function getEventById(id) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        eventRegistrations: {
          include: {
            participant: true
          }
        }
      }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  } catch (error) {
    throw new Error(`Error fetching event: ${error.message}`);
  }
}

/**
 * Создать новое событие
 */
export async function createEvent(eventData) {
  const { title, description, event_date, event_time, location, status, registration_open, max_participants } = eventData;

  if (!title || !event_date || !location) {
    throw new Error('Title, event_date, and location are required');
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(event_date),
        eventTime: event_time ? new Date(event_time) : null,
        location,
        status: status || 'preparation',
        registrationOpen: registration_open || false,
        maxParticipants: max_participants
      }
    });

    return event;
  } catch (error) {
    throw new Error(`Error creating event: ${error.message}`);
  }
}

/**
 * Обновить событие
 */
export async function updateEvent(id, updates) {
  try {
    // Преобразуем поля если нужно
    const data = { ...updates };
    if (updates.event_date) {
      data.eventDate = new Date(updates.event_date);
      delete data.event_date;
    }
    if (updates.event_time) {
      data.eventTime = new Date(updates.event_time);
      delete data.event_time;
    }
    if (updates.registration_open !== undefined) {
      data.registrationOpen = updates.registration_open;
      delete data.registration_open;
    }
    if (updates.max_participants !== undefined) {
      data.maxParticipants = updates.max_participants;
      delete data.max_participants;
    }

    const event = await prisma.event.update({
      where: { id },
      data
    });

    return event;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Event not found');
    }
    throw new Error(`Error updating event: ${error.message}`);
  }
}

/**
 * Удалить событие
 */
export async function deleteEvent(id) {
  try {
    await prisma.event.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Event not found');
    }
    throw new Error(`Error deleting event: ${error.message}`);
  }
}

/**
 * Зарегистрировать участника на событие
 */
export async function registerParticipantForEvent(eventId, participantId) {
  try {
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        participantId,
        status: 'registered'
      },
      include: {
        participant: true,
        event: true
      }
    });

    return registration;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Participant is already registered for this event');
    }
    throw new Error(`Error registering participant: ${error.message}`);
  }
}

/**
 * Получить регистрации на событие
 */
export async function getEventRegistrations(eventId) {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      include: {
        participant: true
      }
    });

    return registrations;
  } catch (error) {
    throw new Error(`Error fetching registrations: ${error.message}`);
  }
}

