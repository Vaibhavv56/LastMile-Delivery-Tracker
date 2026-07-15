import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    estimateOrderCharges,
    assignAgent,
    updateOrderStatus
} from "../controllers/order.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("ADMIN", "CUSTOMER"), createOrder);
router.post("/estimate", authorize("ADMIN", "CUSTOMER"), estimateOrderCharges);

router.get("/", authorize("ADMIN", "CUSTOMER"), getAllOrders);
router.get("/:id", authorize("ADMIN", "CUSTOMER"), getOrderById);

router.patch(
    "/:id/assign-agent",
    authorize("ADMIN"),
    assignAgent
);

router.patch(
    "/:id/status",
    authorize("ADMIN"),
    updateOrderStatus
);

export default router;