import { models } from '../models/index.js';
import constants from '../config/constants.js';

const { Refund, Order } = models;
export const storeRefund = async (req) => {
  const body = req.body;
  const refund = await Refund.findAll({
    where: { order_id: body.order_id },
  });
  if (refund > 0) {
    throw new Error(constants.ORDER_ALREADY_HAS_REFUND_REQUEST);
  }
  try {
    const order = await Order.findOne({
      where: { id: body.order_id },
      include: [
        {
          model: Order,
          as: 'children',
        },
      ],
    });
    if (order.parent != null) {
      throw new Error(constants.REFUND_ONLY_ALLOWED_FOR_MAIN_ORDER);
    }
    if (req.user.id != order.customer_id || req.isSuperAdmin) {
      throw new Error(constants.NOT_AUTHORIZED);
    }
    let data = body;
    data['customer_id'] = order.customer_id;
    data['amount'] = order.amount;
    const newRefund = await Refund.create(data);
    if (order.children && order.children.length > 0)
      createChildOrderRefund(order.children, data);
    return newRefund;
  } catch (error) {
    throw new Error(constants.NOT_FOUND);
  }
};

const createChildOrderRefund = async (orders, data) => {
  try {
    orders.forEach((order) => {
      data['order_id'] = order.id;
      data['customer_id'] = order.customer_id;
      data['shop_id'] = order.shop_id;
      data['amount'] = order.amount;
      Refund.create(data);
    });
  } catch (error) {
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};
