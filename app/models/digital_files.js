/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('digital_files', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    attachment_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null'
    },
    url: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    file_name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    fileable_type: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    fileable_id: {
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
    tableName: 'digital_files'
  })
};
