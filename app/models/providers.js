/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('providers', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    provider_user_id: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    provider: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    }
  }, {
    tableName: 'providers'
  })
};
