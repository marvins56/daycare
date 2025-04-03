# Daystar Daycare Management System Installation Script for Windows
# This script automates the installation and setup of the Daystar Daycare Management System

Write-Host "=== Daystar Daycare Management System Installation ===" -ForegroundColor Green
Write-Host "This script will install and set up the Daystar Daycare Management System."
Write-Host ""

# Check for Node.js
try {
    $nodeVersion = (node -v)
    $versionNumber = $nodeVersion.Substring(1).Split('.')[0]
    if ([int]$versionNumber -lt 14) {
        Write-Host "Node.js version is too old. Please install Node.js v14 or higher." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Node.js is not installed. Please install Node.js v14 or higher." -ForegroundColor Red
    exit 1
}

# Check for npm
try {
    npm -v | Out-Null
} catch {
    Write-Host "npm is not installed. Please install npm v6 or higher." -ForegroundColor Red
    exit 1
}

# Check for MongoDB
Write-Host "Checking for MongoDB..."
try {
    mongod --version | Out-Null
    Write-Host "MongoDB found."
    
    # Check if MongoDB service is running
    $mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoService -and $mongoService.Status -ne 'Running') {
        Write-Host "MongoDB is not running. Attempting to start..."
        Start-Service MongoDB -ErrorAction SilentlyContinue
        if ((Get-Service MongoDB).Status -ne 'Running') {
            Write-Host "Could not start MongoDB. You may need to start it manually." -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "MongoDB is not installed. Would you like to continue anyway? (y/n)"
    $continueWithoutMongo = Read-Host
    if ($continueWithoutMongo -ne "y") {
        Write-Host "Installation aborted. Please install MongoDB v4 or higher." -ForegroundColor Red
        exit 1
    }
    Write-Host "Continuing without MongoDB. You will need to configure the database connection manually."
}

# Create .env files
Write-Host "Creating environment configuration files..."

# Generate random string for JWT_SECRET
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Backend .env
@"
PORT=5000
MONGO_URI=mongodb://localhost:27017/daystar-daycare
JWT_SECRET=$jwtSecret
JWT_EXPIRE=30d
"@ | Out-File -FilePath "backend\.env" -Encoding utf8

# Frontend .env
@"
REACT_APP_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath "frontend\.env" -Encoding utf8

# Install backend dependencies
Write-Host "Installing backend dependencies..."
Push-Location -Path "backend"
npm install
Pop-Location

# Install frontend dependencies
Write-Host "Installing frontend dependencies..."
Push-Location -Path "frontend"
npm install
Pop-Location

Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:"
Write-Host "1. Start the backend server: cd backend && npm run dev"
Write-Host "2. In a new terminal, start the frontend: cd frontend && npm start"
Write-Host ""
Write-Host "For more information, please refer to the documentation in the docs directory."