import express from "express";

import {
  getVendorSettings,
  saveNotificationSettings,
  updatePassword,
  savePreferences
} from "../controllers/vendorSettingsController.js";

const router = express.Router();

router.get("/:vendorId", getVendorSettings);

router.post("/notifications", saveNotificationSettings);

router.post("/password", updatePassword);

router.post("/preferences", savePreferences);

export default router;