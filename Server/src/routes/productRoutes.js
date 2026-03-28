import express from "express";
import { createProduct, getProducts } from "../controller/productController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", protect, getProducts);

export default router;