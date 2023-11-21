import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Review } = models;

export const index = async (req, res) => {
  const product_id = req.query.product_id;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  if (product_id) {
    const reviews = await Review.findAll({
      where: {
        product_id,
      },
      limit: limit,
    });

    return res.json({ reviews });
  }
  return res.status(404).json({ message: constants.NOT_FOUND });
};

export const show = async (req, res) => {
  const { slug } = req.params;

  const review = await Review.findByPk(slug, {});

  if (!review) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ review });
};
