import express from "express";
import {
  addGuest,
  getGuestsByEvent,
  updateGuest,
  deleteGuest,
} from "../controllers/guest.controller.js";

const router = express.Router();

router.post("/", addGuest);                     // ➕ Add guest
router.get("/event/:eventId", getGuestsByEvent); // 📋 List by event
router.put("/:id", updateGuest);                // ✏️ Update
router.delete("/:id", deleteGuest);              // ❌ Delete

export default router;
