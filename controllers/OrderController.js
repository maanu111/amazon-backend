const Order = require("../models/orderModel.js");

const createOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      city,
      district,
      landmark,
      paymentMethod,
      products,
    } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !address ||
      !city ||
      !district ||
      !landmark ||
      !paymentMethod ||
      !products ||
      !Array.isArray(products)
    ) {
      return res.status(400).json({
        message: "Invalid order data! Ensure all required fields are provided.",
      });
    }

    const newOrder = new Order({ ...req.body, userId: req.user._id });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const getOrders = async (req, res) => {
//   try {
//     let orders;

//     if (req.user.role === "admin") {
//       orders = await Order.find();
//     } else {
//       orders = await Order.find({ userId: req.user._id });
//     }

//     res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Failed to fetch orders" });
//   }
// };

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};
//
const getAllOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  // getOrders,
  getUserOrders,
  getAllOrdersForAdmin,
  getOrderById,
  updateOrderStatus,
};
