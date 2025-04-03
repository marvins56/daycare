# Daystar Daycare Management System - System Documentation

## 1. System Overview

The Daystar Daycare Management System is a comprehensive web application designed to manage all aspects of a daycare center's operations. The system provides functionality for managing babysitters, children, attendance, incidents, and finances.

### 1.1 Purpose

This system aims to streamline the administrative processes of the Daystar Daycare Center, reducing paperwork, improving data accuracy, and enhancing communication between staff and parents.

### 1.2 Features

- **User Authentication and Authorization**: Secure login system with role-based access control
- **Babysitter Management**: Registration, scheduling, and payment tracking
- **Child Management**: Registration, special care needs tracking, and parent information
- **Attendance Tracking**: Check-in and check-out system for children
- **Incident Reporting**: Documentation and follow-up of incidents
- **Financial Management**: Income and expense tracking, reporting, and budgeting

## 2. System Architecture

### 2.1 Technology Stack

The Daystar Daycare Management System is built using the MERN stack:

- **Frontend**: React.js with Bootstrap for responsive design
- **Backend**: Express.js RESTful API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)

### 2.2 System Components

![System Architecture](system-architecture.png)

#### 2.2.1 Frontend Components

- **Authentication Components**: Login, registration, and user profile
- **Dashboard**: Overview of key metrics and notifications
- **Babysitter Management**: CRUD operations for babysitters
- **Child Management**: CRUD operations for children
- **Attendance Tracking**: Check-in/check-out interface
- **Incident Reporting**: Incident creation and resolution
- **Financial Management**: Income/expense tracking and reporting

#### 2.2.2 Backend Components

- **API Routes**: RESTful endpoints for all system features
- **Controllers**: Business logic implementation
- **Models**: Database schema definitions
- **Middleware**: Authentication, validation, and error handling
- **Config**: Environment configuration

#### 2.2.3 Database Design

The system uses MongoDB with the following collections:
- Users
- Babysitters
- Children
- Attendance
- Incidents
- Payments
- Expenses

## 3. Installation and Setup

### 3.1 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn package manager

### 3.2 Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/daystar/daycare-management.git
   cd daycare-management
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/daystar-daycare
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     ```

5. Start the development servers:
   - Backend: `npm run dev` (from the backend directory)
   - Frontend: `npm start` (from the frontend directory)

## 4. User Guide

### 4.1 Authentication

#### 4.1.1 Login
1. Navigate to the login page
2. Enter your email and password
3. Click the "Login" button

#### 4.1.2 User Roles
- **Manager**: Full access to all system features
- **Babysitter**: Limited access to attendance, children, and incident reporting

### 4.2 Babysitter Management

#### 4.2.1 Adding a Babysitter
1. Navigate to the Babysitter Management page
2. Click "Add Babysitter"
3. Fill in the required information:
   - First Name
   - Last Name
   - Phone Number
   - National ID
   - Date of Birth
   - Next of Kin Information
4. Click "Add Babysitter" to save

#### 4.2.2 Editing a Babysitter
1. Navigate to the Babysitter Management page
2. Find the babysitter in the list
3. Click the "Edit" button
4. Update the information
5. Click "Update Babysitter" to save changes

### 4.3 Child Management

#### 4.3.1 Adding a Child
1. Navigate to the Child Management page
2. Click "Add Child"
3. Fill in the required information:
   - Full Name
   - Age
   - Parent/Guardian Information
   - Session Type (Full Day/Half Day)
   - Special Care Needs (if any)
4. Click "Add Child" to save

#### 4.3.2 Editing a Child
1. Navigate to the Child Management page
2. Find the child in the list
3. Click the "Edit" button
4. Update the information
5. Click "Update Child Record" to save changes

### 4.4 Attendance Tracking

#### 4.4.1 Checking In a Child
1. Navigate to the Attendance Tracking page
2. Click "Check In"
3. Select the child, babysitter, and session type
4. Enter check-in time
5. Add any notes if necessary
6. Click "Check In" to record attendance

#### 4.4.2 Checking Out a Child
1. Navigate to the Attendance Tracking page
2. Find the child in the active attendance list
3. Click "Check Out"
4. The system will automatically record the check-out time

### 4.5 Incident Reporting

#### 4.5.1 Reporting an Incident
1. Navigate to the Incident Reporting page
2. Click "Report Incident"
3. Fill in the required information:
   - Child involved
   - Reported by
   - Incident type and severity
   - Description
   - Action taken
   - Parent notification status
4. Click "Submit Report" to save

#### 4.5.2 Resolving an Incident
1. Navigate to the Incident Reporting page
2. Find the incident in the list
3. Click "Resolve"
4. Add follow-up notes if necessary
5. Click "Resolve Incident" to update the status

### 4.6 Financial Management

#### 4.6.1 Recording Income
1. Navigate to the Financial Management page
2. Select the "Income" tab
3. Click "Add Income"
4. Fill in the required information:
   - Source
   - Description
   - Amount
   - Date
   - Payment Type
5. Click "Save" to record the income

#### 4.6.2 Recording Expenses
1. Navigate to the Financial Management page
2. Select the "Expenses" tab
3. Click "Add Expense"
4. Fill in the required information:
   - Category
   - Description
   - Amount
   - Date
   - Babysitter (if salary expense)
5. Click "Save" to record the expense

## 5. API Documentation

### 5.1 Authentication Endpoints

#### 5.1.1 Login
- **URL**: `/api/auth/login`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "manager"
    }
  }
  ```

