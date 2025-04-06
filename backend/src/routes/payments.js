// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require('express-validator');

// // Middleware
// const { protect, authorize } = require('../middleware/auth');

// // Models
// const Payment = require('../models/Payment');
// const Babysitter = require('../models/Babysitter');

// // @route   POST api/payments
// // @desc    Create a new payment record
// // @access  Private/Manager
// router.post(
//   '/',
//   [
//     protect,
//     authorize('manager'),
//     [
//       check('babysitter', 'Babysitter ID is required').not().isEmpty(),
//       check('date', 'Date is required').not().isEmpty(),
//       check('childrenCount.halfDay', 'Half-day children count is required').isInt({ min: 0 }),
//       check('childrenCount.fullDay', 'Full-day children count is required').isInt({ min: 0 })
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       // Verify babysitter exists
//       const babysitter = await Babysitter.findById(req.body.babysitter);
//       if (!babysitter) {
//         return res.status(404).json({ msg: 'Babysitter not found' });
//       }

//       // Calculate total amount
//       const halfDayAmount = req.body.childrenCount.halfDay * (req.body.amountPerChild?.halfDay || 2000);
//       const fullDayAmount = req.body.childrenCount.fullDay * (req.body.amountPerChild?.fullDay || 5000);
//       const totalAmount = halfDayAmount + fullDayAmount;

//       // Create payment record
//       const payment = new Payment({
//         babysitter: req.body.babysitter,
//         date: req.body.date,
//         childrenCount: {
//           halfDay: req.body.childrenCount.halfDay,
//           fullDay: req.body.childrenCount.fullDay
//         },
//         amountPerChild: {
//           halfDay: req.body.amountPerChild?.halfDay || 2000,
//           fullDay: req.body.amountPerChild?.fullDay || 5000
//         },
//         totalAmount,
//         status: req.body.status || 'pending',
//         approvedBy: req.user.id,
//         notes: req.body.notes || ''
//       });

//       await payment.save();

//       // Populate the babysitter information
//       const populatedPayment = await Payment.findById(payment._id)
//         .populate('babysitter', 'firstName lastName')
//         .populate('approvedBy', 'firstName lastName');

//       res.status(201).json(populatedPayment);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   GET api/payments
// // @desc    Get all payment records
// // @access  Private/Manager
// router.get('/', [protect, authorize('manager')], async (req, res) => {
//   try {
//     // Filter by status if provided
//     const filter = {};
//     if (req.query.status) {
//       filter.status = req.query.status;
//     }
    
//     // Filter by babysitter if provided
//     if (req.query.babysitter) {
//       filter.babysitter = req.query.babysitter;
//     }

//     const payments = await Payment.find(filter)
//       .populate('babysitter', 'firstName lastName')
//       .populate('approvedBy', 'firstName lastName')
//       .sort({ date: -1 });

//     res.json(payments);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET api/payments/babysitter
// // @desc    Get payment records for the logged-in babysitter
// // @access  Private/Babysitter
// router.get('/babysitter', [protect, authorize('babysitter')], async (req, res) => {
//   try {
//     // Find the babysitter profile for the logged-in user
//     const babysitter = await Babysitter.findOne({ user: req.user.id });
    
//     if (!babysitter) {
//       return res.status(404).json({ msg: 'Babysitter profile not found' });
//     }

//     const payments = await Payment.find({ babysitter: babysitter._id })
//       .populate('approvedBy', 'firstName lastName')
//       .sort({ date: -1 });

//     res.json(payments);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET api/payments/:id
// // @desc    Get payment record by ID
// // @access  Private
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id)
//       .populate('babysitter', 'firstName lastName')
//       .populate('approvedBy', 'firstName lastName');

//     if (!payment) {
//       return res.status(404).json({ msg: 'Payment record not found' });
//     }

//     // If user is a babysitter, verify they can only see their own payments
//     if (req.user.role === 'babysitter') {
//       const babysitter = await Babysitter.findOne({ user: req.user.id });
      
//       if (!babysitter || payment.babysitter._id.toString() !== babysitter._id.toString()) {
//         return res.status(403).json({ msg: 'Not authorized to view this payment' });
//       }
//     }

//     res.json(payment);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Payment record not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// // @route   PUT api/payments/:id
// // @desc    Update payment record
// // @access  Private/Manager
// router.put(
//   '/:id',
//   [
//     protect,
//     authorize('manager'),
//     [
//       check('childrenCount.halfDay', 'Half-day children count is required').isInt({ min: 0 }),
//       check('childrenCount.fullDay', 'Full-day children count is required').isInt({ min: 0 })
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const payment = await Payment.findById(req.params.id);

