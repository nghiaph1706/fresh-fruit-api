import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { models } from "../models/index.js";
import permissions from "../models/permissions.js";

dotenv.config();
const { Permission, UserHasPermission, PersonalAccessToken, User } = models;

export const createToken = async (user) => {
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRED,
  });

  const personalAccessTokens = await PersonalAccessToken.findOne({
    where: {
      tokenable_id: user.id,
      name: "auth_token",
      tokenable_type: "User",
    },
  });

  if (!personalAccessTokens) {
    await PersonalAccessToken.create({
      tokenable_type: "User",
      tokenable_id: user.id,
      name: "auth_token",
      token: token,
      abilities: '["*"]',
      last_used_at: Date.now(),
    });
    return token;
  } else {
    await PersonalAccessToken.update(
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

export const getPermissionNames = async (hasPermissions) => {
  const permissionNames = hasPermissions.map((permission) => permission.name);

  return permissionNames;
};

export const givePermissionTo = async (user, permissionNames) => {
  const permissions = await Permission.findAll({
    where: {
      name: permissionNames,
    },
  });

  await user.setPermissions(permissions);
};

export const destroyAccessToken = async (token) => {
  return await PersonalAccessToken.destroy({
    where: {
      name: "auth_token",
      token: token,
    },
  }) > 0 ? true : false;
};