import express from "express";

import {
    createRate,
    getAllRates,
    getRateById,
    updateRate,
    deleteRate
} from "../controllers/rate.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("ADMIN"), createRate);

router.get("/", authorize("ADMIN", "CUSTOMER"), getAllRates);

router.get("/:id", authorize("ADMIN", "CUSTOMER"), getRateById);

router.put("/:id", authorize("ADMIN"), updateRate);

router.delete("/:id", authorize("ADMIN"), deleteRate);

export default router;