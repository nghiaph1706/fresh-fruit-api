/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('order_product', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'products',
        key: 'id'
      }
    },
    variation_option_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'variation_options',
        key: 'id'
      }
    },
    order_quantity: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    unit_price: {
      type: 'DOUBLE',
      allowNull: false,
      comment: 'null'
    },
    subtotal: {
      type: 'DOUBLE',
      allowNull: false,
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
    tableName: 'order_product'
  })
};
