import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Category, Type } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const parent = req.query.parent;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;

  let categories;

  const baseQuery = {
    where: {
      language,
    },
    include: [
      { model: Type, as: "type" },
      { association: "parent", as: "parent" },
      { association: "children", as: "children" },
    ],
    limit: limit,
  };

  if (parent === "null") {
    console.log("parent is null");
    categories = await Category.findAll({
      ...baseQuery,
      where: {
        ...baseQuery.where,
        parent_id: {
          [Op.eq]: null,
        },
      },
    });
  } else {
    categories = await Category.findAll(baseQuery);
  }
  // TODO fix this
  return res.json({ data: categories });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  let category;

  if (!isNaN(slug)) {
    category = await Category.findByPk(slug, {
      include: [
        {
          model: Type,
          as: "type",
        },
        { association: "parent", as: "parent" },
        { association: "children", as: "children" },
      ],
    });
  } else {
    category = await Category.findOne({
      where: {
        language,
        slug,
      },
      include: [
        {
          model: Type,
          as: "type",
        },
        { association: "parent", as: "parent" },
        { association: "children", as: "children" },
      ],
    });
  }

  if (!category) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ data: category });
};

export const store = async (req, res) => {
  const { name, slug, type_id, icon, image, details, language, parent } =
    req.body;

  const category = await Category.create({
    name,
    slug,
    type_id,
    icon,
    image,
    details,
    language,
    parent_id: parent,
  });

  res.send(category);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const { name, slug, type_id, icon, image, details, language, parent } =
    req.body;

  const category = await Category.findOne({
    where: {
      id,
    },
  });

  if (!category) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  category.name = name;
  category.slug = slug;
  category.type_id = type_id;
  category.icon = icon;
  category.image = image;
  category.details = details;
  category.language = language;
  category.parent_id = parent;

  await category.save();

  res.send(category);
};

export const destroy = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({
    where: {
      id,
    },
  });

  if (!category) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  await category.destroy();

  res.send(category);
};
