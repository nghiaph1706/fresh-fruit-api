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

  return CategoryProduct;
}
