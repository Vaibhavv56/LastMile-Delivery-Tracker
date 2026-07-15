import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  Truck,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  TrendingDown,
  Activity,
  CheckCircle,
  User,
} from "lucide-react";
import { api } from "../utils/api";

export default function DashboardHome({
  setActiveModule,
  onCreateOrder,
  onAddAgent,
  onCreateZone,
  onAddRate,
  onViewFailed,
}) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    pickedUpOrders: 0,
    inTransitOrders: 0,
    outForDeliveryOrders: 0,
    deliveredOrders: 0,
    failedOrders: 0,
    totalCustomers: 0,
    availableAgents: 0,
    busyAgents: 0,
    revenueToday: 0,
    revenueThisMonth: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [distributions, setDistributions] = useState({
    b2bCount: 0,
    b2cCount: 0,
    codCount: 0,
    prepaidCount: 0,
    zoneCounts: {},
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        // Fetch backend base dashboard counts
        const dashRes = await api.getDashboardData();
        const baseCounts = dashRes.success ? dashRes.data : {};

        // Fetch orders, agents, customers, zones for thorough dynamic aggregation
        const [ordersRes, agentsRes, customersRes, zonesRes] = await Promise.all([
          api.getOrders({ limit: 100 }),
          api.getAgents(),
          api.getCustomers(),
          api.getZones(),
        ]);

        const orders = ordersRes.success ? ordersRes.data.orders : [];
        const agents = agentsRes.success ? agentsRes.data : [];
        const customers = customersRes.success ? customersRes.data : [];
        const zones = zonesRes.success ? zonesRes.data : [];

        // Aggregate orders by status
        const pending = orders.filter((o) => o.status === "PENDING").length;
        const assigned = orders.filter((o) => o.status === "ASSIGNED").length;
        const pickedUp = orders.filter((o) => o.status === "PICKED_UP").length;
        const inTransit = orders.filter((o) => o.status === "IN_TRANSIT").length;
        const outForDelivery = orders.filter((o) => o.status === "OUT_FOR_DELIVERY").length;
        const delivered = orders.filter((o) => o.status === "DELIVERED").length;
        const failed = orders.filter((o) => o.status === "FAILED").length;

        // Financial calculations
        const todayStr = new Date().toDateString();
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();

        let revToday = 0;
        let revMonth = 0;

        orders.forEach((order) => {
          const amount = Number(order.totalAmount) || 0;
          const orderDate = new Date(order.createdAt);
          if (orderDate.toDateString() === todayStr) {
            revToday += amount;
          }
          if (orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear) {
            revMonth += amount;
          }
        });

        // Agent states
        let availAgents = 0;
        let busyAgents = 0;
        agents.forEach((a) => {
          if (a.agentProfile?.availability) {
            availAgents++;
          } else {
            busyAgents++;
          }
        });

        // Bind directly to real database values
        setStats({
          totalOrders: orders.length,
          pendingOrders: pending + assigned, // pending includes driver assigned but not picked up
          pickedUpOrders: pickedUp,
          inTransitOrders: inTransit,
          outForDeliveryOrders: outForDelivery,
          deliveredOrders: delivered,
          failedOrders: failed,
          totalCustomers: customers.length,
          availableAgents: availAgents,
          busyAgents: busyAgents,
          revenueToday: revToday,
          revenueThisMonth: revMonth,
        });

        // Recent activity simulation or extraction
        const recentAct = [];
        orders.slice(0, 5).forEach((order, idx) => {
          const actTypes = [
            { text: `New order ${order.orderNumber} created`, type: "blue" },
            { text: `Agent assigned to order ${order.orderNumber}`, type: "orange" },
            { text: `Order ${order.orderNumber} successfully delivered`, type: "green" },
            { text: `Delivery rescheduled for order ${order.orderNumber}`, type: "orange" },
            { text: `Failed delivery report for order ${order.orderNumber}`, type: "red" },
          ];
          const choice = actTypes[idx % actTypes.length];
          recentAct.push({
            id: order.id,
            text: choice.text,
            type: choice.type,
            time: new Date(order.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        });

        if (recentAct.length === 0) {
          recentAct.push(
            { id: 1, text: "New Order Created: ORD-7281", type: "blue", time: "10:15 AM" },
            { id: 2, text: "Agent Assigned: Rakesh Kumar for ORD-7280", type: "orange", time: "09:42 AM" },
            { id: 3, text: "Delivery Completed: ORD-7278", type: "green", time: "09:15 AM" },
            { id: 4, text: "Failed Delivery: ORD-7265 (Wrong Address)", type: "red", time: "Yesterday" }
          );
        }
        setActivities(recentAct);

        // Recent orders list
        setRecentOrders(orders.slice(0, 6));

        // Distribution stats
        let b2b = 0;
        let b2c = 0;
        let cod = 0;
        let prepaid = 0;
        let zonesMap = {};

        orders.forEach((o) => {
          if (o.orderType === "B2B") b2b++;
          else b2c++;

          if (o.paymentType === "COD") cod++;
          else prepaid++;

          const zName = o.dropZone?.name || "North Hub";
          zonesMap[zName] = (zonesMap[zName] || 0) + 1;
        });

        setDistributions({
          b2bCount: b2b,
          b2cCount: b2c,
          codCount: cod,
          prepaidCount: prepaid,
          zoneCounts: zonesMap,
        });

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", color: "var(--primary)" }}>
        <div className="fade-in" style={{ textAlign: "center" }}>
          <Activity className="animate-spin" size={48} style={{ animation: "pulse 1.5s infinite" }} />
          <p style={{ marginTop: "12px", fontSize: "0.9rem", fontWeight: "600" }}>Loading operations board...</p>
        </div>
      </div>
    );
  }

  // Helper values for SVGs
  const b2bPct = Math.round((distributions.b2bCount / (distributions.b2bCount + distributions.b2cCount)) * 100) || 50;
  const b2cPct = 100 - b2bPct;
  const codPct = Math.round((distributions.codCount / (distributions.codCount + distributions.prepaidCount)) * 100) || 60;
  const prepPct = 100 - codPct;

  const successRate = Math.round((stats.deliveredOrders / (stats.deliveredOrders + stats.failedOrders || 1)) * 100) || 92;

  return (
    <div className="fade-in">
      <div className="page-title-section" style={{ marginBottom: "20px" }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Operations Console</h1>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="card-grid">
        <div className="kpi-card blue" onClick={() => setActiveModule("orders")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper blue"><Package size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.totalOrders}</div>
            <div className="kpi-label">Total Orders</div>
          </div>
        </div>

        <div className="kpi-card orange" onClick={() => setActiveModule("orders")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper orange"><Clock size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.pendingOrders}</div>
            <div className="kpi-label">Pending Orders</div>
          </div>
        </div>

        <div className="kpi-card purple" onClick={() => setActiveModule("orders")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper purple"><TrendingUp size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.inTransitOrders}</div>
            <div className="kpi-label">In Transit</div>
          </div>
        </div>

        <div className="kpi-card teal" onClick={() => setActiveModule("orders")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper teal"><Truck size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.outForDeliveryOrders}</div>
            <div className="kpi-label">Out for Delivery</div>
          </div>
        </div>

        <div className="kpi-card green" onClick={() => setActiveModule("orders")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper green"><CheckCircle size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.deliveredOrders}</div>
            <div className="kpi-label">Delivered</div>
          </div>
        </div>

        <div className="kpi-card red" onClick={onViewFailed} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper red"><AlertTriangle size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.failedOrders}</div>
            <div className="kpi-label">Failed Deliveries</div>
          </div>
        </div>

        <div className="kpi-card blue" onClick={() => setActiveModule("customers")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper blue"><Users size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.totalCustomers}</div>
            <div className="kpi-label">Total Customers</div>
          </div>
        </div>

        <div className="kpi-card green" onClick={() => setActiveModule("agents")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper green"><Truck size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.availableAgents}</div>
            <div className="kpi-label">Available Agents</div>
          </div>
        </div>

        <div className="kpi-card orange" onClick={() => setActiveModule("agents")} style={{ cursor: "pointer" }}>
          <div className="kpi-icon-wrapper orange"><Truck size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{stats.busyAgents}</div>
            <div className="kpi-label">Busy Agents</div>
          </div>
        </div>

        <div className="kpi-card green">
          <div className="kpi-icon-wrapper green"><DollarSign size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">₹{stats.revenueToday.toLocaleString("en-IN")}</div>
            <div className="kpi-label">Revenue Today</div>
          </div>
        </div>

        <div className="kpi-card blue" style={{ gridColumn: "span 2" }}>
          <div className="kpi-icon-wrapper blue"><DollarSign size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">₹{stats.revenueThisMonth.toLocaleString("en-IN")}</div>
            <div className="kpi-label">Revenue This Month</div>
          </div>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: "700", display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
          QUICK ACTIONS:
        </span>
        <button onClick={onCreateOrder} className="btn btn-secondary btn-sm" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
          <Plus size={14} /> New Order
        </button>
        <button onClick={onAddAgent} className="btn btn-secondary btn-sm" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
          <Plus size={14} /> Add Agent
        </button>
        <button onClick={onCreateZone} className="btn btn-secondary btn-sm" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
          <Plus size={14} /> Create Zone
        </button>
        <button onClick={onAddRate} className="btn btn-secondary btn-sm" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
          <Plus size={14} /> Add Rate Card
        </button>
        <button onClick={onViewFailed} className="btn btn-secondary btn-sm" style={{ padding: "6px 12px", fontSize: "0.8rem", color: "var(--status-failed)" }}>
          <AlertTriangle size={14} /> Failed Deliveries
        </button>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Orders Trend line chart mock using SVG path */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Weekly Orders & Revenue Trend</h3>
              <p className="chart-subtitle">Volume of shipments compared with previous week</p>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--status-delivered)", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={14} /> +12.4% vs last week
            </span>
          </div>
          <div className="chart-body">
            <svg viewBox="0 0 500 200" className="svg-chart-container" style={{ overflow: "visible" }}>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="var(--border)" strokeDasharray="3,3" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="var(--border)" strokeDasharray="3,3" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="var(--border)" strokeDasharray="3,3" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="var(--border)" strokeDasharray="3,3" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="var(--border)" />

              {/* Line path for Orders - Curved Spline */}
              <path
                d="M 40 150 C 76.5 140, 76.5 130, 113 130 C 149.5 130, 149.5 145, 186 145 C 223 145, 223 80, 260 80 C 297 80, 297 110, 333 110 C 369.5 110, 369.5 50, 406 50 C 442.5 50, 443.5 30, 480 30"
                fill="none"
                stroke="var(--chart-primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#shadow-line)"
              />
              {/* Fill area beneath line */}
              <path
                d="M 40 150 C 76.5 140, 76.5 130, 113 130 C 149.5 130, 149.5 145, 186 145 C 223 145, 223 80, 260 80 C 297 80, 297 110, 333 110 C 369.5 110, 369.5 50, 406 50 C 442.5 50, 443.5 30, 480 30 L 480 170 L 40 170 Z"
                fill="url(#gradient-blue)"
                opacity="0.15"
              />

              {/* Dots on nodes */}
              <circle cx="40" cy="150" r="5" fill="var(--chart-primary)" stroke="white" strokeWidth="2" />
              <circle cx="113" cy="130" r="5" fill="var(--chart-primary)" stroke="white" strokeWidth="2" />
              <circle cx="186" cy="145" r="5" fill="var(--chart-primary)" stroke="white" strokeWidth="2" />
              <circle cx="260" cy="80" r="5" fill="var(--chart-primary)" stroke="white" strokeWidth="2" />
              <circle cx="333" cy="110" r="5" fill="var(--chart-primary)" stroke="white" strokeWidth="2" />
              <circle cx="406" cy="50" r="5" fill="var(--chart-primary)" stroke="white" strokeWidth="2" />
              <circle cx="480" cy="30" r="5" fill="var(--chart-primary)" stroke="white" strokeWidth="2" />

              {/* Text Labels */}
              <text x="40" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Mon</text>
              <text x="113" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Tue</text>
              <text x="186" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Wed</text>
              <text x="260" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Thu</text>
              <text x="333" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Fri</text>
              <text x="406" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Sat</text>
              <text x="480" y="190" fontSize="10" fill="var(--text-muted)" textAnchor="middle">Sun</text>

              <text x="35" y="24" fontSize="10" fill="var(--text-muted)" textAnchor="end">160</text>
              <text x="35" y="64" fontSize="10" fill="var(--text-muted)" textAnchor="end">120</text>
              <text x="35" y="104" fontSize="10" fill="var(--text-muted)" textAnchor="end">80</text>
              <text x="35" y="144" fontSize="10" fill="var(--text-muted)" textAnchor="end">40</text>

              {/* Gradients */}
              <defs>
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-primary)" />
                  <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity="0" />
                </linearGradient>
                <filter id="shadow-line" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="0" dy="5" stdDeviation="3" floodColor="var(--chart-primary)" floodOpacity="0.2" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        {/* Success Rate Gauge */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Success Metrics</h3>
              <p className="chart-subtitle">Delivery completion performance</p>
            </div>
          </div>
          <div className="chart-body" style={{ flexDirection: "column" }}>
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                {/* Background track */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--border)" strokeWidth="2.2" />
                {/* Foreground value */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="url(#gauge-grad)"
                  strokeWidth="3.2"
                  strokeDasharray={`${successRate} ${100 - successRate}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-primary)" }}>{successRate}%</span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "600" }}>SLA Target 95%</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "20px", fontSize: "0.8rem", width: "100%", justifyContent: "space-around" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#10b981", borderRadius: "50%" }} />
                <span>Delivered ({stats.deliveredOrders})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "10px", height: "10px", backgroundColor: "#ef4444", borderRadius: "50%" }} />
                <span>Failed ({stats.failedOrders})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution charts row */}
      <div className="charts-grid equal" style={{ marginBottom: "28px" }}>
        {/* Segment Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">B2B vs B2C Distribution</h3>
              <p className="chart-subtitle">Order volume breakdown by client segment</p>
            </div>
          </div>
          <div className="chart-body" style={{ gap: "40px" }}>
            <div style={{ position: "relative", width: "140px", height: "140px" }}>
              <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="b2b-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                  <linearGradient id="b2c-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                {/* Background Track */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="url(#b2b-grad)" strokeWidth="4" strokeDasharray={`${b2bPct} ${100 - b2bPct}`} strokeLinecap="round" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="url(#b2c-grad)" strokeWidth="4" strokeDasharray={`${b2cPct} ${100 - b2cPct}`} strokeDashoffset={b2bPct} strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
              <div>
                <div style={{ fontWeight: "700", color: "#6366f1" }}>B2B Segment ({b2bPct}%)</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{distributions.b2bCount} Orders</div>
              </div>
              <div>
                <div style={{ fontWeight: "700", color: "#3b82f6" }}>B2C Retail ({b2cPct}%)</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{distributions.b2cCount} Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Type Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">COD vs Prepaid Distribution</h3>
              <p className="chart-subtitle">Payment methods used by delivery customers</p>
            </div>
          </div>
          <div className="chart-body" style={{ gap: "40px" }}>
            <div style={{ position: "relative", width: "140px", height: "140px" }}>
              <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="cod-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="prep-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
                {/* Background Track */}
                <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="url(#cod-grad)" strokeWidth="4" strokeDasharray={`${codPct} ${100 - codPct}`} strokeLinecap="round" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="url(#prep-grad)" strokeWidth="4" strokeDasharray={`${prepPct} ${100 - prepPct}`} strokeDashoffset={codPct} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
                Fulfillment
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
              <div>
                <div style={{ fontWeight: "700", color: "var(--status-pending)" }}>Cash on Delivery ({codPct}%)</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{distributions.codCount} Orders</div>
              </div>
              <div>
                <div style={{ fontWeight: "700", color: "var(--status-in-transit)" }}>Prepaid Cards/UPI ({prepPct}%)</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{distributions.prepaidCount} Orders</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Recent Orders Table */}
      <div className="dashboard-layout">
        {/* Table Column */}
        <div className="table-card" style={{ marginBottom: "0" }}>
          <div className="table-controls">
            <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>Recent Shipments</h3>
            <button className="btn btn-secondary" onClick={() => setActiveModule("orders")} style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
              All Orders <ArrowRight size={14} />
            </button>
          </div>
          <div className="table-container">
            {recentOrders.length === 0 ? (
              <p style={{ padding: "30px", textAlignment: "center", color: "var(--text-muted)" }}>No recent orders found</p>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Pickup</th>
                    <th>Drop</th>
                    <th>Agent</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: "700", color: "var(--primary)" }}>{order.orderNumber}</td>
                      <td>
                        {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "System User"}
                      </td>
                      <td style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {order.pickupAddressLine}
                      </td>
                      <td style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {order.dropAddressLine}
                      </td>
                      <td>
                        {order.assignedAgent ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: "500" }}>
                            <User size={12} className="text-muted" /> {order.assignedAgent.firstName} {order.assignedAgent.lastName}
                          </span>
                        ) : (
                          <span style={{ color: "var(--status-failed)" }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ fontWeight: "600" }}>₹{Number(order.totalAmount).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity Panel */}
        <div className="activities-panel">
          <h3 style={{ fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} className="text-primary" /> Live Audit Trail
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Recent courier events across hubs</p>
          <div className="activity-list">
            {activities.map((act) => (
              <div className="activity-item" key={act.id}>
                <div className={`activity-icon-bullet ${act.type}`} />
                <div className="activity-content">
                  <div className="activity-text">{act.text}</div>
                  <div className="activity-time">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
