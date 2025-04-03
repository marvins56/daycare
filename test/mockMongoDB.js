// Mock MongoDB for testing
const mockMongoDB = () => {
  // Create a mock implementation of mongoose
  const mongoose = require('mongoose');
  
  // Override the connect method to return a resolved promise
  mongoose.connect = jest.fn().mockResolvedValue(true);
  
  // Create mock models
  const mockModel = {
    find: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue({}),
    findOne: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({ _id: 'mock-id' }),
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
    findByIdAndDelete: jest.fn().mockResolvedValue({}),
  };
  
  // Return the mock mongoose
  return mongoose;
};

module.exports = mockMongoDB;
