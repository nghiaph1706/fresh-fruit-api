/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const CategoryShop = sequelize.define(
    "category_shop",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      shop_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "shops",
          key: "id",
        },
      },
      category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "categories",
          key: "id",
        },
      },
    },
    {
      tableName: "category_shop",
    }
  );

  CategoryShop.associate = function (models) {
    CategoryShop.belongsTo(models.Shop, {
      foreignKey: "shop_id",
      as: "shop",
    });
    CategoryShop.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  };

  return CategoryShop;
}
