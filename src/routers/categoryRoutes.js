import express from "express";
import upload from "../middleware/multer.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {
  addCategory,
  getAllCategory,
  getAllCategoryWithoutPagination,
  updateCategory,
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
categoryRoute.get(
  "/get-category-without-pagination",
  protect,
  adminOnly,
  getAllCategoryWithoutPagination,
);

categoryRoute.patch(
  "/update-category/:id",
  upload.single("image"),
  protect,
  adminOnly,
  updateCategory,
);

export default categoryRoute;
