/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('category_shop', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'shops',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'category_shop'
  })
};
