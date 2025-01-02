const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: 'postgres', // Connect to the default 'postgres' database
});

async function createDatabase() {
  try {
    await client.connect();
    await client.query('CREATE DATABASE real_estate_platform');
    console.log('Database created successfully');
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDatabase();

