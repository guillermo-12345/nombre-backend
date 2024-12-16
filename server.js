const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoute');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const clientRoutes = require('./routes/clientRoutes');
const profileRoutes = require('./routes/profileRoutes');
const emailRoutes = require('./routes/emailRoutes');
const purchaseRoutes = require('./routes/purchasesRoutes');
const { dbConnection } = require('./config/db');
require('dotenv').config();

// Inicializar express
const app = express();

// Enhanced logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} completed in ${duration}ms with status ${res.statusCode}`);
  });
  
  next();
});

// CORS configuration
app.use(cors({
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Enhanced health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await testConnection();
    const dbStatus = isConnected ? 'Connected' : 'Disconnected';
    
    res.status(200).json({
      status: isConnected ? 'OK' : 'Degraded',
      timestamp: new Date().toISOString(),
      dbStatus,
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || 'unknown'
    });
  } catch (error) {
    console.error('[Health] Check failed:', error);
    res.status(500).json({
      status: 'Error',
      timestamp: new Date().toISOString(),
      error: error.message,
      dbStatus: 'Error'
    });
  }
});

// Database status middleware
app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }

  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database is not connected');
    }
    next();
  } catch (error) {
    console.error('[Database] Middleware check failed:', error);
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Database connection is not available',
      timestamp: new Date().toISOString()
    });
  }
});


// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas CRUD
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/email', emailRoutes);

// Ruta inicial
app.get('/', (req, res) => res.send('Servidor corriendo...'));

a
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server] Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Server initialization
const startServer = async () => {
  try {
    // Initialize database with retries
    await initializeDatabase();
    
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 3001;
      app.listen(PORT, () => {
        console.log(`[Server] Running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
};

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;