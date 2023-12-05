import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { models } from "../models/index.js";
import PermissionEnum from '../config/enum/Permission.js';
import constants from "../config/constants.js";

dotenv.config();
const { Permission, UserHasPermission, PersonalAccessToken, User, Shop } =
  models;

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
  return (await PersonalAccessToken.destroy({
    where: {
      name: "auth_token",
      token: token,
    },
  })) > 0
    ? true
    : false;
};

export const hasPermission = async (user, shopId = null) => {
  try {
    const permissions = await user.getPermissions();
    const permissionNames = permissions.map((permission) => permission.name);
    if (user && permissionNames.includes(PersonalAccessToken.SUPER_ADMIN)) {
      return true;
    }
    const shop = await Shop.findByPk(shopId, {
      include: [
        {
          model: User,
          as: "staffs",
        },
      ],
    });

    if (!shop) {
      return false;
    }

    if (!shop.is_active) {
      throw new Error(constants.SHOP_NOT_APPROVED);
    }

    if (user && permissionNames.includes(PermissionEnum.STORE_OWNER)) {
      return shop.owner_id == user.id;
    } else if (user && permissionNames.includes(PermissionEnum.STAFF)) {
      return shop.staffs.length > 0;
    }
    console.log(permissionNames);

    return false;
  } catch (error) {
    return false;
  }
};
