/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('download_tokens', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    digital_file_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'digital_files',
        key: 'id'
      }
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    user_id: {
      type: DataTypes.BIGINT,
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
    tableName: 'download_tokens'
  })
};
