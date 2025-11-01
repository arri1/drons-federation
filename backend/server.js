import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbService } from './services/databaseService.js';
import participantRoutes from './routes/participants.js';

dotenv.config();

console.log('🔧 Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Проверка подключения к базе
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await dbService.checkConnection();
    const participants = await dbService.getTopParticipants(1);
    
    res.json({ 
      status: 'OK', 
      database: dbStatus.connected ? 'connected' : 'disconnected',
      database_time: dbStatus.time,
      participants_count: participants.length,
      message: 'API is working correctly'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Основной маршрут
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ФГД Website API is working!',
    database: 'PostgreSQL',
    version: '1.0',
    endpoints: [
      '/api/health',
      '/api/participants',
      '/api/participants/top',
      '/api/events'
    ]
  });
});

// Подключаем маршруты
app.use('/api/participants', participantRoutes);

// Маршрут для мероприятий
app.get('/api/events', async (req, res) => {
  try {
    const events = await dbService.getUpcomingEvents();
    res.json(events);
  } catch (error) {
    console.error('Error in /api/events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// 404 обработчик
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Main API: http://localhost:${PORT}/api`);
  console.log(`👥 Participants: http://localhost:${PORT}/api/participants`);
});