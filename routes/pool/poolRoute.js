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
     analytics,
     register,
     updateSettings,
     adminLogin,
     getVendors
 } from "../../controllers/pool.controller.js";
import {protect as authMiddleware} from "../../middleware/auth.middleware.js";
const router = express.Router();

// ADMIN ROUTES
router.post("/admin-login", adminLogin);
router.get("/vendor-list", authMiddleware, getVendors);


// VENDOR ROUTES
router.post("/vendor-login", vendorLogin);
router.post("/vendor-register", register);
router.post("/create-event", authMiddleware,createEvent);
router.get("/get-event", authMiddleware, getEvents);
router.put("/events/:id/status", updateEventStatus);
router.get("/events/:type", getEventsByType);
router.get("/get-all-events", getAllEvents);
router.get("/event-by-id/:id", getEventById);
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/get-bookings", authMiddleware,  getBookings);
router.get("/event-inventory", authMiddleware, eventInventory)
router.get("/analytics", authMiddleware, analytics)
router.post("/update-settings", authMiddleware, updateSettings)

export default router;