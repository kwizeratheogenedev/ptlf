const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Achievement = require('../models/Achievement');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'backend/uploads/achievements';
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

// File filter for allowed document types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   GET /api/achievements
// @desc    Get all achievements (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/achievements/:id
// @desc    Get single achievement
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/achievements
// @desc    Create achievement with document upload
// @access  Private
router.post('/', auth, upload.single('document'), async (req, res) => {
  try {
    const { title, description, category, issuer, issueDate, link, isFeatured, order } = req.body;

    // Input validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const achievementData = {
      title,
      description,
      category: category || 'certification',
      issuer,
      issueDate: issueDate || null,
      link,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      order: parseInt(order) || 0
    };

    if (req.file) {
      achievementData.documentUrl = `/uploads/achievements/${req.file.filename}`;
      achievementData.documentName = req.file.originalname;
    }

    const achievement = await Achievement.create(achievementData);
    res.status(201).json(achievement);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/achievements/:id
// @desc    Update achievement
// @access  Private
router.put('/:id', auth, upload.single('document'), async (req, res) => {
  try {
    const { title, description, category, issuer, issueDate, link, isFeatured, order } = req.body;
    
    const achievementData = {
      title,
      description,
      category,
      issuer,
      issueDate,
      link,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      order: parseInt(order) || 0
    };

    if (req.file) {
      achievementData.documentUrl = `/uploads/achievements/${req.file.filename}`;
      achievementData.documentName = req.file.originalname;
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      achievementData,
      { new: true }
    );

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/achievements/:id
// @desc    Delete achievement
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    // Delete document file if exists
    if (achievement.documentUrl) {
      const filePath = path.join(__dirname, '..', achievement.documentUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Achievement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
