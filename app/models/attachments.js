/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const Attachment = sequelize.define(
    "attachments",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      url: {
        type: DataTypes.STRING(191),
        allowNull: false,
        defaultValue: "",
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
      tableName: "attachments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Attachment;
}
