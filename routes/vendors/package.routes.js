import express from "express";
import {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
  togglePackageStatus
} from "../../controllers/vendors/package.controller.js";

const router = express.Router();

router.post("/", createPackage);
router.get("/", getPackages);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);
router.patch("/:id/status", togglePackageStatus);

export default router;
