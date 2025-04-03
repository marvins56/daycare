#!/bin/bash

# Daystar Daycare Management System Installation Script
# This script automates the installation and setup of the Daystar Daycare Management System

echo "=== Daystar Daycare Management System Installation ==="
echo "This script will install and set up the Daystar Daycare Management System."
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "Node.js version is too old. Please install Node.js v14 or higher."
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm v6 or higher."
    exit 1
fi

# Check for MongoDB
echo "Checking for MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Would you like to continue anyway? (y/n)"
    read -r continue_without_mongo
    if [ "$continue_without_mongo" != "y" ]; then
        echo "Installation aborted. Please install MongoDB v4 or higher."
        exit 1
    fi
    echo "Continuing without MongoDB. You will need to configure the database connection manually."
else
    echo "MongoDB found."
    # Try to start MongoDB if it's not running
    if ! pgrep mongod > /dev/null; then
        echo "MongoDB is not running. Attempting to start..."
        sudo service mongod start || echo "Could not start MongoDB. You may need to start it manually."
    fi
fi

# Create .env files
echo "Creating environment configuration files..."

# Backend .env
echo "PORT=5000
MONGO_URI=mongodb://localhost:27017/daystar-daycare
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE=30d" > backend/.env

# Frontend .env
echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend || exit
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend || exit
npm install
cd ..

echo "Installation completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start the backend server: cd backend && npm run dev"
echo "2. In a new terminal, start the frontend: cd frontend && npm start"
echo ""
echo "For more information, please refer to the documentation in the docs directory."
