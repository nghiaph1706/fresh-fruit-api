/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Wishlist = sequelize.define(
    "wishlists",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
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
      tableName: "wishlists",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "users",
    });
    Wishlist.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "products",
    });
    // Wishlist.belongsTo(models.VariationOption, {
    //   foreignKey: "variation_option_id",
    //   as: "variation_options",
    // });
  };

  return Wishlist;
}
