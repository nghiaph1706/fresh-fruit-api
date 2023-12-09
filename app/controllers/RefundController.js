import constants from "../config/constants.js";
import { models, sequelize } from "../models/index.js";
import PermissionEnum from "../config/enum/Permission.js";
import { hasPermission } from "../services/AuthService.js";
import { Op, literal } from "sequelize";
import * as RefundRepository from "../repositories/RefundRepository.js";
import * as UtilService from "../services/UtilServcie.js";
import RefundStatus from "../config/enum/RefundStatus.js";
import OrderStatus from "../config/enum/OrderStatus.js";
import PaymentStatus from "../config/enum/PaymentStatus.js";

const {
  Refund,
  Order,
  User,
  Shop,
  RefundReason,
  Product,
  OrderProduct,
  Balance,
  Wallet,
} = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  const query = req.query;
  let where = null;
  if (search.refund_reason?.slug) {
    console.log("hello2");
    where = {};
    where["slug"] = search.refund_reason.slug;
  }
  try {
    if (req.user && req.isSuperAdmin && !query.shop_id) {
      console.log("hello1");
      const results = await Refund.findAndCountAll({
        include: [
          {
            model: Order,
            require: true,
          },
          {
            model: Shop,
            require: true,
          },
          {
            model: User,
            as: "customer",
          },
          {
            model: RefundReason,
            require: true,
            where,
          },
        ],
        distinct: true,
        where: {
          id: { [Op.ne]: null },
          shop_id: { [Op.eq]: null },
        },
        limit,
        offset,
        order: [[orderBy, sortedBy]],
      });
      return res.json(
        UtilService.paginate(results.count, limit, offset, results.rows),
      );
    } else if (query.shop_id && hasPermission(req.user, query.shop_id)) {
      console.log("hello2");
      const results = await Refund.findAndCountAll({
        include: [
          {
            model: Order,
            require: true,
          },
          {
            model: Shop,
            require: true,
          },
          {
            model: User,
            as: "customer",
          },
          {
            model: RefundReason,
            require: true,
            where,
          },
        ],
        distinct: true,
        where: {
          shop_id: { [Op.eq]: query.shop_id },
        },
        limit,
        offset,
        order: [[orderBy, sortedBy]],
      });
      return res.json(
        UtilService.paginate(results.count, limit, offset, results.rows),
      );
    } else if (req.user && req.permissions.includes(PermissionEnum.CUSTOMER)) {
      console.log("hello3");
      const results = await Refund.findAndCountAll({
        include: [
          {
            model: Order,
            require: true,
          },
          {
            model: Shop,
            require: true,
          },
          {
            model: User,
            as: "customer",
          },
          {
            model: RefundReason,
            require: true,
            where,
          },
        ],
        distinct: true,
        where: {
          customer_id: { [Op.eq]: req.user.id },
          shop_id: { [Op.eq]: null },
        },
        limit,
        offset,
        order: [[orderBy, sortedBy]],
      });
      console.log(results);
      return res.json(
        UtilService.paginate(results.count, limit, offset, results.rows),
      );
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: constants.BAD_REQUEST });
  }
};

export const show = async (req, res) => {
  try {
    const { slug } = req.params;
    const refund = await Refund.findByPk(slug, {
      include: [
        {
          model: Order,
          include: [
            {
              model: Product,
              as: "products",
              through: {
                models: OrderProduct,
                as: "pivot",
              },
            },
          ],
        },
        {
          model: Shop,
          require: true,
        },
        {
          model: User,
          as: "customer",
        },
        {
          model: RefundReason,
          require: true,
        },
      ],
    });
    if (!refund) {
      return res.status(404).json({ message: constants.NOT_FOUND });
    }
    res.send(refund);
  } catch (error) {
    return res.status(400).json({ message: constants.BAD_REQUEST });
  }
};

export const store = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: constants.NOT_AUTHORIZED });
    }

    const results = await RefundRepository.storeRefund(req);
    return res.status(201).send(results);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: constants.BAD_REQUEST });
  }
};

export const update = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (!req.params.id) {
      return res.status(200).json({ message: constants.WRONG_REFUND });
    }
    const refund = await Refund.findOne({
      where: { id: req.params.id },
      include: [
        { model: Shop },
        { model: Order },
        { model: User, as: "customer" },
      ],
    });
    console.log(refund);
    if (!refund) {
      return res.status(404).json({ message: constants.NOT_FOUND });
    }
    if (refund.status == RefundStatus.APPROVED) {
      return res.status(400).json({ message: constants.ALREADY_REFUNDED });
    }
    const status = req.body.status;
    Object.assign(refund, { status: status });
    console.log(refund);
    const result = await Refund.update(
      { status: status },
      { where: { id: refund.id } },
      { transaction: t },
    );
    refund.status = status;
    console.log(result);
    changeShopSpecificRefundStatus(refund.order_id, status, t);
    if (refund.status == RefundStatus.APPROVED) {
      const orderData = {};
      orderData.order_status = OrderStatus.REFUNDED;
      orderData.payment_status = PaymentStatus.REFUNDED;
      changeOrderStatus(refund.order_id, orderData, t);
    }
    if (status == RefundStatus.APPROVED) {
      const order = await Order.findOne({
        where: { id: refund.order_id },
        include: [{ model: Order, as: "children" }],
      });
      order.children.forEach(async (item) => {
        const balance = await Balance.finOne({
          where: { shop_id: item.shop_id },
        });
        balance.total_earnings = balance.total_earnings - item.amount;
        balance.current_balance = balance.current_balance - item.amount;
        balance.save({ transaction: t });
      });
      // let wallet = await Wallet.findOne({
      //   where: { customer_id: refund.customer_id },
      // });
      // if (!wallet) {
      //   wallet = await Wallet.create(
      //     { customer_id: refund.customer_id },
      //     { transaction: t },
      //   );
      // }
      // walletPoints = await currencyToWalletPoints(refund.amount);
      // wallet.total_points = wallet.total_points + walletPoints;
      // wallet.available_points = wallet.available_points + walletPoints;
      // wallet.save({ transaction: t });
    }

    await t.commit();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).json({ message: constants.SOMETHING_WENT_WRONG });
  }
};

const changeShopSpecificRefundStatus = async (order_id, status, t) => {
  const order = await Order.findOne({
    where: { id: order_id },
    include: [{ model: Order, as: "children" }],
  });
  const ids = [];
  if (order) {
    order.children.map((item) => {
      ids.push(item.id);
    });
    await Refund.update(
      { status: status },
      { where: { id: ids } },
      { transaction: t },
    );
  }
};

const changeOrderStatus = async (parentOrderId, data, t) => {
  const parentOrder = await Order.findOne({ where: { id: parentOrderId } });
  if (parentOrder) {
    Object.assign(parentOrder, { status: data });
    parentOrder.save();
    Order.update(
      { order_status: data.order_status, payment_status: data.payment_status },
      { where: { parent_id: parentOrder.id } },
      { transaction: t },
    );
  }
};
