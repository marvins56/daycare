// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const UserSchema = new mongoose.Schema({
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
//     required: [true, 'Please add an email'],
//     unique: true,
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       'Please add a valid email'
//     ]
//   },
//   role: {
//     type: String,
//     enum: ['manager', 'babysitter'],
//     default: 'babysitter'
//   },
//   password: {
//     type: String,
//     required: [true, 'Please add a password'],
//     minlength: 6,
//     select: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Encrypt password using bcrypt
// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Sign JWT and return
// UserSchema.methods.getSignedJwtToken = function() {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE
//   });
// };

// // Match user entered password to hashed password in database
// UserSchema.methods.matchPassword = async function(enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);


// models/User.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please add a valid email' }
      }
    },
    role: {
      type: DataTypes.ENUM('manager', 'babysitter'),
      defaultValue: 'babysitter'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [6, 100], msg: 'Password must be at least 6 characters' }
      }
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Add instance methods
  User.prototype.getSignedJwtToken = function() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  };

  User.prototype.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  // Define associations
  User.associate = function(models) {
    User.hasOne(models.Babysitter, {
      foreignKey: 'userId',
      as: 'babysitterProfile'
    });
  };

  return User;
};