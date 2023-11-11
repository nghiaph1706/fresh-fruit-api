/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('model_has_roles', {
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    model_type: {
      type: DataTypes.STRING(191),
      allowNull: false,
      primaryKey: true,
      comment: 'null'
    },
    model_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null'
    }
  }, {
    tableName: 'model_has_roles'
  })
};
