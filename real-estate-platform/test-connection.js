const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL');
    await client.release();
    await pool.end();
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

testConnection();

