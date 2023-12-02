import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { customSlugify } from "../services/UtilServcie.js";

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

  return res.json({ data: tags });
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

  res.json({ data: tag });
};

export const store = async (req, res) => {
  try {
    const body = req.body;
    body.slug = customSlugify(body.name);
    const result = await Tag.create(body);
    return res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const body = req.body;
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).send(constants.NOT_FOUND);
    }
    body.slug = customSlugify(body.name);
    Object.assign(tag, body);
    await tag.save();
    return res.status(200).send(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroy = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).send(constants.NOT_FOUND);
    }
    await tag.destroy();
    return res.status(200).send(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
