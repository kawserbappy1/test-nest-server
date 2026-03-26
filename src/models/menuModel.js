import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    ingredients: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    variants: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tags: [{ type: String }],
    prepTime: {
      type: Number,
      default: 20,
    },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;
