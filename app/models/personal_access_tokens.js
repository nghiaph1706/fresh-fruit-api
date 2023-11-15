/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const PersonalAccessTokens = sequelize.define('personal_access_tokens', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    tokenable_type: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    tokenable_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null'
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'null',
      unique: true
    },
    abilities: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    last_used_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
    },
  }, {
    tableName: 'personal_access_tokens'
  })

  return PersonalAccessTokens
};
