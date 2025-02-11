import express from "express";
import { readFile, writeFile } from "../utils/fs.js";
const router = express.Router();

// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const carts = await readFile("src/mock/carts.json");
    const cart = carts.find((cart) => cart.id === cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    res.status(200).json({ status: "success", data: cart.products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const carts = await readFile("src/mock/carts.json");
    const cart = carts.find((cart) => cart.id === cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (product) => product.id === pid
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ id: pid, quantity });
    }
    await writeFile("src/mock/carts.json", carts);
    res.status(200).json({ status: "success", data: cart.products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

export default router;
