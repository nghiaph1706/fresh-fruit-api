/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('store_notice_read', {
    store_notice_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'store_notices',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    is_read: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      comment: 'null'
    }
  }, {
    tableName: 'store_notice_read'
  })
};
