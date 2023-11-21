import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Resource } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;

  const resources = await Resource.findAll({
    where: {
      language,
    },
    limit: limit,
  });

  return res.json({ resources });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  let resource;

  if (!isNaN(slug)) {
    resource = await Resource.findByPk(slug, {});
  } else {
    resource = await Resource.findOne({
      where: {
        language,
        slug,
      },
    });
  }

  if (!resource) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ resource });
};
