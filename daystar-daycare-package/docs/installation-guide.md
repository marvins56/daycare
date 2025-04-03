# Daystar Daycare Management System - Installation Guide

## Prerequisites

Before installing the Daystar Daycare Management System, ensure you have the following prerequisites installed:

1. Node.js (v14 or higher)
2. npm (v6 or higher)
3. MongoDB (v4 or higher)
4. Git (optional, for cloning the repository)

## Installation Steps

### 1. Clone or Download the Repository

```bash
git clone https://github.com/daystar/daycare-management.git
cd daycare-management
```

Alternatively, download and extract the ZIP file containing the application code.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file in the backend directory with the following content:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/daystar-daycare
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=30d
```

Replace `your_jwt_secret_key_change_in_production` with a secure random string for production use.

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Configure Frontend Environment Variables

Create a `.env` file in the frontend directory with the following content:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# On Linux
sudo service mongod start

# On macOS (if installed via Homebrew)
brew services start mongodb-community

# On Windows
# MongoDB should be running as a service
```

### 7. Start the Backend Server

```bash
cd ../backend
npm run dev
```

The backend server will start on port 5000 (or the port specified in your .env file).

### 8. Start the Frontend Development Server

```bash
cd ../frontend
npm start
```

The frontend development server will start on port 3000 and should automatically open in your default web browser.

## Production Deployment

For production deployment, follow these additional steps:

### 1. Build the Frontend

```bash
cd frontend
npm run build
```

This will create a production-ready build in the `build` directory.

### 2. Serve the Frontend Build

You can serve the frontend build using a static file server like Nginx or Apache, or use a Node.js server:

```bash
npm install -g serve
serve -s build
```

### 3. Configure Backend for Production

Update the `.env` file in the backend directory for production:

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=30d
```

### 4. Start the Backend Server in Production Mode

```bash
cd ../backend
npm start
```

## Docker Deployment (Optional)

If you prefer to use Docker for deployment, follow these steps:

### 1. Build and Run the Backend Container

```bash
cd backend
docker build -t daystar-backend .
docker run -p 5000:5000 --env-file .env daystar-backend
```

### 2. Build and Run the Frontend Container

```bash
cd frontend
docker build -t daystar-frontend .
docker run -p 3000:80 daystar-frontend
```

## Initial Setup

After installation, follow these steps to set up the system:

1. Access the application at `http://localhost:3000`
2. Register a manager account using the registration form
3. Log in with the manager account
4. Begin adding babysitters, children, and other data

## Troubleshooting

### Common Issues

#### MongoDB Connection Error

If you encounter a MongoDB connection error:

1. Ensure MongoDB is running
2. Check the `MONGO_URI` in your `.env` file
3. Verify network connectivity to the MongoDB server

#### API Connection Error

If the frontend cannot connect to the backend:

1. Ensure the backend server is running
2. Check the `REACT_APP_API_URL` in your frontend `.env` file
3. Verify there are no CORS issues

#### Port Already in Use

If you see an error that the port is already in use:

1. Change the port in the `.env` file
2. Update the `REACT_APP_API_URL` in the frontend `.env` file accordingly

## Support

For additional support, please contact the system administrator or refer to the documentation in the `docs` directory.
