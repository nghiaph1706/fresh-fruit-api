// routes/index.js
import express from 'express';
import PermissionEnum from '../config/enum/Permission.js';
import * as AbusiveReportController from '../controllers/AbusiveReportController.js';
import * as AddressController from '../controllers/AddressController.js';
import * as AttributeController from '../controllers/AttributeController.js';
import * as AuthorController from '../controllers/AuthorController.js';
import * as CategoryController from '../controllers/CategoryController.js';
import * as CheckoutController from '../controllers/CheckoutController.js';
import * as CouponController from '../controllers/CouponController.js';
import * as DeliveryTimeController from '../controllers/DeliveryTimeController.js';
import * as FeedbackController from '../controllers/FeedbackController.js';
import * as LanguageController from '../controllers/LanguageController.js';
import * as ManufacturerController from '../controllers/ManufacturerController.js';
import * as OrderController from '../controllers/OrderController.js';
import * as ProductController from '../controllers/ProductController.js';
import * as QuestionController from '../controllers/QuestionController.js';
import * as ResourceController from '../controllers/ResourceController.js';
import * as ReviewController from '../controllers/ReviewController.js';
import * as SettingsController from '../controllers/SettingsController.js';
import * as ShopController from '../controllers/ShopController.js';
import * as StoreNoticeController from '../controllers/StoreNoticeController.js';
import * as TagController from '../controllers/TagController.js';
import * as TypeController from '../controllers/TypeController.js';
import * as UserController from '../controllers/UserController.js';
import * as WishlistController from '../controllers/WishlistController.js';
import * as RefundsController from '../controllers/RefundController.js';
import * as AnalyticsController from '../controllers/AnalyticsController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Public routes
router.post('/token', UserController.token);
router.post('/register', UserController.register);
router.post('/logout', UserController.logout);
router.post('/forget-password', UserController.forgetPassword);
router.post(
  '/verify-forget-password-token',
  UserController.verifyForgetPasswordToken,
);
router.post('/reset-password', UserController.resetPassword);
router.post('/contact-us', UserController.contactAdmin);
router.post('/subscribe-to-newsletter', UserController.subscribeToNewsletter);
router.get('/top-authors', AuthorController.topAuthor);
router.get('/top-manufacturers', ManufacturerController.topManufacturer);
router.get('/popular-products', ProductController.popularProducts);
router.get('/store-notices', authMiddleware([]), StoreNoticeController.index);
router.get('/products', ProductController.index);
router.get('/products/:slug', ProductController.show);
router.get('/types', TypeController.index);
router.get('/types/:slug', TypeController.show);
router.get('/categories', CategoryController.index);
router.get('/categories/:slug', CategoryController.show);
router.get('/delivery-times', DeliveryTimeController.index);
router.get('/delivery-times/:slug', DeliveryTimeController.show);
router.get('/languages', LanguageController.index);
router.get('/languages/:slug', LanguageController.show);
router.get('/tags', TagController.index);
router.get('/tags/:slug', TagController.show);
router.get('/resources', ResourceController.index);
router.get('/resources/:slug', ResourceController.show);
router.get('/coupons', CouponController.index);
router.get('/coupons/:slug', CouponController.show);
router.post('/coupons/verify', CouponController.verify);
router.get('/attributes', AttributeController.index);
router.get('/attributes/:slug', AttributeController.show);
router.get('/shops', ShopController.index);
router.get('/shops/:slug', authMiddleware([]), ShopController.show);
router.get('/settings', SettingsController.index);
router.get('/reviews', ReviewController.index);
router.get('/reviews/:slug', ReviewController.show);
router.get('/questions', QuestionController.index);
router.get('/questions/:slug', QuestionController.show);
router.get('/feedbacks', FeedbackController.index);
router.get('/feedbacks/:slug', authMiddleware([]), FeedbackController.show);
router.post(
  '/orders/checkout/verify',
  authMiddleware([]),
  CheckoutController.verify,
);
router.get('/orders', authMiddleware([]), OrderController.index);
router.get('/orders/:slug', authMiddleware([]), OrderController.show);
router.post('/orders', authMiddleware([]), OrderController.store);

/**
 * ******************************************
 * Authorized Route for Customers only
 * ******************************************
 */
