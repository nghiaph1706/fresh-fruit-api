import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as ReviewRepository from "../repositories/ReviewRepository.js";
import * as UtilService from "../services/UtilServcie.js";
const { Review, Order, Product } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  const include = [];
  const reviews = await Review.findAndCountAll({
    where: {},
    distinct: true,
    limit: limit,
    include,
    limit,
    offset,
    order: [[orderBy, sortedBy]],
  });

  return res.json(
    UtilService.paginate(reviews.count, limit, offset, reviews.rows),
  );
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
  const { product_id, order_id, shop_id } = req.body;

  const hasProductInOrder = await Order.findOne({
    where: {
      id: order_id,
    },
    include: [
      {
        model: Product,
        where: {
          id: product_id,
        },
      },
    ],
  });

  if (!hasProductInOrder) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  try {
    const user_id = req.user.id;
    let query = {
      where: {
        user_id,
        order_id,
        product_id,
        shop_id,
      },
    };
    if (req.body.variation_option_id) {
      query.where.variation_option_id = req.body.variation_option_id;
    }
    const review = await Review.findOne(query);

    if (review) {
      return res
        .status(400)
        .json({ message: constants.ALREADY_GIVEN_REVIEW_FOR_THIS_PRODUCT });
    }

    const data = {
      ...req.body,
      user_id,
    };

    const newReview = await Review.create(data);

    return res.json({ data: newReview });
  } catch (error) {
    return res
      .status(400)
      .json({ message: constants.ALREADY_GIVEN_REVIEW_FOR_THIS_PRODUCT });
  }
};

export const update = async (req, res) => {
  try {
    const review = await ReviewRepository.updateReview(req, req.params.id);
    return res.json({ data: review });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      res.status(404).send(constants.NOT_FOUND);
    }
    await review.destroy();
    return res.status(200).send(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
