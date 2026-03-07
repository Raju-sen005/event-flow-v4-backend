import express from "express";
import {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
  togglePackageStatus
} from "../../controllers/vendors/package.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", protect, createPackage);
router.get("/", protect, getPackages);
router.put("/:id", protect, updatePackage);
router.delete("/:id", protect, deletePackage);
router.patch("/:id/status", protect, togglePackageStatus);

export default router;
