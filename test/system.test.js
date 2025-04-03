// Test script for Daystar Daycare Management System
// This script tests the core functionality of the system

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { expect } = require('chai');
const mocha = require('mocha');

// Load environment variables
dotenv.config({ path: '../backend/.env' });

// API base URL
const API_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test Manager',
  email: 'test.manager@daystar.com',
  password: 'password123',
  role: 'manager'
};

const testBabysitter = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phoneNumber: '08012345678',
  nationalId: 'AB12345678',
  dateOfBirth: '1995-05-15',
  nextOfKin: {
    name: 'John Smith',
    phoneNumber: '08087654321'
  }
};

const testChild = {
  fullName: 'Tommy Johnson',
  age: 5,
  parent: {
    name: 'Sarah Johnson',
    phoneNumber: '08023456789',
    email: 'sarah.johnson@example.com'
  },
  specialCareNeeds: {
    allergies: 'Peanuts',
    medicalConditions: 'None',
    dietaryRestrictions: 'No peanuts',
    other: 'None'
  },
  sessionType: 'full-day'
};

// Test variables
let authToken;
let testBabysitterId;
let testChildId;
let testAttendanceId;
let testIncidentId;
let testPaymentId;
let testExpenseId;

// Helper function for API requests
const api = {
  auth: {
    login: async (email, password) => {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    register: async (userData) => {
      try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    }
  },
  
  babysitters: {
    create: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/babysitters`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getAll: async () => {
      try {
        const response = await axios.get(`${API_URL}/babysitters`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getById: async (id) => {
      try {
        const response = await axios.get(`${API_URL}/babysitters/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    update: async (id, data) => {
      try {
        const response = await axios.put(`${API_URL}/babysitters/${id}`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    delete: async (id) => {
      try {
        const response = await axios.delete(`${API_URL}/babysitters/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    }
  },
  
  children: {
    create: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/children`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getAll: async () => {
      try {
        const response = await axios.get(`${API_URL}/children`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getById: async (id) => {
      try {
        const response = await axios.get(`${API_URL}/children/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    update: async (id, data) => {
      try {
        const response = await axios.put(`${API_URL}/children/${id}`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    delete: async (id) => {
      try {
        const response = await axios.delete(`${API_URL}/children/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    }
  },
  
  attendance: {
    create: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/attendance`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getAll: async () => {
      try {
        const response = await axios.get(`${API_URL}/attendance`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    checkout: async (id, data) => {
      try {
        const response = await axios.put(`${API_URL}/attendance/${id}/checkout`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    }
  },
  
  incidents: {
    create: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/incidents`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getAll: async () => {
      try {
        const response = await axios.get(`${API_URL}/incidents`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    resolve: async (id, data) => {
      try {
        const response = await axios.put(`${API_URL}/incidents/${id}/resolve`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    }
  },
  
  payments: {
    create: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/payments`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getAll: async () => {
      try {
        const response = await axios.get(`${API_URL}/payments`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    }
  },
  
  expenses: {
    create: async (data) => {
      try {
        const response = await axios.post(`${API_URL}/expenses`, data, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getAll: async () => {
      try {
        const response = await axios.get(`${API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    },
    getSummary: async (dateRange) => {
      try {
        const response = await axios.get(`${API_URL}/expenses/summary`, {
          params: dateRange,
          headers: { Authorization: `Bearer ${authToken}` }
        });
        return response.data;
      } catch (error) {
        throw error.response ? error.response.data : error;
      }
    }
  }
};

// Test suite
describe('Daystar Daycare Management System Tests', function() {
  this.timeout(10000); // Set timeout for tests
  
  // Before all tests - connect to database and setup test data
  before(async function() {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB for testing');
      
      // Register test user if not exists
      try {
        const loginResponse = await api.auth.login(testUser.email, testUser.password);
        authToken = loginResponse.token;
      } catch (error) {
        // If login fails, register new user
        const registerResponse = await api.auth.register(testUser);
        authToken = registerResponse.token;
      }
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error;
    }
  });
  
  // After all tests - cleanup test data and disconnect
  after(async function() {
    try {
      // Clean up test data
      if (testBabysitterId) {
        await api.babysitters.delete(testBabysitterId);
      }
      if (testChildId) {
        await api.children.delete(testChildId);
      }
      
      // Disconnect from MongoDB
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB after testing');
    } catch (error) {
      console.error('Test cleanup failed:', error);
    }
  });
  
  // Authentication tests
  describe('Authentication', function() {
    it('should login with valid credentials', async function() {
      const response = await api.auth.login(testUser.email, testUser.password);
      expect(response).to.have.property('token');
      expect(response.token).to.be.a('string');
      authToken = response.token;
    });
    
    it('should fail login with invalid credentials', async function() {
      try {
        await api.auth.login('invalid@example.com', 'wrongpassword');
        // Should not reach here
        expect.fail('Login should have failed with invalid credentials');
      } catch (error) {
        expect(error).to.have.property('msg');
      }
    });
  });
  
  // Babysitter management tests
  describe('Babysitter Management', function() {
    it('should create a new babysitter', async function() {
      const response = await api.babysitters.create(testBabysitter);
      expect(response).to.have.property('_id');
      testBabysitterId = response._id;
      
      expect(response.firstName).to.equal(testBabysitter.firstName);
      expect(response.lastName).to.equal(testBabysitter.lastName);
      expect(response.email).to.equal(testBabysitter.email);
    });
    
    it('should get all babysitters', async function() {
      const response = await api.babysitters.getAll();
      expect(response).to.be.an('array');
      expect(response.length).to.be.at.least(1);
      
      const createdBabysitter = response.find(b => b._id === testBabysitterId);
      expect(createdBabysitter).to.exist;
    });
    
    it('should get babysitter by ID', async function() {
      const response = await api.babysitters.getById(testBabysitterId);
      expect(response).to.have.property('_id');
      expect(response._id).to.equal(testBabysitterId);
      expect(response.firstName).to.equal(testBabysitter.firstName);
    });
    
    it('should update babysitter', async function() {
      const updateData = {
        firstName: 'Jane Updated',
        phoneNumber: '08099999999'
      };
      
      const response = await api.babysitters.update(testBabysitterId, updateData);
      expect(response).to.have.property('_id');
      expect(response.firstName).to.equal(updateData.firstName);
      expect(response.phoneNumber).to.equal(updateData.phoneNumber);
      // Original data should remain unchanged
      expect(response.lastName).to.equal(testBabysitter.lastName);
    });
  });
  
  // Child management tests
  describe('Child Management', function() {
    it('should create a new child', async function() {
      const response = await api.children.create(testChild);
      expect(response).to.have.property('_id');
      testChildId = response._id;
      
      expect(response.fullName).to.equal(testChild.fullName);
      expect(response.age).to.equal(testChild.age);
      expect(response.parent.name).to.equal(testChild.parent.name);
    });
    
    it('should get all children', async function() {
      const response = await api.children.getAll();
      expect(response).to.be.an('array');
      expect(response.length).to.be.at.least(1);
      
      const createdChild = response.find(c => c._id === testChildId);
      expect(createdChild).to.exist;
    });
    
    it('should get child by ID', async function() {
      const response = await api.children.getById(testChildId);
      expect(response).to.have.property('_id');
      expect(response._id).to.equal(testChildId);
      expect(response.fullName).to.equal(testChild.fullName);
    });
    
    it('should update child', async function() {
      const updateData = {
        fullName: 'Tommy Johnson Jr',
        specialCareNeeds: {
          ...testChild.specialCareNeeds,
          allergies: 'Peanuts, Milk'
        }
      };
      
      const response = await api.children.update(testChildId, updateData);
      expect(response).to.have.property('_id');
      expect(response.fullName).to.equal(updateData.fullName);
      expect(response.specialCareNeeds.allergies).to.equal(updateData.specialCareNeeds.allergies);
      // Original data should remain unchanged
      expect(response.age).to.equal(testChild.age);
    });
  });
  
  // Attendance tracking tests
  describe('Attendance Tracking', function() {
    it('should create attendance record', async function() {
      const attendanceData = {
        child: testChildId,
        babysitter: testBabysitterId,
        date: new Date().toISOString().split('T')[0],
        checkInTime: '08:30',
        sessionType: 'full-day',
        notes: 'Test attendance'
      };
      
      const response = await api.attendance.create(attendanceData);
      expect(response).to.have.property('_id');
      testAttendanceId = response._id;
      
      expect(response.child).to.equal(testChildId);
      expect(response.babysitter).to.equal(testBabysitterId);
      expect(response.status).to.equal('checked-in');
    });
    
    it('should get all attendance records', async function() {
      const response = await api.attendance.getAll();
      expect(response).to.be.an('array');
      expect(response.length).to.be.at.least(1);
      
      const createdAttendance = response.find(a => a._id === testAttendanceId);
      expect(createdAttendance).to.exist;
    });
    
    it('should checkout attendance', async function() {
      const checkoutData = {
        checkOutTime: '16:30'
      };
      
      const response = await api.attendance.checkout(testAttendanceId, checkoutData);
      expect(response).to.have.property('_id');
      expect(response._id).to.equal(testAttendanceId);
      expect(response.checkOutTime).to.equal(checkoutData.checkOutTime);
      expect(response.status).to.equal('checked-out');
    });
  });
  
  // Incident reporting tests
  describe('Incident Reporting', function() {
    it('should create incident report', async function() {
      const incidentData = {
        child: testChildId,
        reportedBy: testBabysitterId,
        date: new Date().toISOString().split('T')[0],
        incidentType: 'accident',
        description: 'Minor fall during playtime',
        severity: 'low',
        actionTaken: 'Applied ice pack, child recovered quickly',
        parentNotified: true
      };
      
      const response = await api.incidents.create(incidentData);
      expect(response).to.have.property('_id');
      testIncidentId = response._id;
      
      expect(response.child).to.equal(testChildId);
      expect(response.reportedBy).to.equal(testBabysitterId);
      expect(response.status).to.equal('open');
    });
    
    it('should get all incidents', async function() {
      const response = await api.incidents.getAll();
      expect(response).to.be.an('array');
      expect(response.length).to.be.at.least(1);
      
      const createdIncident = response.find(i => i._id === testIncidentId);
      expect(createdIncident).to.exist;
    });
    
    it('should resolve incident', async function() {
      const resolveData = {
        followUpNotes: 'Incident resolved, child is fine'
      };
      
      const response = await api.incidents.resolve(testIncidentId, resolveData);
      expect(response).to.have.property('_id');
      expect(response._id).to.equal(testIncidentId);
      expect(response.status).to.equal('resolved');
      expect(response.followUpNotes).to.equal(resolveData.followUpNotes);
    });
  });
  
  // Financial management tests
  describe('Financial Management', function() {
    it('should create payment record', async function() {
      const paymentData = {
        source: 'parent_payment',
        description: 'Monthly fee for Tommy Johnson',
        amount: 5000, // $50.00
        date: new Date().toISOString().split('T')[0],
        paymentType: 'bank_transfer'
      };
      
      const response = await api.payments.create(paymentData);
      expect(response).to.have.property('_id');
      testPaymentId = response._id;
      
      expect(response.description).to.equal(paymentData.description);
      expect(response.amount).to.equal(paymentData.amount);
    });
    
    it('should get all payments', async function() {
      const response = await api.payments.getAll();
      expect(response).to.be.an('array');
      expect(response.length).to.be.at.least(1);
      
      const createdPayment = response.find(p => p._id === testPaymentId);
      expect(createdPayment).to.exist;
    });
    
    it('should create expense record', async function() {
      const expenseData = {
        category: 'salary',
        description: 'Salary payment for Jane Smith',
        amount: 3000, // $30.00
        date: new Date().toISOString().split('T')[0],
        babysitterId: testBabysitterId
      };
      
      const response = await api.expenses.create(expenseData);
      expect(response).to.have.property('_id');
      testExpenseId = response._id;
      
      expect(response.description).to.equal(expenseData.description);
      expect(response.amount).to.equal(expenseData.amount);
      expect(response.babysitter.toString()).to.equal(testBabysitterId);
    });
    
    it('should get all expenses', async function() {
      const response = await api.expenses.getAll();
      expect(response).to.be.an('array');
      expect(response.length).to.be.at.least(1);
      
      const createdExpense = response.find(e => e._id === testExpenseId);
      expect(createdExpense).to.exist;
    });
    
    it('should get expense summary', async function() {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const dateRange = {
        startDate: firstDayOfMonth.toISOString().split('T')[0],
        endDate: lastDayOfMonth.toISOString().split('T')[0]
      };
      
      const response = await api.expenses.getSummary(dateRange);
      expect(response).to.have.property('summary');
      expect(response.summary).to.be.an('array');
      
      // Should have at least one category (salary)
      const salaryCategoryExists = response.summary.some(item => item.category === 'salary');
      expect(salaryCategoryExists).to.be.true;
    });
  });
});

// Run tests
// This is just the test script, to run it:
// 1. Make sure the backend server is running
// 2. Run: npm test
console.log('Test script created. Run with: npm test');
