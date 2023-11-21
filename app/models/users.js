// models/users.js
export default function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(191),
        allowNull: false,
        unique: true,
      },
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(191),
        allowNull: true,
      },
      remember_token: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
      },
      shop_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "shops",
          key: "id",
        },
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Permission, {
      through: models.UserHasPermission,
      sourceKey: "id",
    });
    User.hasOne(models.UserProfile, {
      foreignKey: "customer_id",
      as: "profile",
    });
    User.belongsToMany(models.Shop, {
      through: models.UserShop,
      sourceKey: "id",
    });
  };

  return User;
}
