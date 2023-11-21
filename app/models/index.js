// models/index.js
import { Sequelize } from "sequelize";
import AuthorsModel from "./authors.js";
import ManufacturersModel from "./manufacturers.js";
import ModelHasPermissionsModel from "./model_has_permissions.js";
import OrdersModel from "./orders.js";
import PermissionsModel from "./permissions.js";
import PersonalAccessTokensModel from "./personal_access_tokens.js";
import ProductsModel from "./products.js";
import ShopsModel from "./shops.js";
import TypesModel from "./types.js";
import UserModel from "./users.js";
import PasswordResetModel from "./password_resets.js";
import OrderProductModel from "./order_product.js";
import AvailabilityModel from "./availabilities.js";
import CategoryModel from "./categories.js";
import CategoryProductModel from "./category_product.js";
import BannerModel from "./banners.js";
import DeliveryTimeModel from "./delivery_times.js";
import LanguageModel from "./languages.js";
import TagModel from "./tags.js";
import CouponModel from "./coupons.js";
import SettingModel from "./settings.js";
import ResourceModel from "./resources.js";
import AttributeModel from "./attributes.js";
import AttributeValueModel from "./attribute_values.js";

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION,
    dialectOptions: {
      connectTimeout: 100000,
    },
  }
);

const models = {
  User: UserModel(sequelize, Sequelize.DataTypes),
  Permission: PermissionsModel(sequelize, Sequelize.DataTypes),
  UserHasPermission: ModelHasPermissionsModel(sequelize, Sequelize.DataTypes),
  PersonalAccessToken: PersonalAccessTokensModel(
    sequelize,
    Sequelize.DataTypes
  ),
  Author: AuthorsModel(sequelize, Sequelize.DataTypes),
  Product: ProductsModel(sequelize, Sequelize.DataTypes),
  Manufacturer: ManufacturersModel(sequelize, Sequelize.DataTypes),
  Order: OrdersModel(sequelize, Sequelize.DataTypes),
  Type: TypesModel(sequelize, Sequelize.DataTypes),
  Shop: ShopsModel(sequelize, Sequelize.DataTypes),
  PasswordReset: PasswordResetModel(sequelize, Sequelize.DataTypes),
  OrderProduct: OrderProductModel(sequelize, Sequelize.DataTypes),
  Availability: AvailabilityModel(sequelize, Sequelize.DataTypes),
  Category: CategoryModel(sequelize, Sequelize.DataTypes),
  CategoryProduct: CategoryProductModel(sequelize, Sequelize.DataTypes),
  Banner: BannerModel(sequelize, Sequelize.DataTypes),
  DeliveryTime: DeliveryTimeModel(sequelize, Sequelize.DataTypes),
  Language: LanguageModel(sequelize, Sequelize.DataTypes),
  Tag: TagModel(sequelize, Sequelize.DataTypes),
  Coupon: CouponModel(sequelize, Sequelize.DataTypes),
  Setting: SettingModel(sequelize, Sequelize.DataTypes),
  Resource: ResourceModel(sequelize, Sequelize.DataTypes),
  Attribute: AttributeModel(sequelize, Sequelize.DataTypes),
  AttributeValue: AttributeValueModel(sequelize, Sequelize.DataTypes),
  // Add other models here if needed
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { models, sequelize };
