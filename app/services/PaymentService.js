import { Op, or } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import PaymentGatewayType from "../config/enum/PaymentGatewayType.js";

const { Order, PaymentIntent } = models;

export const processPaymentIntent = async (req, settings) => {
  const orderTrackingNumber = req.tracking_number;
  const order = await fetchOrderByTrackingNumber(orderTrackingNumber);

  const isPaymentIntentExists = await paymentIntentExists(
    orderTrackingNumber,
    settings.options.paymentGateway
  );

  if (!isPaymentIntentExists) {
    return await savePaymentIntent(order, settings.options.paymentGateway, req);
  }

  return await PaymentIntent.findOne({
    where: {
      [Op.or]: [
        { tracking_number: orderTrackingNumber },
        { order_id: orderTrackingNumber },
      ],
      payment_gateway: settings.options.paymentGateway.toUpperCase(), 
    },
  });
};

export const fetchOrderByTrackingNumber = async (tracking_number) => {
  try {
    return await Order.findOne({
      where: {
        [Op.or]: [{ id: tracking_number }, { tracking_number }],
      },
    });
  } catch (error) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};

export const paymentIntentExists = async (
  order_tracking_number,
  payment_gateway
) => {
  const paymentIntent = await PaymentIntent.findOne({
    where: {
      [Op.or]: [
        { tracking_number: order_tracking_number },
        { order_id: order_tracking_number },
      ],
      payment_gateway: payment_gateway.toUpperCase(),
    },
  });
  return !!paymentIntent;
};

const savePaymentIntent = async (order, paymentGateway, request) => {
  try {
    const paymentIntentInfo = await createPaymentIntent(
      order,
      request,
      paymentGateway
    );

    const newPaymentIntent = await PaymentIntent.create({
      order_id: order.id,
      tracking_number: order.tracking_number,
      payment_gateway: paymentGateway,
      payment_intent_info: paymentIntentInfo,
    });

    return newPaymentIntent;
  } catch (error) {
    throw new Error("Error saving payment intent");
  }
};

const createPaymentIntent = async (order, request, paymentGateway) => {
  try {
    let createdIntent = {
      amount: order.paid_total,
      order_tracking_number: order.tracking_number,
    };

    if (
      request.user !== null &&
      paymentGateway.toUpperCase() === PaymentGatewayType.STRIPE
    ) {
      const customer = await createPaymentCustomer(request);
      createdIntent.customer = customer.customer_id;
    }

    return await Payment.getIntent(createdIntent);
  } catch (error) {
    throw new Error("Error creating payment intent");
  }
};

const createPaymentCustomer = async (request) => {
  try {
    const settings = await Settings.findOne();
    const paymentGatewayValue = PaymentGatewayType.getValues();

    const existingCustomer = await PaymentGateway.findOne({
      where: {
        user_id: request.user.id,
        gateway_name: settings.options.paymentGateway,
      },
    });

    if (!existingCustomer) {
      const customer = await Payment.createCustomer(request);
      if (
        paymentGatewayValue.includes(
          settings.options.paymentGateway.toUpperCase()
        )
      ) {
        await PaymentGateway.create({
          user_id: request.user.id,
          customer_id: customer.customer_id,
          gateway_name: settings.options.paymentGateway,
        });
      }
      return customer;
    } else {
      return existingCustomer;
    }
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
