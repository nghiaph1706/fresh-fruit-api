import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { makeSlug } from "../repositories/BaseRepository.js";

const { Shop } = models;

export const storeShop = async (req) => {
  try {
    const data = req.body;
    data.slug = makeSlug(req);
    data.owner_id = req.user.id;
    const shop = await Shop.create(data);
    if (data.categories) {
      // TODO: Check if categories exist
      await shop.addCategories(data.categories);
    }
    if (data.balance.payment_info) {
      await shop.createBalance(data.balance);
    }

    const shopData = await Shop.findOne({
      where: { id: shop.id },
      include: [
        // TODO: Uncomment this when categories is ready
        // { model: models.Category, as: "categories" },
        { model: models.User, as: "staffs" },
      ],
    });
    return shopData;
  } catch (error) {
    console.log(error);
    throw new Error(constants.COULD_NOT_CREATE_THE_RESOURCE);
  }
};
