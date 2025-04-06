// const express = require('express');
// const router = express.Router();
// const { check, validationResult } = require('express-validator');

// // Middleware
// const { protect, authorize } = require('../middleware/auth');

// // Models
// const Expense = require('../models/Expense');

// // @route   POST api/expenses
// // @desc    Create a new expense record
// // @access  Private/Manager
// router.post(
//   '/',
//   [
//     protect,
//     authorize('manager'),
//     [
//       check('category', 'Category is required').isIn(['salary', 'toys', 'maintenance', 'utilities', 'other']),
//       check('description', 'Description is required').not().isEmpty(),
//       check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 }),
//       check('date', 'Date is required').not().isEmpty()
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       // Create expense record
//       const expense = new Expense({
//         category: req.body.category,
//         description: req.body.description,
//         amount: Math.round(parseFloat(req.body.amount) * 100), // Store in cents
//         date: req.body.date,
//         approvedBy: req.user.id,
//         receiptImage: req.body.receiptImage || '',
//         notes: req.body.notes || ''
//       });

//       await expense.save();

//       // Populate the approver information
//       const populatedExpense = await Expense.findById(expense._id)
//         .populate('approvedBy', 'firstName lastName');

//       res.status(201).json(populatedExpense);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   GET api/expenses
// // @desc    Get all expense records
// // @access  Private/Manager
// router.get('/', [protect, authorize('manager')], async (req, res) => {
//   try {
//     // Filter by category if provided
//     const filter = {};
//     if (req.query.category) {
//       filter.category = req.query.category;
//     }
    
//     // Filter by date range if provided
//     if (req.query.startDate && req.query.endDate) {
//       filter.date = {
//         $gte: new Date(req.query.startDate),
//         $lte: new Date(req.query.endDate)
//       };
//     }

//     const expenses = await Expense.find(filter)
//       .populate('approvedBy', 'firstName lastName')
//       .sort({ date: -1 });

//     res.json(expenses);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET api/expenses/summary
// // @desc    Get expense summary by category
// // @access  Private/Manager
// router.get('/summary', [protect, authorize('manager')], async (req, res) => {
//   try {
//     // Filter by date range if provided
//     const filter = {};
//     if (req.query.startDate && req.query.endDate) {
//       filter.date = {
//         $gte: new Date(req.query.startDate),
//         $lte: new Date(req.query.endDate)
//       };
//     }

//     const summary = await Expense.aggregate([
//       { $match: filter },
//       { 
//         $group: {
//           _id: '$category',
//           totalAmount: { $sum: '$amount' },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           category: '$_id',
//           totalAmount: 1,
//           count: 1,
//           _id: 0
//         }
//       },
//       { $sort: { totalAmount: -1 } }
//     ]);

//     // Calculate grand total
//     const grandTotal = summary.reduce((total, item) => total + item.totalAmount, 0);

//     res.json({
//       summary,
//       grandTotal
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET api/expenses/:id
// // @desc    Get expense record by ID
// // @access  Private/Manager
// router.get('/:id', [protect, authorize('manager')], async (req, res) => {
//   try {
//     const expense = await Expense.findById(req.params.id)
//       .populate('approvedBy', 'firstName lastName');

//     if (!expense) {
//       return res.status(404).json({ msg: 'Expense record not found' });
//     }

//     res.json(expense);
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Expense record not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// // @route   PUT api/expenses/:id
// // @desc    Update expense record
// // @access  Private/Manager
// router.put(
//   '/:id',
//   [
//     protect,
//     authorize('manager'),
//     [
//       check('category', 'Category is required').isIn(['salary', 'toys', 'maintenance', 'utilities', 'other']),
//       check('description', 'Description is required').not().isEmpty(),
//       check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 })
//     ]
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const expense = await Expense.findById(req.params.id);

//       if (!expense) {
//         return res.status(404).json({ msg: 'Expense record not found' });
//       }

//       // Update expense fields
//       expense.category = req.body.category;
//       expense.description = req.body.description;
//       expense.amount = Math.round(parseFloat(req.body.amount) * 100); // Store in cents
//       if (req.body.date) expense.date = req.body.date;
//       if (req.body.receiptImage !== undefined) expense.receiptImage = req.body.receiptImage;
//       if (req.body.notes !== undefined) expense.notes = req.body.notes;

//       await expense.save();

//       // Populate the approver information
//       const populatedExpense = await Expense.findById(expense._id)
//         .populate('approvedBy', 'firstName lastName');

//       res.json(populatedExpense);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// // @route   DELETE api/expenses/:id
// // @desc    Delete expense record
// // @access  Private/Manager
// router.delete('/:id', [protect, authorize('manager')], async (req, res) => {
//   try {
//     const expense = await Expense.findById(req.params.id);

