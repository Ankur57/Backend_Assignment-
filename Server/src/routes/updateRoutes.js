import express from "express";
import {
  createUpdateRequest,
  approveUpdate,
  rejectUpdate,
  getRequests
} from "../controller/updateController.js";

import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createUpdateRequest);
router.get("/", protect, getRequests);

router.post("/approve/:id", protect, adminOnly, approveUpdate);
router.post("/reject/:id", protect, adminOnly, rejectUpdate);

export default router;