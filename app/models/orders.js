/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Order = sequelize.define(
    "orders",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      tracking_number: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
        unique: true,
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "users",
          key: "id",
        },
      },
      customer_contact: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      customer_name: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      amount: {
        type: "DOUBLE",
        allowNull: false,
        comment: "null",
      },
      sales_tax: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
      },
      paid_total: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
      },
      total: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
      },
      cancelled_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: "0.00",
        comment: "null",
      },
      language: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: "en",
        comment: "null",
      },
      coupon_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
      },
      parent_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "orders",
          key: "id",
        },
      },
      shop_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "shops",
          key: "id",
        },
      },
      discount: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
      },
      payment_gateway: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      shipping_address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      billing_address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      logistics_provider: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
      },
      delivery_fee: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
      },
      delivery_time: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      order_status: {
        type: DataTypes.ENUM(
          "order-pending",
          "order-processing",
          "order-completed",
          "order-refunded",
          "order-failed",
          "order-cancelled",
          "order-at-local-facility",
          "order-out-for-delivery"
        ),
        allowNull: false,
        defaultValue: "order-pending",
        comment: "null",
      },
      payment_status: {
        type: DataTypes.ENUM(
          "payment-pending",
          "payment-processing",
          "payment-success",
          "payment-failed",
          "payment-reversal",
          "payment-cash-on-delivery",
          "payment-cash",
          "payment-wallet",
          "payment-awaiting-for-approval"
        ),
        allowNull: false,
        defaultValue: "payment-pending",
        comment: "null",
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "null",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "null",
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "null",
      },
    },
    {
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Order.associate = function (models) {
    Order.belongsToMany(models.Product, {
      through: models.OrderProduct,
      sourceKey: "id",
    });
  };

  return Order;
}
