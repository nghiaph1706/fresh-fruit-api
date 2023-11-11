/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('media', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    model_type: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    model_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null'
    },
    uuid: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      comment: 'null'
    },
    collection_name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    file_name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    mime_type: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    disk: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    conversions_disk: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null'
    },
    manipulations: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    generated_conversions: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    custom_properties: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    responsive_images: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    order_column: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
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
    tableName: 'media'
  })
};
