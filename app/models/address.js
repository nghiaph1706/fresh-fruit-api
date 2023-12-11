/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Address = sequelize.define(
    "address",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      type: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      default: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "null",
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
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
      tableName: "address",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: "customer_id",
      as: "user",
    });
  };

  return Address;
}
