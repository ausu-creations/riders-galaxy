const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentDetails,
      subtotal,
      shippingCost,
      total,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      shippingAddress,
      paymentDetails,
      subtotal,
      shippingCost,
      total,
      notes,
    });

    await order.save();
    
    res.status(201).json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Create guest order (no authentication required)
router.post('/guest', async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentDetails,
      subtotal,
      shippingCost,
      total,
      notes,
      guestEmail,
      guestPhone,
      guestName,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!guestEmail || !guestPhone || !guestName) {
      return res.status(400).json({ error: 'Guest contact information is required' });
    }

    const order = new Order({
      userId: null, // No user ID for guest orders
      items,
      shippingAddress,
      paymentDetails,
      subtotal,
      shippingCost,
      total,
      notes,
      guestInfo: {
        email: guestEmail,
        phone: guestPhone,
        name: guestName,
      },
    });

    await order.save();
    
    res.status(201).json({ order });
  } catch (error) {
    console.error('Create guest order error:', error);
    res.status(500).json({ error: 'Failed to create guest order' });
  }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if user owns this order or is admin
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Admin: Get all orders
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.orderStatus = status;
    }
    
    const orders = await Order.find(query)
      .populate('userId', 'email displayName phone')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin: Update order status
router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    if (!orderStatus) {
      return res.status(400).json({ error: 'Order status is required' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
