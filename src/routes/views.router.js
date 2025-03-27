import { Router } from "express";
import { readFile } from "../utils/fs.js";
const router = Router();
import { io } from "../app.js";
import { writeFile } from "../utils/fs.js";
import crypto from "crypto";

router.get("/", async (req, res) => {
  const products = await readFile("src/mock/products.json");

  res.render("home", { title: "Home", products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await readFile("src/mock/products.json");
  io.emit("products", products);
  res.render("realTimeProducts", { title: "RealTimeProducts", products });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("addProduct", async (product) => {
      const products = await readFile("src/mock/products.json");
      const newProduct = {
        id: crypto.randomUUID(),
        ...product,
        status: true,
      };
      products.push(newProduct);
      await writeFile("src/mock/products.json", products);
      io.emit("products", products);
    });

    socket.on("deleteProduct", async (productId) => {
      const products = await readFile("src/mock/products.json");
      const productIndex = products.findIndex(
        (product) => product.id === productId
      );
      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await writeFile("src/mock/products.json", products);
        io.emit("products", products);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
});

export default router;
