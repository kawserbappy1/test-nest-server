import jwt from "jsonwebtoken";
import { ACCESSTOKEN } from "../secret.js";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
  try {
    const decode = jwt.verify(token, ACCESSTOKEN);
    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized",
    });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};
