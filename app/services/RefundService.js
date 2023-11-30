import PermissionEnum from '../config/enum/Permission.js';
import { models } from '../models/index.js';

const { Shop } = models;
export const hasPermission = async (permissions, user, shop_id = null) => {
  if (user && permissions.includes(PermissionEnum.SUPER_ADMIN)) {
    return true;
  }
  try {
    const shop = await Shop.findByPk(shop_id);
    if (!shop) {
      throw new MarvelException(SHOP_NOT_APPROVED);
    }
    if (user && permissions.includes(PermissionEnum.STORE_OWNER)) {
      if (shop.owner_id === user.id) {
        return true;
      }
    } else if (user && permissions.includes(PermissionEnum.STORE_OWNER)) {
      if (shop.staffs.contains(user)) {
        return true;
      }
    }
  } catch (e) {
    return false;
  }

  return false;
};
