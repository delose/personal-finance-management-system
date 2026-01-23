#!/bin/bash

# Script to install dependencies for PFMS Architecture Visualization

echo "🚀 Installing dependencies for PFMS Architecture Visualization..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

echo "📦 Installing required npm packages..."

# Install main dependencies
npm install reactflow@11.7.0 framer-motion@10.16.4 axios@1.6.2 @react-icons/all-files@4.1.0

# Install TypeScript types for the new dependencies
npm install --save-dev @types/reactflow

echo "✅ Dependencies installed successfully!"

# Verify installation
echo "🔍 Verifying installation..."
npm list reactflow framer-motion axios @react-icons/all-files

echo "🎉 All dependencies are ready!"
echo "You can now run the application with: npm start"
