const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.ObjectId,
    ref: 'Child',
    required: [true, 'Please add child reference']
  },
  babysitter: {
    type: mongoose.Schema.ObjectId,
    ref: 'Babysitter',
    required: [true, 'Please add babysitter reference']
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Please add attendance date']
  },
  sessionType: {
    type: String,
    enum: ['half-day', 'full-day'],
    required: [true, 'Please specify session type']
  },
  checkInTime: {
    type: Date,
    required: [true, 'Please add check-in time']
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out'],
    default: 'checked-in'
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
