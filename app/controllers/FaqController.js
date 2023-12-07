import constants from "../config/constants.js";
import Permission from "../config/enum/Permission.js";
import { models, sequelize } from "../models/index.js";
import { hasPermission } from "../services/AuthService.js";
import * as UtilService from "../services/UtilServcie.js";
import { Op } from "sequelize";

const { Faq, Shop } = models;
export const index = async (req, res) => {
  const language = req.query.language
    ? req.query.language
    : constants.DEFAULT_LANGUAGE;
  const limit = req.query.limit ? parseInt(req.query.limit) : 15;
  const offset = req.query.page ? parseInt(req.query.page) - 1 : 0;
  const orderBy = req.query.orderBy || "created_at";
  const sortedBy = req.query.sortedBy || "desc";
  const search = UtilService.convertToObject(req.query.search);
  const query = req.params;
  let where = {};
  where["language"] = language;
  try {
    if (search.faq_title) {
      where = {};
      where["faq_title"] = { [Op.like]: `%${search.faq_title}%` };
    }
    const user = req.user;
    if (user) {
      if (req.isSuperAdmin) {
        const faqs = await Faq.findAndCountAll({
          where,
          include: [{ model: Shop, as: "shop" }],
          limit,
          offset,
          order: [[orderBy, sortedBy]],
        });
        console.log(faqs);
        return res.json(
          UtilService.paginate(faqs.count, limit, offset, faqs.rows),
        );
      }
      if (req.isStoreOwner) {
        if (hasPermission(user, query.shop_id)) {
          where["shop_id"] = query.shop_id;
          const faqs = await Faq.findAndCountAll({
            where,
            include: [{ model: Shop, as: "shop" }],
            limit,
            offset,
            order: [[orderBy, sortedBy]],
          });
          return res.json(
            UtilService.paginate(faqs.count, limit, offset, faqs.rows),
          );
        } else {
          const userShops = await user.getShops();
          const followedShopIds = userShops.map((shop) => shop.id);
          where["shop_id"] = { [Op.in]: followedShopIds };
          where["user_id"] = user.id;
          const faqs = await Faq.findAndCountAll({
            where,
            include: [{ model: Shop, as: "shop" }],
            limit,
            offset,
            order: [[orderBy, sortedBy]],
          });
          return res.json(
            UtilService.paginate(faqs.count, limit, offset, faqs.rows),
          );
        }
      }
      if (req.isStaff) {
        where["shop_id"] = query.shop_id;
        const faqs = await Faq.findAndCountAll({
          where,
          include: [{ model: Shop, as: "shop" }],
          limit,
          offset,
          order: [[orderBy, sortedBy]],
        });
        return res.json(
          UtilService.paginate(faqs.count, limit, offset, faqs.rows),
        );
      }
      const faqs = await Faq.findAndCountAll({
        where,
        include: [{ model: Shop, as: "shop" }],
      });
      return res.json(
        UtilService.paginate(faqs.count, limit, offset, faqs.rows),
      );
    } else {
      if (query.shop_id) {
        where["shop_id"] = query.shop_id;
        const faqs = await Faq.findAndCountAll({
          where,
          include: [{ model: Shop, as: "shop" }],
        });
        return res.json(
          UtilService.paginate(faqs.count, limit, offset, faqs.rows),
        );
      } else {
        const faqs = await Faq.findAndCountAll({
          where,
          include: [{ model: Shop, as: "shop" }],
        });
        return res.json(
          UtilService.paginate(faqs.count, limit, offset, faqs.rows),
        );
      }
    }
  } catch (error) {
    res.status(500).json({ message: constants.SOMETHING_WENT_WRONG });
  }
};

export const show = async (req, res) => {
  const faq = await Faq.findOne({
    where: { id: req.params.id },
    include: [{ model: Shop, as: "shop" }],
  });
  if (!faq) {
    res.status(404).json({ message: constants.NOT_FOUND });
  }
  res.status(200).send(faq);
};

export const store = async (req, res) => {
  try {
    let shop = undefined;
    const body = req.body;
    if (body.shop_id) {
      shop = await Shop.findOne({ where: { id: body.shop_id } });
    }
    const faq = {};
    faq.faq_title = body.faq_title;
    faq.faq_description = body.faq_description;
    faq.slug = UtilService.customSlugify(body.faq_title);
    faq.user_id = req.user.id;
    faq.shop_id = body.shop_id ? body.shop_id : null;
    faq.faq_type = body.shop_id ? "shop" : "global";
    faq.issued_by = body.shop_id ? shop.name : "Super Admin";
    faq.language = body.language ?? constants.DEFAULT_LANGUAGE;
    const result = await Faq.create(faq);
    return res.status(201).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: constants.SOMETHING_WENT_WRONG });
  }
};

export const update = async (req, res) => {
  try {
    const faq = await Faq.findOne({ where: { id: req.params.id } });
    if (!faq) {
      res.status(404).json({ message: constants.NOT_FOUND });
    }
    const body = req.body;
    body.id = parseInt(req.params.id);
    body.slug = UtilService.customSlugify(body.faq_title);
    Object.assign(faq, body);
    const newFaq = await faq.save();
    return res.status(200).send(newFaq);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: constants.COULD_NOT_UPDATE_THE_RESOURCE });
  }
};

export const destroy = async (req, res) => {
  try {
    const user = req.user;
    const faq = await Faq.findOne({ where: { id: req.params.id } });
    if (!faq) {
      res.status(404).json({ message: constants.NOT_FOUND });
    }

    if (user && (req.isSuperAdmin || req.isStoreOwner || req.isStaff)) {
      await faq.destroy();
    } else {
      res.status(401).json({ message: constants.NOT_AUTHORIZED });
    }
    res.status(200).send(faq);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: constants.COULD_NOT_DELETE_THE_RESOURCE });
  }
};
