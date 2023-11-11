/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('withdraws', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'shops',
        key: 'id'
      }
    },
    amount: {
      type: 'DOUBLE(8,2)',
      allowNull: false,
      comment: 'null'
    },
    payment_method: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    status: {
      type: DataTypes.ENUM('approved', 'processing', 'rejected', 'pending', 'on_hold'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'null'
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'withdraws'
  })
};
