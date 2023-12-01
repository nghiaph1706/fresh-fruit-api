import { Op, Sequelize } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import OrderStatus from "../config/enum/OrderStatus.js";

const { Order, Shop, User, Refund } = models;

export const analytics = async (req, res) => {
  try {
    const user = req.user;

    if (user && (req.isSuperAdmin || req.isStoreOwner)) {
      const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);

      // Fetch total revenue
      const totalRevenueQuery = await Order.findAll({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("orders.paid_total")), "totalRevenue"],
        ],
        where: {
          created_at: { [Op.gt]: thirtyDaysAgo },
          order_status: OrderStatus.COMPLETED,
          parent_id: { [Op.ne]: null },
        },
        group: ['orders.id'], // Group by the non-aggregated column
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

      // Fetch other required data similarly...
      return res.json({
        totalRevenue,
        totalRefunds,
        totalShops,
        newCustomers,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
