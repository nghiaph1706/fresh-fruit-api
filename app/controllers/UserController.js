// controllers/UserController.js
import bcrypt from "bcrypt";
import constants from "../config/constants.js";
import { models, sequelize } from "../models/index.js";
import MailService from "../services/MailService.js";
import * as AuthService from "../services/AuthService.js";
import PermissionEnum from "../config/enum/Permission.js";
import * as UserRepository from "../repositories/UserRepository.js";
import * as OAuth2Service from "../services/OAuth2Service.js";
import * as MediaService from "../services/MediaService.js";
import * as UtilService from "../services/UtilServcie.js";
import { Op } from "sequelize";

const { User, PasswordReset, UserProfile, Address, Permission } = models;

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
      await user.getPermissions(),
    );
    let role = PermissionEnum.CUSTOMER;
    if (permissions.includes(PermissionEnum.SUPER_ADMIN)) {
      role = PermissionEnum.SUPER_ADMIN;
    } else if (permissions.includes(PermissionEnum.STORE_OWNER)) {
      role = PermissionEnum.STORE_OWNER;
    } else if (permissions.includes(PermissionEnum.STAFF)) {
      role = PermissionEnum.STAFF;
    }

    return res.json({ token, permissions, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const socialLogin = async (req, res) => {
  try {
    const user = await OAuth2Service.getUserProfile(req.body.access_token);
    const userExist = await User.findOne({
      where: {
        email: user.email,
        is_active: true,
      },
    });

    let token, permissionNames;

    if (!userExist) {
      const newUser = {
        name: user.name,
        email: user.email,
        provider: req.body.provider,
        provider_user_id: user.id,
        email_verified_at: new Date(),
      };

      const createdUser = await User.create(newUser);
      const permissions = [PermissionEnum.CUSTOMER];
      await AuthService.givePermissionTo(createdUser, permissions);

      const avatar = {
        thumbnail: user.avatar,
        original: user.avatar,
      };

      await UserProfile.create({
        customer_id: createdUser.id,
        avatar: JSON.stringify(avatar),
      });

      token = await AuthService.createToken(createdUser);
      permissionNames = await AuthService.getPermissionNames(
        await createdUser.getPermissions(),
      );

      await new MailService().sendWelcome(user);
    } else {
      token = await AuthService.createToken(userExist);
      permissionNames = await AuthService.getPermissionNames(
        await userExist.getPermissions(),
      );
    }

    return res.json({ token, permissions: permissionNames });
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
      await user.getPermissions(),
    );
    await new MailService().sendWelcome(user);
    return res.json({ token, permissions: permissionNames });
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
      },
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
        }),
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

export const changePassword = async (req, res) => {
  try {
    const user = req.user;
    if (await bcrypt.compare(req.body.oldPassword, user.password)) {
      await user.update({
        password: await bcrypt.hash(req.body.newPassword, 10),
      });
      return res.json({
        message: constants.PASSWORD_RESET_SUCCESSFUL,
        success: true,
      });
    } else {
      return res.json({
        message: constants.OLD_PASSWORD_INCORRECT,
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  try {
    let where = null;
    if (search.name) {
      where = {};
      where["name"] = { [Op.like]: `%${search.name}%` };
    }
    const users = await User.findAndCountAll({
      where,
      include: [
        { model: UserProfile, as: "profile" },
        { model: Address, as: "address" },
        { model: Permission },
      ],
      order: [[orderBy, sortedBy]],
      limit: limit,
      offset: offset,
    });
    return res.json(
      UtilService.paginate(users.count, limit, offset, users.rows),
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const store = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const body = req.body;
    const user = await User.create(body, { transaction: t });
    const permissions = [PermissionEnum.CUSTOMER];
    await AuthService.givePermissionTo(user, permissions);
    if (body.address && body.address.length > 0) {
      const addresses = body.address.map((item) => {
        return {
          ...item,
          customer_id: body.id,
        };
      });
      await Address.bulkCreate(addresses, { transaction: t });
    }

    if (body.profile) {
      const profile = await UserProfile.create(body.profile, {
        transaction: t,
      });
    }
    await t.commit();
    return res.status(201).send(user);
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const banUser = async (req, res) => {
  try {
    const user = req.user;
    if (user && req.isSuperAdmin && user.id != req.body.id) {
      const banUser = await User.findOne({ where: { id: req.body.id } });
      if (!banUser) res.status(404).json({ message: constants.NOT_FOUND });
      banUser.is_active = false;
      const result = await banUser.save();
      return res.status(200).send(result);
    } else {
      return res.status(401).send(constants.NOT_AUTHORIZED);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const activeUser = async (req, res) => {
  try {
    const user = req.user;
    if (user && req.isSuperAdmin && user.id != req.body.id) {
      const banUser = await User.findOne({ where: { id: req.body.id } });
      if (!banUser) res.status(404).json({ message: constants.NOT_FOUND });
      banUser.is_active = true;
      const result = await banUser.save();
      return res.status(200).send(result);
    } else {
      return res.status(401).send(constants.NOT_AUTHORIZED);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
