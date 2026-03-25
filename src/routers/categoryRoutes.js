import express from "express";
import upload from "../middleware/multer.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {
  addCategory,
  getAllCategory,
} from "../controllers/categoryController.js";
const categoryRoute = express.Router();

categoryRoute.post(
  "/add-category",
  upload.single("image"),
  protect,
  adminOnly,
  addCategory,
);
categoryRoute.get("/get-category", protect, adminOnly, getAllCategory);

export default categoryRoute;
