// models/index.js
import { Sequelize } from "sequelize";
import UserModel from "./users.js";
import PermissionsModel from './permissions.js'
import ModelHasPermissionsModel from './model_has_permissions.js'
import PersonalAccessTokensModel from "./personal_access_tokens.js";

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION,
    dialectOptions: {
      connectTimeout: 100000,
    },
  }
);

const models = {
  User: UserModel(sequelize, Sequelize.DataTypes),
  Permissions: PermissionsModel(sequelize, Sequelize.DataTypes),
  ModelHasPermissions: ModelHasPermissionsModel(sequelize, Sequelize.DataTypes),
  PersonalAccessTokens: PersonalAccessTokensModel(sequelize, Sequelize.DataTypes),
  // Add other models here if needed
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, models };
