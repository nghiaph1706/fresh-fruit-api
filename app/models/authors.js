/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Author = sequelize.define(
    "authors",
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
      is_approved: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: "0",
        comment: "null",
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      cover_image: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      quote: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      born: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      death: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      languages: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      socials: {
        type: DataTypes.TEXT,
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
      tableName: "authors",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Author.associate = (models) => {
    Author.hasMany(models.Product, { as: "products", foreignKey: "author_id" });
  };

  return Author;
}
