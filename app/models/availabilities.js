/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('availabilities', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    from: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    to: {
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
    booking_duration: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    order_quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: 'null'
    },
    bookable_type: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    bookable_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null'
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'products',
        key: 'id'
      }
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
    tableName: 'availabilities'
  })
};
