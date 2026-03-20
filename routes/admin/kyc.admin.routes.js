import express from "express";
import { verifyKYC, rejectKYC } from "../../controllers/admin/adminKyc.controller.js";
import adminAuth from "../../middleware/admin.middleware.js";

const router = express.Router();

router.post("/verify/:vendorId", adminAuth, verifyKYC);
router.post("/reject/:vendorId", adminAuth, rejectKYC);

export default router;