const path = require('path');

// Vercel serverless function handler
module.exports = (req, res) => {
  const express = require('express');
  const cors = require('cors');
  require('dotenv').config();

  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  const { connectDB } = require('./config/db');
  const auth = require('./routes/auth');
  const achievements = require('./routes/achievements');
  const services = require('./routes/services');
  const messages = require('./routes/messages');
  const profile = require('./routes/profile');

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Portfolio API is running' });
  });

  // API Routes
  app.use('/api/auth', auth);
  app.use('/api/achievements', achievements);
  app.use('/api/services', services);
  app.use('/api/messages', messages);
  app.use('/api/profile', profile);

  // Serve static files
  const fs = require('fs');
  const buildPath = path.join(__dirname, '../client/build');
  
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
  }

  // Frontend catch-all
  app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({ message: 'Portfolio API' });
    }
  });

  // Connect DB if URI exists
  if (process.env.MONGODB_URI) {
    connectDB().catch(err => console.log('DB connection error:', err.message));
  }

  app(req, res);
};
