import { Op } from "sequelize";
import constants from "../config/constants.js";
import Permission from "../config/enum/Permission.js";
import { models } from "../models/index.js";
import * as AuthService from "../services/AuthService.js";
import PaymentGatewayType from "../config/enum/PaymentGatewayType.js";
import OrderStatus from "../config/enum/OrderStatus.js";
import PaymentStatus from "../config/enum/PaymentStatus.js";
import * as CalculatePaymentService from "../services/CalculatePaymentService.js";
import * as WalletService from "../services/WalletService.js";
import * as UtilService from "../services/UtilServcie.js";

const {
  Order,
  Product,
  Shop,
  WalletPoint,
  OrderWalletPoint,
  Wallet,
  User,
  Coupon,
  OrderProduct,
  Balance,
} = models;

export const fetchOrders = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const user = req.user || null;
  const permissions = req.permissions;
  const search = UtilService.convertToObject(req.query.search);
  const hasPermission = await AuthService.hasPermission(
    user,
    req.params.shop_id
  );

  let ordersQuery = {
    where: {},
    include: [
      {
        association: "children",
        as: "children",
        include: [
          { model: Shop, as: "shop" },
          { model: Product, as: "products" },
        ],
      },
      {
        model: Product,
        as: "products", // Include associated products for each order
        through: {
          model: models.OrderProduct,
          as: "pivot",
        },
      },
    ],
    limit,
    offset,
    order: [[orderBy, sortedBy]],
  };

  if (
    user &&
    permissions.includes(Permission.SUPER_ADMIN) &&
    req.params.shop_id
  ) {
    console.log(1);
    ordersQuery.where.parent_id = null;
  } else if (hasPermission) {
    console.log(2);
    ordersQuery.where.parent_id = null;
    ordersQuery.where.shop_id = req.params.shop_id;
  } else {
    console.log(3);
    ordersQuery.where.customer_id = user?.id;
    ordersQuery.where.parent_id = { [Op.ne]: null };
  }
  if (search.tracking_number) {
    ordersQuery.where.tracking_number = {
      [Op.like]: `%${search.tracking_number}%`,
    };
  }
  const orders = await Order.findAndCountAll(ordersQuery);
  return res.json(
    UtilService.paginate(orders.count, limit, offset, orders.rows)
  );
};

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
        {
          model: Product,
          as: "products", // Include associated products for each order
          through: {
            model: models.OrderProduct,
            as: "pivot",
          },
        },
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
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};

export const storeOrder = async (req, settings) => {
  req.body.tracking_number = await generateTrackingNumber();
  let payment_gateway_type =
    req.body.payment_gateway || PaymentGatewayType.CASH_ON_DELIVERY;

  switch (payment_gateway_type) {
    case PaymentGatewayType.CASH_ON_DELIVERY:
      req.body.order_status = OrderStatus.PROCESSING;
      req.body.payment_status = PaymentStatus.CASH_ON_DELIVERY;
      break;

    case PaymentGatewayType.CASH:
      req.body.order_status = OrderStatus.PROCESSING;
      req.body.payment_status = PaymentStatus.CASH;
      break;

    case PaymentGatewayType.FULL_WALLET_PAYMENT:
      req.body.order_status = OrderStatus.PROCESSING;
      req.body.payment_status = PaymentStatus.WALLET;
      break;

    default:
      req.body.order_status = OrderStatus.PENDING;
      req.body.payment_status = PaymentStatus.PENDING;
      break;
  }

  let useWalletPoints =
    req.body.use_wallet_points !== undefined
      ? req.body.use_wallet_points
      : false;
  if (
    req.user &&
    req.permissions.includes(Permission.SUPER_ADMIN) &&
    req.body.customer_id !== undefined
  ) {
    req.body.customer_id = req.body.customer_id;
  } else {
    req.body.customer_id = req.user ? req.user.id : null;
  }

  let user = null;
  try {
    let user = await User.findById(req.body.customer_id);
    if (user) {
      req.body.customer_name = user.name;
    }
  } catch (e) {
    let user = null;
  }
  req.body.amount = await CalculatePaymentService.calculateSubtotal(
    req.body.products
  );

  let coupon = null;

  if (req.body.coupon_id) {
    try {
      coupon = await Coupon.findOne({
        where: { id: req.body.coupon_id },
      });
      if (coupon) {
        req.body.discount = CalculatePaymentService.calculateDiscount(
          coupon,
          req.body.amount
        );
      } else {
        throw new Error(COUPON_NOT_FOUND);
      }
    } catch (error) {
      throw new Error(COUPON_NOT_FOUND);
    }
  }

  if (coupon && coupon.type === CouponType.FREE_SHIPPING_COUPON) {
    req.body.delivery_fee = 0;
  }
  req.body.paid_total =
    req.body.amount +
    req.body.sales_tax +
    req.body.delivery_fee -
    req.body.discount;
  req.body.total = req.body.paid_total;

  if (useWalletPoints && user) {
    let wallet = user.getWallet();
    let amount = null;

    if (wallet && wallet.available_points !== undefined) {
      amount =
        parseFloat(req.body.paid_total).toFixed(2) -
        WalletService.walletPointsToCurrency(wallet.available_points);
    }

    if (amount !== null && amount <= 0) {
      req.body.payment_gateway = PaymentGatewayType.FULL_WALLET_PAYMENT;
      let order = createOrder(req);
      storeOrderWalletPoint(req.body.paid_total, order.id);
      manageWalletAmount(req.body.paid_total, user.id);
      return order;
    }
  } else {
    let amount = parseFloat(req.body.paid_total).toFixed(2);
  }

  let order = createOrder(req);

  if (useWalletPoints && user) {
    storeOrderWalletPoint(
      parseFloat(req.body.paid_total).toFixed(2) - amount,
      order.id
    );
    manageWalletAmount(parseFloat(req.body.paid_total).toFixed(2), user.id);
  }

  // if (
  //   payment_gateway_type === PaymentGatewayType.CASH_ON_DELIVERY ||
  //   payment_gateway_type === PaymentGatewayType.CASH
  // ) {
  //   orderStatusManagementOnCOD(
  //     order,
  //     OrderStatus.PENDING,
  //     OrderStatus.PROCESSING
  //   );
  // } else {
  //   orderStatusManagementOnPayment(
  //     order,
  //     OrderStatus.PENDING,
  //     PaymentStatus.PENDING
  //   );
  // }
  // event.emit("OrderProcessed", order);

  return order;
};

