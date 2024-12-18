const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', async (req, res, next) => {
  try {
    console.log('[ProductRoutes] Attempting to fetch all products');
    await productController.getAllProducts(req, res);
  } catch (error) {
    console.error('[ProductRoutes] Error in GET /:', error);
    next(error);
  }
});

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

