import cors from 'cors';
import { runMiddleware } from '../lib/middleware';

const corsMiddleware = cors({
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  res.status(200).json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
}

