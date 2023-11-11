/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('person_product', {
    resource_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'resources',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'products',
        key: 'id'
      }
    }
  }, {
    tableName: 'person_product'
  })
};
