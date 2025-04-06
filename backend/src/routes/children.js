// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require('express-validator');

// // Middleware
// const { protect, authorize } = require('../middleware/auth');

// // Models
// const Child = require('../models/Child');

// // @route   POST api/children
// // @desc    Register a new child
// // @access  Private
// router.post(
//   '/',
//   [
//     protect,
//     [
//       check('fullName', 'Full name is required').not().isEmpty(),
//       check('age', 'Age is required and must be a number').isInt({ min: 1, max: 12 }),
//       check('parent.name', 'Parent/guardian name is required').not().isEmpty(),
//       check('parent.phoneNumber', 'Parent/guardian phone number is required').not().isEmpty(),
//       check('sessionType', 'Session type is required').isIn(['half-day', 'full-day'])
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       // Create child
//       const child = new Child({
//         fullName: req.body.fullName,
//         age: req.body.age,
//         parent: {
//           name: req.body.parent.name,
//           phoneNumber: req.body.parent.phoneNumber,
//           email: req.body.parent.email
//         },
//         specialCareNeeds: {
//           allergies: req.body.specialCareNeeds?.allergies || 'None',
//           medicalConditions: req.body.specialCareNeeds?.medicalConditions || 'None',
//           dietaryRestrictions: req.body.specialCareNeeds?.dietaryRestrictions || 'None',
//           other: req.body.specialCareNeeds?.other || 'None'
//         },
//         sessionType: req.body.sessionType
//       });

//       await child.save();

//       res.status(201).json(child);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   GET api/children
// // @desc    Get all children
// // @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     const children = await Child.find();
//     res.json(children);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET api/children/:id
// // @desc    Get child by ID
// // @access  Private
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const child = await Child.findById(req.params.id);

//     if (!child) {
//       return res.status(404).json({ msg: 'Child not found' });
//     }

//     res.json(child);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Child not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// // @route   PUT api/children/:id
// // @desc    Update child
// // @access  Private
// router.put(
//   '/:id',
//   [
//     protect,
//     [
//       check('fullName', 'Full name is required').not().isEmpty(),
//       check('age', 'Age is required and must be a number').isInt({ min: 1, max: 12 }),
//       check('parent.name', 'Parent/guardian name is required').not().isEmpty(),
//       check('parent.phoneNumber', 'Parent/guardian phone number is required').not().isEmpty(),
//       check('sessionType', 'Session type is required').isIn(['half-day', 'full-day'])
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       let child = await Child.findById(req.params.id);

//       if (!child) {
//         return res.status(404).json({ msg: 'Child not found' });
//       }

//       // Update child
//       child.fullName = req.body.fullName;
//       child.age = req.body.age;
//       child.parent = {
//         name: req.body.parent.name,
//         phoneNumber: req.body.parent.phoneNumber,
//         email: req.body.parent.email
//       };
//       child.specialCareNeeds = {
//         allergies: req.body.specialCareNeeds?.allergies || 'None',
//         medicalConditions: req.body.specialCareNeeds?.medicalConditions || 'None',
//         dietaryRestrictions: req.body.specialCareNeeds?.dietaryRestrictions || 'None',
//         other: req.body.specialCareNeeds?.other || 'None'
//       };
//       child.sessionType = req.body.sessionType;

//       await child.save();

//       res.json(child);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   DELETE api/children/:id
// // @desc    Delete child
// // @access  Private
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const child = await Child.findById(req.params.id);

//     if (!child) {
//       return res.status(404).json({ msg: 'Child not found' });
//     }

//     await child.remove();

//     res.json({ msg: 'Child removed' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Child not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
// routes/children.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Child } = require('../models');
const { protect } = require('../middleware/auth');

