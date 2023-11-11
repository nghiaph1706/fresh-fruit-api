/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('shipping_classes', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    amount: {
      type: 'DOUBLE',
      allowNull: false,
      comment: 'null'
    },
    is_global: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: '1',
      comment: 'null'
    },
    type: {
      type: DataTypes.ENUM('fixed', 'percentage', 'free_shipping'),
      allowNull: false,
      defaultValue: 'fixed',
      comment: 'null'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    }
  }, {
    tableName: 'shipping_classes'
  })
};
