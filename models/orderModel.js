const e = require("express");
const mongoose = require("mongoose");
const { create } = require("./cartModel");

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: String,
  address: String,
  city: String,
  district: String,
  landmark: String,
  paymentMethod: String,
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: String,
      name: String,
      title: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
