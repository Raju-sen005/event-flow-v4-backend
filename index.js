import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js"; // 🔥 YAHI SAHI IMPORT HAI
import https from "https";
import fs from "fs";

import "./models/index.js";
// IMPORT
import authRoutes from "./routes/auth.routes.js";
import customerProfileRoutes from "./routes/customer/profile.routes.js";
import vendorProfileRoutes from "./routes/vendors/profile.routes.js";
import vendorPortfolioRoutes from "./routes/vendors/portfolio.routes.js";
import admin from "./routes/admin/adminRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import vendorPackageRoutes from "./routes/vendors/package.routes.js";
import guestRoutes from "./routes/guestRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import vendorKYCRoutes from "./routes/vendors/kyc.routes.js";
import adminKYCRoutes from "./routes/admin/kyc.admin.routes.js";
import questionRoutes from "./routes/questionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import paymentRoutes from "./routes/payment.routes.js";
import supportRoutes from "./routes/support.routes.js";
import vendorAvailability from "./routes/vendorAvailabilityRoutes.js"
import vendorSettingsRoutes from "./routes/vendorSettingsRoutes.js";
import poolRoutes from "./routes/pool/poolRoute.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json("API is working..!");
});

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/customer/profile", customerProfileRoutes);
app.use("/api/vendor/profile", vendorProfileRoutes);
app.use("/api/portfolio", vendorPortfolioRoutes);
app.use("/api/admin", admin);
app.use("/api/events", eventRoutes);
app.use("/api/vendor/packages", vendorPackageRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/vendor/kyc", vendorKYCRoutes);
app.use("/api/admin/kyc", adminKYCRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/support",supportRoutes);
app.use("/api/vendor/availability", vendorAvailability)
app.use("/api/vendor/settings", vendorSettingsRoutes);

app.use("/api/pool", poolRoutes);

const server = https.createServer({
  key: fs.readFileSync("/home/gogatherhub/public_html/ssl/privkey.pem"),
  cert: fs.readFileSync("/home/gogatherhub/public_html/ssl/cert.pem"),
  ca: fs.readFileSync("/home/gogatherhub/public_html/ssl/bundle.pem")
}, app);

// ✅ DB CONNECT & SYNC
sequelize
  .sync()
  .then(() => {
    console.log("Database connected & synced");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

server.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`HTTPS Server running on port ${process.env.PORT}`);
});
