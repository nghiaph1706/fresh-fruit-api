// controllers/AuthorController.js
import { Sequelize } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { Author, Product } = models;

export const topAuthor = async (req, res) => {
  try {
    // Set default values if query parameters are not provided
    const language = req.query.language || constants.DEFAULT_LANGUAGE;
    const limit = parseInt(req.query.limit) || 10;

    // Use Sequelize.literal for complex SQL expressions
    const productCountExpression = Sequelize.literal(
      "(SELECT COUNT(*) FROM products WHERE products.author_id = authors.id)"
    );

    // Query to fetch top authors with product count
    const authors = await Author.findAll({
      attributes: [
        "id",
        "name",
        "is_approved",
        "image",
        "cover_image",
        "slug",
        "language",
        "bio",
        "quote",
        "born",
        "death",
        "languages",
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
    return res.json({ data: authors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
