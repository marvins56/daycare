const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.ObjectId,
    ref: 'Child',
    required: [true, 'Please add child reference']
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Babysitter',
    required: [true, 'Please add babysitter who reported the incident']
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Please add incident date']
  },
  incidentType: {
    type: String,
    enum: ['health', 'behavior', 'accident', 'other'],
    required: [true, 'Please specify incident type']
  },
  description: {
    type: String,
    required: [true, 'Please add incident description']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  actionTaken: {
    type: String,
    required: [true, 'Please describe action taken']
  },
  parentNotified: {
    type: Boolean,
    default: false
  },
  notificationTime: {
    type: Date
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpNotes: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  }
});

module.exports = mongoose.model('Incident', IncidentSchema);
