import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Review } = models;

export const updateReview = async (req, id) => {
  try {
    const review = await Review.findByPk(id);
    await review.update(req.body);
    return review;
  } catch (error) {
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};
