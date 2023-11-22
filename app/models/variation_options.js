/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const VariationOption = sequelize.define(
    "variation_options",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      price: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      sale_price: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      language: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: "en",
        comment: "null",
      },
      quantity: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
      },
      is_disable: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      sku: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      options: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "null",
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "products",
          key: "id",
        },
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
      is_digital: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
    },
    {
      tableName: "variation_options",
    }
  );

  VariationOption.associate = function (models) {
    VariationOption.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
  };

  return VariationOption;
}
