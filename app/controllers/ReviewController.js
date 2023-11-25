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

    return res.json({ data: reviews });
  }
  return res.status(404).json({ message: constants.NOT_FOUND });
};

export const show = async (req, res) => {
  const { slug } = req.params;

  const review = await Review.findByPk(slug, {});

  if (!review) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.send(review);
};

export const store = async (req, res) => {
  const product_id = req.body.product_id;
  const order_id = req.body.order_id;
  const hasProductInOrder = await Order.findOne({
    where: {
      id: order_id,
    },
    include: {
      model: Product,
      where: {
        id: product_id,
      },
      required: true, // This ensures the product is required, effectively acting as an inner join
      attributes: [], // Set empty attributes to avoid getting product details in the result
    },
  });

  if (hasProductInOrder) {
    throw new Error(constants.NOT_FOUND);
  }

  try {
    let user_id = req.user.id;
    req.user_id = user_id;
  } catch (error) {}
};
