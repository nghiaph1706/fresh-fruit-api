import * as AuthService from "../services/AuthService.js";
import jwt from "jsonwebtoken";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import PermissionEnum from "../config/enum/Permission.js";

const { PersonalAccessToken } = models;

export const authMiddleware = (roles) => {
  return async (req, res, next) => {
    try {
      let permissions = [];
      const authorizationHeader = req.headers["authorization"];

      if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
        const token = authorizationHeader.substring(7);
        const personalAccessToken = await PersonalAccessToken.findOne({
          where: { token: token },
        });

        if (personalAccessToken) {
          const user = await personalAccessToken.getUser();
          req.user = user;
          permissions = await AuthService.getPermissionNames(
            await user.getPermissions(),
          );
        }
      }

      if (roles.length > 0) {
        const hasRequiredRole = roles.some((role) =>
          permissions.includes(role),
        );
        if (!hasRequiredRole) {
          return res.status(403).json({ message: constants.NOT_AUTHORIZED });
        }
      }

      req.permissions = permissions;
      req.isSuperAdmin = req.permissions.includes(PermissionEnum.SUPER_ADMIN);
      req.isStoreOwner = req.permissions.includes(PermissionEnum.STORE_OWNER);
      req.isStaff = req.permissions.includes(PermissionEnum.STAFF);
      return next();
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
