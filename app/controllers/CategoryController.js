import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { customSlugify } from "../services/UtilServcie.js";
import * as UtilService from "../services/UtilServcie.js";

const { Category, Type } = models;

// export const index = async (req, res) => {
//   const language = req.query.language
//     ? req.query.language
//     : constants.DEFAULT_LANGUAGE;
//   const limit = req.query.limit ? parseInt(req.query.limit) : 15;
//   const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
//   const orderBy = req.query.orderBy || "created_at";
//   const sortedBy = req.query.sortedBy || "desc";
//   const search = UtilService.convertToObject(req.query.search);
//   const parent = req.query.parent;

//   let categories;

//   const baseQuery = {
//     where: {
//       language,
//     },
//     include: [
//       { model: Type, as: "type" },
//       {
//         association: "parent",
//         as: "parent",
//         include: [
//           { model: Type, as: "type" },
//           { association: "parent", as: "parent" },
//           { association: "children", as: "children" },
//         ],
//       },
//       {
//         association: "children",
//         as: "children",
//         include: [
//           { model: Type, as: "type" },
//           { association: "parent", as: "parent" },
//           { association: "children", as: "children" },
//         ],
//       },
//     ],
//     distinct: true,
//     limit,
//     offset,
//     order: [[orderBy, sortedBy]],
//   };

//   if (parent === "null") {
//     console.log("parent is null");
//     categories = await Category.findAndCountAll({
//       ...baseQuery,
//       where: {
//         ...baseQuery.where,
//         parent_id: {
//           [Op.eq]: null,
//         },
//       },
//       distinct: true,
//       limit,
//       offset,
//       order: [[orderBy, sortedBy]],
//     });
//   } else {
//     categories = await Category.findAndCountAll(baseQuery);
//   }

//   // const cateWithTranslatedLanguages = categories.map((cate) => ({
//   //   ...cate.toJSON(),
//   //   translated_languages: ['vi'],
//   // }));
//   // TODO fix this
//   return res.json(
//     UtilService.paginate(categories.count, limit, offset, categories.rows),
//   );
// };
export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  const parent = req.query.parent;
  let categories;
  let typeInclude = {};
  if (search.type) {
    typeInclude = {
      model: Type,
      as: "type",
      where: { slug: search.type?.slug },
    };
  } else {
    typeInclude = {
      model: Type,
      as: "type",
    };
  }

  const baseQuery = {
    where: {
      language,
    },
    include: [
      typeInclude,
      {
        association: "parent",
        as: "parent",
        include: [
          { model: Type, as: "type" },
          { association: "parent", as: "parent" },
          { association: "children", as: "children" },
        ],
      },
      {
        association: "children",
        as: "children",
        include: [
          { model: Type, as: "type" },
          { association: "parent", as: "parent" },
          { association: "children", as: "children" },
        ],
      },
    ],
    distinct: true,
    limit,
    offset,
    order: [[orderBy, sortedBy]],
  };
  if (search.name && !search.type) {
    baseQuery.where.name = {
      [Op.like]: `%${search.name}%`,
    };
  }
  if (parent === "null") {
    console.log("parent is null");
    categories = await Category.findAndCountAll({
      ...baseQuery,
      where: {
        ...baseQuery.where,
        parent_id: {
          [Op.eq]: null,
        },
      },
      distinct: true,
      limit,
      offset,
      order: [[orderBy, sortedBy]],
    });
  } else {
    categories = await Category.findAndCountAll(baseQuery);
  }

  // const cateWithTranslatedLanguages = categories.map((cate) => ({
  //   ...cate.toJSON(),
  //   translated_languages: ['vi'],
  // }));
  // TODO fix this
  return res.json(
    UtilService.paginate(categories.count, limit, offset, categories.rows),
  );
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
  const cateWithTranslatedLanguages = {
    ...category.toJSON(),
    translated_languages: ["vi"],
  };
  res.send(cateWithTranslatedLanguages);
};

export const store = async (req, res) => {
  const { name, type_id, icon, image, details, language, parent } = req.body;
  const slug = customSlugify(name);
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
  const { name, type_id, icon, image, details, language, parent } = req.body;

  const category = await Category.findOne({
    where: {
      id,
    },
  });

  if (!category) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  category.name = name;
  category.slug = customSlugify(name);
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
