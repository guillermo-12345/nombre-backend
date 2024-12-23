const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); // Importa correctamente el controlador

// Define las rutas con los métodos del controlador
router.get('/', productController.getAllProducts); // Asegúrate de que `getAllProducts` está definido
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
