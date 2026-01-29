// Contact form routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

/**
 * POST /api/contacts
 * Save a contact message
 */
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('message').notEmpty().withMessage('Message required'),
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('phone').optional().matches(/^[0-9]{10,14}$/).withMessage('Valid phone number required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const contact = new Contact(req.body);
      await contact.save();
      res.status(201).json({ message: 'Message received. We will contact you soon.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

/**
 * GET /api/contacts
 * Admin - list messages
 */
router.get('/', auth, async (req, res) => {
  try {
    const msgs = await Contact.find({}).sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;