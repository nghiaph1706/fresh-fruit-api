import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as UtilService from "../services/UtilServcie.js";
import { Op } from "sequelize";

const { Shipping } = models;
export const index = async (req, res) => {
  const search = UtilService.convertToObject(req.query.search);
  let baseQuery = {
    where: {},
  };
  if (search.name) {
    baseQuery.where.name = {
      [Op.like]: `%${search.name}%`,
    };
  }
  const shipping = await Shipping.findAll(baseQuery);
  return res.send(shipping);
};

export const show = async (req, res) => {
  const { id } = req.params;
  const shipping = await Shipping.findByPk(id);

  if (!shipping) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.send(shipping);
};

export const store = async (req, res) => {
  try {
    const body = req.body;
    if (body.type == "free_shipping") {
      body.amount = 0;
    }
    const result = await Shipping.create(body);
    return res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const body = req.body;
    const shipping = await Shipping.findByPk(req.params.id);
    if (!shipping) {
      res.status(404).send(constants.NOT_FOUND);
    }
    Object.assign(shipping, body);
    const result = await shipping.save();
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroy = async (req, res) => {
  try {
    const shipping = await Shipping.findByPk(req.params.id);
    if (!shipping) {
      res.status(404).send(constants.NOT_FOUND);
    }
    await shipping.destroy();
    return res.status(200).send(shipping);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
