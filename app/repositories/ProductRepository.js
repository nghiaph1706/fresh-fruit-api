import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { Op } from "sequelize";

const { Type, Category, Product, Wishlist } = models;

export const fetchRelated = async (
  slug,
  limit = 10,
  language = constants.DEFAULT_LANGUAGE
) => {
  try {
    const product = await Product.findOne({ where: { slug } });
    const categories = await product
      .getCategories()
      .then((categories) => categories.map((category) => category.id));

    const relatedProducts = await Product.findAll({
      where: {
        language,
      },
      include: [
        {
          model: Category,
          where: {
            id: {
              [Op.in]: categories,
            },
          },
          as: "categories",
        },
        {
          model: Type,
        },
      ],
      limit: limit,
    });

    return relatedProducts;
  } catch (error) {
    throw new Error(error);
    return [];
  }
};

export const fetchWishlists = async (req) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const wishlist = await Wishlist.findAll({
    where: {
      user_id: req.user.id,
    },
    attributes: ["product_id"],
  });
  const productIds = wishlist.map((item) => item.product_id);
  const products = await Product.findAll({
    where: {
      id: productIds,
    },
    limit,
  });
  return products;
};
