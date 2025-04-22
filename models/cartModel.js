const mongoose = require("mongoose");

//
const ProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      title: String,
      description: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Product", ProductSchema);
