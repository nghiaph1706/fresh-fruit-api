// routes/index.js
import express from "express";
import * as UserController from "../controllers/UserController.js";
import * as AuthorController from "../controllers/AuthorController.js";
import * as ManufacturerController from "../controllers/ManufacturerController.js";

const router = express.Router();

// Public routes
router.post("/token", UserController.token);
router.post("/contact-us", UserController.contactAdmin);
router.get("/top-authors", AuthorController.topAuthor);
router.get("/top-manufacturers", ManufacturerController.topManufacturer);
export default router;
