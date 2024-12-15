import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getAllProducts() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products');
    client.release();
    return result.rows;
  } catch (err) {
    console.error('Database error:', err);
    throw new Error('Error fetching products from database');
  }
}

export async function getProductById(id) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    client.release();
    return result.rows[0];
  } catch (err) {
    console.error('Database error:', err);
    throw new Error('Error fetching product from database');
  }
}

