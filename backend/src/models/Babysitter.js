// const mongoose = require('mongoose');

// const BabysitterSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: [true, 'Please add a first name']
//   },
//   lastName: {
//     type: String,
//     required: [true, 'Please add a last name']
//   },
//   email: {
//     type: String,
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       'Please add a valid email'
//     ]
//   },
//   phoneNumber: {
//     type: String,
//     required: [true, 'Please add a phone number']
//   },
//   nationalId: {
//     type: String,
//     required: [true, 'Please add a National Identification Number'],
//     unique: true
//   },
//   dateOfBirth: {
//     type: Date,
//     required: [true, 'Please add date of birth']
//   },
//   nextOfKin: {
//     name: {
//       type: String,
//       required: [true, 'Please add next of kin name']
//     },
//     phoneNumber: {
//       type: String,
//       required: [true, 'Please add next of kin phone number']
//     }
//   },
//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Validate age between 21-35 years
// BabysitterSchema.pre('save', function(next) {
//   const today = new Date();
//   const birthDate = new Date(this.dateOfBirth);
  
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
  
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
  
//   if (age < 21 || age > 35) {
//     return next(new Error('Babysitter age must be between 21 and 35 years'));
//   }
  
//   next();
// });

// module.exports = mongoose.model('Babysitter', BabysitterSchema);


// models/Babysitter.js
module.exports = (sequelize, DataTypes) => {
  const Babysitter = sequelize.define('Babysitter', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add a first name' }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add a last name' }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { msg: 'Please add a valid email' }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add a phone number' }
      }
    },
    nationalId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Please add a National Identification Number' }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add date of birth' },
        isValidAge(value) {
          const today = new Date();
          const birthDate = new Date(value);
          
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          
          if (age < 21 || age > 35) {
            throw new Error('Babysitter age must be between 21 and 35 years');
          }
        }
      }
    },
    nextOfKinName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add next of kin name' }
      }
    },
    nextOfKinPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please add next of kin phone number' }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  // Define associations
  Babysitter.associate = function(models) {
    Babysitter.belongsTo(models.User, { 
      foreignKey: 'userId', 
      as: 'user' 
    });
    
    Babysitter.hasMany(models.Attendance, {
      foreignKey: 'babysitterId',
      as: 'attendanceRecords'
    });
    
    Babysitter.hasMany(models.Incident, {
      foreignKey: 'reportedById',
      as: 'reportedIncidents'
    });
    
    Babysitter.hasMany(models.Payment, {
      foreignKey: 'babysitterId',
      as: 'payments'
    });
  };

  return Babysitter;
};