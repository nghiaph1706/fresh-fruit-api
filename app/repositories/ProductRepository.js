import { Op } from "sequelize";
import constants from "../config/constants.js";
import ProductType from "../config/enum/ProductType.js";
import { models } from "../models/index.js";

const { Type, Category, Product, Wishlist } = models;

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

export const fetchWishlists = async (req) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const wishlist = await Wishlist.findAll({
    where: {
      user_id: req.user.id,
    },
    attributes: ["product_id"],
  });
  const productIds = wishlist.map((item) => item.product_id);
  const products = await Product.findAll({
    where: {
      id: productIds,
    },
    limit,
  });
  return products;
};

export const storeProduct = async (req) => {
  try {
    const data = req.body;
    if (req.body.product_type === ProductType.SIMPLE) {
      data.max_price = data.price;
      data.min_price = data.price;
    }
    data.slug = await customSlugify(data.name);
    const product = await Product.create(data);

    // TODO
    // if (!product.slug || !isNaN(product.slug)) {
    //   product.slug = customSlugify(product.name);
    // }
    // if (req.body.metas) {
    //   const metas = {};
    //   req.body.metas.forEach((meta) => {
    //     metas[meta.key] = meta.value;
    //   });
    //   product.setMeta(metas);
    // }
    if (req.body.categories) {
      product.setCategories(req.body.categories);
    }
    // if (req.body.dropoff_locations) {
    //   product.setDropoffLocations(req.body.dropoff_locations);
    // }
    // if (req.body.pickup_locations) {
    //   product.setPickupLocations(req.body.pickup_locations);
    // }
    // if (req.body.persons) {
    //   product.setPersons(req.body.persons);
    // }
    // if (req.body.features) {
    //   product.setFeatures(req.body.features);
    // }
    // if (req.body.deposits) {
    //   product.setDeposits(req.body.deposits);
    // }
    if (req.body.tags) {
      product.setTags(req.body.tags);
    }
    // if (req.body.variations) {
    //   product.setVariations(req.body.variations);
    // }
    // if (req.body.variation_options) {
    //   req.body.variation_options.upsert.forEach((variation_option) => {
    //     if (variation_option.is_digital) {
    //       const file = variation_option.digital_file;
    //       delete variation_option.digital_file;
    //     }
    //     const new_variation_option =
    //       product.variation_options.create(variation_option);
    //     if (variation_option.is_digital) {
    //       new_variation_option.digital_file.create(file);
    //     }
    //   });
    // }
    // if (req.body.is_digital && req.body.is_digital === true) {
    //   product.digital_file.create(req.body.digital_file);
    // }

    // product.save();
    return product;
  } catch (error) {
    console.error(error);
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};

export const customSlugify = async (text, divider = "-") => {
  const slug = text.replace(" ", divider);
  const slugCount = await Product.count({
    where: {
      slug: {
        [Op.like]: slug + "%",
      },
    },
  });

  if (!slugCount) {
    return slug;
  }

  return slug + divider + slugCount;
};

export const updateProduct = async (req) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    // TODO
    // if (req.body.metas) {
    //   const metas = {};
    //   req.body.metas.forEach((meta) => {
    //     metas[meta.key] = meta.value;
    //   });
    //   product.setMeta(metas);
    // }
    if (req.body.categories) {
      product.setCategories(req.body.categories);
    }
    // if (req.body.dropoff_locations) {
    //   product.setDropoffLocations(req.body.dropoff_locations);
    // }
    // if (req.body.pickup_locations) {
    //   product.setPickupLocations(req.body.pickup_locations);
    // }
    // if (req.body.persons) {
    //   product.setPersons(req.body.persons);
    // }
    // if (req.body.features) {
    //   product.setFeatures(req.body.features);
    // }
    // if (req.body.deposits) {
    //   product.setDeposits(req.body.deposits);
    // }
    if (req.body.tags) {
      product.setTags(req.body.tags);
    }
    // if (req.body.variations) {
    //   product.setVariations(req.body.variations);
    // }
    // if (req.body.variation_options) {
    //   req.body.variation_options.upsert.forEach((variation_option) => {
    //     if (variation_option.is_digital) {
    //       const file = variation_option.digital_file;
    //       delete variation_option.digital_file;
    //     }
    //     const new_variation_option =
    //       product.variation_options.create(variation_option);
    //     if (variation_option.is_digital) {
    //       new_variation_option.digital_file.create(file);
    //     }
    //   });
    // }
    // if (req.body.is_digital && req.body.is_digital === true) {
    //   product.digital_file.create(req.body.digital_file);
    // }

    // product.save();
    // return product;
    const data = req.body;
    if (req.body.product_type === ProductType.VARIABLE) {
      data.price = null;
      data.sale_price = null;
      data.sku = null;
    }
    if (req.body.product_type === ProductType.SIMPLE) {
      data.max_price = data.price;
      data.min_price = data.price;
    }
    if (req.body.slug && req.body.slug !== product.slug) {
      const slug = await customSlugify(req.body.slug);
      data.slug = slug;
      // TODO
      // if (TRANSLATION_ENABLED) {
      //   await Product.update(
      //     {
      //       slug,
      //     },
      //     {
      //       where: {
      //         slug: product.slug,
      //         id: {
      //           [Op.not]: product.id,
      //         },
      //       },
      //     }
      //   );
      // }
    }
    await product.update(data);
    // TODO
    // if (product.product_type === ProductType.SIMPLE) {
    //   await product.variations.destroy();
    //   await product.variation_options.destroy();
    // }
    // await product.save();
  } catch (error) {
    console.error(error);
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};
