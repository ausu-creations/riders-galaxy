const express = require('express');
const router = express.Router();
const Product = require('../models/Product');  // Adjust path if needed
const Category = require('../models/Category'); // Adjust path if needed

// GET /api/products - Fetch products with optional filtering, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, fitment, search, sort } = req.query;
    let query = {};

    // 1. Filter by Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 2. Filter by Brand (supports single or comma-separated brands e.g. "LS2,Rynox")
    if (brand) {
      const brandList = brand.split(',').map(b => b.trim());
      query.brand = { $in: brandList.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // 3. Filter by Fitment (case-insensitive search e.g. "Universal")
    if (fitment) {
      query.fitment = new RegExp(fitment, 'i');
    }

    // 4. Keyword Search across Title, Brand, and Description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 5. Filter by Category Slug(s)
    if (category) {
      const catSlugs = category.split(',').map(c => c.trim());
      // Find category ObjectIds corresponding to the provided slug(s)
      const matchedCategories = await Category.find({ slug: { $in: catSlugs } });
      const categoryIds = matchedCategories.map(c => c._id);
      query.category = { $in: categoryIds };
    }

    // 6. Handle Sorting Options
    let sortOption = { createdAt: -1 }; // Default: Newest first
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'title-asc') sortOption = { title: 1 };

    // Execute query and populate category details
    const products = await Product.find(query)
      .populate('category')
      .sort(sortOption);

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;