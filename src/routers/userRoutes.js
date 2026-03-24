import express from "express";
import upload from "./../middleware/multer.js";
import { loginUser, registerUser } from "../controllers/userController.js";
const userRoute = express.Router();

userRoute.post("/create-user", upload.single("image"), registerUser);
userRoute.post("/log-in", loginUser);
export default userRoute;