const generateTrackingNumber = async () => {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Get today's date in YYYYMMDD format

  const existingTrackingNumbers = await Order.findAll({
    attributes: ["tracking_number"],
    where: {
      tracking_number: {
        [Op.like]: `${today}%`,
      },
    },
    raw: true,
  });

  let trackingNumber;
  do {
    trackingNumber = `${today}${Math.floor(100000 + Math.random() * 900000)}`;
  } while (
    existingTrackingNumbers.some(
      (existing) => existing.tracking_number === trackingNumber
    )
  );

  return trackingNumber;
};

const createChildOrder = async (id, request) => {
  const products = request.body.products;
  const language = request.body.language;
  const productsByShop = {};

  products.forEach(async (cartProduct) => {
    const product = await Product.findByPk(cartProduct.product_id);
    if (product) {
      if (!productsByShop[product.shop_id]) {
        productsByShop[product.shop_id] = [];
      }
      productsByShop[product.shop_id].push(cartProduct);
    }
  });

  const childOrders = [];

  for (const shopId in productsByShop) {
    const cartProducts = productsByShop[shopId];
    const amount = cartProducts.reduce(
      (total, cartProduct) => total + cartProduct.subtotal,
      0
    );

    const orderInput = {
      tracking_number: generateTrackingNumber(),
      shop_id: shopId,
      order_status: request.body.order_status,
      payment_status: request.body.payment_status,
      customer_id: request.body.customer_id,
      shipping_address: request.body.shipping_address,
      billing_address: request.body.billing_address,
      customer_contact: request.body.customer_contact,
      customer_name: request.body.customer_name,
      delivery_time: request.body.delivery_time,
      delivery_fee: 0,
      sales_tax: 0,
      discount: 0,
      parent_id: id,
      amount,
      total: amount,
      paid_total: amount,
      language: language || DEFAULT_LANGUAGE,
      payment_gateway: request.body.payment_gateway,
    };

    try {
      const order = await Order.create(orderInput);
      await order.addProducts(
        cartProducts.map((product) => product.product_id)
      );
      childOrders.push(order);
    } catch (error) {
      throw new Error("Error creating child order");
    }
  }

  return childOrders;
};

const createOrder = async (request) => {
  try {
    const orderInput = {
      tracking_number: request.body.tracking_number,
      customer_id: request.body.customer_id,
      shop_id: request.body.shop_id,
      language: request.body.language,
      order_status: request.body.order_status,
      payment_status: request.body.payment_status,
      amount: request.body.amount,
      sales_tax: request.body.sales_tax,
      paid_total: request.body.paid_total,
      total: request.body.total,
      delivery_time: request.body.delivery_time,
      payment_gateway: request.body.payment_gateway,
      discount: request.body.discount,
      coupon_id: request.body.coupon_id,
      logistics_provider: request.body.logistics_provider,
      billing_address: JSON.stringify(request.body.billing_address),
      shipping_address: JSON.stringify(request.body.shipping_address),
      delivery_fee: request.body.delivery_fee,
      customer_contact: request.body.customer_contact,
      customer_name: request.body.customer_name,
    };
    const order = await Order.create(orderInput);

    const products = request.body.products;
    products.forEach(async (product) => {
      await OrderProduct.create({
        orderId: order.id,
        productId: product.product_id,
        order_quantity: product.order_quantity,
        unit_price: product.unit_price,
        subtotal: product.subtotal,
      });
    });

    await createChildOrder(order, request);
    return order;
  } catch (error) {
    throw new Error("Something went wrong while creating the order");
  }
};

