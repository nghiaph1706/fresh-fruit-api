import { Op, literal } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import PermissionEnum from "../config/enum/Permission.js";

const { Shop, User, UserProfile, Balance } = models;

export const index = async (req, res) => {
  const shops = await Shop.findAll({
    attributes: {
      include: [
        [
          literal(`(
              SELECT COUNT(*)
              FROM orders
              WHERE orders.shop_id = shops.id
            )`),
          "ordersCount",
        ],
        [
          literal(`(
              SELECT COUNT(*)
              FROM products
              WHERE products.shop_id = shops.id
            )`),
          "productsCount",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "owner",
        include: [
          {
            model: UserProfile,
            as: "profile",
          },
        ],
      },
    ],
  });

  return res.json({ shops });
};

export const show = async (req, res) => {
  const { slug } = req.params;
  let isOwnerShop = false;
  let isSuperAdmin = false;

  if (req.permissions && req.user) {
    isSuperAdmin = req.permissions.includes(PermissionEnum.SUPER_ADMIN);
    const ownerShops = await req.user
      .getShops()
      .then((shops) => shops.map((shop) => shop.slug));
    isOwnerShop = ownerShops.includes(slug);
  }

  const shopQuery = {
    where: { slug },
    attributes: {
      include: [
        [
          literal(`(
              SELECT COUNT(*)
              FROM orders
              WHERE orders.shop_id = shops.id
            )`),
          "ordersCount",
        ],
        [
          literal(`(
              SELECT COUNT(*)
              FROM products
              WHERE products.shop_id = shops.id
            )`),
          "productsCount",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "owner",
        include: [{ model: UserProfile, as: "profile" }],
      },
    ],
  };

  if (isSuperAdmin || isOwnerShop) {
    shopQuery.include.push({ model: Balance, as: "balance" });
  }

  const shop = await Shop.findOne(shopQuery);

  if (!shop) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.json({ shop });
};
