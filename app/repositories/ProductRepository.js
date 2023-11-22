import { Op } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Type, Category, Product, Availability, Variation, Resource } = models;

export const fetchRelated = async (
  slug,
  limit = 10,
  language = constants.DEFAULT_LANGUAGE
) => {
  try {
    const product = await Product.findOne({ where: { slug } });
    const categories = await product
      .getCategories()
      .then((categories) => categories.map((category) => category.id));

    const relatedProducts = await Product.findAll({
      where: {
        language,
      },
      include: [
        {
          model: Category,
          where: {
            id: {
              [Op.in]: categories,
            },
          },
          as: "categories",
        },
        {
          model: Type,
        },
      ],
      limit: limit,
    });

    return relatedProducts;
  } catch (error) {
    throw new Error(error);
    return [];
  }
};

export const fetchBlockedDatesForAVariationInRange = async (
  from,
  to,
  variation_id
) => {
  try {
    const availabilities = await Availability.findAll({
      where: {
        bookable_id: variation_id,
        bookable_type: "Variation",
        from: {
          [Op.gte]: from,
        },
        to: {
          [Op.lte]: to,
        },
      },
    });

    return availabilities;
  } catch (error) {
    throw new Error(error);
    return [];
  }
};

export const isVariationAvailableAt = async (
  from,
  to,
  variationId,
  _blockedDates,
  requestedQuantity
) => {
  try {
    const variation = await Variation.findByPk(variationId);
    if (!variation) {
      throw new Error(constants.NOT_FOUND);
    }
    let quantity = 0;
    _blockedDates.forEach((singleDate) => {
      const period = Period.make(
        singleDate.from,
        singleDate.to,
        Precision.DAY,
        Boundaries.EXCLUDE_END
      );
      const range = Period.make(
        from,
        to,
        Precision.DAY,
        Boundaries.EXCLUDE_END
      );
      if (period.overlapsWith(range)) {
        quantity += singleDate.order_quantity;
      }
    });
    return variation.quantity - quantity >= requestedQuantity;
  } catch (error) {
    throw new Error(error);
    return false;
  }
};

export const fetchBlockedDatesForAProductInRange = async (
  from,
  to,
  productId
) => {
  try {
    const availabilities = await Availability.findAll({
      where: {
        product_id: productId,
        from: {
          [Op.gte]: from,
        },
        to: {
          [Op.lte]: to,
        },
      },
    });

    return availabilities;
  } catch (error) {
    throw new Error(error);
    return [];
  }
};

export const isProductAvailableAt = async (
  from,
  to,
  productId,
  _blockedDates,
  requestedQuantity = 1
) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error(constants.NOT_FOUND);
    }
    let quantity = 0;
    _blockedDates.forEach((singleDate) => {
      const period = Period.make(
        singleDate.from,
        singleDate.to,
        Precision.DAY,
        Boundaries.EXCLUDE_END
      );
      const range = Period.make(
        from,
        to,
        Precision.DAY,
        Boundaries.EXCLUDE_END
      );
      if (period.overlapsWith(range)) {
        quantity += singleDate.order_quantity;
      }
    });
    return product.quantity - quantity > requestedQuantity;
  } catch (error) {
    throw new Error(error);
    return false;
  }
};

export const calculatePrice = async (
  bookedDay,
  product_id,
  variation_id,
  quantity,
  persons,
  dropoff_location_id,
  pickup_location_id,
  deposits,
  features
) => {
  try {
    let price = 0;
    let person_price = 0;
    let deposit_price = 0;
    let feature_price = 0;
    let dropoff_location_price = 0;
    let pickup_location_price = 0;

    if (variation_id) {
      const variation_price = await calculateVariationPrice(variation_id);
      price += variation_price * bookedDay * quantity;
    } else {
      const product_price = await calculateProductPrice(product_id);
      price += product_price * bookedDay * quantity;
    }
    if (dropoff_location_id) {
      dropoff_location_price = await calculateLocationPrice(
        dropoff_location_id
      );
    }
    if (pickup_location_id) {
      pickup_location_price = await calculateLocationPrice(pickup_location_id);
    }
    if (features) {
      feature_price = await calculateResourcePrice(features);
    }
    if (persons) {
      person_price = await calculateResourcePrice(persons);
    }
    if (deposits) {
      deposit_price = await calculateResourcePrice(deposits);
    }

    return {
      totalPrice:
        price +
        person_price +
        deposit_price +
        feature_price +
        dropoff_location_price +
        pickup_location_price,
      personPrice: person_price,
      depositPrice: deposit_price,
      featurePrice: feature_price,
      dropoffLocationPrice: dropoff_location_price,
      pickupLocationPrice: pickup_location_price,
    };
  } catch (error) {
    throw new Error(error);
    return {};
  }
};

export const calculateVariationPrice = async (variation_id) => {
  try {
    const variation = await Variation.findByPk(variation_id);
    if (!variation) {
      throw new Error(constants.NOT_FOUND);
    }
    return variation.sale_price ? variation.sale_price : variation.price;
  } catch (error) {
    throw new Error(error);
    return 0;
  }
};

export const calculateProductPrice = async (product_id) => {
  try {
    const product = await Product.findByPk(product_id);
    if (!product) {
      throw new Error(constants.NOT_FOUND);
    }
    return product.sale_price ? product.sale_price : product.price;
  } catch (error) {
    throw new Error(error);
    return 0;
  }
};

export const calculateLocationPrice = async (location_id) => {
  try {
    const location = await Resource.findByPk(location_id);
    if (!location) {
      throw new Error(constants.NOT_FOUND);
    }
    return location.price;
  } catch (error) {
    throw new Error(error);
    return 0;
  }
};

export const calculateResourcePrice = async (resources) => {
  try {
    let price = 0;
    resources.forEach(async (resource_id) => {
      const resource = await Resource.findByPk(resource_id);
      if (resource.price) {
        price += resource.price;
      }
    });
    return price;
  } catch (error) {
    throw new Error(error);
    return 0;
  }
};
