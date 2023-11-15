// controllers/UserController.js
import bcrypt from "bcrypt";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as UserRepository from "../repositories/UserRepository.js";
import ContactAdminEmail from "../services/MailService.js";

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
    const token = UserRepository.createToken(user);
    const permissions = UserRepository.getPermissionNames(user);

    return res.json({ token, permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const contactAdmin = async (req, res) => {
  try {
    const details = req.body;
    const contactAdminEmail = new ContactAdminEmail(details);
    contactAdminEmail.send();
    return res.json({
      message: constants.EMAIL_SENT_SUCCESSFUL,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
