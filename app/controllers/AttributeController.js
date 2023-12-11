import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as AttributeRepository from "../repositories/AtrributeRepository.js";
import { hasPermission } from "../services/AuthService.js";

const { Attribute, AttributeValue, Shop } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;

  const attributes = await Attribute.findAll({
    where: {
      language,
    },
    include: [
      {
        model: AttributeValue,
        as: "values",
      },
      {
        model: Shop,
        as: "shop",
      },
    ],
  });
  const attributeWithTranslatedLanguages = attributes.map((attribute) => ({
    ...attribute.toJSON(),
    translated_languages: ["vi"],
  }));

  return res.send(attributeWithTranslatedLanguages);
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  let attribute;

  if (!isNaN(slug)) {
    attribute = await Attribute.findByPk(slug, {
      include: [
        {
          model: AttributeValue,
          as: "values",
        },
      ],
    });
  } else {
    attribute = await Attribute.findOne({
      where: {
        language,
        slug,
      },
      include: [
        {
          model: AttributeValue,
          as: "values",
        },
      ],
    });
  }

  if (!attribute) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
  const attributeWithTranslatedLanguages = {
    ...attribute.toJSON(),
    translated_languages: ["vi"],
  };
  res.send(attributeWithTranslatedLanguages);
};

export const store = async (req, res) => {
  try {
    if (hasPermission(req.user, req.body.shop_id)) {
      const result = await AttributeRepository.storeAttribute(req);
      res.status(201).send(result);
    } else {
      res.status(401).json({ message: constants.NOT_AUTHORIZED });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: constants.NOT_FOUND });
  }
};

export const update = async (req, res) => {
  try {
    const body = req.body;
    if (hasPermission(req.user, body.shop_id)) {
      const attribute = await Attribute.findByPk(req.params.id, {
        include: [{ model: AttributeValue, as: "values" }],
      });
      if (!attribute) {
        res.status(404).json({ message: constants.NOT_FOUND });
      }
      const result = await AttributeRepository.updateAttribute(req, attribute);
      return res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: constants.COULD_NOT_UPDATE_THE_RESOURCE });
  }
};

export const destroy = async (req, res) => {
  try {
    const attribute = await Attribute.findByPk(req.params.id);
    if (!attribute) {
      res.status(404).json({ message: constants.NOT_FOUND });
    }
    if (hasPermission(req.user, attribute.shop_id)) {
      await attribute.destroy();
      return res.status(200).send(attribute);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: constants.COULD_NOT_DELETE_THE_RESOURCE });
  }
};
