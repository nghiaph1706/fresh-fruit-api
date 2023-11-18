// controllers/UserController.js
import bcrypt from "bcrypt";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import MailService from "../services/MailService.js";
import * as AuthService from "../services/AuthService.js";
import PermissionEnum from "../config/enum/Permission.js";

const { User } = models;

export const token = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        is_active: true,
      },
    });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.json({ token: null, permissions: [] });
    }

    const token = await AuthService.createToken(user);
    const permissions = await AuthService.getPermissionNames(
      await user.getPermissions()
    );

    return res.json({ token, permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const contactAdmin = async (req, res) => {
  try {
    const details = req.body;
    const mailService = new MailService(details);
    mailService.send();
    return res.json({
      message: constants.EMAIL_SENT_SUCCESSFUL,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const register = async (req, res) => {
  try {
    const notAllowedPermissions = [PermissionEnum.SUPER_ADMIN];
    if (
      (req.body.permission &&
        notAllowedPermissions.includes(req.body.permission.value)) ||
      (req.body.permission &&
        notAllowedPermissions.includes(req.body.permission))
    ) {
      throw new Error(constants.NOT_AUTHORIZED);
    }
    const permissions = [PermissionEnum.CUSTOMER];
    if (req.body.permission) {
      permissions.push(req.body.permission.value || req.body.permission);
    }

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });

    await AuthService.givePermissionTo(user, permissions);

    const token = await AuthService.createToken(user);
    const permissionNames = await AuthService.getPermissionNames(
      await user.getPermissions()
    );

    return res.json({ token, permissionNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
