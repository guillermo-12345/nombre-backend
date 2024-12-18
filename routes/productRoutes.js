const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', async (req, res) => {
  try {
    console.log('[ProductRoute] Attempting to fetch products');
    
    const products = await ProductModel.findAll({
      attributes: ['id', 'title', 'description', 'price', 'category', 'stock', 'img']
    });

    console.log(`[ProductRoute] Successfully fetched ${products.length} products`);
    
    return res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('[ProductRoute] Error fetching products:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      details: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
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

