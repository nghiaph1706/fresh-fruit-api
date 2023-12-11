/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Faq = sequelize.define(
    "faqs",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
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
      shop_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: "null",
        references: {
          model: "shops",
          key: "id",
        },
      },
      faq_title: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "null",
      },
      faq_description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      faq_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "null",
      },
      issued_by: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "null",
      },
      language: {
        type: DataTypes.STRING(255),
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
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        comment: "null",
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        comment: "null",
      },
    },
    {
      tableName: "faqs",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  Faq.associate = (models) => {
    Faq.belongsTo(models.Shop, {
      foreignKey: "shop_id",
      as: "shop",
    });
    Faq.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };
  return Faq;
}
