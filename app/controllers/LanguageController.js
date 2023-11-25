import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Language } = models;

export const index = async (req, res) => {
  const languages = await Language.findAll({});

  return res.json({ data: languages });
};

export const show = async (req, res) => {
  const { slug } = req.params;

  const language = await Language.findByPk(slug, {});

  if (!language) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ data: language });
};
