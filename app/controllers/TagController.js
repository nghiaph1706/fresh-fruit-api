import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { customSlugify } from "../services/UtilServcie.js";
import * as UtilService from "../services/UtilServcie.js";
import { Op } from "sequelize";

const { Tag, Type } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  const include = [];
  let baseQuery = {
    where: {
      language,
    },
    distinct: true,
    include,
    limit,
    offset,
    order: [[orderBy, sortedBy]],
  };
  let type = { model: Type, as: "type" };
  if (!search.name) {
    if (search.type?.slug) {
      // include.push({
      //   model: Type,
      //   as: "type",
      //   where: {
      //     slug: search.type.slug,
      //   },
      // });
      type["where"] = { slug: search.type.slug };
    }
  } else {
    baseQuery.where.name = {
      [Op.like]: `%${search.name}%`,
    };
  }
  include.push(type);
  const tags = await Tag.findAndCountAll(baseQuery);

  return res.json(UtilService.paginate(tags.count, limit, offset, tags.rows));
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

  res.status(200).send(tag);
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
