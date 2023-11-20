import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Category, Type } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const parent = req.query.parent;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;

  let categories;
  if (parent) {
    categories = await Category.findAll({
      where: {
        language,
      },
      limit: limit,
    });
  } else {
    categories = await Category.findAll({
      where: {
        language,
      },
      include: [
        {
          model: Type,
          as: "type",
        },
        { association: "parent", as: "parent" },
        { association: "children", as: "children" },
      ],
      limit: limit,
    });
  }

  return res.json({ categories });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  let category;

  if (!isNaN(slug)) {
    category = await Category.findByPk(slug, {
      include: [
        {
          model: Type,
          as: "type",
        },
        { association: "parent", as: "parent" },
        { association: "children", as: "children" },
      ],
    });
  } else {
    category = await Category.findOne({
      where: {
        language,
        slug,
      },
      include: [
        {
          model: Type,
          as: "type",
        },
        { association: "parent", as: "parent" },
        { association: "children", as: "children" },
      ],
    });
  }

  if (!category) {
    res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ category });
};
