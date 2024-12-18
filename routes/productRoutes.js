const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Logging middleware for product routes
router.use((req, res, next) => {
  console.log(`[ProductRoutes] ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
});

// Get all products
router.get('/', productController.getAllProducts);

// Get products by category and supplier
router.get('/by-category-and-supplier', productController.getProductsByCategoryAndSupplier);

// Get products by category
router.get('/by-category', productController.getProductsByCategory);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create a new product
router.post('/', productController.createProduct);

// Update a product
router.put('/:id', productController.updateProduct);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;

