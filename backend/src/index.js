import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as participantsService from './services/participants.prisma.js';
import * as eventsService from './services/events.prisma.js';
import * as newsService from './services/news.prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Participants routes
app.get('/api/participants', async (req, res) => {
  try {
    const participants = await participantsService.getParticipants();
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/participants/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const participants = await participantsService.getTopParticipants(limit);
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/participants/:id', async (req, res) => {
  try {
    const participant = await participantsService.getParticipantById(req.params.id);
    res.json(participant);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Events routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await eventsService.getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/upcoming', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const events = await eventsService.getUpcomingEvents(limit);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await eventsService.getEventById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// News routes
app.get('/api/news', async (req, res) => {
  try {
    const news = await newsService.getPublishedNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/news/latest', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const news = await newsService.getLatestNews(limit);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/news/:id', async (req, res) => {
  try {
    const news = await newsService.getNewsById(req.params.id);
    res.json(news);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 API endpoints:`);
  console.log(`   - GET /api/participants`);
  console.log(`   - GET /api/participants/top`);
  console.log(`   - GET /api/events`);
  console.log(`   - GET /api/events/upcoming`);
  console.log(`   - GET /api/news`);
  console.log(`   - GET /api/news/latest`);
});

