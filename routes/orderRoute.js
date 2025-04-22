const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const authMiddleware = require("../middleware/authMiddleware");

//
router.post("/", authMiddleware, orderController.createOrder);
router.get("/my-orders", authMiddleware, orderController.getUserOrders);
//
router.get("/all", orderController.getAllOrdersForAdmin);

//
router.get("/:id", authMiddleware, orderController.getOrderById);
router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);
router.get("/:id/status", authMiddleware, orderController.updateOrderStatus);

module.exports = router;
