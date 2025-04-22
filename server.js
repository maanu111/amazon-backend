const express = require("express");
const cors = require("cors");
const connectDB = require("./db.js");
const dotenv = require("dotenv");
const homeproductRoutes = require("./routes/homeproductRoutes.js");
const authRoute = require("./routes/authRoute.js");
const orderRoute = require("./routes/orderRoute.js");
const upload = require("./upload/upload.js");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/homeproducts", homeproductRoutes);
app.use("/api/orders", orderRoute);
app.use("/api/users", authRoute);
// app.use("/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
