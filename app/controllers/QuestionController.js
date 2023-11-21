import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Question } = models;

export const index = async (req, res) => {
  const product_id = req.query.product_id;
  const answer = req.query.answer;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  let questions;
  if (product_id) {
    questions = await Question.findAll({
      where: {
        product_id,
        answer: {
          [Op.ne]: null,
        },
      },
      limit: limit,
    });

    return res.json({ questions });
  }
  if (!answer) {
    questions = await Question.findAll({
      limit: limit,
    });

    return res.json({ questions });
  }
  questions = await Question.findAll({
    where: {
      answer: {
        [Op.ne]: null,
      },
    },
    limit: limit,
  });

  return res.json({ questions });
};

export const show = async (req, res) => {
  const { slug } = req.params;

  const question = await Question.findByPk(slug, {});

  if (!question) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ question });
};
