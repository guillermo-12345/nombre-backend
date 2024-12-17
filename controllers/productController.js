const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    console.log('[ProductController] Fetching products');
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

    return res.status(200).json(products);
  } catch (error) {
    console.error('[ProductController] Error:', error);
    return res.status(500).json({
      error: 'Error fetching products',
      message: error.message
    });
  }
};

