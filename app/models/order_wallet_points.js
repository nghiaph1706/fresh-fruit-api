/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const WalletPoint = sequelize.define(
    "order_wallet_points",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      amount: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
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
      tableName: "order_wallet_points",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  WalletPoint.associate = (models) => {
    WalletPoint.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });
  };


  return WalletPoint;
}
