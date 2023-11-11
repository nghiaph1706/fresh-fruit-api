/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('shops', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'null',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    slug: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    cover_image: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      comment: 'null'
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    settings: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'null'
    },
    notifications: {
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
    tableName: 'shops'
  })
};
