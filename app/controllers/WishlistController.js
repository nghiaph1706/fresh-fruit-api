import constants from "../config/constants.js";
import { models } from "../models/index.js";
import * as WishlistRepository from "../repositories/WishlistRepository.js";

const { Wishlist, Product } = models;

export const toggle = async (req, res) => {
  try {
    const wishlist = await WishlistRepository.toggleWishlist(req);
    res.send(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const index = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 15;
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
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const store = async (req, res) => {
  try {
    const wishlist = await WishlistRepository.storeWishlist(req);
    res.send(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroy = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: constants.NOT_AUTHORIZED });
    }
    const wishlist = await Wishlist.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });
    if (wishlist) {
      await wishlist.destroy();
      res.send({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ error: constants.NOT_FOUND });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const in_wishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      where: {
        user_id: req.user.id,
        product_id: req.params.product_id,
      },
    });
    if (wishlist) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
