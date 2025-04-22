const express = require("express");
const router = express.Router();

const {
  getUserCart,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");

router.post("/", createProduct);

router.get("/", getUserCart);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
