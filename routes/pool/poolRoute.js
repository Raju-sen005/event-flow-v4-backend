import express from "express";
import { vendorLogin, 
     createEvent, 
     getEvents, 
     updateEventStatus, 
     getEventsByType
     ,getAllEvents,
     getEventById,
     createOrder,
     verifyPayment,
     getBookings,
     eventInventory,
     analytics
 } from "../../controllers/pool.controller.js";
import {protect} from "../../middleware/auth.middleware.js";
const router = express.Router();

router.post("/vendor-login", vendorLogin);
router.post("/create-event", protect,createEvent);
router.get("/get-event", getEvents);
router.put("/events/:id/status", updateEventStatus);
router.get("/events/:type", getEventsByType);
router.get("/get-all-events", getAllEvents);
router.get("/event-by-id/:id", getEventById);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/get-bookings",  getBookings);
router.get("/event-inventory", eventInventory)
router.get("/analytics", analytics)

export default router;