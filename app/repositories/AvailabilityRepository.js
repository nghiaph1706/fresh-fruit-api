import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { Op } from "sequelize";

const { Availability, Product } = models;

export const getUnavailableProducts = async (from, to) => {
  const _blockedDates = await Availability.findAll({
    where: {
      from: {
        [Op.lte]: from,
      },
      to: {
        [Op.gte]: to,
      },
    },
    group: ["product_id"],
  });

  let unavailableProducts = [];

  _blockedDates.forEach(availability => {
    if (!(isProductAvailableAt(from, to, availability.product_id, availability))) {
        unavailableProducts.push(availability.product_id);
      }
  });
};

function isProductAvailableAt(
  from,
  to,
  productId,
  blockedDates,
  requestedQuantity = 1
) {
  let quantity = 0;

  Product.findByPk(productId)
    .then((product) => {
      blockedDates.forEach((singleDate) => {
        const period = moment.range(singleDate.from, singleDate.to);
        const range = moment.range(from, to);

        if (period.overlaps(range)) {
          quantity += singleDate.order_quantity;
        }
      });

      const availableQuantity = product.quantity - quantity;
      return availableQuantity > requestedQuantity;
    })
    .catch((error) => {
      throw new Error(constants.NOT_FOUND);
    });
}
