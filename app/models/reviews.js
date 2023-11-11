/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('reviews', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
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
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'users',
        key: 'id'
      }
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    rating: {
      type: 'DOUBLE',
      allowNull: true,
      comment: 'null'
    },
    photos: {
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
    tableName: 'reviews'
  })
};
