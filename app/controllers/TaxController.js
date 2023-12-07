import constants from "../config/constants.js";
import Permission from "../config/enum/Permission.js";
import { models, sequelize } from "../models/index.js";
import { hasPermission } from "../services/AuthService.js";
import * as UtilService from "../services/UtilServcie.js";
import { Op } from "sequelize";

const { Tax } = models;
export const index = async (req, res) => {
  //   const language = req.query.language
  //     ? req.query.language
  //     : constants.DEFAULT_LANGUAGE;
  //   const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  //   const offset = req.query.page ? parseInt(req.query.page) - 1 : 0;
  //   const orderBy = req.query.orderBy || "created_at";
  //   const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  try {
    let where = null;
    if (search.name) {
      where = {};
      where["name"] = { [Op.like]: `%${search.name}%` };
    }
    const tax = await Tax.findAll({ where });
    return res.status(200).send(tax);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const show = async (req, res) => {
  try {
    const tax = await Tax.findOne({ where: { id: req.params.id } });
    if (!tax) {
      return res.status(404).send(constants.NOT_FOUND);
    }
    return res.status(200).send(tax);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const store = async (req, res) => {
  try {
    const body = req.body;
    const tax = await Tax.create(body);
    return res.status(201).send(tax);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const tax = await Tax.findOne({ where: { id: req.params.id } });
    if (!tax) {
      return res.status(404).send(constants.NOT_FOUND);
    }
    Object.assign(tax, req.body);
    const result = await tax.save();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroy = async (req, res) => {
  try {
    const tax = await Tax.findOne({ where: { id: req.params.id } });
    if (!tax) {
      return res.status(404).send(constants.NOT_FOUND);
    }
    await tax.destroy();
    return res.status(200).send(tax);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
