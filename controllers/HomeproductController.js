const Homeproduct = require("../models/productModel.js");

const getAllProducts = async (req, res) => {
  try {
    const products = await Homeproduct.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Homeproduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
//
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Manual validation
    if (!title || !description || !price || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Homeproduct({
      title,
      description,
      price,
      category,
      image,
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};
//
const toggleProductVisibility = async (req, res) => {
  try {
    const { isActive } = req.body;

    const updatedProduct = await Homeproduct.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product visibility:", error);
    res.status(500).json({ error: "Failed to update product visibility" });
  }
};
// //
// const updateProduct = async (req, res) => {
//   try {
//     const updatedProduct = await Homeproduct.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     res.status(400).json({ message: "Error updating product", error });
//   }
// };
//
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Homeproduct.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  toggleProductVisibility,
  // updateProduct,
  deleteProduct,
};
