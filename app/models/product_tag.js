/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const ProductTag = sequelize.define(
    "product_tag",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "products",
          key: "id",
        },
      },
      tag_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "tags",
          key: "id",
        },
      },
    },
    {
      tableName: "product_tag",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  ProductTag.associate = function (models) {
    ProductTag.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });
    ProductTag.belongsTo(models.Tag, {
      foreignKey: "tag_id",
      as: "tag",
    });
  };

  return ProductTag;
}
