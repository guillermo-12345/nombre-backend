const Product = require('../models/Product');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  const { category } = req.query;

  try {
    console.log('Fetching products. Category:', category);
    console.log('Request headers:', req.headers);
    
    let products;

    if (category) {
      products = await Product.findAll({ where: { category } });
    } else {
      products = await Product.findAll();
    }

    console.log('Products fetched:', products.length);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products', details: error.message });
  }
};



// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error obteniendo el producto:', error);
    res.status(500).json({ error: 'Error obteniendo el producto' });
  }
};

// Crear un producto
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};


// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Obtener productos por categoría y proveedor
exports.getProductsByCategoryAndSupplier = async (req, res) => {
  const { category, supplierId } = req.query;

  try {
    // Buscar productos que coincidan con la categoría y el proveedor
    const products = await Product.findAll({
      where: {
        category: category,
        supplierId: supplierId
      }
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


exports.getProductsByCategory = async (req, res) => {
  const { category } = req.query;
  try {
    const products = await Product.findAll({ where: { category } });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  }
};