//       if (!payment) {
//         return res.status(404).json({ msg: 'Payment record not found' });
//       }

//       // Update payment fields
//       payment.childrenCount = {
//         halfDay: req.body.childrenCount.halfDay,
//         fullDay: req.body.childrenCount.fullDay
//       };
      
//       if (req.body.amountPerChild) {
//         payment.amountPerChild = {
//           halfDay: req.body.amountPerChild.halfDay || payment.amountPerChild.halfDay,
//           fullDay: req.body.amountPerChild.fullDay || payment.amountPerChild.fullDay
//         };
//       }
      
//       // Recalculate total amount
//       const halfDayAmount = payment.childrenCount.halfDay * payment.amountPerChild.halfDay;
//       const fullDayAmount = payment.childrenCount.fullDay * payment.amountPerChild.fullDay;
//       payment.totalAmount = halfDayAmount + fullDayAmount;
      
//       if (req.body.status) payment.status = req.body.status;
//       if (req.body.notes !== undefined) payment.notes = req.body.notes;
      
//       // Update approver if status changed to approved
//       if (req.body.status === 'approved' && payment.status !== 'approved') {
//         payment.approvedBy = req.user.id;
//       }

//       await payment.save();

//       // Populate the babysitter and approver information
//       const populatedPayment = await Payment.findById(payment._id)
//         .populate('babysitter', 'firstName lastName')
//         .populate('approvedBy', 'firstName lastName');

//       res.json(populatedPayment);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   PUT api/payments/:id/status
// // @desc    Update payment status
// // @access  Private/Manager
// router.put(
//   '/:id/status',
//   [
//     protect,
//     authorize('manager'),
//     [
//       check('status', 'Status is required').isIn(['pending', 'approved', 'paid'])
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const payment = await Payment.findById(req.params.id);

//       if (!payment) {
//         return res.status(404).json({ msg: 'Payment record not found' });
//       }

//       // Update status
//       payment.status = req.body.status;
      
//       // Update approver if status changed to approved
//       if (req.body.status === 'approved' && payment.status !== 'approved') {
//         payment.approvedBy = req.user.id;
//       }

//       await payment.save();

//       // Populate the babysitter and approver information
//       const populatedPayment = await Payment.findById(payment._id)
//         .populate('babysitter', 'firstName lastName')
//         .populate('approvedBy', 'firstName lastName');

//       res.json(populatedPayment);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   DELETE api/payments/:id
// // @desc    Delete payment record
// // @access  Private/Manager
// router.delete('/:id', [protect, authorize('manager')], async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id);

//     if (!payment) {
//       return res.status(404).json({ msg: 'Payment record not found' });
//     }

//     await payment.remove();

//     res.json({ msg: 'Payment record removed' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Payment record not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;