#### 5.1.2 Register
- **URL**: `/api/auth/register`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "babysitter"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "New User",
      "email": "newuser@example.com",
      "role": "babysitter"
    }
  }
  ```

### 5.2 Babysitter Endpoints

#### 5.2.1 Get All Babysitters
- **URL**: `/api/babysitters`
- **Method**: GET
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Response**:
  ```json
  [
    {
      "_id": "babysitter_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phoneNumber": "08012345678",
      "nationalId": "AB12345678",
      "dateOfBirth": "1995-05-15",
      "nextOfKin": {
        "name": "John Smith",
        "phoneNumber": "08087654321"
      }
    }
  ]
  ```

#### 5.2.2 Get Babysitter by ID
- **URL**: `/api/babysitters/:id`
- **Method**: GET
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Response**:
  ```json
  {
    "_id": "babysitter_id",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "08012345678",
    "nationalId": "AB12345678",
    "dateOfBirth": "1995-05-15",
    "nextOfKin": {
      "name": "John Smith",
      "phoneNumber": "08087654321"
    }
  }
  ```

#### 5.2.3 Create Babysitter
- **URL**: `/api/babysitters`
- **Method**: POST
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Request Body**:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "08012345678",
    "nationalId": "AB12345678",
    "dateOfBirth": "1995-05-15",
    "nextOfKin": {
      "name": "John Smith",
      "phoneNumber": "08087654321"
    }
  }
  ```
- **Response**:
  ```json
  {
    "_id": "babysitter_id",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phoneNumber": "08012345678",
    "nationalId": "AB12345678",
    "dateOfBirth": "1995-05-15",
    "nextOfKin": {
      "name": "John Smith",
      "phoneNumber": "08087654321"
    }
  }
  ```

### 5.3 Child Endpoints

#### 5.3.1 Get All Children
- **URL**: `/api/children`
- **Method**: GET
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Response**:
  ```json
  [
    {
      "_id": "child_id",
      "fullName": "Tommy Johnson",
      "age": 5,
      "parent": {
        "name": "Sarah Johnson",
        "phoneNumber": "08023456789",
        "email": "sarah.johnson@example.com"
      },
      "specialCareNeeds": {
        "allergies": "Peanuts",
        "medicalConditions": "None",
        "dietaryRestrictions": "No peanuts",
        "other": "None"
      },
      "sessionType": "full-day"
    }
  ]
  ```

