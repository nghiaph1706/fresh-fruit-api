/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const UserProfile = sequelize.define(
    "user_profiles",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "null",
        autoIncrement: true,
      },
      avatar: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      socials: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "null",
      },
      contact: {
        type: DataTypes.STRING(191),
        allowNull: true,
        comment: "null",
      },
      notifications: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "null",
      },
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        comment: "null",
        references: {
          model: "users",
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
      tableName: "user_profiles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.User, {
      foreignKey: "customer_id",
      as: "user",
    });
  };

  return UserProfile;
}
