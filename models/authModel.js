const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6, select: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "editor", "user"],
    default: "user",
    set: (v) => v.toLowerCase(),
  },
  permissions: {
    type: [String],
    enum: ["delete Product", "update Order", "add Product", "inactive Product"],
    default: [],
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//
userSchema.methodsgenerateOTP = function () {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  this.otp = otp;
  this.otpExpiresAt = expiresAt;
  return otp;
};

module.exports = mongoose.model("User", userSchema);
