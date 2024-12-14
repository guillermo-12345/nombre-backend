const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// Obtener todos los proveedores
router.get('/', supplierController.getSuppliers);

// Obtener un proveedor por ID
router.get('/:id', supplierController.getSupplierById);

// Crear un nuevo proveedor
router.post('/', supplierController.createSupplier);

// Actualizar un proveedor existente
router.put('/:id', supplierController.updateSupplier);

// Eliminar un proveedor
router.delete('/:id', supplierController.deleteSupplier);

module.exports = router;