export const storeOrderWalletPoint = (amount, order_id) => {
  if (amount > 0) {
    OrderWalletPoint.create({ amount, order_id });
  }
};

async function manageWalletAmount(total, customer_id) {
  try {
    const totalInPoints = currencyToWalletPoints(total);

    // Fetch wallet details for the customer
    const wallet = await Wallet.findOne({ where: { customer_id } });

    // Calculate available points after the transaction
    const availablePoints =
      wallet.available_points - totalInPoints >= 0
        ? wallet.available_points - totalInPoints
        : 0;

    // Calculate points used in the transaction
    let spend;
    if (availablePoints === 0) {
      spend = wallet.points_used + wallet.available_points;
    } else {
      spend = wallet.points_used + totalInPoints;
    }

    // Update wallet details
    wallet.available_points = availablePoints;
    wallet.points_used = spend;
    await wallet.save();
  } catch (error) {
    // Handle exceptions or errors appropriately
    throw new Error("SOMETHING_WENT_WRONG");
  }
}

export const updateOrder = async (req, res) => {
  const order = await Order.findByPk(req.body.id);
  const user = req.user || null;
  if (order.shop_id) {
    if (await AuthService.hasPermission(user, order.shop_id)) {
      return changeOrderStatus(order, req.body.order_status);
    }
  } else if (user && req.permissions.includes(Permission.SUPER_ADMIN)) {
    return changeOrderStatus(order, req.body.order_status);
  } else {
    throw new Error(constants.NOT_AUTHORIZED);
  }
};

const changeOrderStatus = async (order, status) => {
  const prevOrderStatus = order.order_status;
  order.order_status = status;
  const newOrderStatus = order.order_status;

  if (prevOrderStatus !== newOrderStatus) {
    const paymentGatewayType =
      order.payment_gateway || PaymentGatewayType.CASH_ON_DELIVERY;
    if (
      ![PaymentGatewayType.CASH, PaymentGatewayType.CASH_ON_DELIVERY].includes(
        paymentGatewayType
      )
    ) {
      if (order.payment_status === PaymentStatus.SUCCESS) {
        manageVendorBalance(order, newOrderStatus, prevOrderStatus);
      }
      orderStatusManagementOnPayment(
        order,
        newOrderStatus,
        order.payment_status
      );
    } else {
      manageVendorBalance(order, newOrderStatus, prevOrderStatus);
      orderStatusManagementOnCOD(order, prevOrderStatus, newOrderStatus);
    }
  }
  await order.save();

  if (order.children && order.order_status === OrderStatus.CANCELLED) {
    order.children.forEach((childOrder) => {
      childOrder.order_status = status;
      childOrder.save();
    });
  }
  return order;
};

const manageVendorBalance = async (order, orderStatus, prevOrderStatus) => {
  if (orderStatus === OrderStatus.COMPLETED) {
    checkIfChildOrder(order, "add");
  } else if (prevOrderStatus === OrderStatus.COMPLETED) {
    checkIfChildOrder(order, "deduct");
  }
};

const checkIfChildOrder = async (order, type) => {
  if (order.parent_id) {
    const parentOrder = await Order.findByPk(order.parent_id);
    if (parentOrder.order_status === OrderStatus.COMPLETED) {
      updateBalanceShop(order, type);
    }
  } else {
    const childOrders = await Order.findAll({
      where: { parent_id: order.id },
    });
    if (childOrders.length > 0) {
      childOrders.forEach((childOrder) => {
        if (childOrder.order_status === OrderStatus.COMPLETED) {
          updateBalanceShop(childOrder, type);
        }
      });
    }
  }
};

const updateBalanceShop = async (order, actionType = "add") => {
  let balance = await Balance.findOne({ where: { shop_id: order.shop_id } });
  const adminCommissionRate = balance.admin_commission_rate;
  let shopEarnings = (order.total * (100 - adminCommissionRate)) / 100;
  if (actionType == "deduct") {
    shopEarnings = shopEarnings * -1;
  }
  balance.total_earnings = balance.total_earnings + shopEarnings;
  balance.current_balance = balance.current_balance + shopEarnings;
  await balance.save();
};

