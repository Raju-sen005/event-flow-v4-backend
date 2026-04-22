import express from "express";
import {
  addGuest,
  getGuestsByEvent,
  updateGuest,
  deleteGuest,
  sendInvitation,
  uploadGuestsCSV
} from "../controllers/guest.controller.js";

const router = express.Router();

router.post("/", addGuest);                     // ➕ Add guest
router.post("/bulk", uploadGuestsCSV); // 🔥 ADD THIS
router.post("/send-invitation", sendInvitation);
router.get("/event/:eventId", getGuestsByEvent); // 📋 List by event
router.put("/:id", updateGuest);                // ✏️ Update
router.delete("/:id", deleteGuest);              // ❌ Delete
export default router;
