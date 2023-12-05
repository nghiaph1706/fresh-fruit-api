/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('refund_reasons', {
    'id': {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'name': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'slug': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'language': {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'your_default_language',
      comment: "null"
    },
    'created_at': {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "null"
    },
    'updated_at': {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "null"
    },
    'deleted_at': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'refund_reasons'
  });
};
