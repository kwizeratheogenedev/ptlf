const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Route files
const auth = require('./routes/auth');
const achievements = require('./routes/achievements');
const services = require('./routes/services');
const messages = require('./routes/messages');
const profile = require('./routes/profile');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio API' });
});

// API Routes
app.use('/api/auth', auth);
app.use('/api/achievements', achievements);
app.use('/api/services', services);
app.use('/api/messages', messages);
app.use('/api/profile', profile);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));

    // Handle React routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Create uploads directories
const ensureUploadsDir = (dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true });
    } catch (e) {
      console.log('Could not create directory:', dir);
    }
  }
};

ensureUploadsDir('uploads');
ensureUploadsDir('uploads/achievements');
ensureUploadsDir('uploads/profile');

// Connect to database
connectDB().then(connected => {
  if (connected) {
    console.log('Database connected');
  } else {
    console.log('Running without database - set MONGODB_URI in backend/.env');
  }
}).catch(err => {
  console.log('Database connection failed:', err.message);
});

// Start server locally (Vercel uses module.exports without listening)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
