/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('store_notices', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: false,
      comment: 'null'
    },
    notice: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'null'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    effective_from: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '2023-11-11 04:55:31',
      comment: 'null'
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'null'
    },
    type: {
      type: DataTypes.ENUM('all_vendor', 'specific_vendor', 'all_shop', 'specific_shop'),
      allowNull: false,
      comment: 'null'
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'null',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    }
  }, {
    tableName: 'store_notices'
  })
};
