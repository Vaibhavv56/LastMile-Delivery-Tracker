import express from "express";

import { dashboard } from "../controllers/admin.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    authorize("ADMIN"),
    dashboard
);

export default router;