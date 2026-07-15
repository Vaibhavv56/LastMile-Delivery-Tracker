import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardHome from "./modules/DashboardHome";
import OrdersModule from "./modules/OrdersModule";
import CustomersModule from "./modules/CustomersModule";
import AgentsModule from "./modules/AgentsModule";
import ZonesModule from "./modules/ZonesModule";
import RatesModule from "./modules/RatesModule";
import CODChargesModule from "./modules/CODChargesModule";
import FailedDeliveriesModule from "./modules/FailedDeliveriesModule";
import NotificationsModule from "./modules/NotificationsModule";
import SettingsModule from "./modules/SettingsModule";
import AgentDashboard from "./modules/AgentDashboard";
import CustomerDashboard from "./modules/CustomerDashboard";
import { api } from "./utils/api";
import { TrendingUp, Key } from "lucide-react";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  
  // App UI state
  const [activeModule, setActiveModule] = useState(() => {
    const u = localStorage.getItem("user");
    if (u) {
      const parsed = JSON.parse(u);
      if (parsed.role === "AGENT") return "agent-dashboard";
      if (parsed.role === "CUSTOMER") return "customer-dashboard";
    }
    return "dashboard";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [notifications, setNotifications] = useState([]);

  // Modal sharing states
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [prefilledCustomerId, setPrefilledCustomerId] = useState("");

  // Login credentials state
  const [loginEmail, setLoginEmail] = useState("admin@gmail.com");
  const [loginPassword, setLoginPassword] = useState("admin");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Agent Activation state
  const [authMode, setAuthMode] = useState("login"); // login, activate
  const [activateEmail, setActivateEmail] = useState("");
  const [activatePassword, setActivatePassword] = useState("");
  const [activateConfirm, setActivateConfirm] = useState("");
  const [activateSuccess, setActivateSuccess] = useState("");

  useEffect(() => {
    // Sync dark mode style attribute on document element
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === "AGENT") {
          setActiveModule("agent-dashboard");
        } else if (parsed.role === "CUSTOMER") {
          setActiveModule("customer-dashboard");
        } else {
          setActiveModule("dashboard");
        }
      }
    }
  }, [token]);

  useEffect(() => {
    if (token && user && user.role === "ADMIN") {
      loadGlobalAlerts();
      const interval = setInterval(loadGlobalAlerts, 30000);
      return () => clearInterval(interval);
    }
  }, [token, user]);

  async function loadGlobalAlerts() {
    try {
      const [ordersRes, customersRes] = await Promise.all([
        api.getOrders({ limit: 100 }),
        api.getCustomers()
      ]);

      const alerts = [];

      if (ordersRes.success) {
        ordersRes.data.orders.forEach((o) => {
          // 1. Order booked alert
          alerts.push({
            id: `order-booked-${o.id}`,
            message: `New consignment booked: #${o.orderNumber} for ₹${Number(o.totalAmount).toFixed(2)}.`,
            isRead: false,
            createdAt: new Date(o.createdAt),
          });

          // 2. Order delivered alert
          if (o.status === "DELIVERED") {
            const deliveryTrack = o.trackingHistory?.find(t => t.status === "DELIVERED");
            const deliveredAt = deliveryTrack ? new Date(deliveryTrack.createdAt) : new Date(o.updatedAt);
            alerts.push({
              id: `order-delivered-${o.id}`,
              message: `Consignment #${o.orderNumber} has been successfully delivered.`,
              isRead: false,
              createdAt: deliveredAt,
            });
          }
        });
      }

      if (customersRes.success) {
        customersRes.data.forEach((c) => {
          // 3. Customer added alert
          alerts.push({
            id: `customer-added-${c.id}`,
            message: `New customer registered: ${c.firstName} ${c.lastName} (${c.email}).`,
            isRead: false,
            createdAt: new Date(c.createdAt),
          });
        });
      }

      // Sort all alerts by date descending
      alerts.sort((a, b) => b.createdAt - a.createdAt);
      setNotifications(alerts.slice(0, 10));
    } catch (err) {
      console.error("Error loading global alerts:", err);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await api.login(loginEmail, loginPassword);
      if (res.success && (res.user.role === "ADMIN" || res.user.role === "AGENT" || res.user.role === "CUSTOMER")) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        if (res.user.role === "AGENT") {
          setActiveModule("agent-dashboard");
        } else if (res.user.role === "CUSTOMER") {
          setActiveModule("customer-dashboard");
        } else {
          setActiveModule("dashboard");
        }
      } else {
        setLoginError("Access denied. Authorized authorization role is required.");
      }
    } catch (err) {
      setLoginError(err.message || "Invalid credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleActivateAgent = async (e) => {
    e.preventDefault();
    setLoginError("");
    setActivateSuccess("");

    if (activatePassword !== activateConfirm) {
      setLoginError("Passwords do not match.");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await api.activateAgent(activateEmail, activatePassword);
      if (res.success) {
        setActivateSuccess(res.message);
        setActivateEmail("");
        setActivatePassword("");
        setActivateConfirm("");
        setTimeout(() => {
          setAuthMode("login");
          setLoginEmail(activateEmail);
          setActivateSuccess("");
        }, 3000);
      }
    } catch (err) {
      setLoginError(err.message || "Activation failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setActiveModule("dashboard");
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleUpdateProfile = (updatedDetails) => {
    const updatedUser = { ...user, ...updatedDetails };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Cross-module routing actions
  const openCreateOrderOnBehalf = (customerId) => {
    setPrefilledCustomerId(customerId);
    setCreateOrderOpen(true);
    setActiveModule("orders");
  };

  const openAssignOrder = (order) => {
    // Directly opens order detailed actions
    setActiveModule("orders");
  };

  const viewFailedDeliveries = () => {
    setActiveModule("failed");
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header" style={{ marginBottom: "24px" }}>
            <div className="sidebar-logo" style={{ border: "none", padding: "0", justifyContent: "center", marginBottom: "16px" }}>
              <TrendingUp size={32} className="text-primary" />
              <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                LastMile Logistics
              </span>
            </div>
            <h2 className="auth-title" style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {authMode === "login" ? "Log In" : "Set Agent Password"}
            </h2>
          </div>

          {loginError && <div className="auth-error" style={{ marginBottom: "16px" }}>{loginError}</div>}
          {activateSuccess && <div className="auth-success" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--success, #10b981)", color: "var(--success, #10b981)", padding: "10px", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", marginBottom: "16px", fontWeight: "600", textAlign: "center" }}>{activateSuccess}</div>}

          {authMode === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", height: "42px", borderRadius: "var(--radius-sm)" }} disabled={loginLoading}>
                {loginLoading ? "Log In..." : "Log In"}
              </button>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode("activate"); setLoginError(""); }}
                  style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                >
                  First time log in? Set agent password here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleActivateAgent}>
              <div className="form-group">
                <label className="form-label">Registered Agent Email</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  placeholder="e.g. driver@domain.com"
                  value={activateEmail}
                  onChange={(e) => setActivateEmail(e.target.value)}
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Create New Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  placeholder="Minimum 6 characters"
                  value={activatePassword}
                  onChange={(e) => setActivatePassword(e.target.value)}
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  value={activateConfirm}
                  onChange={(e) => setActivateConfirm(e.target.value)}
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", height: "42px", borderRadius: "var(--radius-sm)" }} disabled={loginLoading}>
                {loginLoading ? "Saving password..." : "Set Password"}
              </button>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setLoginError(""); }}
                  style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                >
                  Return to Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (user?.role === "AGENT") {
    return (
      <AgentDashboard
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  if (user?.role === "CUSTOMER") {
    return (
      <CustomerDashboard
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return (
          <DashboardHome
            setActiveModule={setActiveModule}
            onCreateOrder={() => setCreateOrderOpen(true)}
            onAddAgent={() => {
              setActiveModule("agents");
            }}
            onCreateZone={() => {
              setActiveModule("zones");
            }}
            onAddRate={() => {
              setActiveModule("rates");
            }}
            onViewFailed={viewFailedDeliveries}
          />
        );
      case "orders":
        return (
          <OrdersModule
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            createFormOpen={createOrderOpen}
            setCreateFormOpen={setCreateOrderOpen}
          />
        );
      case "customers":
        return (
          <CustomersModule
            setActiveModule={setActiveModule}
            onOpenCreateOrderOnBehalf={openCreateOrderOnBehalf}
          />
        );
      case "agents":
        return (
          <AgentsModule
            setActiveModule={setActiveModule}
            onOpenAssignOrderToAgent={openAssignOrder}
          />
        );
      case "zones":
        return <ZonesModule />;
      case "rates":
        return <RatesModule />;
      case "cod":
        return <CODChargesModule />;
      case "failed":
        return (
          <FailedDeliveriesModule
            onOpenAssignOrderToAgent={openAssignOrder}
          />
        );
      case "notifications":
        return <NotificationsModule />;
      case "settings":
        return <SettingsModule user={user} onUpdateUser={handleUpdateProfile} />;
      default:
        return (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h3>Module In Progress</h3>
            <p>Work on {activeModule} is ongoing.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div className="main-wrapper">
        {/* Top Header */}
        <Header
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          user={user}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={notifications}
          markAllNotificationsRead={markAllRead}
        />

        {/* Scrollable Page Body */}
        <main className="page-container">{renderActiveModule()}</main>
      </div>
    </div>
  );
}
