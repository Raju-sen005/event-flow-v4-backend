// routes/vendor/profile.routes.js
import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";

import {
  createVendorProfile,
  getMyVendorProfile,
  updateVendorProfile,
  deleteVendorProfile,
} from "../../controllers/vendors/profile.controller.js";

const router = express.Router();

router.use(
  protect,
  authorizeRoles("vendor", "event-planner", "freelance-planner")
);

router.post("/", createVendorProfile);
router.get("/", getMyVendorProfile);
router.put("/", updateVendorProfile);
router.delete("/", deleteVendorProfile);

export default router;
