import express from "express";
import {
  register,
  login,
  // registerV2,
  // loginV2,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/register-v2", registerV2);
// router.post("/login-v2", loginV2);

export default router;
