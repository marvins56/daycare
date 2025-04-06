// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require('express-validator');

// // Middleware
// const { protect, authorize } = require('../middleware/auth');

// // Models
// const Incident = require('../models/Incident');
// const Child = require('../models/Child');
// const Babysitter = require('../models/Babysitter');

// // @route   POST api/incidents
// // @desc    Create a new incident report
// // @access  Private
// router.post(
//   '/',
//   [
//     protect,
//     [
//       check('child', 'Child ID is required').not().isEmpty(),
//       check('reportedBy', 'Babysitter ID is required').not().isEmpty(),
//       check('date', 'Date is required').not().isEmpty(),
//       check('incidentType', 'Incident type is required').isIn(['health', 'behavior', 'accident', 'other']),
//       check('description', 'Description is required').not().isEmpty(),
//       check('severity', 'Severity is required').isIn(['low', 'medium', 'high']),
//       check('actionTaken', 'Action taken is required').not().isEmpty()
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       // Verify child exists
//       const child = await Child.findById(req.body.child);
//       if (!child) {
//         return res.status(404).json({ msg: 'Child not found' });
//       }

//       // Verify babysitter exists
//       const babysitter = await Babysitter.findById(req.body.reportedBy);
//       if (!babysitter) {
//         return res.status(404).json({ msg: 'Babysitter not found' });
//       }

//       // Create incident report
//       const incident = new Incident({
//         child: req.body.child,
//         reportedBy: req.body.reportedBy,
//         date: req.body.date,
//         incidentType: req.body.incidentType,
//         description: req.body.description,
//         severity: req.body.severity,
//         actionTaken: req.body.actionTaken,
//         parentNotified: req.body.parentNotified || false,
//         notificationTime: req.body.parentNotified ? req.body.notificationTime || new Date() : null,
//         followUpRequired: req.body.followUpRequired || false,
//         followUpNotes: req.body.followUpNotes || ''
//       });

//       await incident.save();

//       // Populate the child and babysitter information
//       const populatedIncident = await Incident.findById(incident._id)
//         .populate('child', 'fullName')
//         .populate('reportedBy', 'firstName lastName');

//       res.status(201).json(populatedIncident);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   GET api/incidents
// // @desc    Get all incident reports
// // @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     // Filter by status if provided
//     const filter = {};
//     if (req.query.status) {
//       filter.status = req.query.status;
//     }

//     const incidents = await Incident.find(filter)
//       .populate('child', 'fullName')
//       .populate('reportedBy', 'firstName lastName')
//       .sort({ date: -1 });

//     res.json(incidents);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET api/incidents/:id
// // @desc    Get incident report by ID
// // @access  Private
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const incident = await Incident.findById(req.params.id)
//       .populate('child', 'fullName')
//       .populate('reportedBy', 'firstName lastName');

//     if (!incident) {
//       return res.status(404).json({ msg: 'Incident report not found' });
//     }

//     res.json(incident);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Incident report not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// // @route   PUT api/incidents/:id
// // @desc    Update incident report
// // @access  Private
// router.put(
//   '/:id',
//   [
//     protect,
//     [
//       check('description', 'Description is required').not().isEmpty(),
//       check('actionTaken', 'Action taken is required').not().isEmpty()
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const incident = await Incident.findById(req.params.id);

//       if (!incident) {
//         return res.status(404).json({ msg: 'Incident report not found' });
//       }

//       // Update incident fields
//       if (req.body.incidentType) incident.incidentType = req.body.incidentType;
//       if (req.body.description) incident.description = req.body.description;
//       if (req.body.severity) incident.severity = req.body.severity;
//       if (req.body.actionTaken) incident.actionTaken = req.body.actionTaken;
      
//       // Update parent notification
//       if (req.body.parentNotified !== undefined) {
//         incident.parentNotified = req.body.parentNotified;
//         if (req.body.parentNotified && !incident.notificationTime) {
//           incident.notificationTime = req.body.notificationTime || new Date();
//         }
//       }
      
//       // Update follow-up information
//       if (req.body.followUpRequired !== undefined) {
//         incident.followUpRequired = req.body.followUpRequired;
//         if (req.body.followUpRequired) {
//           incident.followUpNotes = req.body.followUpNotes || incident.followUpNotes;
//         }
//       }
      
//       // Update status
//       if (req.body.status) incident.status = req.body.status;

//       await incident.save();

//       // Populate the child and babysitter information
//       const populatedIncident = await Incident.findById(incident._id)
//         .populate('child', 'fullName')
//         .populate('reportedBy', 'firstName lastName');

//       res.json(populatedIncident);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   PUT api/incidents/:id/resolve
// // @desc    Resolve an incident
// // @access  Private
// router.put('/:id/resolve', protect, async (req, res) => {
//   try {
//     const incident = await Incident.findById(req.params.id);