const orderStatusManagementOnPayment = async (
  order,
  orderStatus,
  paymentStatus
) => {
  if (paymentStatus === PaymentStatus.PENDING) {
    // send notification to user about order is pending.
  } else if (paymentStatus === PaymentStatus.PROCESSING) {
    // send notification to user about order is processing.
  } else if (paymentStatus === PaymentStatus.SUCCESS) {
    switch (orderStatus) {
      case "order-processing":
        // send notification to site-admin about order is at processing level & payment is success.
        break;

      case "order-at-local-facility":
        // send notification to user about order is at local facility.
        break;

      case "order-out-for-delivery":
        // send notification to user about order is out for delivery.
        break;

      case "order-completed":
        // send notification to user about order is delivered.
        break;

      case "order-cancelled":
        orderStatusManagementOnCancelled(order);
        break;
      default:
      // event(new OrderStatusChanged($order));
    }
  } else if (paymentStatus === PaymentStatus.AWAITING_FOR_APPROVAL) {
    switch (orderStatus) {
      case "order-pending":
        // send notification to user about order is pending & payment is waiting for approval.
        break;
    }
  } else if (paymentStatus === PaymentStatus.FAILED) {
    switch (orderStatus) {
      case "order-failed":
        // send notification to site-admin about order is failed due to payment failed.
        // then admin will set order status to cancelled manually on order page.
        break;

      case "order-cancelled":
        orderStatusManagementOnCancelled(order);
        break;
    }
  } else if (paymentStatus === PaymentStatus.REVERSAL) {
    switch (orderStatus) {
      case "order-cancelled":
        orderStatusManagementOnCancelled(order);
        break;
    }
  }
};

const orderStatusManagementOnCancelled = async (order) => {
  let parentOrder = null;
  if (order.parent_id) {
    parentOrder = await Order.findByPk(order.parent_id);
  } else {
    parentOrder = order;
  }

  const taxAmount = parentOrder.sales_tax;
  const deliveryFee = parentOrder.delivery_fee;
  const currentlyPaid = parentOrder.paid_total;
  const amount = currentlyPaid - taxAmount - deliveryFee;
  let taxRate = 0;
  if (amount > 0) {
    taxRate = taxAmount / amount;
    //for precision
    taxRate = taxRate * 1000000;
  }

  if (order.parent_id) {
    const reducedRevenueAmount = amount - order.amount;
    const cancelledTaxAmount = (order.amount * taxRate) / 1000000;
    const reducedTaxAmount = parentOrder.sales_tax - cancelledTaxAmount; //for precision

    parentOrder.sales_tax = reducedTaxAmount;
    parentOrder.cancelled_tax += cancelledTaxAmount;

    parentOrder.paid_total =
      reducedRevenueAmount + reducedTaxAmount + deliveryFee;
    parentOrder.total = reducedRevenueAmount + reducedTaxAmount + deliveryFee;
    parentOrder.cancelled_amount =
      parentOrder.cancelled_amount +
      order.amount +
      (order.amount * taxRate) / 1000000;
    await parentOrder.save();

    if (parentOrder.paid_total == 0) {
      parentOrder.cancelled_delivery_fee = parentOrder.delivery_fee;
      parentOrder.delivery_fee = 0;
      parentOrder.sales_tax = 0;
      await parentOrder.save();
    }

    order.cancelled_amount = order.total;
    order.paid_total = 0;
    order.total = 0;
    await order.save();
  } else {
    const childOrders = await Order.findAll({
      where: { parent_id: parentOrder.id },
    });
    childOrders.forEach((childOrder) => {
      if (childOrder.order_status == OrderStatus.CANCELLED) return;
      childOrder.cancelled_amount = childOrder.total;
      childOrder.paid_total = 0;
      childOrder.total = 0;
      childOrder.save();
    });
    parentOrder.cancelled_amount += parentOrder.paid_total;
    parentOrder.cancelled_tax += parentOrder.sales_tax;
    parentOrder.cancelled_delivery_fee = parentOrder.delivery_fee;
    parentOrder.sales_tax = 0;
    parentOrder.delivery_fee = 0;
    parentOrder.paid_total = 0;
    parentOrder.total = 0;
    parentOrder.save();
  }
};

const orderStatusManagementOnCOD = async (order, prevStatus, newStatus) => {
  switch (newStatus) {
    case OrderStatus.CANCELLED:
      orderStatusManagementOnCancelled(order);
      break;

    case OrderStatus.REFUNDED:
      break;

    case OrderStatus.FAILED:
      break;
    default:
      break;
  }
};
