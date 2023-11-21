import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Coupon, Setting } = models;

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

export const verify = async (req, res) => {
  const code = req.body.code;
  const subTotal = req.body.sub_total;

  try {
    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) {
      return res.status(404).json({ message: constants.INVALID_COUPON_CODE });
    }
    const isSatisfy = subTotal >= coupon.minimum_cart_amount;
    const settings = await Setting.findOne({
      where: {
        language: constants.DEFAULT_LANGUAGE,
      },
    });
    const isFreeShipping = settings.options.freeShipping;
    const freeShippingAmount = settings.options.freeShippingAmount;
    if (
      coupon.is_valid &&
      isFreeShipping &&
      freeShippingAmount <= subTotal &&
      coupon.type === CouponType.FREE_SHIPPING_COUPON
    ) {
      return res.json({
        is_valid: false,
        message: constants.ALREADY_FREE_SHIPPING_ACTIVATED,
      });
    } else if (coupon.is_valid && isSatisfy) {
      return res.json({ is_valid: true, coupon });
    } else if (coupon.is_valid && !isSatisfy) {
      return res.json({
        is_valid: false,
        message: constants.COUPON_CODE_IS_NOT_APPLICABLE,
      });
    } else {
      return res.json({
        is_valid: false,
        message: constants.INVALID_COUPON_CODE,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
