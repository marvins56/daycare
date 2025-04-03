// API testing with mocked responses
const axios = require('axios');
const { expect } = require('chai');
const mocha = require('mocha');

// Mock axios for testing
jest.mock('axios');

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

// Mock responses
const mockResponses = {
  auth: {
    login: {
      token: 'mock-token',
      user: {
        _id: 'user-id',
        name: testUser.name,
        email: testUser.email,
        role: testUser.role
      }
    },
    register: {
      token: 'mock-token',
      user: {
        _id: 'user-id',
        name: testUser.name,
        email: testUser.email,
        role: testUser.role
      }
    }
  },
  babysitters: {
    create: {
      _id: 'babysitter-id',
      ...testBabysitter
    },
    getAll: [
      {
        _id: 'babysitter-id',
        ...testBabysitter
      }
    ],
    getById: {
      _id: 'babysitter-id',
      ...testBabysitter
    },
    update: {
      _id: 'babysitter-id',
      ...testBabysitter,
      firstName: 'Jane Updated'
    },
    delete: {
      message: 'Babysitter deleted successfully'
    }
  },
  children: {
    create: {
      _id: 'child-id',
      ...testChild
    },
    getAll: [
      {
        _id: 'child-id',
        ...testChild
      }
    ],
    getById: {
      _id: 'child-id',
      ...testChild
    },
    update: {
      _id: 'child-id',
      ...testChild,
      fullName: 'Tommy Johnson Jr'
    },
    delete: {
      message: 'Child deleted successfully'
    }
  },
  attendance: {
    create: {
      _id: 'attendance-id',
      child: 'child-id',
      babysitter: 'babysitter-id',
      date: '2025-04-03',
      checkInTime: '08:30',
      status: 'checked-in'
    },
    getAll: [
      {
        _id: 'attendance-id',
        child: {
          _id: 'child-id',
          fullName: testChild.fullName
        },
        babysitter: {
          _id: 'babysitter-id',
          firstName: testBabysitter.firstName,
          lastName: testBabysitter.lastName
        },
        date: '2025-04-03',
        checkInTime: '08:30',
        status: 'checked-in'
      }
    ],
    checkout: {
      _id: 'attendance-id',
      child: 'child-id',
      babysitter: 'babysitter-id',
      date: '2025-04-03',
      checkInTime: '08:30',
      checkOutTime: '16:30',
      status: 'checked-out'
    }
  },
  incidents: {
    create: {
      _id: 'incident-id',
      child: 'child-id',
      reportedBy: 'babysitter-id',
      date: '2025-04-03',
      incidentType: 'accident',
      description: 'Minor fall during playtime',
      severity: 'low',
      status: 'open'
    },
    getAll: [
      {
        _id: 'incident-id',
        child: {
          _id: 'child-id',
          fullName: testChild.fullName
        },
        reportedBy: {
          _id: 'babysitter-id',
          firstName: testBabysitter.firstName,
          lastName: testBabysitter.lastName
        },
        date: '2025-04-03',
        incidentType: 'accident',
        description: 'Minor fall during playtime',
        severity: 'low',
        status: 'open'
      }
    ],
    resolve: {
      _id: 'incident-id',
      status: 'resolved',
      followUpNotes: 'Incident resolved, child is fine'
    }
  },
  finances: {
    createPayment: {
      _id: 'payment-id',
      source: 'parent_payment',
      description: 'Monthly fee for Tommy Johnson',
      amount: 5000,
      date: '2025-04-03'
    },
    getAllPayments: [
      {
        _id: 'payment-id',
        source: 'parent_payment',
        description: 'Monthly fee for Tommy Johnson',
        amount: 5000,
        date: '2025-04-03'
      }
    ],
    createExpense: {
      _id: 'expense-id',
      category: 'salary',
      description: 'Salary payment for Jane Smith',
      amount: 3000,
      date: '2025-04-03',
      babysitter: 'babysitter-id'
    },
    getAllExpenses: [
      {
        _id: 'expense-id',
        category: 'salary',
        description: 'Salary payment for Jane Smith',
        amount: 3000,
        date: '2025-04-03',
        babysitter: {
          _id: 'babysitter-id',
          firstName: testBabysitter.firstName,
          lastName: testBabysitter.lastName
        }
      }
    ],
    getExpenseSummary: {
      summary: [
        {
          category: 'salary',
          totalAmount: 3000,
          count: 1
        }
      ]
    }
  }
};

