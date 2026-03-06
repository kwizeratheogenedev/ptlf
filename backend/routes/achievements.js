const express = require('express');
const router = express.Router();

// Mock achievements data
const mockAchievements = [
  { _id: '1', title: 'AWS Certified', description: 'AWS Solutions Architect', category: 'certification', issuer: 'Amazon', isFeatured: true, order: 1 },
  { _id: '2', title: 'Best Project Award', description: 'Internal hackathon winner', category: 'award', issuer: 'Company', isFeatured: true, order: 2 }
];

// GET /api/achievements
router.get('/', async (req, res) => {
  try {
    const Achievement = require('../models/Achievement');
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(achievements.length > 0 ? achievements : mockAchievements);
  } catch (error) {
    res.json(mockAchievements);
  }
});

// GET /api/achievements/:id
router.get('/:id', async (req, res) => {
  try {
    const Achievement = require('../models/Achievement');
    const achievement = await Achievement.findById(req.params.id);
    if (achievement) return res.json(achievement);
    res.json(mockAchievements.find(a => a._id === req.params.id) || null);
  } catch (error) {
    res.json(mockAchievements.find(a => a._id === req.params.id) || null);
  }
});

module.exports = router;
