import express from "express";
import {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
  togglePackageStatus
} from "../../controllers/vendors/package.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

// ✅ CREATE (with upload)
router.post(
  "/",
  protect,
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "video", maxCount: 1 }
  ]),
  createPackage
);

// ✅ GET
router.get("/", protect, getPackages);

// ✅ UPDATE (with upload)
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "video", maxCount: 1 }
  ]),
  updatePackage
);

// ✅ DELETE
router.delete("/:id", protect, deletePackage);

// ✅ TOGGLE STATUS
router.patch("/:id/status", protect, togglePackageStatus);

export default router;