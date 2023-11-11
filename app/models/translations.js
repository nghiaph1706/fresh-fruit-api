/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('translations', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    item_type: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null'
    },
    translation_item_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null'
    },
    language_code: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    source_language_code: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: 'en',
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
    tableName: 'translations'
  })
};
