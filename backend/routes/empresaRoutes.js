const express = require('express');
const router = express.Router();
const empresaController = require('../Controllers/empresaController');

// Ruta temporal para pruebas
router.post('/test', empresaController.crearEmpresasPrueba);

module.exports = router;