router.post(
  '/wishlists/toggle',
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.toggle,
);
router.get(
  '/wishlists',
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.index,
);
router.post(
  '/wishlists/store',
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.store,
);
router.delete(
  '/wishlists/:id',
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.destroy,
);
router.get(
  '/wishlists/in_wishlist/:product_id',
  authMiddleware([PermissionEnum.CUSTOMER]),
  WishlistController.in_wishlist,
);
router.get(
  '/my-wishlists',
  authMiddleware([PermissionEnum.CUSTOMER]),
  ProductController.myWishlists,
);
router.get('/me', authMiddleware([PermissionEnum.CUSTOMER]), UserController.me);
router.put(
  '/users/:id',
  authMiddleware([PermissionEnum.CUSTOMER]),
  UserController.update,
);

router.post(
  '/reviews',
  authMiddleware([PermissionEnum.CUSTOMER]),
  ReviewController.store,
);
router.put(
  '/reviews/:id',
  authMiddleware([PermissionEnum.CUSTOMER]),
  ReviewController.update,
);
router.get(
  '/followed-shops-popular-products',
  authMiddleware([PermissionEnum.CUSTOMER]),
  ShopController.followedShopsPopularProducts,
);
router.get(
  '/followed-shops',
  authMiddleware([PermissionEnum.CUSTOMER]),
  ShopController.userFollowedShops,
);
router.get(
  '/follow-shop',
  authMiddleware([PermissionEnum.CUSTOMER]),
  ShopController.userFollowedShop,
);
router.post(
  '/follow-shop',
  authMiddleware([PermissionEnum.CUSTOMER]),
  ShopController.handleFollowShop,
);
router.get(
  '/my-questions',
  authMiddleware([PermissionEnum.CUSTOMER]),
  QuestionController.myQuestions,
);
router.post(
  '/questions',
  authMiddleware([PermissionEnum.CUSTOMER]),
  QuestionController.store,
);
router.post(
  '/feedbacks',
  authMiddleware([PermissionEnum.CUSTOMER]),
  FeedbackController.store,
);
router.post(
  '/abusive_reports',
  authMiddleware([PermissionEnum.CUSTOMER]),
  AbusiveReportController.store,
);
router.get(
  '/my-reports',
  authMiddleware([PermissionEnum.CUSTOMER]),
  AbusiveReportController.myReports,
);
router.post(
  '/update-contact',
  authMiddleware([PermissionEnum.CUSTOMER]),
  UserController.updateContact,
);
router.delete(
  '/address/:id',
  authMiddleware([PermissionEnum.CUSTOMER]),
  AddressController.destroy,
);
router.get(
  '/refunds',
  authMiddleware([PermissionEnum.CUSTOMER]),
  RefundsController.index,
);
router.get(
  '/refunds/:slug',
  authMiddleware([PermissionEnum.CUSTOMER]),
  RefundsController.show,
);
router.post(
  '/refunds',
  authMiddleware([PermissionEnum.CUSTOMER]),
  RefundsController.store,
);

/**
 * ******************************************
 * Authorized Route for Staff & Store Owner
 * ******************************************
 */
router.get(
  '/analytics',
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  AnalyticsController.analytics,
);

/**
 * *****************************************
 * Authorized Route for Super Admin only
 * *****************************************
 */
router.post(
  '/categories',
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CategoryController.store,
);
router.put(
  '/categories/:id',
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CategoryController.update,
);
router.delete(
  '/categories/:id',
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  CategoryController.destroy,
);
router.post(
  '/types',
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TypeController.store,
);
router.put(
  '/types/:id',
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TypeController.update,
);
router.delete(
  '/types/:id',
  authMiddleware([PermissionEnum.SUPER_ADMIN]),
  TypeController.destroy,
);
/**
 * ******************************************
 * Authorized Route for Staff & Store Owner
 * ******************************************
 */
router.post(
  '/products',
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.store,
);
router.put(
  '/products/:id',
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.update,
);
router.delete(
  '/products/:id',
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.destroy,
);

// ADD more
router.get(
  '/withdraws',
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  StoreNoticeController.index,
);
router.get(
  '/top-rate-product',
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.popularProducts,
);
router.get(
  '/low-stock-products',
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  ProductController.popularProducts,
);
router.get(
  '/category-wise-product',
  authMiddleware([PermissionEnum.STAFF, PermissionEnum.STORE_OWNER]),
  StoreNoticeController.index,
);
export default router;