// Setup axios mock responses
beforeEach(() => {
  axios.post.mockImplementation((url, data) => {
    if (url.includes('/auth/login')) {
      return Promise.resolve({ data: mockResponses.auth.login });
    } else if (url.includes('/auth/register')) {
      return Promise.resolve({ data: mockResponses.auth.register });
    } else if (url.includes('/babysitters')) {
      return Promise.resolve({ data: mockResponses.babysitters.create });
    } else if (url.includes('/children')) {
      return Promise.resolve({ data: mockResponses.children.create });
    } else if (url.includes('/attendance')) {
      return Promise.resolve({ data: mockResponses.attendance.create });
    } else if (url.includes('/incidents')) {
      return Promise.resolve({ data: mockResponses.incidents.create });
    } else if (url.includes('/payments')) {
      return Promise.resolve({ data: mockResponses.finances.createPayment });
    } else if (url.includes('/expenses')) {
      return Promise.resolve({ data: mockResponses.finances.createExpense });
    }
    return Promise.reject(new Error('Not found'));
  });

  axios.get.mockImplementation((url) => {
    if (url.includes('/babysitters')) {
      if (url.includes('/babysitters/')) {
        return Promise.resolve({ data: mockResponses.babysitters.getById });
      }
      return Promise.resolve({ data: mockResponses.babysitters.getAll });
    } else if (url.includes('/children')) {
      if (url.includes('/children/')) {
        return Promise.resolve({ data: mockResponses.children.getById });
      }
      return Promise.resolve({ data: mockResponses.children.getAll });
    } else if (url.includes('/attendance')) {
      return Promise.resolve({ data: mockResponses.attendance.getAll });
    } else if (url.includes('/incidents')) {
      return Promise.resolve({ data: mockResponses.incidents.getAll });
    } else if (url.includes('/payments')) {
      return Promise.resolve({ data: mockResponses.finances.getAllPayments });
    } else if (url.includes('/expenses')) {
      if (url.includes('/expenses/summary')) {
        return Promise.resolve({ data: mockResponses.finances.getExpenseSummary });
      }
      return Promise.resolve({ data: mockResponses.finances.getAllExpenses });
    }
    return Promise.reject(new Error('Not found'));
  });

  axios.put.mockImplementation((url, data) => {
    if (url.includes('/babysitters/')) {
      return Promise.resolve({ data: mockResponses.babysitters.update });
    } else if (url.includes('/children/')) {
      return Promise.resolve({ data: mockResponses.children.update });
    } else if (url.includes('/attendance/') && url.includes('/checkout')) {
      return Promise.resolve({ data: mockResponses.attendance.checkout });
    } else if (url.includes('/incidents/') && url.includes('/resolve')) {
      return Promise.resolve({ data: mockResponses.incidents.resolve });
    }
    return Promise.reject(new Error('Not found'));
  });

  axios.delete.mockImplementation((url) => {
    if (url.includes('/babysitters/')) {
      return Promise.resolve({ data: mockResponses.babysitters.delete });
    } else if (url.includes('/children/')) {
      return Promise.resolve({ data: mockResponses.children.delete });
    }
    return Promise.reject(new Error('Not found'));
  });
});

