/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('types', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    settings: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    slug: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    language: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: 'en',
      comment: 'null'
    },
    icon: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    promotional_sliders: {
      type: DataTypes.TEXT,
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
    tableName: 'types'
  })
};
