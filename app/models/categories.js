/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Category = sequelize.define(
    "categories",
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
      language: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: "en",
        comment: "null",
      },
      icon: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      parent: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "categories",
          key: "id",
        },
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
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "null",
      },
    },
    {
      tableName: "categories",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Category.associate = (models) => {
    Category.belongsToMany(models.Product, {
      through: models.CategoryProduct,
      sourceKey: "id"
    });
  };

  return Category;
}
