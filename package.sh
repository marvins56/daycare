#!/bin/bash

# Daystar Daycare Management System Packaging Script
# This script creates a distributable package of the system

echo "=== Daystar Daycare Management System Packaging ==="
echo "Creating distributable package..."

# Create package directory
PACKAGE_DIR="daystar-daycare-package"
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

# Copy backend files
echo "Copying backend files..."
mkdir -p "$PACKAGE_DIR/backend"
cp -r backend/src "$PACKAGE_DIR/backend/"
cp backend/package.json "$PACKAGE_DIR/backend/"
cp backend/.env.example "$PACKAGE_DIR/backend/.env.example"

# Copy frontend files
echo "Copying frontend files..."
mkdir -p "$PACKAGE_DIR/frontend"
cp -r frontend/src "$PACKAGE_DIR/frontend/"
cp frontend/public "$PACKAGE_DIR/frontend/" -r
cp frontend/package.json "$PACKAGE_DIR/frontend/"
cp frontend/.env.example "$PACKAGE_DIR/frontend/.env.example"

# Copy documentation
echo "Copying documentation..."
mkdir -p "$PACKAGE_DIR/docs"
cp -r docs/* "$PACKAGE_DIR/docs/"

# Copy installation script
echo "Copying installation script..."
cp install.sh "$PACKAGE_DIR/"
chmod +x "$PACKAGE_DIR/install.sh"

# Create README file
echo "Creating README file..."
cat > "$PACKAGE_DIR/README.md" << EOF
# Daystar Daycare Management System

## Overview
The Daystar Daycare Management System is a comprehensive web application designed to streamline the administrative processes of a daycare center.

## Installation
1. Run the installation script: \`./install.sh\`
2. Follow the prompts to complete the installation
3. Start the backend server: \`cd backend && npm run dev\`
4. Start the frontend: \`cd frontend && npm start\`

## Documentation
Please refer to the \`docs\` directory for comprehensive documentation:
- System Documentation
- API Documentation
- User Manual
- Database Schema Documentation
- Installation Guide

## Support
For support, please contact the system administrator.
EOF

# Create zip archive
echo "Creating zip archive..."
zip -r "daystar-daycare-system.zip" "$PACKAGE_DIR"

echo "Package created successfully: daystar-daycare-system.zip"
echo "You can distribute this package for installation on other systems."
