import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Feedback, User } = models;

export const index = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const feedbacks = await Feedback.findAll({
    include: [
      {
        model: User,
        as: "user",
      },
    ],
    limit: limit,
  });

  return res.json({ data: feedbacks });
};

export const show = async (req, res) => {
  const { slug } = req.params;

  const feedback = await Feedback.findByPk(slug, {});

  if (!feedback) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ data: feedback });
};
