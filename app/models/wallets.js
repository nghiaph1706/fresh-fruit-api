/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Wallet = sequelize.define(
    "wallets",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      total_points: {
        type: "DOUBLE",
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      points_used: {
        type: "DOUBLE",
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      available_points: {
        type: "DOUBLE",
        allowNull: false,
        defaultValue: "0",
        comment: "null",
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
      tableName: "wallets",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Wallet.associate = (models) => {
    Wallet.belongsTo(models.User, {
      foreignKey: "customer_id",
    });
  };

  return Wallet;
}
