import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as participantsService from './services/participants.js';
import * as eventsService from './services/events.js';
import * as newsService from './services/news.js';

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

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // Пароль по умолчанию

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password === adminPassword) {
      // Генерируем простой токен (в production лучше использовать JWT)
      const token = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      res.json({ 
        success: true, 
        token,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
    
    if (!token || !token.startsWith('admin_')) {
      return res.status(401).json({ authenticated: false });
    }

    // Простая проверка формата токена
    res.json({ authenticated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

app.post('/api/participants', async (req, res) => {
  try {
    const participant = await participantsService.createParticipant(req.body);
    res.status(201).json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/participants/:id', async (req, res) => {
  try {
    const participant = await participantsService.updateParticipant(req.params.id, req.body);
    res.json(participant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/participants/:id', async (req, res) => {
  try {
    await participantsService.deleteParticipant(req.params.id);
    res.json({ success: true, message: 'Participant deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

app.post('/api/events', async (req, res) => {
  try {
    const event = await eventsService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await eventsService.updateEvent(req.params.id, req.body);
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await eventsService.deleteEvent(req.params.id);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// News routes
app.get('/api/news', async (req, res) => {
  try {
    // Если запрос от админки, возвращаем все новости, иначе только опубликованные
    const admin = req.query.admin === 'true';
    const news = admin 
      ? await newsService.getAllNews() 
      : await newsService.getPublishedNews();
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

app.post('/api/news', async (req, res) => {
  try {
    const news = await newsService.createNews(req.body);
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/news/:id', async (req, res) => {
  try {
    const news = await newsService.updateNews(req.params.id, req.body);
    res.json(news);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await newsService.deleteNews(req.params.id);
    res.json({ success: true, message: 'News deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  console.log(`   Participants:`);
  console.log(`     - GET /api/participants`);
  console.log(`     - GET /api/participants/top`);
  console.log(`     - GET /api/participants/:id`);
  console.log(`     - POST /api/participants`);
  console.log(`     - PUT /api/participants/:id`);
  console.log(`     - DELETE /api/participants/:id`);
  console.log(`   Events:`);
  console.log(`     - GET /api/events`);
  console.log(`     - GET /api/events/upcoming`);
  console.log(`     - GET /api/events/:id`);
  console.log(`     - POST /api/events`);
  console.log(`     - PUT /api/events/:id`);
  console.log(`     - DELETE /api/events/:id`);
  console.log(`   News:`);
  console.log(`     - GET /api/news`);
  console.log(`     - GET /api/news/latest`);
  console.log(`     - GET /api/news/:id`);
  console.log(`     - POST /api/news`);
  console.log(`     - PUT /api/news/:id`);
  console.log(`     - DELETE /api/news/:id`);
});

