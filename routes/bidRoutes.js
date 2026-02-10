import express from "express";
import {
  placeBid,
  getBidsByEvent,
  getMyBids,
  updateBidStatus,
} from "../controllers/bidController.js";
import {protect as authMiddleware} from "../middleware/auth.middleware.js";

const router = express.Router();

// Vendor
router.post("/", authMiddleware, placeBid);
router.get("/my-bids", authMiddleware, getMyBids);

// Customer
router.get(
  "/event/:eventId",
  authMiddleware,
  getBidsByEvent
);
router.patch("/:id/status", authMiddleware, updateBidStatus);

export default router;
