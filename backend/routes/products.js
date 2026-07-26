const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, brand, search, sort } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
      ];
    }
    
    let products = await Product.find(query);
    
    // Convert MongoDB Maps to plain objects for JSON serialization
    products = products.map(product => ({
      ...product.toObject(),
      colorImages: product.colorImages ? Object.fromEntries(product.colorImages) : {},
      colorSizeStock: product.colorSizeStock ? Object.fromEntries(product.colorSizeStock) : {}
    }));
    
    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else {
      products.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Convert MongoDB Map to plain object for JSON serialization
    const productData = {
      ...product.toObject(),
      colorImages: product.colorImages ? Object.fromEntries(product.colorImages) : {},
      colorSizeStock: product.colorSizeStock ? Object.fromEntries(product.colorSizeStock) : {}
    };
    
    res.json({ product: productData });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    // Clean up placeholder URLs before saving
    let imageToSave = req.body.image;
    if (imageToSave && (imageToSave.includes('placeholder') || imageToSave.includes('via.placeholder'))) {
      console.log('Removing placeholder URL from new product');
      imageToSave = null;
    }
    
    // Convert colorImages and colorSizeStock objects to Map for MongoDB
    const productData = {
      ...req.body,
      image: imageToSave,
      colorImages: req.body.colorImages ? new Map(Object.entries(req.body.colorImages)) : new Map(),
      colorSizeStock: req.body.colorSizeStock ? new Map(Object.entries(req.body.colorSizeStock)) : new Map()
    };
    
    const product = new Product(productData);
    await product.save();
    
    // Convert MongoDB Map back to object for response
    const responseData = {
      ...product.toObject(),
      colorImages: product.colorImages ? Object.fromEntries(product.colorImages) : {},
      colorSizeStock: product.colorSizeStock ? Object.fromEntries(product.colorSizeStock) : {}
    };
    
    console.log('Created product colorImages:', responseData.colorImages);
    
    res.status(201).json({ product: responseData });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('colorImages in request:', req.body.colorImages);
    
    // Clean up placeholder URLs before saving
    let imageToSave = req.body.image;
    if (imageToSave && (imageToSave.includes('placeholder') || imageToSave.includes('via.placeholder'))) {
      console.log('Removing placeholder URL, will use color images or fallback');
      imageToSave = null;
    }
    
    // Convert colorImages and colorSizeStock objects to Map for MongoDB
    const productData = {
      ...req.body,
      image: imageToSave,
      colorImages: req.body.colorImages ? new Map(Object.entries(req.body.colorImages)) : new Map(),
      colorSizeStock: req.body.colorSizeStock ? new Map(Object.entries(req.body.colorSizeStock)) : new Map()
    };
    
    console.log('productData colorImages:', productData.colorImages);
    console.log('productData image:', productData.image);
    
    // Use $set to explicitly replace the colorImages field
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productData },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log('Updated product colorImages:', product.colorImages);
    
    // Convert MongoDB Map back to object for response
    const responseData = {
      ...product.toObject(),
      colorImages: product.colorImages ? Object.fromEntries(product.colorImages) : {},
      colorSizeStock: product.colorSizeStock ? Object.fromEntries(product.colorSizeStock) : {}
    };
    
    console.log('Response colorImages:', responseData.colorImages);
    
    res.json({ product: responseData });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Update product stock for specific size (admin only)
router.put('/:id/stock', authenticate, requireAdmin, async (req, res) => {
  try {
    const { size, quantity } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.updateStockForSize(size, quantity);
    await product.save();
    
    res.json({ product });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
