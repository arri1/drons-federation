import express from 'express';
import { dbService } from '../services/databaseService.js';

const router = express.Router();

// Получить топ участников
router.get('/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const participants = await dbService.getTopParticipants(limit);
    res.json(participants);
  } catch (error) {
    console.error('Error in /api/participants/top:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

// Создать участника
router.post('/', async (req, res) => {
  try {
    const participant = await dbService.createParticipant(req.body);
    res.status(201).json(participant);
  } catch (error) {
    console.error('Error in /api/participants POST:', error);
    res.status(500).json({ error: 'Failed to create participant' });
  }
});

// Получить всех участников
router.get('/', async (req, res) => {
  try {
    const participants = await dbService.getTopParticipants(100); // Большой лимит
    res.json(participants);
  } catch (error) {
    console.error('Error in /api/participants:', error);
    res.status(500).json({ error: 'Failed to fetch participants' });
  }
});

export default router;