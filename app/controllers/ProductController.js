// controllers/ProductController.js
import { Op, literal } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Type, Shop, Product } = models;

export const popularProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const language = req.query.language || constants.DEFAULT_LANGUAGE;
    const range = req.query.range ? parseInt(req.query.range) : null;
    let type_id = req.query.type_id || "";

    // Check for type_slug in the request
    if (req.query.type_slug && !type_id) {
      try {
        const type = await Type.findOne({
          attributes: ["id"],
          where: {
            slug: req.query.type_slug,
            language: language,
          },
        });

        if (type) {
          type_id = type.id;
        } else {
          throw new Error(constants.NOT_FOUND);
        }
      } catch (error) {
        console.error(error);
        throw new Error("Type not found");
      }
    }

    // Build the base query
    const baseQuery = {
      attributes: {
        exclude: ["createdAt", "updatedAt"], // Exclude timestamps
        include: [
          [
            literal(
              "(SELECT COUNT(*) FROM order_product WHERE order_product.product_id = products.id)"
            ),
            "orderCount",
          ],
        ],
      },
      include: [
        { model: Type, attributes: ["id", "name"] },
        { model: Shop, attributes: ["id", "name"] },
      ],
      order: [["orderCount", "DESC"]],
      where: {
        language: language,
        ...(req.query.shop_id && { shop_id: req.query.shop_id }),
        ...(range && {
          created_at: { [Op.gt]: literal(`NOW() - INTERVAL ${range} DAY`) },
        }),
        ...(type_id && { type_id: type_id }),
      },
      limit: limit,
    };

    // Execute the query
    const products = await Product.findAll(baseQuery);

    // TODO recheck base query, example below
    // const prod = await Product.findOne({
    //   where: {
    //     id: 102
    //   }
    // })
    // console.log(await prod.getOrders());

    return res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
