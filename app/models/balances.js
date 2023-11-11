/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('balances', {
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
    admin_commission_rate: {
      type: 'DOUBLE',
      allowNull: true,
      comment: 'null'
    },
    total_earnings: {
      type: 'DOUBLE',
      allowNull: false,
      defaultValue: '0',
      comment: 'null'
    },
    withdrawn_amount: {
      type: 'DOUBLE',
      allowNull: false,
      defaultValue: '0',
      comment: 'null'
    },
    current_balance: {
      type: 'DOUBLE',
      allowNull: false,
      defaultValue: '0',
      comment: 'null'
    },
    payment_info: {
      type: DataTypes.TEXT,
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
    tableName: 'balances'
  })
};
