const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  babysitter: {
    type: mongoose.Schema.ObjectId,
    ref: 'Babysitter',
    required: [true, 'Please add babysitter reference']
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Please add payment date']
  },
  childrenCount: {
    halfDay: {
      type: Number,
      default: 0
    },
    fullDay: {
      type: Number,
      default: 0
    }
  },
  amountPerChild: {
    halfDay: {
      type: Number,
      default: 2000
    },
    fullDay: {
      type: Number,
      default: 5000
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please add total payment amount']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  }
});

// Calculate total amount before saving
PaymentSchema.pre('save', function(next) {
  this.totalAmount = 
    (this.childrenCount.halfDay * this.amountPerChild.halfDay) + 
    (this.childrenCount.fullDay * this.amountPerChild.fullDay);
  
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
