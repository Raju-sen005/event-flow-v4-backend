import express from "express";
import {
  createOffer,
  getNegotiation,
  acceptOffer,
  counterOffer,
  finalizeVendor,
} from "../controllers/vendors/negotiationController.js";

const router = express.Router();
router.post("/offer", createOffer);
router.get("/:bidId", getNegotiation);
router.post("/accept/:offerId", acceptOffer);
router.post("/counter", counterOffer);
router.post("/finalize", finalizeVendor);

export default router;