// @route   POST api/children
// @desc    Register a new child
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('fullName', 'Full name is required').not().isEmpty(),
      check('age', 'Age is required and must be a number').isInt({ min: 1, max: 12 }),
      check('parent.name', 'Parent/guardian name is required').not().isEmpty(),
      check('parent.phoneNumber', 'Parent/guardian phone number is required').not().isEmpty(),
      check('sessionType', 'Session type is required').isIn(['half-day', 'full-day'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create child
      const child = await Child.create({
        fullName: req.body.fullName,
        age: req.body.age,
        parentName: req.body.parent.name,
        parentPhone: req.body.parent.phoneNumber,
        parentEmail: req.body.parent.email || null,
        allergies: req.body.specialCareNeeds?.allergies || 'None',
        medicalConditions: req.body.specialCareNeeds?.medicalConditions || 'None',
        dietaryRestrictions: req.body.specialCareNeeds?.dietaryRestrictions || 'None',
        otherNeeds: req.body.specialCareNeeds?.other || 'None',
        sessionType: req.body.sessionType
      });

      res.status(201).json(child);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/children
// @desc    Get all children
// @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     const children = await Child.findAll();
//     res.json(children);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });
// In routes/children.js, update the GET response:
router.get('/', protect, async (req, res) => {
  try {
    const children = await Child.findAll();
    
    // Format response to match MongoDB structure
    const formattedChildren = children.map(child => ({
      _id: child.id,
      fullName: child.fullName,
      age: child.age,
      parent: {
        name: child.parentName,
        phoneNumber: child.parentPhone,
        email: child.parentEmail || ''
      },
      specialCareNeeds: {
        allergies: child.allergies || 'None',
        medicalConditions: child.medicalConditions || 'None',
        dietaryRestrictions: child.dietaryRestrictions || 'None',
        other: child.otherNeeds || 'None'
      },
      sessionType: child.sessionType,
      createdAt: child.createdAt
    }));
    
    res.json(formattedChildren);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
// @route   GET api/children/:id
// @desc    Get child by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({ msg: 'Child not found' });
    }

    // Format response to match MongoDB structure
    const formattedChild = {
      _id: child.id,
      fullName: child.fullName,
      age: child.age,
      parent: {
        name: child.parentName,
        phoneNumber: child.parentPhone,
        email: child.parentEmail || ''
      },
      specialCareNeeds: {
        allergies: child.allergies || 'None',
        medicalConditions: child.medicalConditions || 'None',
        dietaryRestrictions: child.dietaryRestrictions || 'None',
        other: child.otherNeeds || 'None'
      },
      sessionType: child.sessionType,
      createdAt: child.createdAt
    };

    res.json(formattedChild);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/children/:id
// @desc    Update child
// @access  Private
router.put(
  '/:id',
  [
    protect,
    [
      check('fullName', 'Full name is required').not().isEmpty(),
      check('age', 'Age is required and must be a number').isInt({ min: 1, max: 12 }),
      check('parent.name', 'Parent/guardian name is required').not().isEmpty(),
      check('parent.phoneNumber', 'Parent/guardian phone number is required').not().isEmpty(),
      check('sessionType', 'Session type is required').isIn(['half-day', 'full-day'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let child = await Child.findByPk(req.params.id);

      if (!child) {
        return res.status(404).json({ msg: 'Child not found' });
      }

      // Update child
      await child.update({
        fullName: req.body.fullName,
        age: req.body.age,
        parentName: req.body.parent.name,
        parentPhone: req.body.parent.phoneNumber,
        parentEmail: req.body.parent.email || null,
        allergies: req.body.specialCareNeeds?.allergies || 'None',
        medicalConditions: req.body.specialCareNeeds?.medicalConditions || 'None',
        dietaryRestrictions: req.body.specialCareNeeds?.dietaryRestrictions || 'None',
        otherNeeds: req.body.specialCareNeeds?.other || 'None',
        sessionType: req.body.sessionType
      });

      // Reload to get updated data
      await child.reload();
      
      res.json(child);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/children/:id
// @desc    Delete child
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({ msg: 'Child not found' });
    }

    await child.destroy();

    res.json({ msg: 'Child removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;