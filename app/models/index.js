// models/index.js
import { Sequelize } from "sequelize";
import UserModel from "./users.js";

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
  // Add other models here if needed
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize, models };
