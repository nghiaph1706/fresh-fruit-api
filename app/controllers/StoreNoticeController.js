import { Sequelize } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Shop } = models;

export const index = async (req, res) => {
    res.send([]);
//   if (!req.query.shop_id) {
//     res.status(401).json({
//       errors: "shop_id is missing",
//       message: constants.NOT_AUTHORIZED,
//     });
//   }
//   const limit = parseInt(req.query.limit) || 15;

//   try {
//     const shop = await Shop.findOne({
//       where: {
//         [Op.or]: [
//           { id: req.query.shop_id ?? 0 },
//           { slug: req.query.shop_id ?? 0 },
//         ],
//       },
//     });
//     if (!shop) {
//       throw new Error(constants.NOT_FOUND);
//     }
    
//     const storeNotices = 

//   } catch (error) {}
};
