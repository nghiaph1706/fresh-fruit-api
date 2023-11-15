/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Permissions = sequelize.define(
    "permissions",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      guard_name: {
        type: DataTypes.STRING(191),
        allowNull: false,
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
      tableName: "permissions",
    }
  );

  return Permissions;
}
