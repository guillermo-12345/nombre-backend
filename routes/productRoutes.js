const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ruta para obtener productos por categoría y proveedor
router.get('/by-category-and-supplier', productController.getProductsByCategoryAndSupplier);

// Ruta para obtener productos por categoría
router.get('/by-category', productController.getProductsByCategory);

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


// Middleware to log requests
router.use((req, res, next) => {
    console.log(`[Products] ${req.method} ${req.url} at ${new Date().toISOString()}`);
    console.log('Query:', req.query);
    next();
  });
  
  // Get all products
  router.get('/', async (req, res, next) => {
    try {
      await productController.getAllProducts(req, res);
    } catch (error) {
      console.error('Error in GET /products:', error);
      next(error);
    }
  });
  
  router.get('/:id', async (req, res, next) => {
    try {
      await productController.getProductById(req, res);
    } catch (error) {
      console.error(`Error in GET /products/${req.params.id}:`, error);
      next(error);
    }
  });
  
  // Error handling middleware specific to products
  router.use((err, req, res, next) => {
    console.error('Products Route Error:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({
      success: false,
      error: 'Product operation failed',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  });

module.exports = router;