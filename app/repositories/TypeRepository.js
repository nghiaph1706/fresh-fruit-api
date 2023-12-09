import constants from "../config/constants.js";
import { models, sequelize } from "../models/index.js";
import { customSlugify } from "../services/UtilServcie.js";

const { Banner, Type } = models;

const dataArray = [
  "name",
  "slug",
  "icon",
  "promotional_sliders",
  "settings",
  "language",
];
export const only = (body, dataArray) => {
  const filterBody = Object.assign(
    {},
    ...dataArray.map((key) => ({ [key]: body[key] })),
  );
  return filterBody;
};

export const storeType = async (req) => {
  console.log(req.body);
  const body = req.body;
  body.slug = customSlugify(body.name);
  const filterBody = only(body, dataArray);
  const t = await sequelize.transaction();

  try {
    const type = await Type.create(filterBody, { transaction: t });
    if (body.banners && body.banners.length > 0) {
      const bannersMap = body.banners.map((item) => {
        return {
          ...item,
          type_id: type.id,
        };
      });
      await Banner.bulkCreate(bannersMap, { transaction: t });
      await t.commit();
    }
    return {
      type,
      translate_languages: ["vi"],
    };
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};

export const updateType = async (req) => {
  const t = await sequelize.transaction();
  try {
    const ids = [];
    const type = await Type.findByPk(req.params.id, {
      include: [{ model: Banner, as: "banners" }],
      transaction: t,
    });
    if (!type) {
      throw Error(constants.NOT_FOUND);
    }
    req.body.banners.forEach((item) => {
      ids.push(item.id);
    });
    if (req.body.banners) {
      if (type.banners && type.banners.length > 0) {
        type.banners.forEach(async (banner) => {
          if (ids.length > 0 && !ids.some((item) => item === banner.id)) {
            await Banner.destroy(
              { where: { id: banner.id } },
              { transaction: t },
            );
          }
        });
      }
      req.body.banners.forEach(async (banner) => {
        if (banner && banner.id) {
          await Banner.update(
            banner,
            { where: { id: banner.id } },
            { transaction: t },
          );
        } else {
          banner.type_id = type.id;
          await Banner.create(banner, { transaction: t });
        }
      });
    }
    delete req.body.banners;
    req.body.slug = customSlugify(req.body.name);
    await Type.update(req.body, {
      where: { id: type.id },
      transaction: t,
    });
    const newtype = await Type.findByPk(req.params.id, {
      include: [{ model: Banner, as: "banners" }],
      transaction: t,
    });
    await t.commit();
    newtype.translate_languages = ["vi"];
    return newtype;
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};
