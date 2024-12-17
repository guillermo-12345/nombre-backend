const { Product } = require('../models');
const { testConnection } = require('../config/db');

exports.getAllProducts = async (req, res) => {
  console.log('[ProductController] Starting getAllProducts request');
  
  try {
    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('[ProductController] Database connection test failed');
      return res.status(503).json({
        success: false,
        error: 'Database connection unavailable',
        timestamp: new Date().toISOString()
      });
    }

    console.log('[ProductController] Attempting to fetch products');
    const products = await Product.findAll({
      attributes: [
        'id', 
        'title', 
        'description', 
        'price', 
        'category',
        'stock',
        'img'
      ]
    });

    console.log(`[ProductController] Successfully fetched ${products.length} products`);
    
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[ProductController] Error in getAllProducts:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });

    return res.status(500).json({
      success: false,
      error: 'Error fetching products from database',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

