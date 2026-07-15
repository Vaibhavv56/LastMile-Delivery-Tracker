import prisma from "../config/prisma.js";

export const dashboard = async (req, res) => {

    try {

        const [
            totalOrders,
            pendingOrders,
            deliveredOrders,
            failedOrders,
            totalCustomers,
            totalAgents
        ] = await Promise.all([

            prisma.order.count(),

            prisma.order.count({
                where: {
                    status: "PENDING"
                }
            }),

            prisma.order.count({
                where: {
                    status: "DELIVERED"
                }
            }),

            prisma.order.count({
                where: {
                    status: "FAILED"
                }
            }),

            prisma.user.count({
                where: {
                    role: "CUSTOMER"
                }
            }),

            prisma.user.count({
                where: {
                    role: "AGENT"
                }
            })

        ]);

        res.json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                failedOrders,
                totalCustomers,
                totalAgents
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};