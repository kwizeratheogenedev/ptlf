const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Skip if MONGODB_URI is not set
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI not set - running without database');
    return false;
  }

  // If already connected, don't reconnect
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return true;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 4500,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    isConnected = false;
    return false;
  }
};

module.exports = { connectDB };
