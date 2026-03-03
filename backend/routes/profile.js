const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

// Configure multer for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'backend/uploads/profile';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// @route   GET /api/profile
// @desc    Get profile (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    
    if (!profile) {
      // Create default profile if none exists
      profile = await Profile.create({
        name: 'Your Name',
        title: 'IT Professional',
        bio: 'Welcome to my portfolio.'
      });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/profile
// @desc    Update profile
// @access  Private
router.put('/', auth, upload.single('profileImage'), async (req, res) => {
  try {
    const { name, title, bio, email, phone, location, website, linkedin, github, twitter, resumeUrl, skills } = req.body;

    // Input validation
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Validate email if provided
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate URLs if provided
    const urlFields = ['website', 'linkedin', 'github', 'twitter', 'resumeUrl'];
    const urlPattern = /^https?:\/\/.+/i;
    for (const field of urlFields) {
      if (req.body[field] && !urlPattern.test(req.body[field])) {
        return res.status(400).json({ message: `${field} must be a valid URL` });
      }
    }
    
    const profileData = {
      name,
      title,
      bio,
      email,
      phone,
      location,
      website,
      linkedin,
      github,
      twitter,
      resumeUrl
    };

    if (req.file) {
      profileData.profileImage = `/uploads/profile/${req.file.filename}`;
    }

    if (skills) {
      try {
        profileData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch (e) {
        profileData.skills = [];
      }
    }

    let profile = await Profile.findOne();
    
    if (profile) {
      profile = await Profile.findOneAndUpdate({}, profileData, { new: true });
    } else {
      profile = await Profile.create(profileData);
    }

    res.json(profile);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/profile/image
// @desc    Update profile image only
// @access  Private
router.put('/image', auth, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let profile = await Profile.findOne();
    
    // Delete old image if exists
    if (profile && profile.profileImage) {
      const oldPath = path.join(__dirname, '..', profile.profileImage);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    profile = await Profile.findOneAndUpdate(
      {},
      { profileImage: `/uploads/profile/${req.file.filename}` },
      { new: true }
    );

    if (!profile) {
      profile = await Profile.create({ profileImage: `/uploads/profile/${req.file.filename}` });
    }

    res.json(profile);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
