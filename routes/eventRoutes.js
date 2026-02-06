import express from "express";
import { createEvent,getMyEvents,getEventById } from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getMyEvents);
router.get("/:id", getEventById);
export default router;