//     if (!expense) {
//       return res.status(404).json({ msg: 'Expense record not found' });
//     }

//     await expense.remove();

//     res.json({ msg: 'Expense record removed' });
//   } catch (err) {
//     console.error(err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Expense record not found' });
//     }
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;



// routes/expenses.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Expense, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { Op, Sequelize } = require('sequelize');

// @route   POST api/expenses
// @desc    Create a new expense record
// @access  Private/Manager
router.post(
  '/',
  [
    protect,
    authorize('manager'),
    [
      check('category', 'Category is required').isIn(['salary', 'toys', 'maintenance', 'utilities', 'other']),
      check('description', 'Description is required').not().isEmpty(),
      check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 }),
      check('date', 'Date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Create expense record
      const expense = await Expense.create({
        category: req.body.category,
        description: req.body.description,
        amount: Math.round(parseFloat(req.body.amount) * 100), // Store in cents
        date: req.body.date,
        approvedById: req.user.id,
        receiptImage: req.body.receiptImage || null,
        notes: req.body.notes || null
      });

      // Fetch the newly created expense with associations
      const populatedExpense = await Expense.findByPk(expense.id, {
        include: [
          { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
        ]
      });

      res.status(201).json(populatedExpense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/expenses
// @desc    Get all expense records
// @access  Private/Manager
router.get('/', [protect, authorize('manager')], async (req, res) => {
  try {
    // Build filter object
    const whereClause = {};
    
    // Filter by category if provided
    if (req.query.category) {
      whereClause.category = req.query.category;
    }
    
    // Filter by date range if provided
    if (req.query.startDate && req.query.endDate) {
      whereClause.date = {
        [Op.between]: [
          new Date(req.query.startDate),
          new Date(req.query.endDate)
        ]
      };
    }

    const expenses = await Expense.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
      ],
      order: [['date', 'DESC']]
    });

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/expenses/summary
// @desc    Get expense summary by category
// @access  Private/Manager
router.get('/summary', [protect, authorize('manager')], async (req, res) => {
  try {
    // Build date filter if provided
    const whereClause = {};
    if (req.query.startDate && req.query.endDate) {
      whereClause.date = {
        [Op.between]: [
          new Date(req.query.startDate),
          new Date(req.query.endDate)
        ]
      };
    }

    // Get expense summary by category
    const summary = await Expense.findAll({
      where: whereClause,
      attributes: [
        'category', 
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['category'],
      order: [[Sequelize.literal('totalAmount'), 'DESC']]
    });

    // Format summary data
    const formattedSummary = summary.map(item => ({
      category: item.category,
      totalAmount: parseInt(item.getDataValue('totalAmount')),
      count: parseInt(item.getDataValue('count'))
    }));

    // Calculate grand total
    const grandTotal = formattedSummary.reduce((total, item) => total + item.totalAmount, 0);

    res.json({
      summary: formattedSummary,
      grandTotal
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/expenses/:id
// @desc    Get expense record by ID
// @access  Private/Manager
router.get('/:id', [protect, authorize('manager')], async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [
        { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
      ]
    });

    if (!expense) {
      return res.status(404).json({ msg: 'Expense record not found' });
    }

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/expenses/:id
// @desc    Update expense record
// @access  Private/Manager
router.put(
  '/:id',
  [
    protect,
    authorize('manager'),
    [
      check('category', 'Category is required').isIn(['salary', 'toys', 'maintenance', 'utilities', 'other']),
      check('description', 'Description is required').not().isEmpty(),
      check('amount', 'Amount is required and must be a positive number').isFloat({ min: 0.01 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const expense = await Expense.findByPk(req.params.id);

      if (!expense) {
        return res.status(404).json({ msg: 'Expense record not found' });
      }

      // Prepare update object
      const updateData = {
        category: req.body.category,
        description: req.body.description,
        amount: Math.round(parseFloat(req.body.amount) * 100), // Store in cents
      };

      // Optional fields
      if (req.body.date) updateData.date = req.body.date;
      if (req.body.receiptImage !== undefined) updateData.receiptImage = req.body.receiptImage;
      if (req.body.notes !== undefined) updateData.notes = req.body.notes;

      // Update expense
      await expense.update(updateData);

      // Fetch updated record with associations
      const populatedExpense = await Expense.findByPk(expense.id, {
        include: [
          { model: User, as: 'approvedBy', attributes: ['firstName', 'lastName'] }
        ]
      });

      res.json(populatedExpense);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/expenses/:id
// @desc    Delete expense record
// @access  Private/Manager
router.delete('/:id', [protect, authorize('manager')], async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense record not found' });
    }

    await expense.destroy();

    res.json({ msg: 'Expense record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;