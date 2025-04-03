const mongoose = require('mongoose');

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
    required: [true, 'Please add a National Identification Number'],
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add date of birth']
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate age between 21-35 years
BabysitterSchema.pre('save', function(next) {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 21 || age > 35) {
    return next(new Error('Babysitter age must be between 21 and 35 years'));
  }
  
  next();
});

module.exports = mongoose.model('Babysitter', BabysitterSchema);
