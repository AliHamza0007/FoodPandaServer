import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    slug: { type: String, lowercase: true, required: true },
    description: { type: String, required: true },
    inStock: { type: String, required: true },
    photo: { data: Buffer, contentType: String },
    category: { type: mongoose.ObjectId, ref: "category", required: true },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("products", ProductSchema);
