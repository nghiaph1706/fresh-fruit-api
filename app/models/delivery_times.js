/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('delivery_times', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    slug: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    icon: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    language: {
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
    tableName: 'delivery_times'
  })
};
