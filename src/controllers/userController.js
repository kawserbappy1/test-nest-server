import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  sendAuthCookies,
} from "../configs/token.js";
//registerUser
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 1 checked empty field
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill up required field",
      });
    }
    //2. check exists user
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    //3. image upload
    const result = await cloudinary.uploader.upload(req.file.path);
    //4. hashedpassword
    const hashedPassword = await bcrypt.hash(password, 10);
    //5. user create
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: result.secure_url,
    });
    //6. send data to frontend
    res.status(201).json({
      success: true,
      message: "User is created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.log("This is register user error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

// loginUser
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. prevent empty field
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill-up required field",
      });
    }

    //2. find user
    const user = await User.findOne({ email });

    //3. user is not valid
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    //4. compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({
        success: false,
        message: "input valid User email or password",
      });
    }

    //5. send cookies throug login
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    sendAuthCookies(res, accessToken, refreshToken);
    //6. send data to frontend
    return res.status(201).json({
      success: true,
      message: "Login Successfull !",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log("This is register user error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

//logout user
export const logOut = async (req, res) => {
  try {
    const cookieOption = {
      httpOnly: true,
      sameSite: "strict",
    };
    res.clearCookie("accessToken", cookieOption);
    res.clearCookie("refreshToken", cookieOption);

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout failed:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
