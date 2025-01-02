import pool from './db';

async function setupDatabase() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

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
        agent_id VARCHAR(50) NOT NULL,
        agent_name VARCHAR(100) NOT NULL,
        agent_email VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create images table
    await client.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(id),
        image_url VARCHAR(255) NOT NULL
      )
    `);

    // Add a trigger to update the updated_at timestamp
    await client.query(`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = now();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
      CREATE TRIGGER update_properties_modtime
      BEFORE UPDATE ON properties
      FOR EACH ROW
      EXECUTE FUNCTION update_modified_column();
    `);

    await client.query('COMMIT');
    console.log('Database setup completed successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error setting up database:', e);
  } finally {
    client.release();
  }
}

setupDatabase().finally(() => pool.end());

