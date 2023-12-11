/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const AbusiveReport = sequelize.define(
    "abusive_reports",
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
      model_type: {
        type: DataTypes.STRING(191),
        allowNull: false,
        comment: "null",
      },
      model_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
      },
      message: {
        type: DataTypes.TEXT,
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
      tableName: "abusive_reports",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AbusiveReport;
}