//     if (!incident) {
//       return res.status(404).json({ msg: 'Incident report not found' });
//     }

//     if (incident.status === 'resolved') {
//       return res.status(400).json({ msg: 'Incident already resolved' });
//     }

//     // Update status to resolved
//     incident.status = 'resolved';
//     if (req.body.followUpNotes) {
//       incident.followUpNotes = req.body.followUpNotes;
//     }

//     await incident.save();

//     // Populate the child and babysitter information
//     const populatedIncident = await Incident.findById(incident._id)
//       .populate('child', 'fullName')
//       .populate('reportedBy', 'firstName lastName');

//     res.json(populatedIncident);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   DELETE api/incidents/:id
// // @desc    Delete incident report
// // @access  Private/Manager
// router.delete('/:id', [protect, authorize('manager')], async (req, res) => {
//   try {
//     const incident = await Incident.findById(req.params.id);

//     if (!incident) {
//       return res.status(404).json({ msg: 'Incident report not found' });
//     }

//     await incident.remove();

//     res.json({ msg: 'Incident report removed' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Incident report not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Incident, Child, Babysitter } = require('../models');
const { protect, authorize } = require('../middleware/auth');

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
      const child = await Child.findByPk(req.body.child);
      if (!child) {
        return res.status(404).json({ msg: 'Child not found' });
      }

      // Verify babysitter exists
      const babysitter = await Babysitter.findByPk(req.body.reportedBy);
      if (!babysitter) {
        return res.status(404).json({ msg: 'Babysitter not found' });
      }

      // Create incident report
      const incident = await Incident.create({
        childId: req.body.child,
        reportedById: req.body.reportedBy,
        date: req.body.date,
        incidentType: req.body.incidentType,
        description: req.body.description,
        severity: req.body.severity,
        actionTaken: req.body.actionTaken,
        parentNotified: req.body.parentNotified || false,
        notificationTime: req.body.parentNotified ? req.body.notificationTime || new Date() : null,
        followUpRequired: req.body.followUpRequired || false,
        followUpNotes: req.body.followUpNotes || null
      });

      // Get the newly created incident with related data
      const populatedIncident = await Incident.findByPk(incident.id, {
        include: [
          { model: Child, as: 'child', attributes: ['id', 'fullName'] },
          { model: Babysitter, as: 'reportedBy', attributes: ['id', 'firstName', 'lastName'] }
        ]
      });

      // Format response to match MongoDB structure
      const formattedIncident = {
        _id: populatedIncident.id,
        child: {
          _id: populatedIncident.child.id,
          fullName: populatedIncident.child.fullName
        },
        reportedBy: {
          _id: populatedIncident.reportedBy.id,
          firstName: populatedIncident.reportedBy.firstName,
          lastName: populatedIncident.reportedBy.lastName
        },
        date: populatedIncident.date,
        incidentType: populatedIncident.incidentType,
        description: populatedIncident.description,
        severity: populatedIncident.severity,
        actionTaken: populatedIncident.actionTaken,
        parentNotified: populatedIncident.parentNotified,
        notificationTime: populatedIncident.notificationTime,
        followUpRequired: populatedIncident.followUpRequired,
        followUpNotes: populatedIncident.followUpNotes,
        status: populatedIncident.status,
        createdAt: populatedIncident.createdAt,
        updatedAt: populatedIncident.updatedAt
      };

      res.status(201).json(formattedIncident);
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
    const whereClause = {};
    if (req.query.status) {
      whereClause.status = req.query.status;
    }

    const incidents = await Incident.findAll({
      where: whereClause,
      include: [
        { model: Child, as: 'child', attributes: ['id', 'fullName'] },
        { model: Babysitter, as: 'reportedBy', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['date', 'DESC']]
    });

    // Format response to match MongoDB structure
    const formattedIncidents = incidents.map(incident => ({
      _id: incident.id,
      child: {
        _id: incident.child.id,
        fullName: incident.child.fullName
      },
      reportedBy: {
        _id: incident.reportedBy.id,
        firstName: incident.reportedBy.firstName,
        lastName: incident.reportedBy.lastName
      },
      date: incident.date,
      incidentType: incident.incidentType,
      description: incident.description,
      severity: incident.severity,
      actionTaken: incident.actionTaken,
      parentNotified: incident.parentNotified,
      notificationTime: incident.notificationTime,
      followUpRequired: incident.followUpRequired,
      followUpNotes: incident.followUpNotes,
      status: incident.status,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt
    }));

    res.json(formattedIncidents);
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
    const incident = await Incident.findByPk(req.params.id, {
      include: [
        { model: Child, as: 'child', attributes: ['id', 'fullName'] },
        { model: Babysitter, as: 'reportedBy', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    if (!incident) {
      return res.status(404).json({ msg: 'Incident report not found' });
    }

    // Format response to match MongoDB structure
    const formattedIncident = {
      _id: incident.id,
      child: {
        _id: incident.child.id,
        fullName: incident.child.fullName
      },
      reportedBy: {
        _id: incident.reportedBy.id,
        firstName: incident.reportedBy.firstName,
        lastName: incident.reportedBy.lastName
      },
      date: incident.date,
      incidentType: incident.incidentType,
      description: incident.description,
      severity: incident.severity,
      actionTaken: incident.actionTaken,
      parentNotified: incident.parentNotified,
      notificationTime: incident.notificationTime,
      followUpRequired: incident.followUpRequired,
      followUpNotes: incident.followUpNotes,
      status: incident.status,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt
    };

    res.json(formattedIncident);
  } catch (err) {
    console.error(err.message);
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
      const incident = await Incident.findByPk(req.params.id);

      if (!incident) {
        return res.status(404).json({ msg: 'Incident report not found' });
      }

      // Prepare update data
      const updateData = {
        description: req.body.description,
        actionTaken: req.body.actionTaken
      };

      // Optional fields
      if (req.body.incidentType) updateData.incidentType = req.body.incidentType;
      if (req.body.severity) updateData.severity = req.body.severity;
      
      // Update parent notification
      if (req.body.parentNotified !== undefined) {
        updateData.parentNotified = req.body.parentNotified;
        if (req.body.parentNotified && !incident.notificationTime) {
          updateData.notificationTime = req.body.notificationTime || new Date();
        }
      }
      
      // Update follow-up information
      if (req.body.followUpRequired !== undefined) {
        updateData.followUpRequired = req.body.followUpRequired;
        if (req.body.followUpRequired) {
          updateData.followUpNotes = req.body.followUpNotes || incident.followUpNotes;
        }
      }
      
      // Update status
      if (req.body.status) updateData.status = req.body.status;

      // Update incident
      await incident.update(updateData);

      // Get updated incident with associations
      const populatedIncident = await Incident.findByPk(incident.id, {
        include: [
          { model: Child, as: 'child', attributes: ['id', 'fullName'] },
          { model: Babysitter, as: 'reportedBy', attributes: ['id', 'firstName', 'lastName'] }
        ]
      });

      // Format response to match MongoDB structure
      const formattedIncident = {
        _id: populatedIncident.id,
        child: {
          _id: populatedIncident.child.id,
          fullName: populatedIncident.child.fullName
        },
        reportedBy: {
          _id: populatedIncident.reportedBy.id,
          firstName: populatedIncident.reportedBy.firstName,
          lastName: populatedIncident.reportedBy.lastName
        },
        date: populatedIncident.date,
        incidentType: populatedIncident.incidentType,
        description: populatedIncident.description,
        severity: populatedIncident.severity,
        actionTaken: populatedIncident.actionTaken,
        parentNotified: populatedIncident.parentNotified,
        notificationTime: populatedIncident.notificationTime,
        followUpRequired: populatedIncident.followUpRequired,
        followUpNotes: populatedIncident.followUpNotes,
        status: populatedIncident.status,
        createdAt: populatedIncident.createdAt,
        updatedAt: populatedIncident.updatedAt
      };

      res.json(formattedIncident);
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
    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({ msg: 'Incident report not found' });
    }

    if (incident.status === 'resolved') {
      return res.status(400).json({ msg: 'Incident already resolved' });
    }

    // Update status to resolved
    const updateData = {
      status: 'resolved'
    };
    
    if (req.body.followUpNotes) {
      updateData.followUpNotes = req.body.followUpNotes;
    }

    await incident.update(updateData);

    // Get updated incident with associations
    const populatedIncident = await Incident.findByPk(incident.id, {
      include: [
        { model: Child, as: 'child', attributes: ['id', 'fullName'] },
        { model: Babysitter, as: 'reportedBy', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    // Format response to match MongoDB structure
    const formattedIncident = {
      _id: populatedIncident.id,
      child: {
        _id: populatedIncident.child.id,
        fullName: populatedIncident.child.fullName
      },
      reportedBy: {
        _id: populatedIncident.reportedBy.id,
        firstName: populatedIncident.reportedBy.firstName,
        lastName: populatedIncident.reportedBy.lastName
      },
      date: populatedIncident.date,
      incidentType: populatedIncident.incidentType,
      description: populatedIncident.description,
      severity: populatedIncident.severity,
      actionTaken: populatedIncident.actionTaken,
      parentNotified: populatedIncident.parentNotified,
      notificationTime: populatedIncident.notificationTime,
      followUpRequired: populatedIncident.followUpRequired,
      followUpNotes: populatedIncident.followUpNotes,
      status: populatedIncident.status,
      createdAt: populatedIncident.createdAt,
      updatedAt: populatedIncident.updatedAt
    };

    res.json(formattedIncident);
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
    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.status(404).json({ msg: 'Incident report not found' });
    }

    await incident.destroy();

    res.json({ msg: 'Incident report removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;