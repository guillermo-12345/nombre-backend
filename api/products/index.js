import { getAllProducts, getProductById } from '../../lib/db';
import cors from 'cors';
import { runMiddleware } from '../../lib/middleware';

const corsMiddleware = cors({
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export default async function handler(req, res) {
  try {
    // Run the CORS middleware
    await runMiddleware(req, res, corsMiddleware);

    // Log the request
    console.log(`Products API accessed: ${req.method} ${req.url}`);

    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const product = await getProductById(req.query.id);
          if (product) {
            res.status(200).json(product);
          } else {
            res.status(404).json({ error: 'Product not found' });
          }
        } else {
          const products = await getAllProducts();
          res.status(200).json(products);
        }
        break;
      
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

