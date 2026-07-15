import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`WebSocket client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`WebSocket client disconnected: ${socket.id}`);
  });
});

// Export io so we can emit events from other modules
export { io };

// Real-time Agent Movement Simulator
const orderProgress = {};

setInterval(async () => {
  try {
    const activeOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["IN_TRANSIT", "OUT_FOR_DELIVERY"]
        },
        assignedAgentId: {
          not: null
        }
      },
      include: {
        assignedAgent: {
          include: {
            agentProfile: true
          }
        }
      }
    });

    for (const order of activeOrders) {
      const agentProfile = order.assignedAgent?.agentProfile;
      if (!agentProfile) continue;

      // Find pickup and drop areas to get coordinates
      const pickupArea = await prisma.area.findFirst({
        where: { pincode: order.pickupPincode }
      });
      const dropArea = await prisma.area.findFirst({
        where: { pincode: order.dropPincode }
      });

      const startLat = pickupArea?.latitude || 18.5204;
      const startLng = pickupArea?.longitude || 73.8567;
      const endLat = dropArea?.latitude || 18.5808;
      const endLng = dropArea?.longitude || 73.7898;

      if (orderProgress[order.id] === undefined) {
        orderProgress[order.id] = 0.0;
      } else {
        orderProgress[order.id] = (orderProgress[order.id] + 0.05) % 1.0;
      }
      const t = orderProgress[order.id];

      const currentLat = startLat + (endLat - startLat) * t;
      const currentLng = startLng + (endLng - startLng) * t;

      await prisma.agentLocation.upsert({
        where: { agentId: agentProfile.id },
        update: {
          latitude: currentLat,
          longitude: currentLng,
          lastSeen: new Date()
        },
        create: {
          agentId: agentProfile.id,
          latitude: currentLat,
          longitude: currentLng
        }
      });

      io.emit("agent:location", {
        agentId: order.assignedAgent.id,
        orderId: order.id,
        latitude: currentLat,
        longitude: currentLng
      });
    }
  } catch (err) {
    console.error("Simulation tick error:", err);
  }
}, 4000);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});