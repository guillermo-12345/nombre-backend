import cors from 'cors';
import { runMiddleware } from '../lib/middleware';

const corsMiddleware = cors({
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export default async function handler(req, res) {
  // Run the CORS middleware
  await runMiddleware(req, res, corsMiddleware);

  // Log the request
  console.log(`Health check accessed: ${new Date().toISOString()}`);

  // Return health status
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
}

