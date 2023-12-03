import { models } from "../models/index.js";
import * as OrderRepository from "../repositories/OrderRepository.js";

const { Order, Product } = models;

export const index = async (req, res) => {
  try {
    const orders = await OrderRepository.fetchOrders(req, res);
    return res.json({ data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const show = async (req, res) => {
  try {
    const { slug } = req.params;
    req.tracking_number = slug;
    return await OrderRepository.fetchSingleOrder(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const store = async (req, res) => {
  try {
    const { slug } = req.params;
    req.tracking_number = slug;
    return res.send(await OrderRepository.storeOrder(req, res));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
