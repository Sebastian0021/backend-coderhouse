import { Router } from "express";
import { readFile } from "../utils/fs.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await readFile("src/mock/products.json");

  res.render("home", { title: "Home", products });
});

export default router;
