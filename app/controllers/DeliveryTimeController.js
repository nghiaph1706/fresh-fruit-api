import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { customSlugify } from "../services/UtilServcie.js";

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

  return res.send(deliveryTimes);
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

export const store = async (req, res) => {
  try {
    const body = req.body;
    body.slug = customSlugify(body.title);
    const result = await DeliveryTime.create(body);
    return res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const body = req.body;
    const deliveryTime = await DeliveryTime.findByPk(req.params.id);
    if (!deliveryTime) {
      res.status(404).send(constants.NOT_FOUND);
    }
    body.slug = customSlugify(body.title);
    Object.assign(deliveryTime, body);
    console.log(deliveryTime);
    const result = await deliveryTime.save();
    return res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroy = async (req, res) => {
  try {
    const deliveryTime = await DeliveryTime.findByPk(req.params.id);
    if (!deliveryTime) {
      res.status(404).send(constants.NOT_FOUND);
    }
    await deliveryTime.destroy();
    return res.status(200).send(deliveryTime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
