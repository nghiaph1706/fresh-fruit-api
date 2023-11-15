import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { models } from "../models/index.js";

dotenv.config();
const { Permissions, ModelHasPermissions, PersonalAccessTokens } = models;

export const createToken = async (user) => {
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRED,
  });

  const personalAccessTokens = await PersonalAccessTokens.findOne({
    where: {
      tokenable_id: user.id,
      name: "auth_token",
    },
  });

  console.log(personalAccessTokens.id);

  if (!personalAccessTokens) {
    await PersonalAccessTokens.create({
      tokenable_type: "MarvelDatabaseModelsUser",
      tokenable_id: user.id,
      name: "auth_token",
      token: token,
      abilities: '["*"]',
      last_used_at: Date.now(),
    });
    return token;
  } else {
    await PersonalAccessTokens.update(
      { last_used_at: Date.now() },
      {
        where: {
          id: personalAccessTokens.id,
          name: "auth_token",
          token: personalAccessTokens.token,
        },
      }
    );
    return personalAccessTokens.token;
  }
};

export const getPermissionNames = async (user) => {
  const hasPermissions = await ModelHasPermissions.findAll({
    attributes: ["permission_id"],
    where: {
      model_id: user.id,
    },
    raw: true,
  }).then((permissions) =>
    permissions.map((permission) => permission.permission_id)
  );

  const permissionNames = await Permissions.findAll({
    attributes: ["name"],
    where: {
      id: hasPermissions,
    },
    raw: true,
  }).then((permissions) => permissions.map((permission) => permission.name));

  return permissionNames;
};
