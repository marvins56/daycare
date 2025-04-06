// models/Incident.js
module.exports = (sequelize, DataTypes) => {
  const Incident = sequelize.define('Incident', {
    childId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Children',
        key: 'id'
      }
    },
    reportedById: {
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
    incidentType: {
      type: DataTypes.ENUM('health', 'behavior', 'accident', 'other'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'low'
    },
    actionTaken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    parentNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notificationTime: {
      type: DataTypes.DATE
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    followUpNotes: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('open', 'resolved'),
      defaultValue: 'open'
    }
  }, {
    timestamps: true
  });

  // Define associations
  Incident.associate = function(models) {
    Incident.belongsTo(models.Child, {
      foreignKey: 'childId',
      as: 'child'
    });
    
    Incident.belongsTo(models.Babysitter, {
      foreignKey: 'reportedById',
      as: 'reportedBy'
    });
  };

  return Incident;
};