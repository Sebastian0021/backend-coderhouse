import express from "express";
import { readFile, writeFile } from "../utils/fs.js";
import { upload } from "../config/multer.js";
const router = express.Router();

// La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await readFile("src/mock/products.json");

    if (limit) {
      const limitedProducts = products.slice(0, limit);
      return res.status(200).json({ status: "success", data: limitedProducts });
    }

    res.status(200).json({ status: "success", data: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// La ruta GET /:pid deberá traer sólo el producto con el id proporcionado

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await readFile("src/mock/products.json");
    const product = products.find((product) => product.id === pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// La ruta raíz POST / deberá agregar un nuevo producto

router.post("/", upload.array("thumbnails"), async (req, res) => {
  try {
    let thumbnails = [];
    console.log(req.files);

    if (req.files.length > 0) {
      thumbnails = req.files.map((file) => file.filename);
    }

    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }
    const products = await readFile("src/mock/products.json");
    const newProduct = {
      id: crypto.randomUUID(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    };
    products.push(newProduct);
    await writeFile("src/mock/products.json", products);
    res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.

router.put("/:pid", upload.array("thumbnails"), async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, code, price, stock, category, status } =
      req.body;
    const products = await readFile("src/mock/products.json");
    const productIndex = products.findIndex((product) => product.id === pid);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    const product = products[productIndex];
    let thumbnails = product.thumbnails;
    if (req.files.length > 0) {
      thumbnails = req.files.map((file) => file.filename);
    }
    products[productIndex] = {
      ...product,
      title: title || product.title,
      description: description || product.description,
      code: code || product.code,
      price: price || product.price,
      status: status !== undefined ? status : product.status,
      stock: stock || product.stock,
      category: category || product.category,
      thumbnails,
    };
    await writeFile("src/mock/products.json", products);
    res.status(200).json({ status: "success", data: products[productIndex] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// La ruta DELETE /:pid deberá eliminar el producto con el id proporcionado.

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await readFile("src/mock/products.json");
    const productIndex = products.findIndex((product) => product.id === pid);
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    products.splice(productIndex, 1);
    await writeFile("src/mock/products.json", products);
    res.status(200).json({ status: "success", message: "Product deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

export default router;
