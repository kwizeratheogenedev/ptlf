#!/bin/bash

# Set production mode
export NODE_ENV=production

# Build the React client
echo "Building React client..."
cd client
npm run build
cd ..

# Start the Node.js backend (which will serve the React app)
echo "Starting server..."
cd backend
node server.js
