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
// import upload from "../../middleware/profileUpload.js";
import { uploadProfileImages } from "../../middleware/profileUpload.js";


const router = express.Router();

router.use(
  protect,
//   router.use((req, res, next) => {
//   // console.log("USER:", req.user);
//   next();
// }),
  authorizeRoles("vendor", "event-planner", "freelance-planner"),
);
// console.log("HIT PROFILE ROUTE");
// router.post("/", upload.single("profileImage"), createVendorProfile);
router.post("/", protect, uploadProfileImages, createVendorProfile);
// router.post("/", createVendorProfile);
router.get("/", getMyVendorProfile);
router.put("/", protect, uploadProfileImages, updateVendorProfile);
// router.put("/", upload.single("profileImage"), updateVendorProfile);
// router.put("/", updateVendorProfile);
router.delete("/", deleteVendorProfile);

export default router;
