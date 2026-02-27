import express from "express";
import upload from "../../middleware/upload.middleware.js";
import { submitKYC, getMyKYC } from "../../controllers/vendorKyc.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getMyKYC);

router.post(
  "/submit",
  protect,
  upload.fields([
    { name: "identityFront" },
    { name: "identityBack" },
    { name: "businessProof" },
    { name: "bankProof" },
    { name: "addressProof" }
  ]),
  submitKYC
);

export default router;