import express from "express";
import {
  sendMessage,
  getMessagesByBid,
  getVendorChats
} from "../controllers/messageController.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/chats", protect, getVendorChats);
router.get("/:bidId", protect, getMessagesByBid);

export default router;