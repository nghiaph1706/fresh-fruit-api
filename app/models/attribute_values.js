/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('attribute_values', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    slug: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    attribute_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'attributes',
        key: 'id'
      }
    },
    value: {
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
    meta: {
      type: DataTypes.STRING(191),
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
    tableName: 'attribute_values'
  })
};
