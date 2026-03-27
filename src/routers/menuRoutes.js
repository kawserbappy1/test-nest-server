import express from "express";
import upload from "../middleware/multer.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { createMenu, getAllMenu } from "../controllers/menuController.js";

const menuRouter = express.Router();

menuRouter.post(
  "/add-menu",
  upload.single("image"),
  protect,
  adminOnly,
  createMenu,
);
menuRouter.get("/all-menu-backend", protect, adminOnly, getAllMenu);
menuRouter.get("/all-menu-frontend", protect, adminOnly);
export default menuRouter;
