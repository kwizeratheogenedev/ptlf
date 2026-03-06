const express = require('express');
const router = express.Router();

// Mock data for demo (when DB not connected)
const mockServices = [
  { _id: '1', title: 'Web Development', description: 'Full-stack web development', shortDescription: 'Build modern websites', icon: 'code', category: 'development', isActive: true, order: 1 },
  { _id: '2', title: 'Mobile Apps', description: 'iOS and Android development', shortDescription: 'Native mobile apps', icon: 'mobile', category: 'development', isActive: true, order: 2 },
  { _id: '3', title: 'Cloud Solutions', description: 'Cloud architecture and deployment', shortDescription: 'AWS, Azure, GCP', icon: 'cloud', category: 'cloud', isActive: true, order: 3 }
];

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const Service = require('../models/Service');
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services.length > 0 ? services : mockServices);
  } catch (error) {
    // Return mock data if DB fails
    res.json(mockServices);
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const Service = require('../models/Service');
    const service = await Service.findById(req.params.id);
    if (service) return res.json(service);
    res.json(mockServices.find(s => s._id === req.params.id) || null);
  } catch (error) {
    res.json(mockServices.find(s => s._id === req.params.id) || null);
  }
});

module.exports = router;
