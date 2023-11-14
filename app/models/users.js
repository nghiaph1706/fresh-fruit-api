// models/users.js
export default function (sequelize, DataTypes) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      remember_token: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      is_active: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1
      },
      shop_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'shops',
          key: 'id'
        }
      }
    },
    {
      tableName: 'users',
      timestamps: false // Set to true if you want Sequelize to manage createdAt and updatedAt columns
    }
  )

  return User
}
