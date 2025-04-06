// const mongoose = require('mongoose');

// const AttendanceSchema = new mongoose.Schema({
//   child: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Child',
//     required: [true, 'Please add child reference']
//   },
//   babysitter: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Babysitter',
//     required: [true, 'Please add babysitter reference']
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//     required: [true, 'Please add attendance date']
//   },
//   sessionType: {
//     type: String,
//     enum: ['half-day', 'full-day'],
//     required: [true, 'Please specify session type']
//   },
//   checkInTime: {
//     type: Date,
//     required: [true, 'Please add check-in time']
//   },
//   checkOutTime: {
//     type: Date
//   },
//   status: {
//     type: String,
//     enum: ['checked-in', 'checked-out'],
//     default: 'checked-in'
//   },
//   notes: {
//     type: String
//   }
// });

// module.exports = mongoose.model('Attendance', AttendanceSchema);
// models/Attendance.js
module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    childId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Children',
        key: 'id'
      }
    },
    babysitterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Babysitters',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    sessionType: {
      type: DataTypes.ENUM('half-day', 'full-day'),
      allowNull: false
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkOutTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('checked-in', 'checked-out'),
      defaultValue: 'checked-in'
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true
  });

  // Define associations
  Attendance.associate = function(models) {
    Attendance.belongsTo(models.Child, {
      foreignKey: 'childId',
      as: 'child'
    });
    
    Attendance.belongsTo(models.Babysitter, {
      foreignKey: 'babysitterId',
      as: 'babysitter'
    });
  };

  return Attendance;
};