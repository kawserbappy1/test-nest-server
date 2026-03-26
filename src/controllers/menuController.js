import mongoose from "mongoose";
import Category from "../models/categoryModel.js";
import { v2 as cloudinary } from "cloudinary";
import Menu from "../models/menuModel.js";
//create menu
export const createMenu = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      ingredients,
      isAvailable,
      isActive,
      isFeatured,
      variants,
      discount,
      tags,
      prepTime,
      rating,
      numReviews,
    } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Fill up required field",
      });
    }
    const checkedCategory = await Category.findById(category);
    if (!checkedCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }
    const parsedVarients = [];
    if (req.body.variants) {
      try {
        parsedVarients = JSON.parse(req.body.variants);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variants format",
        });
      }
    }
    const parsedTags = [];
    if (req.body.tags) {
      parsedTags = JSON.parse(parsedTags);
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    const menu = await Menu.create({
      name,
      description,
      price,
      category,
      ingredients,
      isAvailable,
      isActive,
      isFeatured,
      variants: parsedVarients,
      discount,
      tags: parsedTags,
      prepTime,
      rating,
      numReviews,
      image: result.secure_url,
    });
    res.status(201).json({
      success: true,
      message: "Menu created successfully",
      data: menu,
    });
  } catch (error) {
    console.log("An error to create Menu");
    res.status(500).json({
      success: false,
      message: "Server error while creating menu",
      error: error.message,
    });
  }
};

//get all menu
export const getAllMenu = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const query = {
      name: { $regex: search, $options: "i" },
    };
    const total = await Menu.countDocuments(query);
    const menus = await Menu.find(query)
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .limit(limit)
      .skip(skip)
      .lean();
    res.status(200).json({
      success: true,
      message: "Menu fetched successfully",
      menus,
      totalPage: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log("An error to create Menu");
    res.status(500).json({
      success: false,
      message: "Server error while fetching menu",
      error: error.message,
    });
  }
};
