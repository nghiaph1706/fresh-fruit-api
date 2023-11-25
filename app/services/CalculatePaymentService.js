import CouponType from "../config/enum/CouponType.js";
import { models } from "../models/index.js";

const { Variation, Product, Shop, WalletPoint } = models;

export const calculateSubtotal = async (cartItems) => {
    console.log(cartItems);
  if (cartItems.length == 0) {
    throw new Error("Cart items not found");
  }

  let subtotal = 0;

  try {
    for (const item of cartItems) {
      if (item.variation_option_id) {
        const variation = await Variation.findByPk(item.variation_option_id);
        subtotal += calculateEachItemTotal(variation, item.order_quantity);
      } else {
        const product = await Product.findByPk(item.product_id);
        subtotal += calculateEachItemTotal(product, item.order_quantity);
      }
    }

    return subtotal;
  } catch (error) {
    throw new Error("Item not found");
  }
};

export const calculateDiscount = async (coupon, subtotal) => {
  if (coupon.id) {
    if (coupon.type === CouponType.PERCENTAGE_COUPON) {
      return subtotal * (coupon.amount / 100);
    } else if (coupon.type === CouponType.FIXED_COUPON) {
      return coupon.amount;
    }
  }
  return 0;
};

const calculateEachItemTotal = (item, quantity) => {
  let total = 0;

  if (item.sale_price) {
    total += item.sale_price * quantity;
  } else {
    total += item.price * quantity;
  }

  return total;
};
