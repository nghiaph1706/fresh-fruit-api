/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const CategoryProduct = sequelize.define(
    "category_product",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      productId: {
        field: "product_id",
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "products",
          key: "id",
        },
      },
      categoryId: {
        field: "category_id",
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
      tableName: "category_product",
      timestamps: false,
    }
  );

  // CategoryProduct.associate = function (models) {
  //   CategoryProduct.belongsTo(models.Product, {
  //     foreignKey: "product_id",
  //     as: "product",
  //   });
  //   CategoryProduct.belongsTo(models.Category, {
  //     foreignKey: "category_id",
  //     as: "category",
  //   });
  // };

  return CategoryProduct;
}
