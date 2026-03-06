const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: 'Too many attempts, please try again later' }
});

const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign({ id }, jwtSecret, { expiresIn: '30d' });
};

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Try database first
    try {
      const User = require('../models/User');
      const user = await User.findOne({ email });
      
      if (user) {
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          const token = generateToken(user._id);
          return res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token
          });
        }
      }
    } catch (dbError) {
      console.log('DB not available');
    }

    // Demo login (works without DB)
    if (email === 'admin@demo.com' && password === 'demo123') {
      const token = generateToken('demo-user');
      return res.json({
        _id: 'demo-1',
        username: 'demo',
        email: 'admin@demo.com',
        token
      });
    }

    res.status(400).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Try to create in database
    try {
      const User = require('../models/User');
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({ username, email, password });
      const token = generateToken(user._id);
      
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token
      });
    } catch (dbError) {
      // Demo registration (works without DB)
      const token = generateToken('new-user-' + Date.now());
      return res.status(201).json({
        _id: 'new-' + Date.now(),
        username,
        email,
        token
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Try database
    try {
      const User = require('../models/User');
      const user = await User.findById(decoded.id).select('-password');
      if (user) return res.json(user);
    } catch (dbError) {
      // Demo user
    }

    // Return demo user
    res.json({
      _id: decoded.id,
      username: 'demo',
      email: 'admin@demo.com'
    });
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
