/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('store_notice_shop', {
    store_notice_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'store_notices',
        key: 'id'
      }
    },
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'shops',
        key: 'id'
      }
    }
  }, {
    tableName: 'store_notice_shop'
  })
};
