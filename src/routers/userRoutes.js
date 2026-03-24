import express from "express";
import upload from "./../middleware/multer.js";
import {
  loginUser,
  logOut,
  registerUser,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const userRoute = express.Router();

userRoute.post("/create-user", upload.single("image"), registerUser);
userRoute.post("/log-in", loginUser);
userRoute.post("/log-out", logOut);
userRoute.post("/update-user", upload.single("image"), protect, updateProfile);
export default userRoute;
