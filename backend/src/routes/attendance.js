const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Models
const Attendance = require('../models/Attendance');
const Child = require('../models/Child');
const Babysitter = require('../models/Babysitter');

// @route   POST api/attendance
// @desc    Create a new attendance record
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('child', 'Child ID is required').not().isEmpty(),
      check('babysitter', 'Babysitter ID is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('sessionType', 'Session type is required').isIn(['half-day', 'full-day']),
      check('checkInTime', 'Check-in time is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Verify child exists
      const child = await Child.findById(req.body.child);
      if (!child) {
        return res.status(404).json({ msg: 'Child not found' });
      }

      // Verify babysitter exists
      const babysitter = await Babysitter.findById(req.body.babysitter);
      if (!babysitter) {
        return res.status(404).json({ msg: 'Babysitter not found' });
      }

      // Check if child already has an active attendance record for the day
      const existingAttendance = await Attendance.findOne({
        child: req.body.child,
        date: new Date(req.body.date).toISOString().split('T')[0],
        status: 'checked-in'
      });

      if (existingAttendance) {
        return res.status(400).json({ msg: 'Child already checked in for today' });
      }

      // Create attendance record
      const attendance = new Attendance({
        child: req.body.child,
        babysitter: req.body.babysitter,
        date: req.body.date,
        sessionType: req.body.sessionType,
        checkInTime: req.body.checkInTime,
        notes: req.body.notes
      });

      await attendance.save();

      // Populate the child and babysitter information
      const populatedAttendance = await Attendance.findById(attendance._id)
        .populate('child', 'fullName')
        .populate('babysitter', 'firstName lastName');

      res.status(201).json(populatedAttendance);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/attendance
// @desc    Get all attendance records
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Filter by date if provided
    const filter = {};
    if (req.query.date) {
      filter.date = req.query.date;
    }

    const attendance = await Attendance.find(filter)
      .populate('child', 'fullName')
      .populate('babysitter', 'firstName lastName')
      .sort({ date: -1, checkInTime: -1 });

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/attendance/:id
// @desc    Get attendance record by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('child', 'fullName')
      .populate('babysitter', 'firstName lastName');

    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/attendance/:id/checkout
// @desc    Check out a child
// @access  Private
router.put('/:id/checkout', protect, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }

    if (attendance.status === 'checked-out') {
      return res.status(400).json({ msg: 'Child already checked out' });
    }

    // Update checkout time and status
    attendance.checkOutTime = req.body.checkOutTime || new Date().toTimeString().slice(0, 5);
    attendance.status = 'checked-out';
    attendance.notes = req.body.notes || attendance.notes;

    await attendance.save();

    // Populate the child and babysitter information
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('child', 'fullName')
      .populate('babysitter', 'firstName lastName');

    res.json(populatedAttendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/attendance/:id
// @desc    Delete attendance record
// @access  Private/Manager
router.delete('/:id', [protect, authorize('manager')], async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }

    await attendance.remove();

    res.json({ msg: 'Attendance record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Attendance record not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
