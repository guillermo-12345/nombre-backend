import cors from 'cors';
import { runMiddleware } from '../../lib/middleware';
import { getAllProducts } from '../../lib/db';

const corsMiddleware = cors({
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  try {
    if (req.method === 'GET') {
      const products = await getAllProducts();
      res.status(200).json(products);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in products API:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

