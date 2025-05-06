const express = require("express");
const router = express.Router();
const { auth, isSuperAdmin } = require("../middleware/authMiddleware.js");
const {
  registerUser,
  getUsers,
  getUserById,
  deleteUser,
  loginUser,
  loginSuperAdmin,
  updateUser,
  sendOtp,
  verifyOtp,
  requestResetLink,
  resetPassword,
} = require("../controllers/authController.js");

router.post("/register", registerUser);
router.get("/", auth, isSuperAdmin, getUsers);
router.get("/:id", auth, isSuperAdmin, getUserById);
router.delete("/:id", auth, isSuperAdmin, deleteUser);
router.post("/requestresetlink", requestResetLink);
router.post("/resetpassword", resetPassword);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/login", loginUser);
router.post("/login/superadmin", loginSuperAdmin);
router.put("/:id", auth, isSuperAdmin, updateUser);

module.exports = router;
