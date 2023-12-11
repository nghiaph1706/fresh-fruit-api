/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const UserShop = sequelize.define(
    "user_shop",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      UserId: {
        field: "user_id",
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "users",
          key: "id",
        },
      },
      shopId: {
        field: "shop_id",
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "shops",
          key: "id",
        },
      },
    },
    {
      tableName: "user_shop",
      timestamps: false,
    }
  );

  return UserShop;
}
