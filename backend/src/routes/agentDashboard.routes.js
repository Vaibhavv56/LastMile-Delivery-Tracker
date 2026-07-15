import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getAgentProfile,
  updateAgentProfile,
  updateAgentAvailability,
  getAgentOrders,
  getAgentOrderById,
  updateAgentOrderStatus,
  getAgentNotifications
} from "../controllers/agentDashboard.controller.js";

const router = express.Router();

// Apply auth middlewares
router.use(protect);
router.use(authorize("AGENT"));

// Routes
router.get("/profile", getAgentProfile);
router.put("/profile", updateAgentProfile);
router.patch("/availability", updateAgentAvailability);
router.get("/orders", getAgentOrders);
router.get("/orders/:id", getAgentOrderById);
router.patch("/orders/:id/status", updateAgentOrderStatus);
router.get("/notifications", getAgentNotifications);

export default router;
