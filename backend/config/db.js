const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Skip if MONGODB_URI is not set
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI not set - database connection skipped');
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

// Helper to check if DB is available before operations
const checkConnection = async () => {
  if (!isConnected && process.env.MONGODB_URI) {
    return await connectDB();
  }
  return isConnected;
};

module.exports = { connectDB, checkConnection };
