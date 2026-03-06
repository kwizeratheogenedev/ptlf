const mongoose = require('mongoose');

const connectDB = async () => {
  // Skip if MONGODB_URI is not set
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI not set - database connection skipped');
    return;
  }

  // If already connected, don't reconnect
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 4500,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit in serverless - just log the error
  }
};

module.exports = connectDB;
