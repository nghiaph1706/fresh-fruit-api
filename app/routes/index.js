// routes/index.js
import express from "express";
import * as UserController from "../controllers/UserController.js";
import * as AuthorController from "../controllers/AuthorController.js";

const router = express.Router();

// Public routes
router.post("/token", UserController.token);
router.post("/contact-us", UserController.contactAdmin);
router.get("/top-authors", AuthorController.topAuthor);
export default router;
