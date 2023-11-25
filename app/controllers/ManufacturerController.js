// controllers/ManufacturerController.js
import { Sequelize } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Manufacturer, Product } = models;

export const topManufacturer = async (req, res) => {
  try {
    // Set default values if query parameters are not provided
    const language = req.query.language || constants.DEFAULT_LANGUAGE;
    const limit = parseInt(req.query.limit) || 10;

    // Use Sequelize.literal for complex SQL expressions
    const productCountExpression = Sequelize.literal(
      "(SELECT COUNT(*) FROM products WHERE products.manufacturer_id = manufacturers.id)"
    );

    // Query to fetch top manufacturers with product count
    const manufacturers = await Manufacturer.findAll({
      attributes: [
        "id",
        "name",
        "is_approved",
        "image",
        "cover_image",
        "slug",
        "language",
        "description",
        "website",
        "socials",
        "created_at",
        "updated_at",
        [productCountExpression, "productCount"],
      ],
      where: { language },
      order: [["productCount", "DESC"]], // Order by productCount
      limit,
    });

    // Respond with the result
    return res.json({ data: manufacturers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
