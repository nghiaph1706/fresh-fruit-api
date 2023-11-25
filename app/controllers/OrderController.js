import { models } from "../models/index.js";
import * as OrderRepository from "../repositories/OrderRepository.js";

const { Order, Product } = models;

export const index = async (req, res) => {
  return res.json({data: await OrderRepository.fetchOrders(req, res)});
};

export const show = async (req, res) => {
  const { slug } = req.params;
  req.tracking_number = slug;
  return await OrderRepository.fetchSingleOrder(req, res);
};

export const store = async (req, res) => {
  const { slug } = req.params;
  req.tracking_number = slug;
  return res.send(await OrderRepository.storeOrder(req, res));
};
