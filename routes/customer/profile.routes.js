import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  createProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
} from "../../controllers/customer/profile.controller.js";

const router = express.Router();

router.post("/", protect, createProfile);
router.get("/", protect, getMyProfile);
router.put("/", protect, updateProfile);
router.delete("/", protect, deleteProfile);

export default router;
