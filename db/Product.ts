import mongoose from "mongoose";

const ProductShema = new mongoose.Schema({
  product_id: Number,
  a_href: String,
  category_slug: String,
  website: String,
});

export const ProductDB = mongoose.model("products", ProductShema);
