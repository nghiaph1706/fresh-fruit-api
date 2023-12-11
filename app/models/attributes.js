/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Attribute = sequelize.define(
    "attributes",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
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
      name: {
        type: DataTypes.STRING(191),
        allowNull: false,
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
      tableName: "attributes",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Attribute.associate = (models) => {
    Attribute.belongsTo(models.Shop, {
      foreignKey: "shop_id",
      as: "shop",
    });
    Attribute.hasMany(models.AttributeValue, {
      foreignKey: "attribute_id",
      as: "values",
    });
  };

  return Attribute;
}
