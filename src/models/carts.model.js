import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    product: mongoose.Schema.Types.ObjectId,
    ref: "products",
    quantity: Number,
  },
});

export const cartModel = mongoose.model("carts", cartSchema);
