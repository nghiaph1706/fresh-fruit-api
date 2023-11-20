import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Banner, Type } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;

  const types = await Type.findAll({
    where: {
      language,
    },
  });

  return res.json({ types });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  let type;

  if (!isNaN(slug)) {
    type = await Type.findByPk(slug, {
      include: [{ model: Banner, as: "banners" }],
    });
  } else {
    type = await Type.findOne({
      where: {
        language,
        slug,
      },
      include: [{ model: Banner, as: "banners" }],
    });
  }

  if (!type) {
    throw new Error(constants.NOT_FOUND);
  }

  res.json({ type });
};
