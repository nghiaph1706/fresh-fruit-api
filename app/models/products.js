/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Product = sequelize.define(
    "products",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      slug: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      type_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "types",
          key: "id",
        },
      },
      price: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
      },
      shop_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "shops",
          key: "id",
        },
      },
      sale_price: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
      },
      language: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: "en",
        comment: "null",
      },
      min_price: {
        type: "DOUBLE(8,2)",
        allowNull: true,
        comment: "null",
      },
      max_price: {
        type: "DOUBLE(8,2)",
        allowNull: true,
        comment: "null",
      },
      sku: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      quantity: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      in_stock: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "1",
        comment: "null",
      },
      is_taxable: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      shipping_class_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "shipping_classes",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("publish", "draft"),
        allowNull: false,
        defaultValue: "publish",
        comment: "null",
      },
      product_type: {
        type: DataTypes.ENUM("simple", "variable"),
        allowNull: false,
        defaultValue: "simple",
        comment: "null",
      },
      unit: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      height: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      width: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      length: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      video: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      gallery: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      deleted_at: {
        type: DataTypes.DATE,
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
      author_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "authors",
          key: "id",
        },
      },
      manufacturer_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "manufacturers",
          key: "id",
        },
      },
      is_digital: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      is_external: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      external_product_url: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      external_product_button_text: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
    },
    {
      tableName: "products",
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Author, { foreignKey: "author_id" });
  };

  return Product;
}
