import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js"; // 🔥 YAHI SAHI IMPORT HAI

// IMPORT
import authRoutes from "./routes/auth.routes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello World !");
});

// ✅ ROUTES
app.use("/api/auth", authRoutes);



// ✅ DB CONNECT & SYNC
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected & synced");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
