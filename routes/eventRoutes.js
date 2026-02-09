import express from "express";
import { createEvent,getMyEvents,getEventById } from "../controllers/eventController.js";
import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect,createEvent);
router.get("/", protect,getMyEvents);
router.get("/:id", protect,getEventById);
export default router;
