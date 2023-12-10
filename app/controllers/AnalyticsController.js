import { Op, Sequelize } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import OrderStatus from "../config/enum/OrderStatus.js";
import * as AnalyticsRepository from "../repositories/AnalyticsRepository.js";
import { sequelize } from "../models/index.js";

const { Order, Shop, User, Refund, CategoryProduct } = models;

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

export const categoryWiseProduct = async (req, res) => {
  try {
    const user = req.user;
    const limit = req.query.limit ? parseInt(req.query.limit) : 15;
    const language = req.query.language
      ? req.query.language
      : constants.DEFAULT_LANGUAGE;

    let mostProductCategory = [];

    if (req.isSuperAdmin) {
      // mostProductCategory = await sequelize.query(
      //   `SELECT categories.id as category_id, categories.name as category_name, shops.name as shop_name, COUNT(category_product.product_id) as product_count FROM category_product INNER JOIN products ON category_product.product_id = products.id INNER JOIN categories ON category_product.category_id = categories.id INNER JOIN shops ON products.shop_id = shops.id WHERE categories.language = '${language}' GROUP BY categories.id, categories.name, shops.name ORDER BY product_count DESC LIMIT ${limit}`,
      //   {
      //     type: Sequelize.QueryTypes.SELECT,
      //   }
      // );

      mostProductCategory = await CategoryProduct.findAll({
        attributes: [
          [
            Sequelize.fn("COUNT", Sequelize.col("category_product.product_id")),
            "product_count",
          ],
        ],
        include: [
          {
            model: models.Product,
            attributes: [],
            include: [
              {
                model: models.Shop,
                attributes: [],
              },
            ],
          },
          {
            model: models.Category,
            attributes: ["id", "name"],
            where: {
              language,
            },
          },
        ],
        group: ["category_product.category_id", "category.id", "shop.id"],
        order: [[Sequelize.literal("product_count"), "DESC"]],
        limit,
      });
    }

    if (req.isStoreOwner) {
      const shops = await user
        .getShops()
        .then((shops) => shops.map((shop) => shop.id));
      // mostProductCategory = await sequelize.query(
      //   `SELECT categories.id as category_id, categories.name as category_name, shops.name as shop_name, COUNT(category_product.product_id) as product_count FROM category_product INNER JOIN products ON category_product.product_id = products.id INNER JOIN categories ON category_product.category_id = categories.id INNER JOIN shops ON products.shop_id = shops.id WHERE categories.language = '${language}' AND shops.id IN (${shops}) GROUP BY categories.id, categories.name, shops.name ORDER BY product_count DESC LIMIT ${limit}`,
      //   {
      //     type: Sequelize.QueryTypes.SELECT,
      //   }
      // );

      mostProductCategory = await CategoryProduct.findAll({
        attributes: [
          [
            Sequelize.fn("COUNT", Sequelize.col("category_product.product_id")),
            "product_count",
          ],
        ],
        include: [
          {
            model: models.Product,
            attributes: [],
            include: [
              {
                model: models.Shop,
                attributes: [],
                where: {
                  id: { [Op.in]: shops },
                },
              },
            ],
          },
          {
            model: models.Category,
            attributes: ["id", "name"],
            where: {
              language,
            },
          },
        ],
        group: ["category_product.category_id", "category.id", "shop.id"],
        order: [[Sequelize.literal("product_count"), "DESC"]],
        limit,
      });
    }

    if (req.isStaff) {
      const shop = user.shop_id;
      if (shop) {
        // mostProductCategory = await sequelize.query(
        //   `SELECT categories.id as category_id, categories.name as category_name, shops.name as shop_name, COUNT(category_product.product_id) as product_count FROM category_product INNER JOIN products ON category_product.product_id = products.id INNER JOIN categories ON category_product.category_id = categories.id INNER JOIN shops ON products.shop_id = shops.id WHERE categories.language = '${language}' AND shops.id = '${shop}' GROUP BY categories.id, categories.name, shops.name ORDER BY product_count DESC LIMIT ${limit}`,
        //   {
        //     type: Sequelize.QueryTypes.SELECT,
        //   }
        // );

        mostProductCategory = await CategoryProduct.findAll({
          attributes: [
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.col("category_product.product_id")
              ),
              "product_count",
            ],
          ],
          include: [
            {
              model: models.Product,
              attributes: [],
              include: [
                {
                  model: models.Shop,
                  attributes: [],
                  where: {
                    id: shop,
                  },
                },
              ],
            },
            {
              model: models.Category,
              attributes: ["id", "name"],
              where: {
                language,
              },
            },
          ],
          group: ["category_product.category_id", "category.id", "shop.id"],
          order: [[Sequelize.literal("product_count"), "DESC"]],
          limit,
        });
      } else {
        mostProductCategory = [];
      }
    }

    return res.json(mostProductCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
