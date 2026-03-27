import express from "express";
import multer from "multer";

import {
  placeBid,
  getBidsByEvent,
  getMyBids,
  getBidById,
  updateBidStatus,
  updateBid,
  deleteBid,
  getTotalBidsByEvent,
} from "../controllers/bidController.js";

import { protect as authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

// ➕ Vendor place bid
router.post("/", authMiddleware, upload.array("portfolioSamples"), placeBid);
// 📋 Vendor - my bids
router.get("/my-bids", authMiddleware, getMyBids);

// 📋 Customer - bids for event
router.get("/event/:eventId", authMiddleware, getBidsByEvent);

// 📄 Bid detail
router.get("/:id", authMiddleware, getBidById);

// ✅ Accept / Reject bid
router.patch("/:id/status", authMiddleware, updateBidStatus);

router.put("/:id", authMiddleware, upload.array("portfolioSamples"), updateBid);

router.delete("/:id", authMiddleware, deleteBid);

router.get("/event/:eventId/total-bids", authMiddleware, getTotalBidsByEvent);

export default router;