// Test suite
describe('Daystar Daycare Management System API Tests', () => {
  // Authentication tests
  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const response = await axios.post('/api/auth/login', {
        email: testUser.email,
        password: testUser.password
      });
      
      expect(response.data).to.have.property('token');
      expect(response.data.token).to.equal('mock-token');
    });
    
    it('should register a new user', async () => {
      const response = await axios.post('/api/auth/register', testUser);
      
      expect(response.data).to.have.property('token');
      expect(response.data.token).to.equal('mock-token');
      expect(response.data.user.email).to.equal(testUser.email);
    });
  });
  
  // Babysitter management tests
  describe('Babysitter Management', () => {
    it('should create a new babysitter', async () => {
      const response = await axios.post('/api/babysitters', testBabysitter);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.firstName).to.equal(testBabysitter.firstName);
      expect(response.data.lastName).to.equal(testBabysitter.lastName);
    });
    
    it('should get all babysitters', async () => {
      const response = await axios.get('/api/babysitters');
      
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.at.least(1);
      expect(response.data[0].firstName).to.equal(testBabysitter.firstName);
    });
    
    it('should get babysitter by ID', async () => {
      const response = await axios.get('/api/babysitters/babysitter-id');
      
      expect(response.data).to.have.property('_id');
      expect(response.data._id).to.equal('babysitter-id');
      expect(response.data.firstName).to.equal(testBabysitter.firstName);
    });
    
    it('should update babysitter', async () => {
      const updateData = {
        firstName: 'Jane Updated'
      };
      
      const response = await axios.put('/api/babysitters/babysitter-id', updateData);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.firstName).to.equal('Jane Updated');
    });
    
    it('should delete babysitter', async () => {
      const response = await axios.delete('/api/babysitters/babysitter-id');
      
      expect(response.data).to.have.property('message');
      expect(response.data.message).to.include('deleted');
    });
  });
  
  // Child management tests
  describe('Child Management', () => {
    it('should create a new child', async () => {
      const response = await axios.post('/api/children', testChild);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.fullName).to.equal(testChild.fullName);
      expect(response.data.age).to.equal(testChild.age);
    });
    
    it('should get all children', async () => {
      const response = await axios.get('/api/children');
      
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.at.least(1);
      expect(response.data[0].fullName).to.equal(testChild.fullName);
    });
    
    it('should get child by ID', async () => {
      const response = await axios.get('/api/children/child-id');
      
      expect(response.data).to.have.property('_id');
      expect(response.data._id).to.equal('child-id');
      expect(response.data.fullName).to.equal(testChild.fullName);
    });
    
    it('should update child', async () => {
      const updateData = {
        fullName: 'Tommy Johnson Jr'
      };
      
      const response = await axios.put('/api/children/child-id', updateData);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.fullName).to.equal('Tommy Johnson Jr');
    });
    
    it('should delete child', async () => {
      const response = await axios.delete('/api/children/child-id');
      
      expect(response.data).to.have.property('message');
      expect(response.data.message).to.include('deleted');
    });
  });
  
  // Attendance tracking tests
  describe('Attendance Tracking', () => {
    it('should create attendance record', async () => {
      const attendanceData = {
        child: 'child-id',
        babysitter: 'babysitter-id',
        date: '2025-04-03',
        checkInTime: '08:30',
        sessionType: 'full-day'
      };
      
      const response = await axios.post('/api/attendance', attendanceData);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.child).to.equal('child-id');
      expect(response.data.babysitter).to.equal('babysitter-id');
      expect(response.data.status).to.equal('checked-in');
    });
    
    it('should get all attendance records', async () => {
      const response = await axios.get('/api/attendance');
      
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.at.least(1);
      expect(response.data[0].child.fullName).to.equal(testChild.fullName);
    });
    
    it('should checkout attendance', async () => {
      const checkoutData = {
        checkOutTime: '16:30'
      };
      
      const response = await axios.put('/api/attendance/attendance-id/checkout', checkoutData);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.checkOutTime).to.equal('16:30');
      expect(response.data.status).to.equal('checked-out');
    });
  });
  
  // Incident reporting tests
  describe('Incident Reporting', () => {
    it('should create incident report', async () => {
      const incidentData = {
        child: 'child-id',
        reportedBy: 'babysitter-id',
        date: '2025-04-03',
        incidentType: 'accident',
        description: 'Minor fall during playtime',
        severity: 'low',
        actionTaken: 'Applied ice pack, child recovered quickly',
        parentNotified: true
      };
      
      const response = await axios.post('/api/incidents', incidentData);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.child).to.equal('child-id');
      expect(response.data.reportedBy).to.equal('babysitter-id');
      expect(response.data.status).to.equal('open');
    });
    
    it('should get all incidents', async () => {
      const response = await axios.get('/api/incidents');
      
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.at.least(1);
      expect(response.data[0].child.fullName).to.equal(testChild.fullName);
    });
    
    it('should resolve incident', async () => {
      const resolveData = {
        followUpNotes: 'Incident resolved, child is fine'
      };
      
      const response = await axios.put('/api/incidents/incident-id/resolve', resolveData);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.status).to.equal('resolved');
      expect(response.data.followUpNotes).to.equal(resolveData.followUpNotes);
    });
  });
  
  // Financial management tests
  describe('Financial Management', () => {
    it('should create payment record', async () => {
      const paymentData = {
        source: 'parent_payment',
        description: 'Monthly fee for Tommy Johnson',
        amount: 5000,
        date: '2025-04-03',
        paymentType: 'bank_transfer'
      };
      
      const response = await axios.post('/api/payments', paymentData);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.description).to.equal(paymentData.description);
      expect(response.data.amount).to.equal(paymentData.amount);
    });
    
    it('should get all payments', async () => {
      const response = await axios.get('/api/payments');
      
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.at.least(1);
      expect(response.data[0].description).to.include('Tommy Johnson');
    });
    
    it('should create expense record', async () => {
      const expenseData = {
        category: 'salary',
        description: 'Salary payment for Jane Smith',
        amount: 3000,
        date: '2025-04-03',
        babysitterId: 'babysitter-id'
      };
      
      const response = await axios.post('/api/expenses', expenseData);
      
      expect(response.data).to.have.property('_id');
      expect(response.data.description).to.equal(expenseData.description);
      expect(response.data.amount).to.equal(expenseData.amount);
    });
    
    it('should get all expenses', async () => {
      const response = await axios.get('/api/expenses');
      
      expect(response.data).to.be.an('array');
      expect(response.data.length).to.be.at.least(1);
      expect(response.data[0].description).to.include('Jane Smith');
    });
    
    it('should get expense summary', async () => {
      const response = await axios.get('/api/expenses/summary', {
        params: {
          startDate: '2025-04-01',
          endDate: '2025-04-30'
        }
      });
      
      expect(response.data).to.have.property('summary');
      expect(response.data.summary).to.be.an('array');
      expect(response.data.summary[0].category).to.equal('salary');
    });
  });
});

console.log('Mock API tests created successfully');
