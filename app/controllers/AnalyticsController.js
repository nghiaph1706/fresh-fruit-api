import { Op, Sequelize } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import OrderStatus from "../config/enum/OrderStatus.js";
import * as AnalyticsRepository from "../repositories/AnalyticsRepository.js";

const { Order, Shop, User, Refund } = models;

export const analytics = async (req, res) => {
  try {
    const user = req.user;

    if (user && (req.isSuperAdmin || req.isStoreOwner)) {
      const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
      const aDayAgo = new Date(new Date() - 1 * 24 * 60 * 60 * 1000);
      const shops = await user
        .getShops()
        .then((shops) => shops.map((shop) => shop.id));

      // Fetch total revenue
      const totalRevenueQuery = await Order.findAll({
        attributes: [
          [
            Sequelize.fn("SUM", Sequelize.col("orders.paid_total")),
            "totalRevenue",
          ],
        ],
        where: {
          created_at: { [Op.gt]: thirtyDaysAgo },
          order_status: OrderStatus.COMPLETED,
          parent_id: { [Op.ne]: null },
        },
        group: ["orders.id"], // Group by the non-aggregated column
        // TODO Recheck parent
        // include: [
        //   {
        //     model: Order,
        //     as: "parent",
        //     attributes: [],
        //     where: {
        //       order_status: OrderStatus.COMPLETED,
        //     },
        //   },
        // ],
      });
      const totalRevenue = totalRevenueQuery[0]?.dataValues.totalRevenue || 0;

      // Fetch total revenue
      const todayRevenueQuery = await Order.findAll({
        attributes: [
          [
            Sequelize.fn("SUM", Sequelize.col("orders.paid_total")),
            "totalRevenue",
          ],
        ],
        where: {
          created_at: { [Op.gt]: aDayAgo },
          order_status: OrderStatus.COMPLETED,
          parent_id: { [Op.ne]: null },
        },
        group: ["orders.id"], // Group by the non-aggregated column
        // TODO Recheck parent
        // include: [
        //   {
        //     model: Order,
        //     as: "parent",
        //     attributes: [],
        //     where: {
        //       order_status: OrderStatus.COMPLETED,
        //     },
        //   },
        // ],
      });
      const todaysRevenue = todayRevenueQuery[0]?.dataValues.totalRevenue || 0;

      // Fetch total refunds
      const totalRefunds = await Refund.sum("amount", {
        where: {
          created_at: { [Op.gt]: thirtyDaysAgo },
        },
      });

      // Fetch total shops
      const totalShops = await Shop.count();

      // Fetch new customers
      const newCustomers = await User.count({
        where: {
          created_at: { [Op.gt]: thirtyDaysAgo },
          // Add other conditions if needed
        },
      });

      let totalOrders = 0;
      if (req.isSuperAdmin) {
        totalOrders = await Order.count({
          where: {
            parent_id: { [Op.ne]: null },
          },
        });
      } else {
        totalOrders = await Order.count({
          where: {
            shop_id: { [Op.in]: shops },
          },
        });
      }

      const totalYearSaleByMonth =
        await AnalyticsRepository.getTotalYearSaleByMonth(req, shops);
      const todayTotalOrderByStatus =
        await AnalyticsRepository.orderCountingByStatus(req, 1, shops);
      const weeklyTotalOrderByStatus =
        await AnalyticsRepository.orderCountingByStatus(req, 7, shops);
      const monthlyTotalOrderByStatus =
        await AnalyticsRepository.orderCountingByStatus(req, 30, shops);
      const yearlyTotalOrderByStatus =
        await AnalyticsRepository.orderCountingByStatus(req, 365, shops);

      // Fetch other required data similarly...
      return res.json({
        totalRevenue,
        todaysRevenue,
        totalRefunds,
        totalShops,
        newCustomers,
        totalOrders,
        totalYearSaleByMonth,
        todayTotalOrderByStatus,
        weeklyTotalOrderByStatus,
        monthlyTotalOrderByStatus,
        yearlyTotalOrderByStatus,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
