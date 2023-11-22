import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { Op } from "sequelize";

const { Shipping, Setting, Product, Variation, Tax } = models;

export const checkStock = async (products) => {
  let unavailableProducts = [];
  products.forEach(async product => {
    let isNotInStock = false;
    if (product.variation_option_id) {
      isNotInStock = isVariationInStock(product.variation_option_id, product.order_quantity);
    } else {
      isNotInStock = await isInStock(product.product_id, product.order_quantity);
    }
    if (isNotInStock) {
      unavailableProducts.push(isNotInStock);
    }
  });
  return unavailableProducts;
};

export const getOrderAmount = async (req, unavailableProducts) => {
  if (unavailableProducts.length) {
    return calculateAmountWithAvailable(req.body.products, unavailableProducts);
  }
  return req.body.amount;
}

export const calculateShippingCharge = async (req, amount) => {
  try {
    const orderedProducts = req.body.products;
    const physicalProducts = await Product.findAll({
      where: {
        id: orderedProducts.map((product) => product.product_id),
        is_digital: false,
      },
    });

    if (!physicalProducts.length) {
      return 0;
    }

    const settings = await Setting.findOne({
      where: {
        language: constants.DEFAULT_LANGUAGE,
      },
    });

    const classId = settings.options.shippingClass;

    if (classId) {
      const shippingClass = await Shipping.findByPk(classId);
      return getShippingCharge(shippingClass, amount);
    } else {
      return calculateShippingChargeByProduct(req.body.products);
    }
  } catch (error) {
    return 0;
  }
};

export const calculateTax = async (req, shipping_charge, amount) => {
  const tax_class = await getTaxClass(req);
  if (tax_class) {
    return getTotalTax(amount, tax_class);
  }
  return tax_class;
}

const getTaxClass = async (req) => {
  try {
    const settings = await Setting.findOne({
      where: {
        language: constants.DEFAULT_LANGUAGE,
      },
    });
    const taxClassId = settings.options.taxClass;
    const tax = await Tax.findByPk(taxClassId);
    return tax;
  } catch (error) {
    return 0;
  }
};

const getTaxClassByAddress = async (address) => {
  return await Tax.findOne({
    where: {
      [Op.or]: [
        { country: address.country },
        { state: address.state },
        { city: address.city },
        { zip: address.zip },
      ],
    },
    order: [['priority', 'ASC']],
  });
};

const getTotalTax = (amount, taxClass) => {
  return (amount * taxClass.rate) / 100;
};


const getShippingCharge = (shippingClass, amount) => {
  switch (shippingClass.type) {
    case 'fixed':
      return shippingClass.amount;
    case 'percentage':
      return (shippingClass.amount * amount) / 100;
    default:
      return 0;
  }
};

const calculateShippingChargeByProduct = async (products) => {
  let totalCharge = 0;
  products.forEach(async product => {
    totalCharge += await calculateEachProductCharge(product.product_id, product.subtotal);
  });
  return totalCharge;
};

const calculateEachProductCharge = async (id, amount) => {
  try {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Shipping,
          as: "shipping",
        },
      ],
    });

    if (product && product.shipping) {
      return getShippingCharge(product.shipping, amount);
    }

    return 0;
  } catch (error) {
    return 0;
  }
};


const calculateAmountWithAvailable = (products, unavailableProducts) => {
  let amount = 0;
  products.forEach(product => {
    if (!unavailableProducts.includes(product.product_id)) {
      amount += product.sub_total;
    }
  });
  return amount;
}

const isVariationInStock = async (variation_id, order_quantity) => {
  try {
    const variationOption = await Variation.findByPk(variation_id);
    if (order_quantity > variationOption.quantity) {
      return variationOption.product_id;
    }
    return false;
  } catch (error) {
    return false;
  }
}

const isInStock = async (id, order_quantity) => {
  try {
    const product = await Product.findByPk(id);
    if (order_quantity > product.quantity) {
      return id;
    }
    return false;
  } catch (error) {
    return false;
  }
}
