// TODAVIA NO FUNCIONA NI EL DELETE NI EL PUT

import express from "express";
import { cartModel } from "../models/carts.model.js";

const router = express.Router();

// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid).populate("products.product");
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    res.status(200).json({ status: "success", data: cart.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (product) => product.product.toString() !== pid
    );

    await cart.save();

    res
      .status(200)
      .json({ status: "success", message: "Product deleted from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos.
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ status: "error", message: "Products must be an array" });
    }

    const cart = await cartModel.findByIdAndUpdate(
      cid,
      { products },
      { new: true }
    );

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be a positive number",
      });
    }

    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    if (!cart.products || cart.products.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product._id.toString() === pid
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({ status: "success", data: cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// DELETE api/carts/:cid deberá eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartModel.findById(cid);

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    cart.products = [];

    await cart.save();

    res
      .status(200)
      .json({ status: "success", message: "All products deleted from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

export default router;
