/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const UserHasPermission = sequelize.define(
    "model_has_permissions", // TODO rename to user_has_permissions
    {
      permissionId: {
        field: "permission_id",
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        references: {
          model: "permission",
          key: "id",
        },
      },
      model_type: { // TODO remove
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      UserId: {
        field: "model_id",
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
      },
    },
    {
      tableName: "model_has_permissions",
      timestamps: false 
    }
  );

  return UserHasPermission
}
