import prisma from "../config/prisma.js";
import { sendOrderStatusEmail } from "../services/email.service.js";

export const getAgentProfile = async (req, res) => {
  try {
    const agent = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        agentProfile: {
          include: {
            currentZone: true
          }
        }
      }
    });

    if (!agent) {
      return res.status(404).json({ success: false, message: "Agent profile not found." });
    }

    return res.status(200).json({ success: true, data: agent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const updateAgentProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, vehicleNumber, licenseNumber } = req.body;

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        phone
      }
    });

    await prisma.agentProfile.update({
      where: { userId: req.user.id },
      data: {
        vehicleNumber,
        licenseNumber
      }
    });

    const updated = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        agentProfile: {
          include: {
            currentZone: true
          }
        }
      }
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const updateAgentAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const updatedProfile = await prisma.agentProfile.update({
      where: { userId: req.user.id },
      data: {
        availability: Boolean(availability)
      }
    });

    return res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getAgentOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { assignedAgentId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        pickupZone: true,
        dropZone: true,
        trackingHistory: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getAgentOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: Number(req.params.id),
        assignedAgentId: req.user.id
      },
      include: {
        customer: true,
        pickupZone: true,
        dropZone: true,
        trackingHistory: {
          orderBy: { createdAt: "desc" },
          include: {
            updatedBy: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or not assigned to you." });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const updateAgentOrderStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const orderId = Number(req.params.id);

    // Verify order ownership
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        assignedAgentId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or not assigned to you." });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    // Create tracking history log
    await prisma.trackingHistory.create({
      data: {
        orderId,
        status,
        updatedById: req.user.id,
        remarks: remarks || `Driver updated status to ${status}`
      }
    });

    // Create notification for Customer
    await prisma.notification.create({
      data: {
        userId: order.customerId,
        orderId,
        type: "SMS",
        message: `Status update for order ${order.orderNumber}: Now ${status}. (${remarks || "Driver transit status update."})`
      }
    });

    // Create notification for Agent
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        orderId,
        type: "SMS",
        message: `You successfully updated ${order.orderNumber} to ${status}.`
      }
    });

    // Trigger email notification
    sendOrderStatusEmail(orderId, status, remarks || `Driver updated status to ${status}`).catch(err => console.error("Email dispatch failed:", err));

    const io = req.app.get("io");
    if (io) {
      io.emit("order:status", { orderId: updatedOrder.id, status: updatedOrder.status });
    }

    return res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getAgentNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
