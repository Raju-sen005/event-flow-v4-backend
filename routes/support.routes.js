import express from "express";

import {
 createTicket,
 getVendorTickets,
 getTicketDetail,
 replyTicket
} from "../controllers/support.controller.js";

const router = express.Router();

router.post("/tickets", createTicket);

router.get("/tickets/vendor/:vendorId", getVendorTickets);

router.get("/tickets/:ticketId", getTicketDetail);

router.post("/tickets/:ticketId/reply", replyTicket);

export default router;