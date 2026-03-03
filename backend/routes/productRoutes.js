const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');
const { auth } = require('../middlewares/auth'); // middleware de autenticación

// Crear producto (requiere token)
router.post('/', auth, productController.createProduct);

// Editar producto por código (requiere token)
router.put('/:_id', auth, productController.editProduct);

// Baja lógica (desactivar producto) (requiere token)
router.put('/desactivate/:_id', auth, productController.desactivateProduct);

// Listar productos activos (de la empresa del usuario autenticado)
router.get('/activos', auth, productController.getActiveProducts);

// Listar todos los productos (activos e inactivos) de la empresa
router.get('/', auth, productController.listProducts);

module.exports = router;
