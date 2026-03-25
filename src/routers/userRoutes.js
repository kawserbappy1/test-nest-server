import express from "express";
import upload from "./../middleware/multer.js";
import {
  loginUser,
  logOut,
  registerUser,
  updateProfile,
  userProfile,
} from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
const userRoute = express.Router();

userRoute.post("/create-user", upload.single("image"), registerUser);
userRoute.post("/log-in", loginUser);
userRoute.post("/log-out", logOut);
userRoute.patch("/update-user", upload.single("image"), protect, updateProfile);
userRoute.get("/user-profile", protect, userProfile);
userRoute.get("/get-all-user", protect, adminOnly, userProfile);
export default userRoute;
