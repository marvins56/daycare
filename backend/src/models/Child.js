// const mongoose = require('mongoose');

// const ChildSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: [true, 'Please add child\'s full name']
//   },
//   age: {
//     type: Number,
//     required: [true, 'Please add child\'s age']
//   },
//   parent: {
//     name: {
//       type: String,
//       required: [true, 'Please add parent/guardian name']
//     },
//     phoneNumber: {
//       type: String,
//       required: [true, 'Please add parent/guardian phone number']
//     },
//     email: {
//       type: String,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         'Please add a valid email'
//       ]
//     }
//   },
//   specialCareNeeds: {
//     allergies: {
//       type: String,
//       default: 'None'
//     },
//     medicalConditions: {
//       type: String,
//       default: 'None'
//     },
//     dietaryRestrictions: {
//       type: String,
//       default: 'None'
//     },
//     other: {
//       type: String,
//       default: 'None'
//     }
//   },
//   sessionType: {
//     type: String,
//     enum: ['half-day', 'full-day'],
//     required: [true, 'Please specify session type']
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Child', ChildSchema);
// models/Child.js
module.exports = (sequelize, DataTypes) => {
  const Child = sequelize.define('Child', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add child\'s full name' }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Age must be a number' },
        min: { args: [1], msg: 'Age must be at least 1' },
        max: { args: [12], msg: 'Age cannot be more than 12' }
      }
    },
    parentName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add parent/guardian name' }
      }
    },
    parentPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add parent/guardian phone number' }
      }
    },
    parentEmail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { msg: 'Please add a valid email' }
      }
    },
    allergies: {
      type: DataTypes.TEXT,
      defaultValue: 'None'
    },
    medicalConditions: {
      type: DataTypes.TEXT,
      defaultValue: 'None'
    },
    dietaryRestrictions: {
      type: DataTypes.TEXT,
      defaultValue: 'None'
    },
    otherNeeds: {
      type: DataTypes.TEXT,
      defaultValue: 'None'
    },
    sessionType: {
      type: DataTypes.ENUM('half-day', 'full-day'),
      allowNull: false
    }
  }, {
    timestamps: true
  });

  // Define associations
  Child.associate = function(models) {
    Child.hasMany(models.Attendance, {
      foreignKey: 'childId',
      as: 'attendanceRecords'
    });
    
    Child.hasMany(models.Incident, {
      foreignKey: 'childId',
      as: 'incidents'
    });
  };

  return Child;
};