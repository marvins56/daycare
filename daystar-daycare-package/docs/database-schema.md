# Daystar Daycare Management System - Database Schema Documentation

## Overview

This document provides detailed information about the database schema used in the Daystar Daycare Management System. The system uses MongoDB as its database with Mongoose as the ODM (Object Document Mapper).

## Collections

The database consists of the following collections:

1. Users
2. Babysitters
3. Children
4. Attendance
5. Incidents
6. Payments
7. Expenses

## Schema Definitions

### User Schema

```javascript
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['manager', 'babysitter'],
    default: 'babysitter'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Fields:
- **name**: User's full name
- **email**: User's email address (unique, used for login)
- **password**: Hashed password (minimum 6 characters)
- **role**: User role (manager or babysitter)
- **createdAt**: Timestamp when the user was created

### Babysitter Schema

```javascript
const BabysitterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  nationalId: {
    type: String,
    required: [true, 'Please add a national ID'],
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add date of birth'],
    validate: {
      validator: function(value) {
        const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
        return age >= 21 && age <= 35;
      },
      message: 'Babysitter must be between 21 and 35 years old'
    }
  },
  nextOfKin: {
    name: {
      type: String,
      required: [true, 'Please add next of kin name']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add next of kin phone number']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Fields:
- **firstName**: Babysitter's first name
- **lastName**: Babysitter's last name
- **email**: Babysitter's email address
- **phoneNumber**: Babysitter's phone number
- **nationalId**: Babysitter's national ID (unique)
- **dateOfBirth**: Babysitter's date of birth (with age validation)
- **nextOfKin**: Object containing next of kin information
  - **name**: Next of kin's name
  - **phoneNumber**: Next of kin's phone number
- **createdAt**: Timestamp when the babysitter was created

### Child Schema

```javascript
const ChildSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a full name']
  },
  age: {
    type: Number,
    required: [true, 'Please add age'],
    min: [0, 'Age must be at least 0'],
    max: [12, 'Age must not exceed 12']
  },
  parent: {
    name: {
      type: String,
      required: [true, 'Please add parent name']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add parent phone number']
    },
    email: {
      type: String,
      required: [true, 'Please add parent email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    }
  },
  specialCareNeeds: {
    allergies: {
      type: String,
      default: 'None'
    },
    medicalConditions: {
      type: String,
      default: 'None'
    },
    dietaryRestrictions: {
      type: String,
      default: 'None'
    },
    other: {
      type: String,
      default: 'None'
    }
  },
  sessionType: {
    type: String,
    enum: ['full-day', 'half-day'],
    required: [true, 'Please specify session type']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Fields:
- **fullName**: Child's full name
- **age**: Child's age (between 0 and 12)
- **parent**: Object containing parent information
  - **name**: Parent's name
  - **phoneNumber**: Parent's phone number
  - **email**: Parent's email address
- **specialCareNeeds**: Object containing special care needs information
  - **allergies**: Child's allergies
  - **medicalConditions**: Child's medical conditions
  - **dietaryRestrictions**: Child's dietary restrictions
  - **other**: Other special care needs
- **sessionType**: Type of session (full-day or half-day)
- **createdAt**: Timestamp when the child was created

### Attendance Schema

```javascript
const AttendanceSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'Please add a child']
  },
  babysitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Babysitter',
    required: [true, 'Please add a babysitter']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  checkInTime: {
    type: String,
    required: [true, 'Please add check-in time']
  },
  checkOutTime: {
    type: String,
    default: null
  },
  sessionType: {
    type: String,
    enum: ['full-day', 'half-day'],
    required: [true, 'Please specify session type']
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out'],
    default: 'checked-in'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Fields:
- **child**: Reference to the Child document
- **babysitter**: Reference to the Babysitter document
- **date**: Date of attendance
- **checkInTime**: Time when the child was checked in
- **checkOutTime**: Time when the child was checked out (null if not checked out yet)
- **sessionType**: Type of session (full-day or half-day)
- **status**: Status of attendance (checked-in or checked-out)
- **notes**: Additional notes about the attendance
- **createdAt**: Timestamp when the attendance record was created

### Incident Schema

```javascript
const IncidentSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: [true, 'Please add a child']
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Babysitter',
    required: [true, 'Please add who reported the incident']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  incidentType: {
    type: String,
    enum: ['health', 'behavior', 'accident', 'other'],
    required: [true, 'Please specify incident type']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: [true, 'Please specify severity']
  },
  actionTaken: {
    type: String,
    required: [true, 'Please add action taken']
  },
  parentNotified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Fields:
- **child**: Reference to the Child document
- **reportedBy**: Reference to the Babysitter document who reported the incident
- **date**: Date of the incident
- **incidentType**: Type of incident (health, behavior, accident, other)
- **description**: Detailed description of the incident
- **severity**: Severity of the incident (low, medium, high)
- **actionTaken**: Actions taken to address the incident
- **parentNotified**: Whether the parent has been notified
- **status**: Status of the incident (open or resolved)
- **followUpRequired**: Whether follow-up is required
- **followUpNotes**: Notes about the follow-up
- **createdAt**: Timestamp when the incident record was created

### Payment Schema

```javascript
const PaymentSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['parent_payment', 'donation', 'grant', 'other'],
    required: [true, 'Please specify payment source']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount must be at least 0']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  paymentType: {
    type: String,
    enum: ['cash', 'bank_transfer', 'mobile_money', 'check', 'other'],
    required: [true, 'Please specify payment type']
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Fields:
- **source**: Source of the payment (parent_payment, donation, grant, other)
- **description**: Description of the payment
- **amount**: Amount of the payment
- **date**: Date of the payment
- **paymentType**: Type of payment (cash, bank_transfer, mobile_money, check, other)
- **notes**: Additional notes about the payment
- **createdAt**: Timestamp when the payment record was created

### Expense Schema

```javascript
const ExpenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['salary', 'toys', 'maintenance', 'utilities', 'other'],
    required: [true, 'Please specify expense category']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount must be at least 0']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  babysitter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Babysitter',
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Fields:
- **category**: Category of the expense (salary, toys, maintenance, utilities, other)
- **description**: Description of the expense
- **amount**: Amount of the expense
- **date**: Date of the expense
- **babysitter**: Reference to the Babysitter document (for salary expenses)
- **notes**: Additional notes about the expense
- **createdAt**: Timestamp when the expense record was created

## Relationships

The database schema includes the following relationships:

1. **Attendance to Child**: Many-to-One (Each attendance record is associated with one child)
2. **Attendance to Babysitter**: Many-to-One (Each attendance record is associated with one babysitter)
3. **Incident to Child**: Many-to-One (Each incident is associated with one child)
4. **Incident to Babysitter**: Many-to-One (Each incident is reported by one babysitter)
5. **Expense to Babysitter**: Many-to-One (Some expenses, particularly salaries, are associated with one babysitter)

## Indexes

The following indexes are created to improve query performance:

1. **User.email**: Unique index for user email
2. **Babysitter.email**: Unique index for babysitter email
3. **Babysitter.nationalId**: Unique index for babysitter national ID
4. **Attendance.date**: Index for querying attendance by date
5. **Incident.date**: Index for querying incidents by date
6. **Payment.date**: Index for querying payments by date
7. **Expense.date**: Index for querying expenses by date

## Data Validation

The schema includes the following validation rules:

1. **User.email**: Must be a valid email format
2. **User.password**: Minimum length of 6 characters
3. **Babysitter.email**: Must be a valid email format
4. **Babysitter.dateOfBirth**: Must result in an age between 21 and 35 years
5. **Child.age**: Must be between 0 and 12
6. **Child.parent.email**: Must be a valid email format
7. **Payment.amount**: Must be at least 0
8. **Expense.amount**: Must be at least 0

## Middleware

The schema includes the following middleware:

1. **User.pre('save')**: Hashes the password before saving
2. **Attendance.pre('save')**: Sets the status to 'checked-out' if checkOutTime is provided
3. **Incident.pre('findOneAndUpdate')**: Sets the status to 'resolved' if followUpNotes is provided

## Conclusion

This database schema provides a solid foundation for the Daystar Daycare Management System, allowing for efficient storage and retrieval of data while maintaining data integrity through validation rules and relationships.
