import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Database connected successfully!');
    
    const result = await client.query('SELECT username, points FROM participants LIMIT 3');
    console.log('📊 Sample data:', result.rows);
    
    await client.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();