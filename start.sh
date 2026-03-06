#!/bin/bash

# Set production mode
export NODE_ENV=production

# Install backend dependencies if needed
echo "Installing backend dependencies..."
cd backend
npm install

# Install client dependencies if needed
echo "Installing client dependencies..."
cd ../client
npm install

# Build the React client
echo "Building React client..."
npm run build
cd ..

# Start the Node.js backend (which will serve the React app)
echo "Starting server..."
cd backend
node server.js
