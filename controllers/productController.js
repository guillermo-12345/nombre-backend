const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    console.log('[ProductController] Fetching all products');
    
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

    console.log(`[ProductController] Found ${products.length} products`);
    
    return res.status(200).json({
      success: true,
      data: products,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[ProductController] Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

