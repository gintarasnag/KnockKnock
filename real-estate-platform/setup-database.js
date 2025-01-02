const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function setupDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'AGENT', 'ADMIN')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        lat NUMERIC(8, 6) NOT NULL,
        lng NUMERIC(9, 6) NOT NULL,
        beds INTEGER NOT NULL CHECK (beds >= 0),
        baths NUMERIC(3, 1) NOT NULL CHECK (baths >= 0),
        sqft INTEGER NOT NULL CHECK (sqft >= 0),
        property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('house', 'apartment', 'condo', 'townhouse', 'land')),
        status VARCHAR(20) NOT NULL CHECK (status IN ('FOR_SALE', 'FOR_RENT', 'SOLD', 'PENDING')),
        agent_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create property_images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
        image_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add triggers for updating timestamps
    await client.query(`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = now();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Add triggers to all tables
    const tables = ['users', 'properties', 'property_images'];
    for (const table of tables) {
      await client.query(`
        DROP TRIGGER IF EXISTS update_${table}_modtime ON ${table};
        CREATE TRIGGER update_${table}_modtime
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_modified_column();
      `);
    }

    await client.query('COMMIT');
    console.log('Database setup completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error setting up database:', e);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();

