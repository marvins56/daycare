// models/Expense.js
module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    category: {
      type: DataTypes.ENUM('salary', 'toys', 'maintenance', 'utilities', 'other'),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER, // Store in cents
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Amount must be greater than 0' }
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    approvedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    receiptImage: {
      type: DataTypes.STRING
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true
  });

  // Define associations
  Expense.associate = function(models) {
    Expense.belongsTo(models.User, {
      foreignKey: 'approvedById',
      as: 'approvedBy'
    });
  };

  return Expense;
};