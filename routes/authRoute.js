const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware.js");
const {
  registerUser,
  getUsers,
  getUserById,
  deleteUser,
  loginUser,
  updateUser,
} = require("../controllers/authController.js");

router.post("/register", registerUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);
router.put("/:id", auth, updateUser);

module.exports = router;