### 5.4 Attendance Endpoints

#### 5.4.1 Create Attendance Record
- **URL**: `/api/attendance`
- **Method**: POST
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Request Body**:
  ```json
  {
    "child": "child_id",
    "babysitter": "babysitter_id",
    "date": "2025-04-03",
    "checkInTime": "08:30",
    "sessionType": "full-day",
    "notes": "Child brought extra snacks"
  }
  ```

### 5.5 Incident Endpoints

#### 5.5.1 Create Incident Report
- **URL**: `/api/incidents`
- **Method**: POST
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Request Body**:
  ```json
  {
    "child": "child_id",
    "reportedBy": "babysitter_id",
    "date": "2025-04-03",
    "incidentType": "accident",
    "description": "Minor fall during playtime",
    "severity": "low",
    "actionTaken": "Applied ice pack, child recovered quickly",
    "parentNotified": true
  }
  ```

### 5.6 Financial Endpoints

#### 5.6.1 Create Payment
- **URL**: `/api/payments`
- **Method**: POST
- **Headers**: `Authorization: Bearer jwt_token_here`
- **Request Body**:
  ```json
  {
    "source": "parent_payment",
    "description": "Monthly fee for Tommy Johnson",
    "amount": 5000,
    "date": "2025-04-03",
    "paymentType": "bank_transfer"
  }
  ```

## 6. Database Schema

### 6.1 User Schema
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date
}
```

### 6.2 Babysitter Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  nationalId: String,
  dateOfBirth: Date,
  nextOfKin: {
    name: String,
    phoneNumber: String
  },
  createdAt: Date
}
```

### 6.3 Child Schema
```javascript
{
  fullName: String,
  age: Number,
  parent: {
    name: String,
    phoneNumber: String,
    email: String
  },
  specialCareNeeds: {
    allergies: String,
    medicalConditions: String,
    dietaryRestrictions: String,
    other: String
  },
  sessionType: String,
  createdAt: Date
}
```

### 6.4 Attendance Schema
```javascript
{
  child: ObjectId,
  babysitter: ObjectId,
  date: Date,
  checkInTime: String,
  checkOutTime: String,
  sessionType: String,
  status: String,
  notes: String,
  createdAt: Date
}
```

### 6.5 Incident Schema
```javascript
{
  child: ObjectId,
  reportedBy: ObjectId,
  date: Date,
  incidentType: String,
  description: String,
  severity: String,
  actionTaken: String,
  parentNotified: Boolean,
  status: String,
  followUpRequired: Boolean,
  followUpNotes: String,
  createdAt: Date
}
```

### 6.6 Payment Schema
```javascript
{
  source: String,
  description: String,
  amount: Number,
  date: Date,
  paymentType: String,
  notes: String,
  createdAt: Date
}
```

### 6.7 Expense Schema
```javascript
{
  category: String,
  description: String,
  amount: Number,
  date: Date,
  babysitter: ObjectId,
  notes: String,
  createdAt: Date
}
```

## 7. Security Considerations

### 7.1 Authentication and Authorization
- JSON Web Tokens (JWT) for authentication
- Role-based access control for authorization
- Password hashing using bcrypt

### 7.2 Data Validation
- Input validation on both frontend and backend
- Mongoose schema validation for database integrity

### 7.3 Error Handling
- Proper error handling to prevent information leakage
- Consistent error responses from API endpoints

## 8. Maintenance and Support

### 8.1 Backup Strategy
- Regular database backups
- Application state persistence

### 8.2 Monitoring
- Error logging and monitoring
- Performance metrics tracking

### 8.3 Updates and Upgrades
- Regular security updates
- Feature enhancements based on user feedback

## 9. Conclusion

The Daystar Daycare Management System provides a comprehensive solution for managing all aspects of a daycare center's operations. The system is designed to be user-friendly, secure, and scalable to meet the growing needs of the daycare center.
