// controllers/UserController.js
import bcrypt from "bcrypt";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import MailService from "../services/MailService.js";
import * as AuthService from "../services/AuthService.js"

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
    const token = await AuthService.createToken(user)
    const permissions = await AuthService.getPermissionNames(user)

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
