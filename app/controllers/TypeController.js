import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as TypeRepository from "../repositories/TypeRepository.js";

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

  const typesWithTranslatedLanguages = types.map((type) => ({
    ...type.toJSON(),
    translated_languages: ['vi'],
  }));

  return res.send(typesWithTranslatedLanguages);
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
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  const typeWithTranslatedLanguages = {
    ...type.toJSON(),
    translated_languages: ["vi"],
  };

  res.send(typeWithTranslatedLanguages);
};

export const store = async (req, res) => {
  try {
    const result = await TypeRepository.storeType(req);
    return res.status(201).send(result);
  } catch (error) {
    console.log(error);
  }
};

export const update = async (req, res) => {
  try {
    const result = await TypeRepository.updateType(req);
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const type = await Type.findOne({
      where: {
        id,
      },
    });

    if (!type) {
      return res.status(404).json({ message: constants.NOT_FOUND });
    }
    await type.destroy();

    res.send({
      type,
      translate_languages: ["vi"],
    });
  } catch (error) {}
};
