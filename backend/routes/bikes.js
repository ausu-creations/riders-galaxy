const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Get all bike brands with their models (public)
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.find({ isActive: true }).sort({ brand: 1 });
    const bikesData = {};
    
    bikes.forEach(bike => {
      bikesData[bike.brand] = bike.models.sort();
    });
    
    res.json({ bikes: bikesData, bikesList: bikes });
  } catch (error) {
    console.error('Error fetching bikes:', error);
    res.status(500).json({ error: 'Failed to fetch bikes' });
  }
});

// Get a single bike brand by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({ error: 'Bike brand not found' });
    }
    res.json({ bike });
  } catch (error) {
    console.error('Error fetching bike:', error);
    res.status(500).json({ error: 'Failed to fetch bike' });
  }
});

// Create a new bike brand (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { brand, models } = req.body;
    
    // Handle both string and array input
    let modelsArray = models;
    if (typeof models === 'string') {
      modelsArray = models.split(',').map(m => m.trim()).filter(m => m);
    }
    
    if (!brand || !Array.isArray(modelsArray) || modelsArray.length === 0) {
      return res.status(400).json({ error: 'Brand and models are required' });
    }
    
    // Check if brand already exists
    const existingBike = await Bike.findOne({ brand });
    if (existingBike) {
      return res.status(400).json({ error: 'Bike brand already exists' });
    }
    
    const bike = new Bike({ brand, models: modelsArray });
    await bike.save();
    
    res.status(201).json({ bike });
  } catch (error) {
    console.error('Error creating bike:', error);
    res.status(500).json({ error: 'Failed to create bike brand' });
  }
});

// Update a bike brand (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { brand, models } = req.body;
    
    // Handle both string and array input
    let modelsArray = models;
    if (typeof models === 'string') {
      modelsArray = models.split(',').map(m => m.trim()).filter(m => m);
    }
    
    if (!brand || !Array.isArray(modelsArray) || modelsArray.length === 0) {
      return res.status(400).json({ error: 'Brand and models are required' });
    }
    
    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      { brand, models: modelsArray },
      { new: true, runValidators: true }
    );
    
    if (!bike) {
      return res.status(404).json({ error: 'Bike brand not found' });
    }
    
    res.json({ bike });
  } catch (error) {
    console.error('Error updating bike:', error);
    res.status(500).json({ error: 'Failed to update bike brand' });
  }
});

// Delete a bike brand (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);
    
    if (!bike) {
      return res.status(404).json({ error: 'Bike brand not found' });
    }
    
    res.json({ message: 'Bike brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting bike:', error);
    res.status(500).json({ error: 'Failed to delete bike brand' });
  }
});

// Add a model to an existing bike brand (admin only)
router.post('/:id/models', authenticate, requireAdmin, async (req, res) => {
  try {
    const { model } = req.body;
    
    if (!model) {
      return res.status(400).json({ error: 'Model name is required' });
    }
    
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({ error: 'Bike brand not found' });
    }
    
    if (bike.models.includes(model)) {
      return res.status(400).json({ error: 'Model already exists for this brand' });
    }
    
    bike.models.push(model);
    await bike.save();
    
    res.json({ bike });
  } catch (error) {
    console.error('Error adding model:', error);
    res.status(500).json({ error: 'Failed to add model' });
  }
});

// Remove a model from a bike brand (admin only)
router.delete('/:id/models/:model', authenticate, requireAdmin, async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({ error: 'Bike brand not found' });
    }
    
    bike.models = bike.models.filter(model => model !== req.params.model);
    await bike.save();
    
    res.json({ bike });
  } catch (error) {
    console.error('Error removing model:', error);
    res.status(500).json({ error: 'Failed to remove model' });
  }
});

module.exports = router;