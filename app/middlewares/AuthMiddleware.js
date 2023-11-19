import * as AuthService from "../services/AuthService.js";
import jwt from "jsonwebtoken";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { PersonalAccessToken } = models;

export const authMiddleware = (roles) => {
  return async (req, res, next) => {
    const permissions = [];
    const authorizationHeader = req.headers["authorization"];
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      const token = authorizationHeader.substring(7);
      const personalAccessToken = await PersonalAccessToken.findOne({
        where: {
          token: token,
        },
      });
      const user = await personalAccessToken.getUser();
      req.user = user;
      permissions = await AuthService.getPermissionNames(
        await user.getPermissions()
      );
    }
    if (roles.length) {
      roles.forEach((role) => {
        if (permissions.includes(role)) {
          req.permissions = permissions;
          return next();
        }
      });
      res.status(403).json({ message: constants.NOT_AUTHORIZED });
    }
    req.permissions = permissions;
    return next();
  };
};
