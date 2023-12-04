import constants from "../config/constants.js";
import WithdrawStatus from "../config/enum/WithdrawStatus.js";
import { models } from "../models/index.js";
import { sequelize } from "../models/index.js";
import { Op } from "sequelize";
import * as UtilService from "../services/UtilServcie.js";

const { Withdraw, Shop, Balance } = models;
export const index = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  try {
    const query = req.query;
    const shop_id =
      query.shop_id && query.shop_id != undefined ? query.shop_id : false;
    if (shop_id) {
      const shops = await Shop.findAll({ where: { owner_id: req.user.id } });
      if (shops.some((item) => item.id == shop_id)) {
        const results = await Withdraw.findAndCountAll({
          include: [
            {
              model: Shop,
              as: "shop",
            },
          ],
          where: {
            shop_id: shop_id,
          },
          order: [[orderBy, sortedBy]],
          limit: limit,
          offset: offset,
        });
        return res.json(
          UtilService.paginate(results.count, limit, offset, results.rows),
        );
      } else if (req.user && req.isSuperAdmin) {
        const results = await Withdraw.findAndCountAll({
          include: [
            {
              model: Shop,
              as: "shop",
            },
          ],
          where: {
            shop_id: { [Op.ne]: null },
          },
          order: [[orderBy, sortedBy]],
          limit: limit,
          offset: offset,
        });
        return res.json(
          UtilService.paginate(results.count, limit, offset, results.rows),
        );
      } else {
        throw new Error(constants.NOT_AUTHORIZED);
      }
    } else {
      if (req.user && req.isSuperAdmin) {
        const results = await Withdraw.findAndCountAll({
          include: [
            {
              model: Shop,
              as: "shop",
            },
          ],
          where: {
            id: { [Op.ne]: null },
          },
          order: [[orderBy, sortedBy]],
          limit: limit,
          offset: offset,
        });
        return res.json(
          UtilService.paginate(results.count, limit, offset, results.rows),
        );
      } else {
        throw new Error(constants.NOT_AUTHORIZED);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchWithdraws = async (req) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 15;
    const query = req.query;
    const shop_id =
      query.shop_id && query.shop_id != undefined ? query.shop_id : false;
    if (shop_id) {
      const shops = await Shop.findAll({ where: { owner_id: req.user.id } });
      if (shops.some((item) => item.id == shop_id)) {
        const results = await Withdraw.findAll({
          include: [
            {
              model: Shop,
              as: "shop",
            },
          ],
          where: {
            shop_id: shop_id,
          },
          limit: limit,
        });
        return results;
      } else if (req.user && req.isSuperAdmin) {
        const results = await Withdraw.findAll({
          include: [
            {
              model: Shop,
              as: "shop",
            },
          ],
          where: {
            shop_id: { [Op.ne]: null },
          },
          limit: limit,
        });
        return results;
      } else {
        throw new Error(constants.NOT_AUTHORIZED);
      }
    } else {
      if (req.user && req.isSuperAdmin) {
        const results = await Withdraw.findAll({
          include: [
            {
              model: Shop,
              as: "shop",
            },
          ],
          where: {
            id: { [Op.ne]: null },
          },
          limit: limit,
        });
        return results;
      } else {
        throw new Error(constants.NOT_AUTHORIZED);
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};

export const show = async (req, res) => {
  try {
    const shops = await Shop.findAll({ where: { owner_id: req.user.id } });
    const withdraws = await Withdraw.findByPk(req.params.id);
    if (
      req.user &&
      (req.isSuperAdmin || shops.some((item) => item.id == withdraws.shop_id))
    ) {
      return res.status(200).send(withdraws);
    } else {
      return res.status(401).json({ message: constants.NOT_AUTHORIZED });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: constants.SOMETHING_WENT_WRONG });
  }
};

export const store = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const body = req.body;
    const shops = await Shop.findAll({ where: { owner_id: req.user.id } });
    if (
      req.user &&
      (req.isSuperAdmin || shops.some((item) => item == body.shop_id))
    ) {
      if (!body.shop_id) {
        res
          .status(400)
          .json({ message: constants.WITHDRAW_MUST_BE_ATTACHED_TO_SHOP });
      }
      const balance = await Balance.findOne({
        where: { shop_id: body.shop_id },
      });
      if (
        balance &&
        balance.current_balance &&
        balance.current_balance <= body.amount
      ) {
        res.status(400).json({ message: constants.INSUFFICIENT_BALANCE });
      }
      const withdraws = await Withdraw.create(body, { transaction: t });
      balance.withdrawn_amount = balance.withdrawn_amount + body.amount;
      balance.current_balance = balance.current_balance - body.amount;
      await balance.save({ transaction: t });
      withdraws.status = WithdrawStatus.PENDING;
      await t.commit();
      return res.status(201).send(withdraws);
    } else {
      return res.status(401).json({ message: constants.NOT_AUTHORIZED });
    }
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ message: constants.SOMETHING_WENT_WRONG });
  }
};

export const update = async (req, res) => {
  res.status(400).json({ message: constants.ACTION_NOT_VALID });
};

export const destroy = async (req, res) => {
  try {
    if (req.user && req.isSuperAdmin) {
      const withdraws = await Withdraw.findByPk(req.params.id);
      withdraws.destroy();
      return res.status(200).send(withdraws);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: constants.COULD_NOT_DELETE_THE_RESOURCE });
  }
};

export const approveWithdraw = async (req, res) => {
  try {
    const body = req.body;
    if (req.user && req.isSuperAdmin) {
      const status = body.status ? body.status : body.status.value;
      const withdraw = await Withdraw.findByPk(body.id);
      withdraw.status = status;
      const newWithdraw = await withdraw.save();
      return res.status(200).send(newWithdraw);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: constants.SOMETHING_WENT_WRONG });
  }
};
