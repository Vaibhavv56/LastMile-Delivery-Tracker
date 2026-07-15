import express from "express";

import {
    createZone,
    getAllZones,
    getZoneById,
    updateZone,
    deleteZone
} from "../controllers/zone.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("ADMIN"));

router.post("/", createZone);

router.get("/", getAllZones);

router.get("/:id", getZoneById);

router.put("/:id", updateZone);

router.delete("/:id", deleteZone);

export default router;