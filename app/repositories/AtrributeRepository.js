import constants from "../config/constants.js";
import { customSlugify } from "../services/UtilServcie.js";
import { only } from "./TypeRepository.js";
import { models } from "../models/index.js";
import { sequelize } from "../models/index.js";

const dataArray = ["name", "slug", "shop_id", "language"];
const { Attribute, AttributeValue } = models;
export const storeAttribute = async (req) => {
  const body = req.body;
  const t = await sequelize.transaction();
  try {
    body.slug = customSlugify(body.name);

    const attribute = await Attribute.create(only(body, dataArray), {
      transaction: t,
    });
    if (body.values && body.values.length > 0) {
      const attribureValues = body.values.map((item) => {
        return {
          ...item,
          slug: customSlugify(item.value),
          attribute_id: attribute.id,
        };
      });
      await AttributeValue.bulkCreate(attribureValues, { transaction: t });
    }

    await t.commit();

    return attribute;
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw new Error(constants.COULD_NOT_CREATE_THE_RESOURCE);
  }
};

export const updateAttribute = async (req, attribute) => {
  try {
    const body = req.body;
    const ids = [];
    body.values.forEach((item) => {
      ids.push(item.id);
    });
    const t = await sequelize.transaction();
    if (body.values && body.values.length > 0) {
      attribute.values.forEach((value) => {
        if (ids.length > 0 && !ids.some((item) => item === value.id)) {
          AttributeValue.destroy(
            { where: { id: value.id } },
            { transaction: t },
          );
        }
      });
      body.values.forEach((value) => {
        if (value && value.id) {
          value.slug = customSlugify(value.value);
          AttributeValue.update(
            value,
            { where: { id: value.id } },
            { transaction: t },
          );
        } else {
          value.attribute_id = attribute.id;
          value.slug = customSlugify(value.value);
          AttributeValue.create(value, { transaction: t });
        }
      });
    }
    if (body.name && body.name != attribute.name) {
      body.slug = customSlugify(body.name);
    }
    delete body.values;
    await Attribute.update(body, {
      where: { id: attribute.id },
      transaction: t,
    });
    const updatedAttribute = await Attribute.findByPk(req.params.id, {
      transaction: t,
    });
    await t.commit();
    return updatedAttribute;
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};
