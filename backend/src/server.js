// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const { protect } = require('./middleware/auth');

// // Load environment variables
// dotenv.config();

// // Create Express app
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));

// // Define routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/babysitters', require('./routes/babysitters'));
// app.use('/api/children', require('./routes/children'));
// app.use('/api/attendance', require('./routes/attendance'));
// app.use('/api/incidents', require('./routes/incidents'));
// app.use('/api/payments', require('./routes/payments'));
// app.use('/api/expenses', require('./routes/expenses'));

// // Protected route for testing auth
// app.get('/api/protected', protect, (req, res) => {
//   res.json({ msg: 'This is a protected route', user: req.user });
// });

// // Default route
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to Daystar Daycare Management System API' });
// });

// // Define port
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected');
//     // Start server after successful database connection
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   });

// module.exports = app;



const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Database configuration
const dbConfig = require('./config/database')[process.env.NODE_ENV || 'development'];

// Initialize Sequelize with database connection
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions || {},
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Import all models to ensure they're loaded
const db = require('./models');
console.log('Models loaded:', Object.keys(db).filter(k => k !== 'sequelize' && k !== 'Sequelize'));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/babysitters', require('./routes/babysitters'));
app.use('/api/children', require('./routes/children'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/incidents', require('./routes/incidents'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/expenses', require('./routes/expenses'));

// Protected route for testing auth
app.get('/api/protected', require('./middleware/auth').protect, (req, res) => {
  res.json({ msg: 'This is a protected route', user: req.user });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Daystar Daycare Management System API' });
});

// Define port
const PORT = process.env.PORT || 5000;

// Test database connection and start server
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    
    // Sync models with database (create tables)
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized successfully');
    // Start server after successful database sync
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database or sync models:', err);
    process.exit(1);
  });

module.exports = app;