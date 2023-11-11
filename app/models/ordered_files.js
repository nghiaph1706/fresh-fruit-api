/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('ordered_files', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    purchase_key: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    digital_file_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'digital_files',
        key: 'id'
      }
    },
    tracking_number: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null',
      references: {
        model: 'orders',
        key: 'tracking_number'
      }
    },
    customer_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'users',
        key: 'id'
      }
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
    tableName: 'ordered_files'
  })
};
