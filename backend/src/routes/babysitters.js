const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Models
const Babysitter = require('../models/Babysitter');
const User = require('../models/User');

// @route   POST api/babysitters
// @desc    Register a new babysitter
// @access  Private/Manager
router.post(
  '/',
  [
    protect,
    authorize('manager'),
    [
      check('firstName', 'First name is required').not().isEmpty(),
      check('lastName', 'Last name is required').not().isEmpty(),
      check('phoneNumber', 'Phone number is required').not().isEmpty(),
      check('nationalId', 'National ID is required').not().isEmpty(),
      check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
      check('nextOfKin.name', 'Next of kin name is required').not().isEmpty(),
      check('nextOfKin.phoneNumber', 'Next of kin phone number is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if babysitter with this national ID already exists
      const existingBabysitter = await Babysitter.findOne({ nationalId: req.body.nationalId });
      if (existingBabysitter) {
        return res.status(400).json({ msg: 'Babysitter with this National ID already exists' });
      }

      // Create user account for babysitter if email is provided
      let userId = null;
      if (req.body.email) {
        // Check if user with this email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // Create new user
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password || 'password123', // Default password, should be changed
          role: 'babysitter'
        });

        await user.save();
        userId = user._id;
      }

      // Create babysitter
      const babysitter = new Babysitter({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        nationalId: req.body.nationalId,
        dateOfBirth: req.body.dateOfBirth,
        nextOfKin: {
          name: req.body.nextOfKin.name,
          phoneNumber: req.body.nextOfKin.phoneNumber
        },
        user: userId
      });

      await babysitter.save();

      res.status(201).json(babysitter);
    } catch (err) {
      console.error(err.message);
      if (err.message.includes('Babysitter age must be between 21 and 35 years')) {
        return res.status(400).json({ msg: err.message });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/babysitters
// @desc    Get all babysitters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const babysitters = await Babysitter.find().populate('user', ['firstName', 'lastName', 'email']);
    res.json(babysitters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/babysitters/:id
// @desc    Get babysitter by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const babysitter = await Babysitter.findById(req.params.id).populate('user', ['firstName', 'lastName', 'email']);

    if (!babysitter) {
      return res.status(404).json({ msg: 'Babysitter not found' });
    }

    res.json(babysitter);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Babysitter not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/babysitters/:id
// @desc    Update babysitter
// @access  Private/Manager
router.put(
  '/:id',
  [
    protect,
    authorize('manager'),
    [
      check('firstName', 'First name is required').not().isEmpty(),
      check('lastName', 'Last name is required').not().isEmpty(),
      check('phoneNumber', 'Phone number is required').not().isEmpty(),
      check('nationalId', 'National ID is required').not().isEmpty(),
      check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
      check('nextOfKin.name', 'Next of kin name is required').not().isEmpty(),
      check('nextOfKin.phoneNumber', 'Next of kin phone number is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let babysitter = await Babysitter.findById(req.params.id);

      if (!babysitter) {
        return res.status(404).json({ msg: 'Babysitter not found' });
      }

      // Check if updating to a national ID that already exists on another babysitter
      if (req.body.nationalId !== babysitter.nationalId) {
        const existingBabysitter = await Babysitter.findOne({ nationalId: req.body.nationalId });
        if (existingBabysitter && existingBabysitter._id.toString() !== req.params.id) {
          return res.status(400).json({ msg: 'Babysitter with this National ID already exists' });
        }
      }

      // Update babysitter
      babysitter.firstName = req.body.firstName;
      babysitter.lastName = req.body.lastName;
      babysitter.email = req.body.email;
      babysitter.phoneNumber = req.body.phoneNumber;
      babysitter.nationalId = req.body.nationalId;
      babysitter.dateOfBirth = req.body.dateOfBirth;
      babysitter.nextOfKin = {
        name: req.body.nextOfKin.name,
        phoneNumber: req.body.nextOfKin.phoneNumber
      };

      await babysitter.save();

      // Update associated user if exists
      if (babysitter.user) {
        const user = await User.findById(babysitter.user);
        if (user) {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          if (req.body.email) {
            user.email = req.body.email;
          }
          await user.save();
        }
      }

      res.json(babysitter);
    } catch (err) {
      console.error(err.message);
      if (err.message.includes('Babysitter age must be between 21 and 35 years')) {
        return res.status(400).json({ msg: err.message });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/babysitters/:id
// @desc    Delete babysitter
// @access  Private/Manager
router.delete('/:id', [protect, authorize('manager')], async (req, res) => {
  try {
    const babysitter = await Babysitter.findById(req.params.id);

    if (!babysitter) {
      return res.status(404).json({ msg: 'Babysitter not found' });
    }

    // Delete associated user if exists
    if (babysitter.user) {
      await User.findByIdAndDelete(babysitter.user);
    }

    await babysitter.remove();

    res.json({ msg: 'Babysitter removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Babysitter not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
