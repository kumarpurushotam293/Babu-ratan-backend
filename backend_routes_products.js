// Products routes: list products
const express = require('express');
const router = express.Router();
const Product = require('./backend_model_Product');


/**
 * GET /api/products
 * Public - returns list of sweets
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;