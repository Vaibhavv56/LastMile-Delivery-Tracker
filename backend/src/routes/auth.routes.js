import express from "express";
import { login, activateAgent, changePassword } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/activate-agent", activateAgent);
router.post("/change-password", protect, changePassword);

export default router;