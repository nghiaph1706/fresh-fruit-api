// controllers/ProductController.js
import { Op, literal } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as AvailabilityRepository from "../repositories/AvailabilityRepository.js";
import * as ProductRepository from "../repositories/ProductRepository.js";
import * as AuthService from "../services/AuthService.js";
import * as UtilService from "../services/UtilServcie.js";

const { Type, Shop, Product, Category } = models;

export const popularProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const language = req.query.language || constants.DEFAULT_LANGUAGE;
    const range = req.query.range ? parseInt(req.query.range) : null;
    let type_id = req.query.type_id || "";

    // Check for type_slug in the request
    if (req.query.type_slug && !type_id) {
      try {
        const type = await Type.findOne({
          attributes: ["id"],
          where: {
            slug: req.query.type_slug,
            language: language,
          },
        });

        if (type) {
          type_id = type.id;
        } else {
          return res.status(404).json({ message: constants.NOT_FOUND });
        }
      } catch (error) {
        console.error(error);
        throw new Error("Type not found");
      }
    }

    // Build the base query
    const baseQuery = {
      attributes: {
        exclude: ["createdAt", "updatedAt"], // Exclude timestamps
        include: [
          [
            literal(
              "(SELECT COUNT(*) FROM order_product WHERE order_product.product_id = products.id)"
            ),
            "orderCount",
          ],
        ],
      },
      include: [
        { model: Type, attributes: ["id", "name"] },
        { model: Shop, attributes: ["id", "name"] },
      ],
      order: [["orderCount", "DESC"]],
      where: {
        language: language,
        ...(req.query.shop_id && { shop_id: req.query.shop_id }),
        ...(range && {
          created_at: { [Op.gt]: literal(`NOW() - INTERVAL ${range} DAY`) },
        }),
        ...(type_id && { type_id: type_id }),
      },
      limit: limit,
    };

    // Execute the query
    const products = await Product.findAll(baseQuery);

    return res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const index = async (req, res) => {
  const limit = parseInt(req.query.limit) || 15;
  const search = UtilService.convertToObject(req.query.search);
  let unavailableProducts = [];
  const language = req.query.language || constants.DEFAULT_LANGUAGE;

  if (req.query.date_range) {
    const dateRange = req.query.date_range.split("//");
    unavailableProducts = AvailabilityRepository.getUnavailableProducts(
      dateRange[0],
      dateRange[1]
    );
  }

  const include = [];
  let baseQuery = {
    where: {
      language,
      id: {
        [Op.notIn]: unavailableProducts,
      },
    },
    include,
    limit,
  };

  if (!search.name) {
    if (search.type?.slug) {
      include.push({
        model: Type,
        where: {
          slug: search.type.slug,
        },
      });
    }

    if (search.categories?.slug) {
      include.push({
        model: Category,
        where: {
          slug: search.categories.slug,
        },
      });
    }
  } else {
    baseQuery.where.name = {
      [Op.like]: `%${search.name}%`,
    };
  }

  const products = await Product.findAll(baseQuery);

  return res.json({ data: products });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const language = req.query.language || constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  try {
    let product;

    if (!isNaN(slug)) {
      product = await Product.findByPk(slug, {});
    } else {
      product = await Product.findOne({
        where: {
          language,
          slug,
        },
      });
    }

    if (!product) {
      return res.status(404).json({ message: constants.NOT_FOUND });
    }
    // Fetch related products
    const relatedProducts = await ProductRepository.fetchRelated(
      product.slug,
      limit,
      language
    );

    res.json({ related_products: relatedProducts, ...product.dataValues });
  } catch (error) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};

export const myWishlists = async (req, res) => {
  try {
    const products = await ProductRepository.fetchWishlists(req);
    res.json({ data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const store = async (req, res) => {
  try {
    const hasPermission = await AuthService.hasPermission(
      req.user,
      req.params.shop_id
    );
    if (hasPermission) {
      const product = await ProductRepository.storeProduct(req);
      res.send(product);
    } else {
      res.status(401).json({ message: constants.NOT_AUTHORIZED });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  try {
    const product = await ProductRepository.updateProduct(req);
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroy = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    await product.destroy();
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
