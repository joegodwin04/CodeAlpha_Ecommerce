const Product = require('../models/Product');

/**
 * GET /api/products
 * Returns all products.
 */
const getAllProducts = (req, res) => {
  try {
    const products = Product.findAll();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products. Please try again later.',
    });
  }
};

/**
 * GET /api/products/:id
 * Returns a single product by ID.
 */
const getProductById = (req, res) => {
  try {
    const { id } = req.params;

    // Validate that id is a positive integer
    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID. ID must be a positive number.',
      });
    }

    const product = Product.findById(parseInt(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product. Please try again later.',
    });
  }
};

module.exports = { getAllProducts, getProductById };
