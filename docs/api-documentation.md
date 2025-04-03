# Daystar Daycare Management System - API Documentation

## Overview

This document provides detailed information about the API endpoints available in the Daystar Daycare Management System. The API follows RESTful principles and uses JSON for data exchange.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api
```

## Authentication

Most API endpoints require authentication. Authentication is handled using JSON Web Tokens (JWT).

### Headers

For authenticated endpoints, include the following header:

```
Authorization: Bearer <jwt_token>
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "msg": "Error message describing what went wrong"
}
```

## Endpoints

### Authentication

#### Login

- **URL**: `/auth/login`
- **Method**: POST
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "manager"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "msg": "Invalid credentials"
  }
  ```

#### Register

- **URL**: `/auth/register`
- **Method**: POST
- **Authentication**: None (or Manager role for creating new users)
- **Request Body**:
  ```json
  {
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "role": "babysitter"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "New User",
      "email": "newuser@example.com",
      "role": "babysitter"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "msg": "User already exists"
  }
  ```

#### Get Current User

- **URL**: `/auth/me`
- **Method**: GET
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "manager"
    }
  }
  ```

### Babysitters

#### Get All Babysitters

- **URL**: `/babysitters`
- **Method**: GET
- **Authentication**: Required
- **Query Parameters**:
  - `name` (optional): Filter by name
- **Success Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
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
        },
        "createdAt": "2025-04-01T10:00:00.000Z"
      }
    ]
  }
  ```

#### Get Babysitter by ID

- **URL**: `/babysitters/:id`
- **Method**: GET
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
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
      },
      "createdAt": "2025-04-01T10:00:00.000Z"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "msg": "Babysitter not found"
  }
  ```

#### Create Babysitter

- **URL**: `/babysitters`
- **Method**: POST
- **Authentication**: Required (Manager role)
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
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
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
      },
      "createdAt": "2025-04-03T10:00:00.000Z"
    }
  }
  ```

#### Update Babysitter

- **URL**: `/babysitters/:id`
- **Method**: PUT
- **Authentication**: Required (Manager role)
- **Request Body**:
  ```json
  {
    "firstName": "Jane Updated",
    "phoneNumber": "08099999999"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "babysitter_id",
      "firstName": "Jane Updated",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phoneNumber": "08099999999",
      "nationalId": "AB12345678",
      "dateOfBirth": "1995-05-15",
      "nextOfKin": {
        "name": "John Smith",
        "phoneNumber": "08087654321"
      },
      "createdAt": "2025-04-01T10:00:00.000Z"
    }
  }
  ```

#### Delete Babysitter

- **URL**: `/babysitters/:id`
- **Method**: DELETE
- **Authentication**: Required (Manager role)
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

### Children

#### Get All Children

- **URL**: `/children`
- **Method**: GET
- **Authentication**: Required
- **Query Parameters**:
  - `name` (optional): Filter by name
- **Success Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
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
        "sessionType": "full-day",
        "createdAt": "2025-04-01T10:00:00.000Z"
      }
    ]
  }
  ```

#### Get Child by ID

- **URL**: `/children/:id`
- **Method**: GET
- **Authentication**: Required
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
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
      "sessionType": "full-day",
      "createdAt": "2025-04-01T10:00:00.000Z"
    }
  }
  ```

#### Create Child

- **URL**: `/children`
- **Method**: POST
- **Authentication**: Required
- **Request Body**:
  ```json
  {
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
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
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
      "sessionType": "full-day",
      "createdAt": "2025-04-03T10:00:00.000Z"
    }
  }
  ```

### Attendance

#### Get All Attendance Records

- **URL**: `/attendance`
- **Method**: GET
- **Authentication**: Required
- **Query Parameters**:
  - `date` (optional): Filter by date (YYYY-MM-DD)
- **Success Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "attendance_id",
        "child": {
          "_id": "child_id",
          "fullName": "Tommy Johnson"
        },
        "babysitter": {
          "_id": "babysitter_id",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "date": "2025-04-03",
        "checkInTime": "08:30",
        "checkOutTime": null,
        "sessionType": "full-day",
        "status": "checked-in",
        "notes": "Child brought extra snacks",
        "createdAt": "2025-04-03T08:30:00.000Z"
      }
    ]
  }
  ```

#### Create Attendance Record

- **URL**: `/attendance`
- **Method**: POST
- **Authentication**: Required
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
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "attendance_id",
      "child": "child_id",
      "babysitter": "babysitter_id",
      "date": "2025-04-03",
      "checkInTime": "08:30",
      "checkOutTime": null,
      "sessionType": "full-day",
      "status": "checked-in",
      "notes": "Child brought extra snacks",
      "createdAt": "2025-04-03T08:30:00.000Z"
    }
  }
  ```

#### Check Out

- **URL**: `/attendance/:id/checkout`
- **Method**: PUT
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "checkOutTime": "16:30"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "attendance_id",
      "child": "child_id",
      "babysitter": "babysitter_id",
      "date": "2025-04-03",
      "checkInTime": "08:30",
      "checkOutTime": "16:30",
      "sessionType": "full-day",
      "status": "checked-out",
      "notes": "Child brought extra snacks",
      "createdAt": "2025-04-03T08:30:00.000Z"
    }
  }
  ```

### Incidents

#### Get All Incidents

- **URL**: `/incidents`
- **Method**: GET
- **Authentication**: Required
- **Query Parameters**:
  - `status` (optional): Filter by status (open, resolved)
- **Success Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "incident_id",
        "child": {
          "_id": "child_id",
          "fullName": "Tommy Johnson"
        },
        "reportedBy": {
          "_id": "babysitter_id",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "date": "2025-04-03",
        "incidentType": "accident",
        "description": "Minor fall during playtime",
        "severity": "low",
        "actionTaken": "Applied ice pack, child recovered quickly",
        "parentNotified": true,
        "status": "open",
        "followUpRequired": false,
        "followUpNotes": "",
        "createdAt": "2025-04-03T10:15:00.000Z"
      }
    ]
  }
  ```

