import { models } from "../models/index.js";
import * as OrderRepository from "../repositories/OrderRepository.js";

const { Order, Product } = models;

export const show = async (req, res) => {
  const { slug } = req.params;
  req.tracking_number = slug;
  return OrderRepository.fetchSingleOrder(req, res);
};

export const store = async (req, res) => {
  const { slug } = req.params;
  req.tracking_number = slug;
  return res.send( await OrderRepository.storeOrder(req, res));
};