import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Address } = models;

export const destroy = async (req, res) => {
  try {
    const user = req.user;
    if (req.isSuperAdmin) {
      const address = await Address.findByPk(req.params.id);
      await address.destroy();
      return res.json({ message: constants.ADDRESS_DELETED });
    } else {
      const address = await Address.findByPk(req.params.id);
      if (address.customer_id == user.id) {
        await address.destroy();
        return res.json({ message: constants.ADDRESS_DELETED });
      }
    }
  } catch (error) {
    res.status(400).json({ message: constants.NOT_FOUND });
  }
};
