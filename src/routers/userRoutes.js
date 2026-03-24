import express from "express";
import upload from "./../middleware/multer.js";
import {
  loginUser,
  logOut,
  registerUser,
} from "../controllers/userController.js";
const userRoute = express.Router();

userRoute.post("/create-user", upload.single("image"), registerUser);
userRoute.post("/log-in", loginUser);
userRoute.post("/log-out", logOut);
export default userRoute;
