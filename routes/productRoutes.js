const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// --- CATEGORY ROUTES ---

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a category (for seeding/admin)
router.post('/categories', async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// --- PRODUCT ROUTES ---

// Get all products (with optional filters for category, brand, or fitment)
router.get('/products', async (req, res) => {
  try {
    const { category, brand, fitment } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (fitment) filter.fitment = fitment;

    const products = await Product.find(filter).populate('category');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single product by slug
router.get('/products/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a product (for seeding/inventory management)
router.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;