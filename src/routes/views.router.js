import { Router } from "express";
import productModel from "../models/product.model.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await productModel.find();

  res.render("home", {
    title: "Home",
    products: products.map((p) => p.toObject()),
  });
});

export default router;
