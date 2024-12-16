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

// Logging middleware
// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS configuration
app.use(cors({
  origin: 'https://equipo1-ecommerce-nuevo.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parser middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await require('./config/db').testConnection();
    res.status(200).json({ 
      status: isConnected ? 'OK' : 'Error',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Health] Error:', error);
    res.status(500).json({ 
      status: 'Error',
      error: error.message,
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

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server] Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 3001;
      app.listen(PORT, () => {
        console.log(`[Server] Running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('[Server] Startup error:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;