import express from "express";
import vendorController from "../controllers/vendor.controller.js";

const router = express.Router();

router.get("/", vendorController.getAllVendors);
router.get("/:id", vendorController.getVendorById);
router.get("/event/:eventId", vendorController.getVendorsByEvent);
export default router;
