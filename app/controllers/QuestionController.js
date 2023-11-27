import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as QuestionRepository from "../repositories/QuestionRepository.js";

const { Question, Setting } = models;

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

    return res.json({ data: questions });
  }
  if (!answer) {
    questions = await Question.findAll({
      limit: limit,
    });

    return res.json({ data: questions });
  }
  questions = await Question.findAll({
    where: {
      answer: {
        [Op.ne]: null,
      },
    },
    limit: limit,
  });

  return res.json({ data: questions });
};

export const show = async (req, res) => {
  const { slug } = req.params;

  const question = await Question.findByPk(slug, {});

  if (!question) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ data: question });
};

export const store = async (req, res) => {
  try {
    const productQuestionCount = await Question.count({
      where: {
        product_id: req.body.product_id,
        user_id: req.user.id,
        shop_id: req.body.shop_id,
      },
    });

    const settings = await Setting.findOne({
      where: {
        language: constants.DEFAULT_LANGUAGE,
      },
    });

    const maximumQuestionLimit = settings.options.maximumQuestionLimit || 5;

    if (maximumQuestionLimit <= productQuestionCount) {
      return res.status(400).json({ message: constants.BAD_REQUEST });
    }

    const question = await QuestionRepository.storeQuestion(req);

    return res.send(question);
  } catch (error) {
    return res.status(400).json({ message: constants.BAD_REQUEST });
  }
};

export const myQuestions = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;

  const questions = await Question.findAll({
    where: {
      user_id: req.user.id,
    },
    limit: limit,
  });

  return res.json({ data: questions });
};
