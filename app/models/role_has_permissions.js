/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('role_has_permissions', {
    permission_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      references: {
        model: 'permissions',
        key: 'id'
      }
    },
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      references: {
        model: 'roles',
        key: 'id'
      }
    }
  }, {
    tableName: 'role_has_permissions'
  })
};
