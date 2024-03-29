/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const PaymentIntent = sequelize.define(
    "payment_intents",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "orders",
          key: "id",
        },
      },
      tracking_number: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      payment_gateway: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      payment_intent_info: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: "payment_intents",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return PaymentIntent;
}
