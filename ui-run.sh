#!/bin/bash

# Set the directory where your React project is located
UI_DIR="pfms-ui"

# Navigate to the UI project directory
cd $UI_DIR

# Install the dependencies (if they aren't already installed)
echo "Installing dependencies..."
npm install

# Start the React development server
echo "Starting the React UI..."
npm start

# Optionally, you can print the URL where the app will be running
echo "The React UI is running at http://localhost:3000"


