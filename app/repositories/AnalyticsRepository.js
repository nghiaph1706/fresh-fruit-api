import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import OrderStatus from "../config/enum/OrderStatus.js";
import {sequelize} from "../config/db.connection.js";


const { Order } = models;

export const getTotalYearSaleByMonth = async (req, shops) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = new Date().getFullYear();

  let query = `
      SELECT
        DATE_FORMAT(A.created_at, '%M') as month,
        SUM(
          ${req.isSuperAdmin ? "A.paid_total" : "B.amount"}
        ) as total
      FROM orders A
      ${req.isSuperAdmin ? "" : "INNER JOIN orders B ON A.parent_id = B.id" }
      WHERE
        A.order_status = :completedStatus
        AND YEAR(A.created_at) = :year
        ${
          req.isSuperAdmin
            ? ""
            : "AND A.parent_id IS NOT NULL AND A.shop_id IN (:shopIds)"
        }
      GROUP BY month;
    `;

  let replacements = {
    completedStatus: OrderStatus.COMPLETED,
    year: year,
  };

  if (!req.isSuperAdmin) {
    replacements.shopIds = shops.length > 0 ? shops : '';
  }

  const results = await sequelize.query(query, {
    replacements: replacements,
    type: sequelize.QueryTypes.SELECT,
  });

  const totalYearSaleByMonth = results.reduce((acc, row) => {
    acc[row.month] = row.total;
    return acc;
  }, {});

  const formattedData = months.map((month) => ({
    month,
    total: totalYearSaleByMonth[month] || 0,
  }));

  return formattedData;
};

export const orderCountingByStatus = async (request, days = 1, shops) => {
  let query;
  switch (true) {
    case request.isSuperAdmin:
      query = await Order.findAll({
        attributes: [
          "order_status",
          [sequelize.fn("COUNT", "*"), "order_count"],
        ],
        where: {
          parent_id: null,
          created_at: {
            [Op.gt]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`),
          },
        },
        group: "order_status",
      });
      break;

    case request.isStoreOwner:
      const shopIds = shops.length > 0 ? shops : '';
      query = await Order.findAll({
        attributes: [
          "order_status",
          [sequelize.fn("COUNT", "*"), "order_count"],
        ],
        where: {
          parent_id: { [Op.ne]: null },
          shop_id: { [Op.in]: shopIds },
          created_at: {
            [Op.gt]: sequelize.literal(`NOW() - INTERVAL ${days} DAY`),
          },
        },
        group: "order_status",
      });
      break;

    // case user.hasPermissionTo(Permission.STAFF):
    //   const shopId = user?.shop_id ?? null;
    //   query = await Order.findAll({
    //     attributes: [
    //       "order_status",
    //       [sequelize.fn("COUNT", "*"), "order_count"],
    //     ],
    //     where: {
    //       parent_id: { [Op.ne]: null },
    //       shop_id: shopId,
    //       created_at: {
    //         [Op.gt]: sequelize.literal(`NOW() - INTERVAL '${days} DAY'`),
    //       },
    //     },
    //     group: "order_status",
    //   });
    //   break;
  }

  const result = {
    pending: 0,
    processing: 0,
    complete: 0,
    cancelled: 0,
    refunded: 0,
    failed: 0,
    localFacility: 0,
    outForDelivery: 0,
  };
  console.log(query);

  query.forEach((row) => {
    result[row.order_status.replace('order-','')] = row.getDataValue("order_count") || 0;
  });

  return result;
};
