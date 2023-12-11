/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Shop = sequelize.define(
    "shops",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      owner_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "users",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      slug: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      cover_image: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "null",
      },
      logo: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "null",
      },
      is_active: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      address: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "null",
      },
      settings: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "null",
      },
      notifications: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "null",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "null",
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "null",
      },
    },
    {
      tableName: "shops",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Shop.associate = (models) => {
    Shop.belongsTo(models.User, {
      foreignKey: "owner_id",
      as: "owner",
    });
    Shop.hasMany(models.Product, {
      foreignKey: "shop_id",
      as: "products",
    });
    Shop.belongsToMany(models.User, {
      through: models.UserShop,
      sourceKey: "id",
    });
    Shop.hasOne(models.Balance, {
      foreignKey: "shop_id",
      as: "balance",
    });
    Shop.hasMany(models.User, {
      foreignKey: "shop_id",
      as: "staffs",
    });
  };

  return Shop;
}
