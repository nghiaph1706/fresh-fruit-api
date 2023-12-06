// models/index.js
import { Sequelize } from "sequelize";
import AbusiveReportModel from "./abusive_reports.js";
import AddressModel from "./address.js";
import AttachmentModel from "./attachments.js";
import AttributeValueModel from "./attribute_values.js";
import AttributeModel from "./attributes.js";
import AuthorsModel from "./authors.js";
import AvailabilityModel from "./availabilities.js";
import BalanceModel from "./balances.js";
import BannerModel from "./banners.js";
import CategoryModel from "./categories.js";
import CategoryProductModel from "./category_product.js";
import CategoryShopModel from "./category_shop.js";
import CouponModel from "./coupons.js";
import DeliveryTimeModel from "./delivery_times.js";
import FeedbackModel from "./feedbacks.js";
import LanguageModel from "./languages.js";
import ManufacturersModel from "./manufacturers.js";
import ModelHasPermissionsModel from "./model_has_permissions.js";
import OrderProductModel from "./order_product.js";
import WalletPointModel from "./order_wallet_points.js";
import OrdersModel from "./orders.js";
import PasswordResetModel from "./password_resets.js";
import PaymentIntentModel from "./payment_intents.js";
import PermissionsModel from "./permissions.js";
import PersonalAccessTokensModel from "./personal_access_tokens.js";
import ProductTagModel from "./product_tag.js";
import ProductsModel from "./products.js";
import QuestionModel from "./questions.js";
import RefundReasonModel from "./refund_reasons.js";
import RefundModel from "./refunds.js";
import ResourceModel from "./resources.js";
import ReviewModel from "./reviews.js";
import SettingModel from "./settings.js";
import ShippingModel from "./shipping_classes.js";
import ShopsModel from "./shops.js";
import TagModel from "./tags.js";
import TaxModel from "./tax_classes.js";
import TypesModel from "./types.js";
import UserProfileModel from "./user_profiles.js";
import UserShopModel from "./user_shop.js";
import UserModel from "./users.js";
import VariationModel from "./variation_options.js";
import WalletModel from "./wallets.js";
import WishlistModel from "./wishlists.js";
import WithdrawModel from "./withdraws.js";

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
  UserProfile: UserProfileModel(sequelize, Sequelize.DataTypes),
  UserShop: UserShopModel(sequelize, Sequelize.DataTypes),
  Balance: BalanceModel(sequelize, Sequelize.DataTypes),
  Review: ReviewModel(sequelize, Sequelize.DataTypes),
  Question: QuestionModel(sequelize, Sequelize.DataTypes),
  Feedback: FeedbackModel(sequelize, Sequelize.DataTypes),
  Wallet: WalletModel(sequelize, Sequelize.DataTypes),
  Variation: VariationModel(sequelize, Sequelize.DataTypes),
  Shipping: ShippingModel(sequelize, Sequelize.DataTypes),
  Tax: TaxModel(sequelize, Sequelize.DataTypes),
  Wishlist: WishlistModel(sequelize, Sequelize.DataTypes),
  WalletPoint: WalletPointModel(sequelize, Sequelize.DataTypes),
  PaymentIntent: PaymentIntentModel(sequelize, Sequelize.DataTypes),
  Address: AddressModel(sequelize, Sequelize.DataTypes),
  AbusiveReport: AbusiveReportModel(sequelize, Sequelize.DataTypes),
  Attachment: AttachmentModel(sequelize, Sequelize.DataTypes),
  CategoryShop: CategoryShopModel(sequelize, Sequelize.DataTypes),
  // Add other models here if needed
  Refund: RefundModel(sequelize, Sequelize.DataTypes),
  Withdraw: WithdrawModel(sequelize, Sequelize.DataTypes),
  RefundReason: RefundReasonModel(sequelize, Sequelize.DataTypes),
  ProductTag: ProductTagModel(sequelize, Sequelize.DataTypes),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { models, sequelize };
