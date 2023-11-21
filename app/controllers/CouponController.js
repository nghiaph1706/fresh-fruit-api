import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Coupon } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;

  const coupons = await Coupon.findAll({
    where: {
      language,
    },
    limit: limit,
  });

  return res.json({ coupons });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  let coupon;

  if (!isNaN(slug)) {
    coupon = await Coupon.findByPk(slug, {});
  } else {
    coupon = await Coupon.findOne({
      where: {
        language,
        code: slug,
      },
    });
  }

  if (!coupon) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ coupon });
};
