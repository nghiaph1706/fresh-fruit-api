import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { only } from "../repositories/TypeRepository.js";
import * as UtilService from "../services/UtilServcie.js";

const { Coupon, Setting } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  const include = [];
  let baseQuery = {
    where: {
      language,
    },
    include,
    limit,
    offset,
    order: [[orderBy, sortedBy]],
  };
  if (search.code) {
    baseQuery.where.code = {
      [Op.like]: `%${search.code}%`,
    };
  }
  const coupons = await Coupon.findAndCountAll(baseQuery);

  return res.json(
    UtilService.paginate(coupons.count, limit, offset, coupons.rows),
  );
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

  res.send(coupon);
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

export const store = async (req, res) => {
  const body = req.body;
  try {
    const result = await Coupon.create(body);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  req.body.id = parseInt(req.params.id);
  return res.status(200).send(await updateCoupon(req.body));
};

export const updateCoupon = async (body) => {
  const dataArray = [
    "id",
    "code",
    "language",
    "description",
    "image",
    "type",
    "amount",
    "minimum_cart_amount",
    "active_from",
    "expire_at",
  ];
  try {
    const coupon = await Coupon.findByPk(body.id);
    if (!coupon) {
      throw new Error(constants.NOT_FOUND);
    }
    if (body.language && body.language === constants.DEFAULT_LANGUAGE) {
      const updateCoupon = only(body, dataArray);
      const nonTranslatableKeys = ["language", "image", "description", "id"];
      nonTranslatableKeys.forEach((item) => {
        if (updateCoupon[item]) {
          delete updateCoupon[item];
        }
      });
      await Coupon.update(updateCoupon, { where: { code: coupon.code } });
    }
    delete body.id;
    Object.assign(coupon, body);
    const result = await coupon.save();
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};

export const destroy = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      res.status(404).json({ message: constants.NOT_FOUND });
    }
    await coupon.destroy();
    res.status(200).send(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
