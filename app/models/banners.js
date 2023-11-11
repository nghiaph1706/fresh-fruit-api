/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('banners', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
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
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    image: {
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
    tableName: 'banners'
  })
};
