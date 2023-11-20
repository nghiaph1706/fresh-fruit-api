import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { Op } from "sequelize";

const { Type, Category, Product } = models;

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
              [Op.in]: categories || [], // Ensure categories is an array of IDs
            },
          },
          as: "categories",
        },
        {
          model: Type,
        },
      ],
      limit: parseInt(limit), // Ensure limit is converted to a number
    });

    return relatedProducts;
  } catch (error) {
    throw new Error(error);
    return [];
  }
};
