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

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

// API Routes - IMPORTANT: must be before catch-all
app.use('/api/auth', auth);
app.use('/api/achievements', achievements);
app.use('/api/services', services);
app.use('/api/messages', messages);
app.use('/api/profile', profile);

// Serve static files from React build
const fs = require('fs');
const buildPath = path.join(__dirname, '../client/build');

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
}

// Catch-all for frontend - must be LAST
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Connect to database
if (process.env.MONGODB_URI) {
  connectDB().then(connected => {
    if (connected) console.log('Database connected');
  }).catch(err => {
    console.log('Database connection failed:', err.message);
  });
}

// Vercel uses module.exports
module.exports = app;
