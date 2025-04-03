const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add child\'s full name']
  },
  age: {
    type: Number,
    required: [true, 'Please add child\'s age']
  },
  parent: {
    name: {
      type: String,
      required: [true, 'Please add parent/guardian name']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add parent/guardian phone number']
    },
    email: {
      type: String,
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
    enum: ['half-day', 'full-day'],
    required: [true, 'Please specify session type']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Child', ChildSchema);
