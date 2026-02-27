import express from "express";
import {
  createPortfolio,
  getMyPortfolios,
  updatePortfolio,
  deletePortfolio,
  togglePortfolioStatus,
} from "../../controllers/vendors/portfolio.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authorizeVendor } from "../../middleware/authorizeRoles.js";

const router = express.Router();

router.use(protect, authorizeVendor);

router.post("/", createPortfolio);
router.get("/", getMyPortfolios);
router.put("/:id", updatePortfolio);
router.patch("/:id/status", togglePortfolioStatus);
router.delete("/:id", deletePortfolio);

export default router;
