// routes/questionRoutes.js

import express from "express";
import { askQuestion } from "../controllers/questionController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/ask", protect, askQuestion);

export default router;