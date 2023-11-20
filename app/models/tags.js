/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Tag = sequelize.define(
    "tags",
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
      tableName: "tags",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Tag.associate = (models) => {
    Tag.belongsTo(models.Type, { foreignKey: "type_id", as: "type" });
  };
  
  return Tag;
}
