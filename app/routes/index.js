// routes/index.js
import express from "express";
import multer from "multer";
import PermissionEnum from "../config/enum/Permission.js";
import * as AbusiveReportController from "../controllers/AbusiveReportController.js";
import * as AddressController from "../controllers/AddressController.js";
import * as AttributeController from "../controllers/AttributeController.js";
import * as AuthorController from "../controllers/AuthorController.js";
import * as CategoryController from "../controllers/CategoryController.js";
import * as CheckoutController from "../controllers/CheckoutController.js";
import * as CouponController from "../controllers/CouponController.js";
import * as DeliveryTimeController from "../controllers/DeliveryTimeController.js";
import * as FeedbackController from "../controllers/FeedbackController.js";
import * as LanguageController from "../controllers/LanguageController.js";
import * as ManufacturerController from "../controllers/ManufacturerController.js";
import * as OrderController from "../controllers/OrderController.js";
import * as ProductController from "../controllers/ProductController.js";
import * as QuestionController from "../controllers/QuestionController.js";
import * as ResourceController from "../controllers/ResourceController.js";
import * as ReviewController from "../controllers/ReviewController.js";
import * as SettingsController from "../controllers/SettingsController.js";
import * as ShopController from "../controllers/ShopController.js";
import * as StoreNoticeController from "../controllers/StoreNoticeController.js";
import * as TagController from "../controllers/TagController.js";
import * as TypeController from "../controllers/TypeController.js";
import * as UserController from "../controllers/UserController.js";
import * as WishlistController from "../controllers/WishlistController.js";
import * as RefundsController from "../controllers/RefundController.js";
import * as AnalyticsController from "../controllers/AnalyticsController.js";
import * as AttachmentController from "../controllers/AttachmentController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import * as WithdrawController from "../controllers/WithdrawController.js";
import * as RefundReasonController from "../controllers/RefundReasonController.js";
import * as FaqController from "../controllers/FaqController.js";
import * as TaxController from "../controllers/TaxController.js";
import * as ShippingController from "../controllers/ShippingController.js";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Public routes
router.post("/token", UserController.token);
router.post("/register", UserController.register);
router.post("/logout", UserController.logout);
router.post("/forget-password", UserController.forgetPassword);
router.post(
  "/verify-forget-password-token",
  UserController.verifyForgetPasswordToken
);
router.post("/social-login-token", UserController.socialLogin);
router.post("/reset-password", UserController.resetPassword);
router.post("/contact-us", UserController.contactAdmin);
router.post("/subscribe-to-newsletter", UserController.subscribeToNewsletter);
router.get("/top-authors", AuthorController.topAuthor);
router.get("/authors", AuthorController.topAuthor);
router.get("/top-manufacturers", ManufacturerController.topManufacturer);
router.get("/popular-products", ProductController.popularProducts);
router.get("/store-notices", authMiddleware([]), StoreNoticeController.index);
router.get("/products", ProductController.index);
router.get("/products/:slug", ProductController.show);
router.get("/types", TypeController.index);
router.get("/types/:slug", TypeController.show);
router.get("/categories", CategoryController.index);
router.get("/categories/:slug", CategoryController.show);
router.get("/delivery-times", DeliveryTimeController.index);
router.get("/delivery-times/:slug", DeliveryTimeController.show);
router.get("/languages", LanguageController.index);
router.get("/languages/:slug", LanguageController.show);
router.get("/tags", TagController.index);
router.get("/tags/:slug", TagController.show);
router.get("/resources", ResourceController.index);
router.get("/resources/:slug", ResourceController.show);
router.get("/coupons", CouponController.index);
router.get("/coupons/:slug", CouponController.show);
router.post("/coupons/verify", CouponController.verify);
router.get("/attributes", AttributeController.index);
router.get("/attributes/:slug", AttributeController.show);
router.get("/shops", ShopController.index);
router.get("/shops/:slug", authMiddleware([]), ShopController.show);
router.get("/settings", SettingsController.index);
router.get("/reviews", ReviewController.index);
router.get("/reviews/:slug", ReviewController.show);
router.get("/questions", QuestionController.index);
router.get("/questions/:slug", QuestionController.show);
router.get("/feedbacks", FeedbackController.index);
router.get("/best-selling-products", ProductController.popularProducts);
router.get("/feedbacks/:slug", authMiddleware([]), FeedbackController.show);
router.post(
  "/orders/checkout/verify",
  authMiddleware([]),
  CheckoutController.verify
);
router.get("/orders", authMiddleware([]), OrderController.index);
router.get("/orders/:slug", authMiddleware([]), OrderController.show);
router.post("/orders", authMiddleware([]), OrderController.store);
router.get("/attachments", authMiddleware([]), AttachmentController.index);
router.get("/attachments/:slug", authMiddleware([]), AttachmentController.show);
router.get("/refund-reasons", authMiddleware([]), RefundReasonController.index);
router.get(
  "/refund-reasons/:slug",
  authMiddleware([]),
  RefundReasonController.show
);
router.get("/refunds", authMiddleware([]), RefundsController.index);
router.get("/refunds/:slug", authMiddleware([]), RefundsController.show);
router.get("/faqs", authMiddleware([]), FaqController.index);
router.get("/faqs/:id", authMiddleware([]), FaqController.show);
/**
 * ******************************************
 * Authorized Route for Customers only
 * ******************************************
 */
