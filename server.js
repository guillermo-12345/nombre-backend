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

const allowedOrigins = ['https://equipo1-ecommerce-nuevo.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());


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

// Middleware de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal. Intenta nuevamente.' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Conectar y sincronizar la base de datos
const port = process.env.PORT || 3001;

dbConnection.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
}).catch((error) => {
  console.error('Error al sincronizar la base de datos:', error);
});


module.exports=app