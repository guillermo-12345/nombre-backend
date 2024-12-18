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

// Logging middleware for product routes
router.use((req, res, next) => {
  console.log(`[ProductRoutes] ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
});

// Get all products
router.get('/', async (req, res, next) => {
  try {
    await getAllProducts(req, res);
  } catch (error) {
    console.error('[ProductRoutes] Error:', error);
    next(error);
  }
});


module.exports = router;