import express from "express";
import vendorController from "../controllers/vendor.controller.js";

const router = express.Router();

router.get("/", vendorController.getAllVendors);

export default router;
