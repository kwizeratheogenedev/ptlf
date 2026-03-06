const express = require('express');
const router = express.Router();

// Mock profile data
const mockProfile = {
  _id: '1',
  name: 'Your Name',
  title: 'IT Professional',
  bio: 'Welcome to my portfolio website.',
  email: 'email@example.com',
  phone: '',
  location: '',
  website: '',
  linkedin: '',
  github: '',
  twitter: '',
  resumeUrl: '',
  profileImage: '',
  skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
};

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    const Profile = require('../models/Profile');
    const profile = await Profile.findOne();
    res.json(profile || mockProfile);
  } catch (error) {
    res.json(mockProfile);
  }
});

module.exports = router;
