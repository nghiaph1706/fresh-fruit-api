import constants from "../config/constants.js";
import { models } from "../models/index.js";

const { User, Address, UserProfile } = models;

export const updateUser = async (req, user) => {
  try {
    if (req.body.address && req.body.address.length) {
      for (let address of req.body.address) {
        address.address = JSON.stringify(address.address);
        if (address.id) {
          await Address.update(address, {
            where: {
              id: address.id,
            },
          });
        } else {
          address.customer_id = user.id;
          await Address.create(address);
        }
      }
    }

    if (req.body.profile) {
      req.body.profile.avatar = JSON.stringify(req.body.profile.avatar);
      if (req.body.profile.id) {
        await UserProfile.update(req.body.profile, {
          where: {
            id: req.body.profile.id,
          },
        });
      } else {
        let profile = req.body.profile;
        profile.customer_id = user.id;
        await UserProfile.create(profile);
      }
    }

    // only update the fields name, email, shop_id
    await user.update({
      name: req.body.name,
      email: req.body.email,
      shop_id: req.body.shop_id,
    });

    const responseUser = await User.findOne({
      where: {
        id: user.id,
      },
      include: [
        { model: models.Address, as: "address" },
        { model: models.UserProfile, as: "profile" },
        { model: models.Wallet, as: "wallet" },
        {
          model: models.Shop,
          as: "shops",
          include: {
            model: models.Balance,
            as: "balance",
          },
        },
        {
          model: models.Shop,
          as: "managed_shop",
          include: {
            model: models.Balance,
            as: "balance",
          },
        },
      ],
    });

    return responseUser;
  } catch (error) {
    console.error(error);
    throw new Error(constants.SOMETHING_WENT_WRONG);
  }
};
