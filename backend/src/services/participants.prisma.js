import prisma from '../config/prisma.js';

/**
 * Получить всех участников с сортировкой по рейтингу
 */
export async function getParticipants(orderBy = 'rating', ascending = false) {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: {
        [orderBy]: ascending ? 'asc' : 'desc'
      }
    });

    return participants;
  } catch (error) {
    throw new Error(`Error fetching participants: ${error.message}`);
  }
}

/**
 * Получить топ N участников
 */
export async function getTopParticipants(limit = 10) {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: {
        rating: 'desc'
      },
      take: limit
    });

    // Добавляем rank (позицию в рейтинге)
    return participants.map((participant, index) => ({
      ...participant,
      rank: index + 1
    }));
  } catch (error) {
    throw new Error(`Error fetching top participants: ${error.message}`);
  }
}

/**
 * Получить участника по ID
 */
export async function getParticipantById(id) {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id }
    });

    if (!participant) {
      throw new Error('Participant not found');
    }

    return participant;
  } catch (error) {
    throw new Error(`Error fetching participant: ${error.message}`);
  }
}

/**
 * Создать нового участника
 */
export async function createParticipant(participantData) {
  const { username, avatar, rating, wins, losses, draws } = participantData;

  if (!username) {
    throw new Error('Username is required');
  }

  try {
    const participant = await prisma.participant.create({
      data: {
        username,
        avatar: avatar || '🚁',
        rating: rating || 1000,
        wins: wins || 0,
        losses: losses || 0,
        draws: draws || 0
      }
    });

    return participant;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Username already exists');
    }
    throw new Error(`Error creating participant: ${error.message}`);
  }
}

/**
 * Обновить участника
 */
export async function updateParticipant(id, updates) {
  try {
    const participant = await prisma.participant.update({
      where: { id },
      data: updates
    });

    return participant;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Participant not found');
    }
    throw new Error(`Error updating participant: ${error.message}`);
  }
}

/**
 * Удалить участника
 */
export async function deleteParticipant(id) {
  try {
    await prisma.participant.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    if (error.code === 'P2025') {
      throw new Error('Participant not found');
    }
    throw new Error(`Error deleting participant: ${error.message}`);
  }
}

