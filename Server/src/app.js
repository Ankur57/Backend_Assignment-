import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import updateRoutes from "./routes/updateRoutes.js";

dotenv.config();

const app = express();

// Global variable for mongoose connection promise
let dbConnectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  
  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("MongoDB connected successfully");
    }).catch(err => {
      console.error("MongoDB connection fail:", err);
      dbConnectionPromise = null;
      throw err;
    });
  }
  await dbConnectionPromise;
};

// Start connection immediately in background (useful for local dev and eager load)
if (process.env.MONGO_URI) {
  connectDB().catch(console.error);
}

// Serverless DB connection middleware: ensures DB is connected before handling any requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database connection error" });
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/updates", updateRoutes);

export default app;