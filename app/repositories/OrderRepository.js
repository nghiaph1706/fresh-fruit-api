import { Op, or } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import PaymentGatewayType from "../config/enum/PaymentGatewayType.js";
import Permission from "../config/enum/Permission.js";
import * as AuthService from "../services/AuthService.js";

const { Order, Product, Shop, WalletPoint } = models;

export const fetchSingleOrder = async (req, res) => {
  const user = req.user || null;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;
  const orderParam = req.tracking_number ?? req.body.id;

  try {
    const order = await Order.findOne({
      where: {
        language,
        [Op.or]: [{ id: orderParam }, { tracking_number: orderParam }],
      },
      include: [
        { model: Product, as: "products" },
        {
          association: "children",
          as: "children",
          include: [{ model: Shop, as: "shop" }],
        },
        { model: WalletPoint, as: "wallet_point" },
      ],
    });
    if (!order) {
      return res.status(404).json({ message: constants.NOT_FOUND });
    }

    // * Don't use online payment gateway
    // const intentGateways = [
    //   PaymentGatewayType.CASH,
    //   PaymentGatewayType.CASH_ON_DELIVERY,
    //   PaymentGatewayType.FULL_WALLET_PAYMENT,
    // ];

    // if (!intentGateways.includes(order.payment_gateway)) {
    //   const paymentIntent = await processPaymentIntent(request, settings);
    //   order.payment_intent = paymentIntent;
    // }

    if (!order.customer_id) {
      return res.send(order);
    }

    const hasPermission = await AuthService.hasPermission(user, order.shop_id);

    if (user && req.permissions.includes(Permission.SUPER_ADMIN)) {
      return res.send(order);
    } else if (order.shop_id && hasPermission) {
      return res.send(order);
    } else if (user && user.id == order.customer_id) {
      return res.send(order);
    } else {
      throw new Error(constants.NOT_AUTHORIZED);
    }
    console.log(123);
  } catch (error) {
    throw new Error(error);
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};
