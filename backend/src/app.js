import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import zoneRoutes from "./routes/zone.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import areaRoutes from "./routes/area.routes.js";
import rateRoutes from "./routes/rate.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import orderRoutes from "./routes/order.routes.js";
import agentDashboardRoutes from "./routes/agentDashboard.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api/admin", adminRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/agents",agentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/agent-dashboard", agentDashboardRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Last Mile Delivery Tracker API"
    });
});

app.get("/api/config", (req, res) => {
    res.json({
        success: true,
        geoapifyApiKey: process.env.GEOAPIFY_API_KEY || ""
    });
});

app.use("/api/auth", authRoutes);

export default app;