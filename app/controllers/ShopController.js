import { Op, literal } from "sequelize";
import constants from "../config/constants.js";
import { models } from "../models/index.js";
import PermissionEnum from "../config/enum/Permission.js";
import * as ShopRepository from "../repositories/ShopRepository.js";
import * as UtilService from "../services/UtilServcie.js";

const { Shop, User, UserProfile, Balance, Product } = models;

export const index = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);

  let base;

  const shops = await Shop.findAndCountAll({
    where: {
      name: { [Op.like]: `%${search?.name || ""}%` },
    },
    attributes: {
      include: [
        [
          literal(`(
              SELECT COUNT(*)
              FROM orders
              WHERE orders.shop_id = shops.id
            )`),
          "orders_count",
        ],
        [
          literal(`(
              SELECT COUNT(*)
              FROM products
              WHERE products.shop_id = shops.id
            )`),
          "products_count",
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
    order: [[orderBy, sortedBy]],
    limit: limit,
    offset: offset,
  });

  return res.json(UtilService.paginate(shops.count, limit, offset, shops.rows));
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
          "orders_count",
        ],
        [
          literal(`(
              SELECT COUNT(*)
              FROM products
              WHERE products.shop_id = shops.id
            )`),
          "products_count",
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

  res.send(shop);
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

export const userFollowedShop = async (req, res) => {
  try {
    const user = req.user;
    const userShops = await user.getShops();
    const followedShopIds = userShops.map((shop) => shop.id);

    const shop_id = parseInt(req.query.shop_id);

    return res.send(followedShopIds.includes(shop_id));
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};

export const handleFollowShop = async (req, res) => {
  try {
    const user = req.user;
    const userShops = await user.getShops();
    const followedShopIds = userShops.map((shop) => shop.id);

    const shop_id = parseInt(req.query.shop_id);

    if (followedShopIds.includes(shop_id)) {
      await user.removeShop(shop_id);
      return res.send(false);
    } else {
      await user.addShop(shop_id);
      return res.send(true);
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};

export const store = async (req, res) => {
  try {
    if (req.isStoreOwner) {
      const shop = await ShopRepository.storeShop(req);
      res.send(shop);
    } else {
      res.status(401).json({ message: constants.NOT_AUTHORIZED });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const disApproveShop = async (req, res) => {
  try {
    const id = req.body.id;
    await Shop.update(
      { is_active: false },
      { where: { id } }
    )

    return res.send(true);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};

export const approveShop = async (req, res) => {
  try {
    const id = req.body.id;
    const admin_commission_rate = req.body.admin_commission_rate;
    let shop = await Shop.findByPk(id);
    if (shop) {
      shop.update(
        {
          is_active: true,
          admin_commission_rate
        }
      )
      await Balance.findOrCreate({
        where: {
          shop_id: id,
        },
        default: {
          shop_id: id,
          admin_commission_rate
        }
      })
    }

    return res.send(shop);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: constants.NOT_FOUND });
  }
};
