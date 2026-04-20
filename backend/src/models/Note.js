const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [1, 200],
      notEmpty: true,
    },
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    defaultValue: '',
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '#ffffff',
    validate: {
      is: /^#[0-9A-Fa-f]{6}$/,
    },
  },
  is_pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'notes',
});

// Associations
User.hasMany(Note, { foreignKey: 'user_id', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Note;
