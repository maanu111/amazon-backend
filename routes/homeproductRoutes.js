const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  toggleProductVisibility,
  deleteProduct,
} = require("../controllers/HomeproductController.js");
const upload = require("../upload/upload.js");

const router = express.Router();

router.post("/", upload.single("image"), createProduct);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", toggleProductVisibility);
router.delete("/:id", deleteProduct);

module.exports = router;
