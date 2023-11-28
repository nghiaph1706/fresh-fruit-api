// controllers/UserController.js
import bcrypt from "bcrypt";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import MailService from "../services/MailService.js";
import * as AuthService from "../services/AuthService.js";
import PermissionEnum from "../config/enum/Permission.js";
import * as UserRepository from "../repositories/UserRepository.js";

const { User, PasswordReset } = models;

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
    await new MailService().sendResetPassword(user);
    return res.json({ token, permissionNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      const token = authorizationHeader.substring(7);
      return res.send(await AuthService.destroyAccessToken(token));
    } else {
      throw new Error(constants.NOT_AUTHORIZED);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        is_active: true,
      },
    });
    if (!user) {
      return res.json({ message: constants.NOT_FOUND, success: false });
    }

    const tokenData = await PasswordReset.findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        email: req.body.email,
        token: (Math.random() + 1).toString(36).substring(7).toUpperCase(),
      },
    });

    if (new MailService().sendResetPassword(tokenData[0])) {
      return res.json({
        message: constants.CHECK_INBOX_FOR_PASSWORD_RESET_EMAIL,
        success: true,
      });
    } else {
      return res.json({
        message: constants.SOMETHING_WENT_WRONG,
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyForgetPasswordToken = async (req, res) => {
  try {
    const tokenData = await PasswordReset.findOne({
      where: {
        token: req.body.token,
      },
    });
    if (!tokenData) {
      return res.json({
        message: constants.INVALID_TOKEN,
        success: false,
      });
    }
    const user = await User.findOne({
      where: {
        email: tokenData.email,
      },
    });
    if (!user) {
      return res.json({ message: constants.NOT_FOUND, success: false });
    }
    return res.json({ message: constants.TOKEN_IS_VALID, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.update(
      { password: await bcrypt.hash(req.body.password, 10) },
      {
        where: {
          email: req.body.email,
        },
      }
    );
    if (user == 0) {
      return res.json({ message: constants.NOT_FOUND, success: false });
    }
    await PasswordReset.destroy({
      where: {
        email: req.body.email,
      },
    });
    return res.json({
      message: constants.PASSWORD_RESET_SUCCESSFUL,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const contactAdmin = async (req, res) => {
  try {
    const details = req.body;
    const mailService = new MailService();
    await mailService.sendContactAdmin(details);
    return res.json({
      message: constants.EMAIL_SENT_SUCCESSFUL,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const subscribeToNewsletter = async (req, res) => {
  try {
    const details = req.body;
    const mailService = new MailService();
    await mailService.sendSubscribeToNewsletter(details);
    return res.send(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const me = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      return res.send(
        await User.findOne({
          where: {
            id: user.id,
          },
          include: [
            { model: models.Address, as: "address" },
            { model: models.UserProfile, as: "profile" },
            { model: models.Wallet, as: "wallet" },
            {
              model: models.Shop,
              as: "shops",
              include: {
                model: models.Balance,
                as: "balance",
              },
            },
            {
              model: models.Shop,
              as: "managed_shop",
              include: {
                model: models.Balance,
                as: "balance",
              },
            },
          ],
        })
      );
    }
    throw new Error(constants.NOT_AUTHORIZED);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (user) {
      if (req.isSuperAdmin) {
        return res.send(await await UserRepository.updateUser(req, user));
      } else if (req.user.id == req.params.id) {
        return res.send(await UserRepository.updateUser(req, user));
      }
    }
    throw new Error(constants.NOT_AUTHORIZED);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const phoneNumber = req.body.phone_number;
    const user_id = req.body.user_id;
    // TODO: Verify OTP
    // if (await UserRepository.verifyOtp(req)) {
    // Create or update user profile
    const userProfile = await models.UserProfile.findOne({
      where: {
        customer_id: user_id,
      },
    });
    if (userProfile) {
      await userProfile.update({
        contact: phoneNumber,
      });
    } else {
      await models.UserProfile.create({
        contact: phoneNumber,
        customer_id: user_id,
      });
    }
    return res.json({
      message: constants.CONTACT_UPDATE_SUCCESSFUL,
      success: true,
    });
    // }
    // return res.json({
    //   message: constants.CONTACT_UPDATE_FAILED,
    //   success: false,
    // });
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: constants.INVALID_GATEWAY });
  }
};
