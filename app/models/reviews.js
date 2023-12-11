/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Review = sequelize.define(
    "reviews",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "orders",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "users",
          key: "id",
        },
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
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "products",
          key: "id",
        },
      },
      variation_option_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "variation_options",
          key: "id",
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "null",
      },
      rating: {
        type: "DOUBLE",
        allowNull: true,
        comment: "null",
      },
      photos: {
        type: DataTypes.JSON,
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
    },
    {
      tableName: "reviews",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    Review.belongsTo(models.Shop, { foreignKey: "shop_id" });
    Review.belongsTo(models.Order, { foreignKey: "order_id" });
    Review.belongsTo(models.Product, { foreignKey: "product_id" });
  };
  return Review;
}
