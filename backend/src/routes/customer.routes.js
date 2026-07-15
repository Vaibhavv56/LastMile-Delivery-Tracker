import express from "express";

import {

    createCustomer,

    getAllCustomers,

    getCustomerById,

    updateCustomer,

    deleteCustomer

} from "../controllers/customer.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", authorize("ADMIN"), createCustomer);

router.get("/", authorize("ADMIN"), getAllCustomers);

router.get("/:id", authorize("ADMIN", "CUSTOMER"), getCustomerById);

router.put("/:id", authorize("ADMIN", "CUSTOMER"), updateCustomer);

router.delete("/:id", authorize("ADMIN"), deleteCustomer);

export default router;