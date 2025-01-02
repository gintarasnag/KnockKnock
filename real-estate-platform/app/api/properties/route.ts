import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM properties')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, price, address, city, lat, lng, beds, baths, sqft, property_type, status, agent_id } = body

    const result = await pool.query(
      'INSERT INTO properties (title, description, price, address, city, lat, lng, beds, baths, sqft, property_type, status, agent_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [title, description, price, address, city, lat, lng, beds, baths, sqft, property_type, status, agent_id]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

