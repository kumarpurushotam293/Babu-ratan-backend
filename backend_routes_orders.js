// Orders routes: create order & admin operations
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

/**
 * POST /api/orders
 * Create a new order (public)
 */
router.post(
  '/',
  [
    body('customerName').notEmpty().withMessage('Customer name required'),
    body('phone').matches(/^[0-9]{10,14}$/).withMessage('Valid phone number required'),
    body('address').notEmpty().withMessage('Address required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item required'),
    body('totalPrice').isFloat({ gt: 0 }).withMessage('Total price must be greater than 0')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { customerName, phone, address, items, totalPrice } = req.body;
    try {
      const order = new Order({
        customerName,
        phone,
        address,
        items,
        totalPrice
      });
      await order.save();
      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * GET /api/orders
 * Admin - list all orders
 */
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * PATCH /api/orders/:id/status
 * Admin - update order status
 */
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const allowed = ['Pending', 'Confirmed', 'Delivered'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;