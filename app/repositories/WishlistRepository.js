import { models } from "../models/index.js";

const { Wishlist } = models;

export const toggleWishlist = async (req) => {
  try {
    const wishlist = await Wishlist.findOne({
      where: {
        user_id: req.user.id,
        product_id: req.body.product_id,
      },
    });

    if (!wishlist) {
      const wishlistInput = {
        user_id: req.user.id,
        product_id: req.body.product_id,
        variation_option_id: req.body.variation_option_id,
      };
      await Wishlist.create(wishlistInput);
      return true;
    } else {
      await Wishlist.destroy({
        where: {
          id: wishlist.id,
        },
      });
      return false;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const storeWishlist = async (req) => {
  try {
    const wishlist = await Wishlist.findOne({
      where: {
        user_id: req.user.id,
        product_id: req.body.product_id,
      },
    });

    if (!wishlist) {
      const wishlistInput = {
        user_id: req.user.id,
        product_id: req.body.product_id,
        variation_option_id: req.body.variation_option_id,
      };
      await Wishlist.create(wishlistInput);
      return true;
    }
  } catch (error) {
    throw new Error("Already added to wishlist for this product");
  }
};
