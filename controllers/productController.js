// const Product = require("../models/cartModel.js");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const createProduct = async (req, res) => {
//   try {
//     if (Array.isArray(req.body)) {
//       const products = await Product.insertMany(req.body);
//       res.status(201).json(products);
//     } else {
//       const product = new Product(req.body);
//       await product.save();
//       res.status(201).json(product);
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
// //
// const getUserCart = async (req, res) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded._id;
//     console.log("Decoded User ID:", userId);
//     const cart = await Product.findOne({ userId });
//     if (!cart) return res.status(200).json({ products: [] });

//     res.status(200).json(cart);
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ error: "Failed to fetch cart" });
//   }
// };
// //
// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createProduct,
//   getProducts,
//   getUserCart,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// };
