/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('coupons', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    language: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: 'en',
      comment: 'null'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    type: {
      type: DataTypes.ENUM('fixed', 'percentage', 'free_shipping'),
      allowNull: false,
      defaultValue: 'fixed',
      comment: 'null'
    },
    amount: {
      type: 'DOUBLE(8,2)',
      allowNull: false,
      defaultValue: '0.00',
      comment: 'null'
    },
    minimum_cart_amount: {
      type: 'DOUBLE(8,2)',
      allowNull: false,
      defaultValue: '0.00',
      comment: 'null'
    },
    active_from: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    expire_at: {
      type: DataTypes.STRING(191),
      allowNull: false,
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
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    }
  }, {
    tableName: 'coupons'
  })
};