router.post(
  "/wishlists/toggle",
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.toggle
);
router.get(
  "/wishlists",
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.index
);
router.post(
  "/wishlists/store",
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.store
);
router.delete(
  "/wishlists/:id",
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.destroy
);
router.get(
  "/wishlists/in_wishlist/:product_id",
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.in_wishlist
);
router.get(
  "/my-wishlists",
  authMiddleware([PermissionEnum.CUSTOMER]),
  ProductController.myWishlists
);
router.get("/me", authMiddleware([PermissionEnum.CUSTOMER]), UserController.me);
router.put(
  "/users/:id",
  authMiddleware([PermissionEnum.CUSTOMER]),
  UserController.update
);

router.post(
  "/reviews",
  authMiddleware([PermissionEnum.CUSTOMER]),
  ReviewController.store
);
router.put(
  "/reviews/:id",
  authMiddleware([PermissionEnum.CUSTOMER]),
  ReviewController.update
);
router.get(
  "/followed-shops-popular-products",
  authMiddleware([PermissionEnum.CUSTOMER]),
  ShopController.followedShopsPopularProducts
);
router.get(
  "/followed-shops",
  authMiddleware([PermissionEnum.CUSTOMER]),
  ShopController.userFollowedShops
);
router.get(
  "/follow-shop",
  authMiddleware([PermissionEnum.CUSTOMER]),
  ShopController.userFollowedShop
);
router.post(
  "/follow-shop",
  authMiddleware([PermissionEnum.CUSTOMER]),
  ShopController.handleFollowShop
);
router.get(
  "/my-questions",
  authMiddleware([PermissionEnum.CUSTOMER]),
  QuestionController.myQuestions
);
router.post(
  "/questions",
  authMiddleware([PermissionEnum.CUSTOMER]),
  QuestionController.store
);
router.post(
  "/feedbacks",
  authMiddleware([PermissionEnum.CUSTOMER]),
  FeedbackController.store
);
router.post(
  "/abusive_reports",
  authMiddleware([PermissionEnum.CUSTOMER]),
  AbusiveReportController.store
);
router.get(
  "/my-reports",
  authMiddleware([PermissionEnum.CUSTOMER]),
  AbusiveReportController.myReports
);
router.post(
  "/change-password",
  authMiddleware([PermissionEnum.CUSTOMER]),
  UserController.changePassword
);
router.post(
  "/update-contact",
  authMiddleware([PermissionEnum.CUSTOMER]),
  UserController.updateContact
);
router.delete(
  "/address/:id",
  authMiddleware([PermissionEnum.CUSTOMER]),
  AddressController.destroy
);
router.post(
  "/refunds",
  authMiddleware([PermissionEnum.CUSTOMER]),
  RefundsController.store
);
router.post(
  "/attachments",
  authMiddleware([PermissionEnum.CUSTOMER]) && upload.array("attachment[]", 5),
  AttachmentController.store
);
router.delete(
  "/attachments/:slug",
  authMiddleware([]),
  AttachmentController.destroy
);
router.get(
  "/orders/tracking-number/:tracking_number",
  authMiddleware([]),
  OrderController.findByTrackingNumber
);

/**
 * *****************************************
 * Authorized Route for Super Admin only
 * *****************************************
 */
