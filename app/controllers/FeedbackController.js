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

export const store = async (req, res) => {
  try {
    const model_id = req.body.model_id;
    const model_type = req.body.model_type;
    const user_id = req.user.id;
    const feedback = await Feedback.findOne({
      where: {
        model_id,
        model_type,
        user_id,
      },
    });

    if (!feedback) {
      req.body.user_id = user_id;
      const feedback = await Feedback.create(req.body);
      return res.json({ data: feedback });
    } else {
      const positive = feedback.positive;
      const negative = feedback.negative;
      if (req.body.positive && positive == null && negative == true) {
        await feedback.update({
          positive: true,
          negative: null,
        });
      }
      if (req.body.negative && positive == true && negative == null) {
        await feedback.update({
          positive: null,
          negative: true,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: constants.SOMETHING_WENT_WRONG });
  }
};
