/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('manufacturers', {
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
    is_approved: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      comment: 'null'
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    cover_image: {
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
    type_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'types',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    website: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    socials: {
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
    tableName: 'manufacturers'
  })
};
