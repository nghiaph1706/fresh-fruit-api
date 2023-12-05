import constants from "../config/constants.js";
import { models } from "../models/index.js";
import { customSlugify } from "../services/UtilServcie.js";

const { Shop, UserShop } = models;

export const storeShop = async (req) => {
  try {
    const data = req.body;
    const slugText = await (() => {
      if (req.body.slug) {
        return req.body.slug;
      } else if (req.body.name) {
        return req.body.name;
      } else if (req.body.title) {
        return req.body.title;
      } else {
        return "auto-generated-string";
      }
    })();

    data.slug = customSlugify(slugText);
    data.owner_id = req.user.id;
    const shop = await Shop.create(data);
    
    await UserShop.create({
      UserId: req.user.id,
      shopId: shop.id
    });
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
