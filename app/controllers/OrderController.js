import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as OrderRepository from "../repositories/OrderRepository.js"

const { Order, Product } = models;

export const show = async (req, res) => {
  const { slug } = req.params;
  req.tracking_number = slug;
  return OrderRepository.fetchSingleOrder(req, res);
};
