const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
} = require('../controllers/productController');

// GET /api/products          → list all products
router.get('/', getAllProducts);

// GET /api/products/:id      → get single product by ID
router.get('/:id', getProductById);

module.exports = router;
