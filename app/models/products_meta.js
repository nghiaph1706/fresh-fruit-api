/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('products_meta', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'products',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(191),
      allowNull: false,
      defaultValue: 'null',
      comment: 'null'
    },
    key: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    value: {
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
    tableName: 'products_meta'
  })
};
