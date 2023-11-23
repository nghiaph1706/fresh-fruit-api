import * as WishlistRepository from "../repositories/WishlistRepository.js";

export const toggle = async (req, res) => {
  try {
    const wishlist = await WishlistRepository.toggleWishlist(req);
    res.send(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
