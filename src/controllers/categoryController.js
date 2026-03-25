import Category from "../models/categoryModel.js";
import { v2 as claudinary } from "cloudinary";
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }
    const existCategory = await Category.findOne({ name });
    if (existCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }
    const result = await claudinary.uploader.upload(req.file.path);
    const category = await Category.create({
      name,
      description,
      image: result.secure_url,
    });
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: {
        id: category._id,
        name: category.name,
        description: category.description,
        image: category.image,
        isActive: category.isActive,
      },
    });
  } catch (error) {
    console.log("An occure an category");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getAllCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const query = {
      name: { $regex: search, $options: "i" },
    };
    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    res.status(200).json({
      success: true,
      categories,
      total,
      totalPage: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log("An occure to get category");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCategoryWithoutPagination = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.log("An occure to get category");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