// routes/payments.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Payment, Babysitter, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   POST api/payments
// @desc    Create a new payment record
// @access  Private/Manager
router.post(
  '/',
  [
    protect,
    authorize('manager'),
    [
      check('babysitter', 'Babysitter ID is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('childrenCount.halfDay', 'Half-day children count is required').isInt({ min: 0 }),
      check('childrenCount.fullDay', 'Full-day children count is required').isInt({ min: 0 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Verify babysitter exists
      const babysitter = await Babysitter.findByPk(req.body.babysitter);
      if (!babysitter) {
        return res.status(404).json({ msg: 'Babysitter not found' });
      }

      // Get rate values
      const halfDayRate = req.body.amountPerChild?.halfDay || 2000;  // Default: 20 USD in cents
      const fullDayRate = req.body.amountPerChild?.fullDay || 5000;  // Default: 50 USD in cents
      
      // Create payment record
      const payment = await Payment.create({
        babysitterId: req.body.babysitter,
        date: req.body.date,
        halfDayChildren: req.body.childrenCount.halfDay,
        fullDayChildren: req.body.childrenCount.fullDay,
        halfDayAmount: halfDayRate,
        fullDayAmount: fullDayRate,
        totalAmount: (req.body.childrenCount.halfDay * halfDayRate) + 
                     (req.body.childrenCount.fullDay * fullDayRate),
        status: req.body.status || 'pending',
        approvedById: req.user.id,
        notes: req.body.notes || null
      });

      // Fetch the newly created payment with associations
      const populatedPayment = await Payment.findByPk(payment.id, {
        include: [
          { model: Babysitter, as: 'babysitter', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
        ]
      });

      res.status(201).json(populatedPayment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/payments
// @desc    Get all payment records
// @access  Private/Manager
router.get('/', [protect, authorize('manager')], async (req, res) => {
  try {
    // Build filter object
    const whereClause = {};
    
    // Filter by status if provided
    if (req.query.status) {
      whereClause.status = req.query.status;
    }
    
    // Filter by babysitter if provided
    if (req.query.babysitter) {
      whereClause.babysitterId = req.query.babysitter;
    }

    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        { model: Babysitter, as: 'babysitter', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
      ],
      order: [['date', 'DESC']]
    });

    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/payments/babysitter
// @desc    Get payment records for the logged-in babysitter
// @access  Private/Babysitter
router.get('/babysitter', [protect, authorize('babysitter')], async (req, res) => {
  try {
    // Find the babysitter profile for the logged-in user
    const babysitter = await Babysitter.findOne({ where: { userId: req.user.id } });
    
    if (!babysitter) {
      return res.status(404).json({ msg: 'Babysitter profile not found' });
    }

    const payments = await Payment.findAll({
      where: { babysitterId: babysitter.id },
      include: [
        { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
      ],
      order: [['date', 'DESC']]
    });

    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/payments/:id
// @desc    Get payment record by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        { model: Babysitter, as: 'babysitter', attributes: ['firstName', 'lastName'] },
        { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
      ]
    });

    if (!payment) {
      return res.status(404).json({ msg: 'Payment record not found' });
    }

    // If user is a babysitter, verify they can only see their own payments
    if (req.user.role === 'babysitter') {
      const babysitter = await Babysitter.findOne({ where: { userId: req.user.id } });
      
      if (!babysitter || payment.babysitterId !== babysitter.id) {
        return res.status(403).json({ msg: 'Not authorized to view this payment' });
      }
    }

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/payments/:id
// @desc    Update payment record
// @access  Private/Manager
router.put(
  '/:id',
  [
    protect,
    authorize('manager'),
    [
      check('childrenCount.halfDay', 'Half-day children count is required').isInt({ min: 0 }),
      check('childrenCount.fullDay', 'Full-day children count is required').isInt({ min: 0 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        return res.status(404).json({ msg: 'Payment record not found' });
      }

      // Prepare update data
      const updateData = {
        halfDayChildren: req.body.childrenCount.halfDay,
        fullDayChildren: req.body.childrenCount.fullDay
      };
      
      // Update rate values if provided
      if (req.body.amountPerChild) {
        if (req.body.amountPerChild.halfDay) {
          updateData.halfDayAmount = req.body.amountPerChild.halfDay;
        }
        
        if (req.body.amountPerChild.fullDay) {
          updateData.fullDayAmount = req.body.amountPerChild.fullDay;
        }
      }
      
      // Status and notes
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.notes !== undefined) updateData.notes = req.body.notes;
      
      // Calculate total amount
      updateData.totalAmount = 
        (updateData.halfDayChildren * (updateData.halfDayAmount || payment.halfDayAmount)) + 
        (updateData.fullDayChildren * (updateData.fullDayAmount || payment.fullDayAmount));
      
      // Update approver if status changed to approved
      if (req.body.status === 'approved' && payment.status !== 'approved') {
        updateData.approvedById = req.user.id;
      }

      // Update payment
      await payment.update(updateData);

      // Fetch updated record with associations
      const populatedPayment = await Payment.findByPk(payment.id, {
        include: [
          { model: Babysitter, as: 'babysitter', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
        ]
      });

      res.json(populatedPayment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/payments/:id/status
// @desc    Update payment status
// @access  Private/Manager
router.put(
  '/:id/status',
  [
    protect,
    authorize('manager'),
    [
      check('status', 'Status is required').isIn(['pending', 'approved', 'paid'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        return res.status(404).json({ msg: 'Payment record not found' });
      }

      // Update data
      const updateData = {
        status: req.body.status
      };
      
      // Update approver if status changing to approved
      if (req.body.status === 'approved' && payment.status !== 'approved') {
        updateData.approvedById = req.user.id;
      }

      // Update payment
      await payment.update(updateData);

      // Fetch updated record with associations
      const populatedPayment = await Payment.findByPk(payment.id, {
        include: [
          { model: Babysitter, as: 'babysitter', attributes: ['firstName', 'lastName'] },
          { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
        ]
      });

      res.json(populatedPayment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/payments/:id
// @desc    Delete payment record
// @access  Private/Manager
router.delete('/:id', [protect, authorize('manager')], async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({ msg: 'Payment record not found' });
    }

    await payment.destroy();

    res.json({ msg: 'Payment record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;