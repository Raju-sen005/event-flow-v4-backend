import express from "express";
import {
  getVendorPayments,
  confirmCashPayment,
  requestWithdraw
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/vendor", protect, getVendorPayments);

router.post("/confirm-cash/:id", protect, confirmCashPayment);

router.post("/withdraw", protect, requestWithdraw);

export default router;