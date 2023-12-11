/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const RefundReason = sequelize.define(
    "refund_reasons",
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
      tableName: "refund_reasons",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );
  return RefundReason;
}
