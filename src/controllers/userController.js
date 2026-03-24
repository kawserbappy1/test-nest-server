import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  sendAuthCookies,
} from "../configs/token.js";

// *********** for User *******************
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

//update user
export const updateProfile = async (req, res) => {
  try {
    // 1. catch user id from the middleware function
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { name, password } = req.body;
    // 2. Get user from DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // 3. Update fields
    if (name) user.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    // 4. Image update
    if (req.file) {
      // Delete old image
      if (user.image) {
        const public_id = user.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(public_id);
      }
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      user.image = result.secure_url;
    }
    // 5. Save user
    await user.save();
    // 6. send response to the frontend
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
