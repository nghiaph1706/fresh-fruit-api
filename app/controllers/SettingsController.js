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

  return res.send(settings);
};

export const store = async (req, res) => {
  const language = req.body.language
    ? req.body.language
    : constants.DEFAULT_LANGUAGE;

  const settings = await Setting.findOne({
    where: {
      language,
    },
  });

  if (settings) {
    settings.options = req.body.options;
    await settings.save();
    return res.status(200).send(settings);
  }

  const result = await Setting.create({
    options: req.body.options,
    language,
  });

  return res.status(201).send(result);
};