router.post(
  "/categories",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CategoryController.store
);
router.put(
  "/categories/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CategoryController.update
);
router.delete(
  "/categories/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CategoryController.destroy
);
router.post(
  "/types",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TypeController.store
);
router.put(
  "/types/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TypeController.update
);
router.delete(
  "/types/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TypeController.destroy
);
router.post(
  "/delivery-times",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  DeliveryTimeController.store
);
router.put(
  "/delivery-times/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  DeliveryTimeController.update
);
router.delete(
  "/delivery-times/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  DeliveryTimeController.destroy
);
router.post(
  "/coupons",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CouponController.store
);
router.put(
  "/coupons/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CouponController.update
);
router.delete(
  "/coupons/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CouponController.destroy
);
router.post(
  "/tags",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TagController.store
);
router.put(
  "/tags/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TagController.update
);
router.delete(
  "/tags/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TagController.destroy
);
router.delete(
  "/reviews/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  ReviewController.destroy
);
router.delete(
  "/questions/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  QuestionController.destroy
);
router.post(
  "/approve-withdraw",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  WithdrawController.approveWithdraw
);
router.delete(
  "/withdraws/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  WithdrawController.destroy
);
router.get(
  "/withdraws/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  WithdrawController.show
);

router.post(
  "/refund-reasons",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  RefundReasonController.store
);
router.put(
  "/refund-reasons/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  RefundReasonController.update
);
router.delete(
  "/refund-reasons/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  RefundReasonController.destroy
);
router.post(
  "/faqs",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  FaqController.store
);
router.put(
  "/faqs/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  FaqController.update
);
router.delete(
  "/faqs/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  FaqController.destroy
);
router.get(
  "/users",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  UserController.index
);
router.post(
  "/users",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  UserController.store
);
router.post(
  "/users/block-user",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  UserController.banUser
);
router.post(
  "/users/unblock-user",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  UserController.activeUser
);
router.post(
  "/taxes",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TaxController.store
);
router.put(
  "/taxes/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TaxController.update
);
router.delete(
  "/taxes/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TaxController.destroy
);
router.get(
  "/taxes",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TaxController.index
);
router.get(
  "/taxes/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TaxController.show
);
router.post(
  "/attributes",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  AttributeController.store
);
router.put(
  "/attributes/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  AttributeController.update
);
router.delete(
  "/attributes/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  AttributeController.destroy
);
router.put(
  "/shippings/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  ShippingController.update
);
router.post(
  "/settings",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  SettingsController.store
);
router.delete(
  "/shippings/:id",
  authMiddleware([PermissionEnum.STAFF]),
  ShippingController.destroy
);
router.get(
  "/shippings",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  ShippingController.index
);
router.get(
  "/shippings/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  ShippingController.show
);
router.post(
  "/shippings",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  ShippingController.store
);
router.post(
  "/approve-shop",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  ShopController.approveShop
);
router.post(
  "/disapprove-shop",
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  ShopController.disApproveShop
);
/**
 * ******************************************
 * Authorized Route for Staff & Store Owner
 * ******************************************
 */
router.get(
  "/analytics",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  AnalyticsController.analytics
);
router.post(
  "/products",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.store
);
router.put(
  "/products/:id",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.update
);
router.delete(
  "/products/:id",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.destroy
);
router.put(
  "/orders/:id",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  OrderController.update
);
router.delete(
  "/orders/:id",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  OrderController.destroy
);
router.get(
  "/withdraws",
  authMiddleware([PermissionEnum.SUPER_ADMIN, PermissionEnum.STORE_OWNER]),
  WithdrawController.index
);
router.post(
  "/withdraws",
  authMiddleware([PermissionEnum.SUPER_ADMIN, PermissionEnum.STORE_OWNER]),
  WithdrawController.store
);
router.put(
  "/withdraws/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN, PermissionEnum.STORE_OWNER]),
  WithdrawController.update
);
router.put(
  "/refunds/:id",
  authMiddleware([PermissionEnum.SUPER_ADMIN, PermissionEnum.STORE_OWNER]),
  RefundsController.update
);

/**
 * *****************************************
 * Authorized Route for Store owner Only
 * *****************************************
 */
router.post(
  "/shops",
  authMiddleware([PermissionEnum.STORE_OWNER]),
  ShopController.store
);

// ADD more
router.get(
  "/withdraws",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  StoreNoticeController.index
);
router.get(
  "/top-rate-product",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.popularProducts
);
router.get(
  "/low-stock-products",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.popularProducts
);
router.get(
  "/category-wise-product",
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  AnalyticsController.categoryWiseProduct
);
export default router;
