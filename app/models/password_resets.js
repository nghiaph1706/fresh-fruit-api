/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('password_resets', {
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    token: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    }
  }, {
    tableName: 'password_resets'
  })
};
