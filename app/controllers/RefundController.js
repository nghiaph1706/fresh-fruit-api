import constants from '../config/constants.js';
import { models, sequelize } from '../models/index.js';
import PermissionEnum from '../config/enum/Permission.js';
import { hasPermission } from '../services/RefundService.js';
import { Op, literal } from 'sequelize';

const { Refund, Order, User, Shop } = models;

export const index = async (req, res) => {
  const limit = parseInt(req.query.limit);
  const query = req.query;
  try {
    if (
      req.user &&
      req.permissions.includes(PermissionEnum.SUPER_ADMIN) &&
      !query.shop_id
    ) {
      const results = await Refund.findAll({
        include: [
          {
            model: Order,
            require: true,
          },
          {
            model: Shop,
            require: true,
          },
          {
            model: User,
            require: true,
          },
        ],
        where: {
          id: { [Op.ne]: null },
          shop_id: { [Op.eq]: null },
        },
        limit: limit,
      });
      return res.status(200).send({ data: results });
    } else if (hasPermission(req.permissions, req.user, query.shop_id)) {
      const results = await Refund.findAll({
        include: [
          {
            model: Order,
          },
          {
            model: Shop,
          },
          {
            model: User,
          },
        ],
        where: {
          shop_id: { [Op.eq]: query.shop_id },
        },
        limit: limit,
      });
      return res.status(200).send({ data: results });
    } else if (req.user && req.permissions.include(PermissionEnum.CUSTOMER)) {
      const results = await Refund.findAll({
        include: [
          {
            model: Order,
            require: true,
          },
          {
            model: Shop,
            require: true,
          },
          {
            model: User,
            require: true,
          },
        ],
        where: {
          customer_id: { [Op.eq]: req.user.id },
          shop_id: { [Op.eq]: null },
        },
        limit: limit,
      });
      return res.status(200).send({ data: results });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: constants.BAD_REQUEST });
  }
};

export const show = async (req, res) => {
  try {
    const { slug } = req.params;
    const refund = await Refund.findByPk(slug);
    if (!refund) {
      return res.status(404).json({ message: constants.NOT_FOUND });
    }
    res.send(refund);
  } catch (error) {
    return res.status(400).json({ message: constants.BAD_REQUEST });
  }
};

export const store = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: constants.NOT_AUTHORIZED });
    }
    const refund = req.body;
    const newRefund = await Refund.create(refund);
    return res.send(newRefund);
  } catch (error) {
    return res.status(400).json({ message: constants.BAD_REQUEST });
  }
};
