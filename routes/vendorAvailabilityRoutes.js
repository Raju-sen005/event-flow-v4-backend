import express from "express";
import {
 getVendorAvailability,
 blockDate,
 unblockDate,
 saveVendorSettings
} from "../controllers/vendorAvailabilityController.js";

const router = express.Router();

router.get("/:vendorId", getVendorAvailability);

router.post("/block-date", blockDate);

router.post("/unblock-date", unblockDate);

router.post("/settings", saveVendorSettings);

export default router;