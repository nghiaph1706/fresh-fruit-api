import constants from "../config/constants.js";
import { models } from "../models/index.js";

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

  return res.json({data: attributes });
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

  res.json({ data: attribute });
};
