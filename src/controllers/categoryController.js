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
