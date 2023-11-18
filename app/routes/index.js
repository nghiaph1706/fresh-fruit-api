// routes/index.js
import express from "express";
import * as UserController from "../controllers/UserController.js";
import * as AuthorController from "../controllers/AuthorController.js";
import * as ManufacturerController from "../controllers/ManufacturerController.js";
import * as ProductController from "../controllers/ProductController.js";

const router = express.Router();

// Public routes
router.post("/token", UserController.token);
router.post("/register", UserController.register);
router.post("/logout", UserController.logout);
router.post("/forget-password", UserController.forgetPassword);
router.post("/verify-forget-password-token", UserController.verifyForgetPasswordToken);
router.post("/contact-us", UserController.contactAdmin);
router.get("/top-authors", AuthorController.topAuthor);
router.get("/top-manufacturers", ManufacturerController.topManufacturer);
router.get("/popular-products", ProductController.popularProducts);
export default router;
