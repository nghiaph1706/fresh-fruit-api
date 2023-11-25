import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { DeliveryTime } = models;

export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;

  const deliveryTimes = await DeliveryTime.findAll({
    where: {
      language,
    },
  });

  return res.json({data: deliveryTimes });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  const deliveryTime = await DeliveryTime.findByPk(slug, {
    where: {
      language,
    },
  });

  if (!deliveryTime) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.send(deliveryTime);
};
