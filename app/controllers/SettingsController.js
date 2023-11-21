import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Setting } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;

  const settings = await Setting.findOne({
    where: {
      language,
    },
  });

  return res.json({ settings });
};
