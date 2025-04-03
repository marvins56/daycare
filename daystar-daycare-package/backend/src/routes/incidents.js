const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Models
const Incident = require('../models/Incident');
const Child = require('../models/Child');
const Babysitter = require('../models/Babysitter');

// @route   POST api/incidents
// @desc    Create a new incident report
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('child', 'Child ID is required').not().isEmpty(),
      check('reportedBy', 'Babysitter ID is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('incidentType', 'Incident type is required').isIn(['health', 'behavior', 'accident', 'other']),
      check('description', 'Description is required').not().isEmpty(),
      check('severity', 'Severity is required').isIn(['low', 'medium', 'high']),
      check('actionTaken', 'Action taken is required').not().isEmpty()
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
      const babysitter = await Babysitter.findById(req.body.reportedBy);
      if (!babysitter) {
        return res.status(404).json({ msg: 'Babysitter not found' });
      }

      // Create incident report
      const incident = new Incident({
        child: req.body.child,
        reportedBy: req.body.reportedBy,
        date: req.body.date,
        incidentType: req.body.incidentType,
        description: req.body.description,
        severity: req.body.severity,
        actionTaken: req.body.actionTaken,
        parentNotified: req.body.parentNotified || false,
        notificationTime: req.body.parentNotified ? req.body.notificationTime || new Date() : null,
        followUpRequired: req.body.followUpRequired || false,
        followUpNotes: req.body.followUpNotes || ''
      });

      await incident.save();

      // Populate the child and babysitter information
      const populatedIncident = await Incident.findById(incident._id)
        .populate('child', 'fullName')
        .populate('reportedBy', 'firstName lastName');

      res.status(201).json(populatedIncident);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/incidents
// @desc    Get all incident reports
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Filter by status if provided
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const incidents = await Incident.find(filter)
      .populate('child', 'fullName')
      .populate('reportedBy', 'firstName lastName')
      .sort({ date: -1 });

    res.json(incidents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/incidents/:id
// @desc    Get incident report by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('child', 'fullName')
      .populate('reportedBy', 'firstName lastName');

    if (!incident) {
      return res.status(404).json({ msg: 'Incident report not found' });
    }

    res.json(incident);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Incident report not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/incidents/:id
// @desc    Update incident report
// @access  Private
router.put(
  '/:id',
  [
    protect,
    [
      check('description', 'Description is required').not().isEmpty(),
      check('actionTaken', 'Action taken is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const incident = await Incident.findById(req.params.id);

      if (!incident) {
        return res.status(404).json({ msg: 'Incident report not found' });
      }

      // Update incident fields
      if (req.body.incidentType) incident.incidentType = req.body.incidentType;
      if (req.body.description) incident.description = req.body.description;
      if (req.body.severity) incident.severity = req.body.severity;
      if (req.body.actionTaken) incident.actionTaken = req.body.actionTaken;
      
      // Update parent notification
      if (req.body.parentNotified !== undefined) {
        incident.parentNotified = req.body.parentNotified;
        if (req.body.parentNotified && !incident.notificationTime) {
          incident.notificationTime = req.body.notificationTime || new Date();
        }
      }
      
      // Update follow-up information
      if (req.body.followUpRequired !== undefined) {
        incident.followUpRequired = req.body.followUpRequired;
        if (req.body.followUpRequired) {
          incident.followUpNotes = req.body.followUpNotes || incident.followUpNotes;
        }
      }
      
      // Update status
      if (req.body.status) incident.status = req.body.status;

      await incident.save();

      // Populate the child and babysitter information
      const populatedIncident = await Incident.findById(incident._id)
        .populate('child', 'fullName')
        .populate('reportedBy', 'firstName lastName');

      res.json(populatedIncident);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/incidents/:id/resolve
// @desc    Resolve an incident
// @access  Private
router.put('/:id/resolve', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ msg: 'Incident report not found' });
    }

    if (incident.status === 'resolved') {
      return res.status(400).json({ msg: 'Incident already resolved' });
    }

    // Update status to resolved
    incident.status = 'resolved';
    if (req.body.followUpNotes) {
      incident.followUpNotes = req.body.followUpNotes;
    }

    await incident.save();

    // Populate the child and babysitter information
    const populatedIncident = await Incident.findById(incident._id)
      .populate('child', 'fullName')
      .populate('reportedBy', 'firstName lastName');

    res.json(populatedIncident);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/incidents/:id
// @desc    Delete incident report
// @access  Private/Manager
router.delete('/:id', [protect, authorize('manager')], async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ msg: 'Incident report not found' });
    }

    await incident.remove();

    res.json({ msg: 'Incident report removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Incident report not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
