import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Используем отдельные переменные или connection string
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || 'fgd_database',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres123',
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

export const dbService = {
  // Получить топ участников
  async getTopParticipants(limit = 10) {
    try {
      const result = await pool.query(
        `SELECT * FROM participants 
         ORDER BY points DESC 
         LIMIT $1`,
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Database error in getTopParticipants:', error);
      throw error;
    }
  },

  // Создать участника
  async createParticipant(participantData) {
    try {
      const result = await pool.query(
        `INSERT INTO participants 
         (username, full_name, gender, email, phone, birth_date, location, category, pilot_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          participantData.username,
          participantData.fullName,
          participantData.gender,
          participantData.email,
          participantData.phone,
          participantData.birthDate,
          participantData.location,
          participantData.category || 'Стандарт',
          `PILOT-${Date.now()}`
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Database error in createParticipant:', error);
      throw error;
    }
  },

  // Получить мероприятия
  async getUpcomingEvents() {
    try {
      const result = await pool.query(
        `SELECT * FROM events 
         WHERE event_date >= CURRENT_DATE 
         ORDER BY event_date ASC`
      );
      return result.rows;
    } catch (error) {
      console.error('Database error in getUpcomingEvents:', error);
      throw error;
    }
  },

  // Проверить подключение к базе
  async checkConnection() {
    try {
      const result = await pool.query('SELECT NOW() as current_time');
      return { connected: true, time: result.rows[0].current_time };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
};