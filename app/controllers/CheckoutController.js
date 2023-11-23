import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as CheckoutRepository from "../repositories/CheckoutRepository.js"
import * as WalletRepository from "../repositories/WalletRepository.js"

const { Setting, User } = models;

export const verify = async (req, res) => {
  let user = null;

  try {
    if (req.body.customer_id) {
      user = await User.findByPk(req.body.customer_id);
    } else {
      user = req.user || null;
    }
    if (!user) {
      return res.status(404).json({ error: constants.NOT_FOUND });
    }

    let wallet = (await user.getWallet()) ?? null;
    const settings = await Setting.findOne({
      where: {
        language: constants.DEFAULT_LANGUAGE,
      },
    });

    let minimumOrderAmount = settings.options.minimumOrderAmount || 0;
    let unavailableProducts = await CheckoutRepository.checkStock(req.body.products);
    let amount = await CheckoutRepository.getOrderAmount(req, unavailableProducts);
    let shippingCharge =
      settings.options.freeShipping &&
        settings.options.freeShippingAmount <= amount
        ? 0
        : await CheckoutRepository.calculateShippingCharge(req, amount);
    let tax = await CheckoutRepository.calculateTax(req, shippingCharge, amount);
    let total = amount + tax + shippingCharge;
    if (total < minimumOrderAmount) {
      return res.status(500).json({ message: "Minimum order amount is " + minimumOrderAmount });
    }
    return res.json({
      total_tax: tax,
      shipping_charge: shippingCharge,
      unavailable_products: unavailableProducts,
      wallet_amount: wallet?.available_points || 0,
      wallet_currency: wallet?.available_points ? await WalletRepository.currencyToWalletPoints(wallet.available_points) : 0
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
