import express from "express";
import upload from "../middleware/multer.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { createMenu } from "../controllers/menuController.js";

const menuRouter = express.Router();

menuRouter.post(
  "/add-menu",
  upload.single("image"),
  protect,
  adminOnly,
  createMenu,
);
export default menuRouter;
