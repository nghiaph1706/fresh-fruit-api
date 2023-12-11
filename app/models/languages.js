/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Language = sequelize.define(
    "languages",
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      flag: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "null",
      },
      language_code: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      language_name: {
        type: DataTypes.STRING(191),
        allowNull: false,
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
      tableName: "languages",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Language;
}
