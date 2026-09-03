const express = require('express');
const router = express.Router();
const { 
  createPresencialSale, 
  getPresencialSalesHistory 
} = require('../controllers/salesController');

// Middleware de autenticación opcional
// const { protect, adminOrStaff } = require('../middleware/authMiddleware');

router.route('/presencial')
  .post(/* protect, adminOrStaff, */ createPresencialSale)
  .get(/* protect, adminOrStaff, */ getPresencialSalesHistory);

module.exports = router;    