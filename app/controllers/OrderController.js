import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as OrderRepository from "../repositories/OrderRepository.js";

const { Order, Product, WalletPoint, PaymentIntent } = models;

export const index = async (req, res) => {
  try {
    const result = await OrderRepository.fetchOrders(req, res);
    return result;
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

export const findByTrackingNumber = async (req, res) => {
  const user = req.user ?? null;
  try {
    const order = await Order.findOne({
      where: { tracking_number: req.params.tracking_number },
      include: [
        { model: WalletPoint, as: "wallet_point" },
        { model: Product, require: true },
        { model: Order, as: "children" },
        { model: PaymentIntent, as: "payment_intent" },
      ],
    });
    if (order && order.customer_id === null) {
      return res.status(200).send(order);
    }

    if (user && (user.id === order.customer_id || req.isSuperAdmin)) {
      return res.status(200).send(order);
    } else {
      res.status(401).json({ message: constants.NOT_AUTHORIZED });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
