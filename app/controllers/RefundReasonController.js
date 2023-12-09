import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { customSlugify } from "../services/UtilServcie.js";
import * as UtilService from "../services/UtilServcie.js";
import { Op } from "sequelize";

const { RefundReason } = models;
export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  const include = [];
  let baseQuery = {
    where: {},
    distinct: true,
    include,
    limit,
    offset,
    order: [[orderBy, sortedBy]],
  };
  if (search.name) {
    baseQuery.where.name = {
      [Op.like]: `%${search.name}%`,
    };
  }
  const refundReason = await RefundReason.findAndCountAll(baseQuery);
  return res.json(
    UtilService.paginate(refundReason.count, limit, offset, refundReason.rows),
  );
};

export const show = async (req, res) => {
  const { slug } = req.params;
  //   const language = req.query.language || constants.DEFAULT_LANGUAGE;
  let refundReason = null;
  try {
    if (isNaN(slug)) {
      refundReason = await RefundReason.findOne({
        where: {
          slug,
        },
      });
    } else {
      refundReason = await RefundReason.findByPk(slug);
    }

    if (!refundReason) {
      return res.status(404).json({ message: constants.NOT_FOUND });
    }

    res.send(refundReason);
  } catch (error) {}
};

export const store = async (req, res) => {
  try {
    const body = req.body;
    body.slug = customSlugify(body.name);
    const result = await RefundReason.create(body);
    return res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const body = req.body;
    const refundReason = await RefundReason.findByPk(req.params.id);
    if (!refundReason) {
      res.status(404).send(constants.NOT_FOUND);
    }
    body.slug = customSlugify(body.name);
    Object.assign(refundReason, body);
    const result = await refundReason.save();
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroy = async (req, res) => {
  try {
    const refundReason = await RefundReason.findByPk(req.params.id);
    if (!refundReason) {
      res.status(404).send(constants.NOT_FOUND);
    }
    await refundReason.destroy();
    return res.status(200).send(refundReason);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
