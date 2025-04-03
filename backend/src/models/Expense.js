const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['salary', 'toys', 'maintenance', 'utilities', 'other'],
    required: [true, 'Please specify expense category']
  },
  description: {
    type: String,
    required: [true, 'Please add expense description']
  },
  amount: {
    type: Number,
    required: [true, 'Please add expense amount']
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Please add expense date']
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add user who approved expense']
  },
  receiptImage: {
    type: String
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
