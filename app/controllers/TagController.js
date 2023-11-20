import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Tag, Type } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;

  const tags = await Tag.findAll({
    where: {
      language,
    },
    include: [
      {
        model: Type,
        as: "type",
      },
    ],
  });

  return res.json({ tags });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  let tag;

  if (!isNaN(slug)) {
    tag = await Tag.findByPk(slug, {
      include: [
        {
          model: Type,
          as: "type",
        },
      ],
    });
  } else {
    tag = await Tag.findOne({
      where: {
        language,
        slug,
      },
      include: [
        {
          model: Type,
          as: "type",
        },
      ],
    });
  }

  if (!tag) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ tag });
};
