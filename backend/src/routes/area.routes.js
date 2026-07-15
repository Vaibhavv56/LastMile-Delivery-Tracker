import express from "express";

import {
    createArea,
    getAllAreas,
    getAreaById,
    updateArea,
    deleteArea
} from "../controllers/area.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("ADMIN"), createArea);

router.get("/", authorize("ADMIN", "CUSTOMER"), getAllAreas);

router.get("/:id", authorize("ADMIN", "CUSTOMER"), getAreaById);

router.put("/:id", authorize("ADMIN"), updateArea);

router.delete("/:id", authorize("ADMIN"), deleteArea);

export default router;