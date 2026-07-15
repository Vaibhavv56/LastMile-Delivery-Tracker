import {
    createOrderService,
    getAllOrdersService,
    getOrderByIdService,
    estimateOrderChargesService,
    assignAgentService,
    updateOrderStatusService
} from "../services/order.service.js";

export const createOrder = async (req, res) => {

    try {

        const order = await createOrderService(
            req.body,
            req.user.id
        );

        const io = req.app.get("io");
        if (io) {
            io.emit("order:created", order);
        }

        res.status(201).json({

            success: true,

            message: "Order created successfully.",

            data: order

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

export const getAllOrders = async (req, res) => {

    try {

        const orders = await getAllOrdersService(req.query);

        res.json({

            success: true,

            data: orders

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const getOrderById = async (req, res) => {

    try {

        const order = await getOrderByIdService(Number(req.params.id));

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        res.json({

            success: true,

            data: order

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

export const assignAgent = async (req, res) => {

    try {

        const order = await assignAgentService(

            Number(req.params.id),

            req.body.agentId,

            req.user.id

        );

        const io = req.app.get("io");
        if (io) {
            io.emit("order:status", { orderId: order.id, status: order.status, assignedAgentId: order.assignedAgentId });
        }

        res.json({

            success: true,

            message: "Agent assigned successfully.",

            data: order

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};


export const updateOrderStatus = async (req, res) => {

    try {

        const order = await updateOrderStatusService(

            Number(req.params.id),

            req.body.status,

            req.body.remarks,

            req.user.id

        );

        const io = req.app.get("io");
        if (io) {
            io.emit("order:status", { orderId: order.id, status: order.status });
        }

        res.json({

            success: true,

            message: "Order status updated.",

            data: order

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

export const estimateOrderCharges = async (req, res) => {
    try {
        const estimate = await estimateOrderChargesService(req.body);
        res.status(200).json({
            success: true,
            data: estimate
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};