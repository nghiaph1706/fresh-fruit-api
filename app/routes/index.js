// routes/index.js
import express from "express";
import * as UserController from "../controllers/UserController.js";
import * as AuthorController from "../controllers/AuthorController.js";
import * as ManufacturerController from "../controllers/ManufacturerController.js";
import * as ProductController from "../controllers/ProductController.js";
import * as StoreNoticeController from "../controllers/StoreNoticeController.js";
import * as TypeController from "../controllers/TypeController.js";
import * as CategoryController from "../controllers/CategoryController.js";
import * as DeliveryTimeController from "../controllers/DeliveryTimeController.js";
import PermissionEnum from "../config/enum/Permission.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Public routes
router.post("/token", UserController.token);
router.post("/register", UserController.register);
router.post("/logout", UserController.logout);
router.post("/forget-password", UserController.forgetPassword);
router.post("/verify-forget-password-token", UserController.verifyForgetPasswordToken);
router.post("/reset-password", UserController.resetPassword);
router.post("/contact-us", UserController.contactAdmin);
router.post("/subscribe-to-newsletter", UserController.subscribeToNewsletter);
router.get("/top-authors", AuthorController.topAuthor);
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

export default router;
