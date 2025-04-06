// const mongoose = require('mongoose');

// const PaymentSchema = new mongoose.Schema({
//   babysitter: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Babysitter',
//     required: [true, 'Please add babysitter reference']
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//     required: [true, 'Please add payment date']
//   },
//   childrenCount: {
//     halfDay: {
//       type: Number,
//       default: 0
//     },
//     fullDay: {
//       type: Number,
//       default: 0
//     }
//   },
//   amountPerChild: {
//     halfDay: {
//       type: Number,
//       default: 2000
//     },
//     fullDay: {
//       type: Number,
//       default: 5000
//     }
//   },
//   totalAmount: {
//     type: Number,
//     required: [true, 'Please add total payment amount']
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'paid'],
//     default: 'pending'
//   },
//   approvedBy: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User'
//   },
//   notes: {
//     type: String
//   }
// });

// // Calculate total amount before saving
// PaymentSchema.pre('save', function(next) {
//   this.totalAmount = 
//     (this.childrenCount.halfDay * this.amountPerChild.halfDay) + 
//     (this.childrenCount.fullDay * this.amountPerChild.fullDay);
  
//   next();
// });

// module.exports = mongoose.model('Payment', PaymentSchema);
// models/Payment.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    babysitterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Babysitters',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    halfDayChildren: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    fullDayChildren: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    halfDayAmount: {
      type: DataTypes.INTEGER, // Store in cents
      defaultValue: 2000 // 20 USD in cents
    },
    fullDayAmount: {
      type: DataTypes.INTEGER, // Store in cents
      defaultValue: 5000 // 50 USD in cents
    },
    totalAmount: {
      type: DataTypes.INTEGER, // Store in cents
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'paid'),
      defaultValue: 'pending'
    },
    approvedById: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: (payment) => {
        payment.totalAmount = 
          (payment.halfDayChildren * payment.halfDayAmount) + 
          (payment.fullDayChildren * payment.fullDayAmount);
      },
      beforeUpdate: (payment) => {
        payment.totalAmount = 
          (payment.halfDayChildren * payment.halfDayAmount) + 
          (payment.fullDayChildren * payment.fullDayAmount);
      }
    }
  });

  // Define associations
  Payment.associate = function(models) {
    Payment.belongsTo(models.Babysitter, {
      foreignKey: 'babysitterId',
      as: 'babysitter'
    });
    
    Payment.belongsTo(models.User, {
      foreignKey: 'approvedById',
      as: 'approvedBy'
    });
  };

  return Payment;
};