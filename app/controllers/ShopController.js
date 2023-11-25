import { Op, literal } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import PermissionEnum from "../config/enum/Permission.js";

const { Shop, User, UserProfile, Balance, Product } = models;

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

export const followedShopsPopularProducts = async (req, res) => {
  try {
    const user = req.user;
    const userShops = await user.getShops();
    const followedShopIds = userShops.map((shop) => shop.id);
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const products = await Product.findAll({
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*)
              FROM order_product
              WHERE order_product.product_id = products.id
            )`),
            "ordersCount",
          ],
        ],
      },
      include: [{ model: Shop, as: "shop" }],
      where: { shop_id: { [Op.in]: followedShopIds } },
      order: [["ordersCount", "DESC"]],
      limit,
    });

    return res.send(products);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};

export const userFollowedShops = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 15;
    const user = req.user;

    const shops = await user.getShops({ limit });

    return res.send(shops);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};
