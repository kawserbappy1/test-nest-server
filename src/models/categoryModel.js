import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name required"],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    description: {
      type: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
