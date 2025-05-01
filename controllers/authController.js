const User = require("../models/authModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
//
const emailValidation = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
};
//
const registerUser = async (req, res) => {
  const { name, email, password, cPassword, role } = req.body;

  if (!name || !email || !password || !cPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!emailValidation(email)) {
    return res.status(400).json({ message: "Enter a valid email" });
  }
  if (password !== cPassword) {
    return res.status(400).json({ message: "Passwords must be the same" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }
  //

  //

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const newUser = new User({ name, email, password, role });
  try {
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//
const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `Amazon <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
//
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpiresAt)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "4h" }
  );

  res.status(200).json({
    message: "OTP verified",
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    },
  });
};
//
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, permissions } = req.body;

  const isSuperAdmin = req.user.role?.toLowerCase() === "superadmin";

  if (!isSuperAdmin) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const updateData = {};

  if (name) updateData.name = name;
  if (email) updateData.email = email;

  if (isSuperAdmin && Array.isArray(permissions)) {
    const validPermissions = [
      "update Order",
      "add Product",
      "inactive Product",
      "delete Product",
    ];
    const isValid = permissions.every((p) => validPermissions.includes(p));
    if (!isValid) {
      return res
        .status(400)
        .json({ message: "Invalid permission(s) provided" });
    }
    updateData.permissions = permissions;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email);

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    console.log("User not found:", email);
    return res.status(401).json({ message: "Invalid email or password" });
  }

  console.log("Stored hashed password:", user.password);
  console.log("Entered password:", password);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);

  if (!isMatch) {
    return res
      .status(401)
      .json({ message: "Invalid email or password (wrong password)" });
  }

  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    SECRET_KEY,
    {
      expiresIn: "4h",
    }
  );
  const permissions = user.permissions || [];

  res.json({
    message: "Login successful",
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    },
  });
};

module.exports = {
  registerUser,
  sendOtp,
  verifyOtp,
  getUsers,
  getUserById,
  deleteUser,
  loginUser,
  updateUser,
};
