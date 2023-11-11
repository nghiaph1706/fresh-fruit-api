/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: 'null',
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null'
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'null',
      unique: true
    },
    email_verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'null'
    },
    password: {
      type: DataTypes.STRING(191),
      allowNull: true,
      comment: 'null'
    },
    remember_token: {
      type: DataTypes.STRING(100),
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
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1',
      comment: 'null'
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
    tableName: 'users'
  })
};
