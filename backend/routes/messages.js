const express = require('express');
const router = express.Router();

// Mock messages (for demo)
const mockMessages = [];

// POST /api/messages
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Try database
    try {
      const Message = require('../models/Message');
      const newMessage = await Message.create({ name, email, subject, message, phone });
      return res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (dbError) {
      // Save to mock
      const msg = { _id: Date.now().toString(), name, email, subject, message, phone, isRead: false, createdAt: new Date() };
      mockMessages.push(msg);
      return res.status(201).json({ message: 'Message sent successfully', data: msg });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
