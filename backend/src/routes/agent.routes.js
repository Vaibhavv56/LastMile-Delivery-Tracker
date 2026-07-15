import express from "express";

import {

createAgent,

getAllAgents,

getAgentById,

updateAgent,

deleteAgent,

updateAvailability

} from "../controllers/agent.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.use(authorize("ADMIN"));

router.post("/",createAgent);

router.get("/",getAllAgents);

router.get("/:id",getAgentById);

router.put("/:id",updateAgent);

router.delete("/:id",deleteAgent);

router.patch("/:id/availability",updateAvailability);

export default router;