import express from "express";
import { upload } from "../config/multer.js";
import productsModel from "../models/product.model.js";
const router = express.Router();

// La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort:
        sort === "asc"
          ? { price: 1 }
          : sort === "desc"
          ? { price: -1 }
          : undefined,
    };

    const filter = query
      ? { $or: [{ category: query }, { availability: query }] }
      : {};

    const result = await productsModel.paginate(filter, options);

    const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } =
      result;

    const prevLink = hasPrevPage
      ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`
      : null;
    const nextLink = hasNextPage
      ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`
      : null;

    const response = {
      status: "success",
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page: result.page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// La ruta GET /:pid deberá traer sólo el producto con el id proporcionado

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsModel.findById(pid);
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

    if (req.files.length > 0) {
      thumbnails = req.files.map((file) => file.filename);
    }

    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields" });
    }
    const newProduct = {
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    };
    await productsModel.create(newProduct);
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
    await productsModel.findByIdAndUpdate(pid, req.body);

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
    await productsModel.deleteOne({ _id: pid });
    res.status(200).json({ status: "success", message: "Product deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

export default router;
