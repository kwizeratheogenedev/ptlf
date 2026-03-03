const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Service = require('../models/Service');

// @route   GET /api/services
// @desc    Get all services (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/services/admin
// @desc    Get all services including inactive (admin)
// @access  Private
router.get('/admin', auth, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/services
// @desc    Create service
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, shortDescription, icon, category, price, features, isActive, order } = req.body;

    // Input validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const serviceData = {
      title,
      description,
      shortDescription: shortDescription || description.substring(0, 150),
      icon: icon || 'code',
      category: category || 'development',
      price: price || '',
      features: (() => {
        try {
          return features ? JSON.parse(features) : [];
        } catch (e) {
          return [];
        }
      })(),
      isActive: isActive !== false,
      order: parseInt(order) || 0
    };

    const service = await Service.create(serviceData);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, shortDescription, icon, category, price, features, isActive, order } = req.body;
    
    const serviceData = {
      title,
      description,
      shortDescription: shortDescription || description.substring(0, 150),
      icon,
      category,
      price,
      features: (() => {
        try {
          return features ? JSON.parse(features) : [];
        } catch (e) {
          return [];
        }
      })(),
      isActive,
      order: parseInt(order) || 0
    };

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      serviceData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
