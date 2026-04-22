import express from "express";
import {
  getInvitations,
  deleteInvitation,
  sendInvitation,
} from "../controllers/invitation.controller.js";

const router = express.Router();


// ✅ GET all
router.get("/", getInvitations);

// ✅ DELETE
router.delete("/:id", deleteInvitation);

// ✅ SEND
router.post("/send/:id", sendInvitation);

export default router;