#### Create Incident

- **URL**: `/incidents`
- **Method**: POST
- **Authentication**: Required
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
    "parentNotified": true,
    "followUpRequired": false
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "incident_id",
      "child": "child_id",
      "reportedBy": "babysitter_id",
      "date": "2025-04-03",
      "incidentType": "accident",
      "description": "Minor fall during playtime",
      "severity": "low",
      "actionTaken": "Applied ice pack, child recovered quickly",
      "parentNotified": true,
      "status": "open",
      "followUpRequired": false,
      "followUpNotes": "",
      "createdAt": "2025-04-03T10:15:00.000Z"
    }
  }
  ```

#### Resolve Incident

- **URL**: `/incidents/:id/resolve`
- **Method**: PUT
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "followUpNotes": "Incident resolved, child is fine"
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "incident_id",
      "child": "child_id",
      "reportedBy": "babysitter_id",
      "date": "2025-04-03",
      "incidentType": "accident",
      "description": "Minor fall during playtime",
      "severity": "low",
      "actionTaken": "Applied ice pack, child recovered quickly",
      "parentNotified": true,
      "status": "resolved",
      "followUpRequired": false,
      "followUpNotes": "Incident resolved, child is fine",
      "createdAt": "2025-04-03T10:15:00.000Z"
    }
  }
  ```

### Payments

#### Get All Payments

- **URL**: `/payments`
- **Method**: GET
- **Authentication**: Required (Manager role)
- **Query Parameters**:
  - `startDate` (optional): Filter by start date (YYYY-MM-DD)
  - `endDate` (optional): Filter by end date (YYYY-MM-DD)
  - `source` (optional): Filter by source
- **Success Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "payment_id",
        "source": "parent_payment",
        "description": "Monthly fee for Tommy Johnson",
        "amount": 5000,
        "date": "2025-04-03",
        "paymentType": "bank_transfer",
        "notes": "",
        "createdAt": "2025-04-03T11:00:00.000Z"
      }
    ]
  }
  ```

#### Create Payment

- **URL**: `/payments`
- **Method**: POST
- **Authentication**: Required (Manager role)
- **Request Body**:
  ```json
  {
    "source": "parent_payment",
    "description": "Monthly fee for Tommy Johnson",
    "amount": 5000,
    "date": "2025-04-03",
    "paymentType": "bank_transfer",
    "notes": ""
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "payment_id",
      "source": "parent_payment",
      "description": "Monthly fee for Tommy Johnson",
      "amount": 5000,
      "date": "2025-04-03",
      "paymentType": "bank_transfer",
      "notes": "",
      "createdAt": "2025-04-03T11:00:00.000Z"
    }
  }
  ```

### Expenses

#### Get All Expenses

- **URL**: `/expenses`
- **Method**: GET
- **Authentication**: Required (Manager role)
- **Query Parameters**:
  - `startDate` (optional): Filter by start date (YYYY-MM-DD)
  - `endDate` (optional): Filter by end date (YYYY-MM-DD)
  - `category` (optional): Filter by category
- **Success Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "expense_id",
        "category": "salary",
        "description": "Salary payment for Jane Smith",
        "amount": 3000,
        "date": "2025-04-03",
        "babysitter": {
          "_id": "babysitter_id",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "notes": "",
        "createdAt": "2025-04-03T11:30:00.000Z"
      }
    ]
  }
  ```

#### Create Expense

- **URL**: `/expenses`
- **Method**: POST
- **Authentication**: Required (Manager role)
- **Request Body**:
  ```json
  {
    "category": "salary",
    "description": "Salary payment for Jane Smith",
    "amount": 3000,
    "date": "2025-04-03",
    "babysitterId": "babysitter_id",
    "notes": ""
  }
  ```
- **Success Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "expense_id",
      "category": "salary",
      "description": "Salary payment for Jane Smith",
      "amount": 3000,
      "date": "2025-04-03",
      "babysitter": "babysitter_id",
      "notes": "",
      "createdAt": "2025-04-03T11:30:00.000Z"
    }
  }
  ```

#### Get Expense Summary

- **URL**: `/expenses/summary`
- **Method**: GET
- **Authentication**: Required (Manager role)
- **Query Parameters**:
  - `startDate` (required): Start date (YYYY-MM-DD)
  - `endDate` (required): End date (YYYY-MM-DD)
- **Success Response**:
  ```json
  {
    "success": true,
    "summary": [
      {
        "category": "salary",
        "totalAmount": 3000,
        "count": 1
      },
      {
        "category": "toys",
        "totalAmount": 500,
        "count": 2
      }
    ],
    "total": 3500
  }
  ```

## Status Codes

- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Clients are limited to 100 requests per hour.

## Versioning

The current API version is v1. All endpoints are prefixed with `/api`.

## Support

For API support, please contact the system administrator.
