import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Truck,
  Phone,
  Calendar,
  LogOut,
  Moon,
  Sun,
  Navigation,
  Eye,
  Activity,
  Award,
  ChevronRight,
  ChevronLeft,
  Search,
  Bell,
  CheckSquare,
  TrendingUp,
  FileText,
  Menu
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../utils/api";

const ZONE_COORDS = {
  Hinjewadi: [18.59, 73.74],
  Wakad: [18.59, 73.79],
  "Pimpri-Chinchwad": [18.63, 73.79],
  Bhosari: [18.63, 73.84],
  Bavdhan: [18.53, 73.74],
  Baner: [18.55, 73.79],
  Pashan: [18.52, 73.79],
  Aundh: [18.57, 73.82],
  Kothrud: [18.49, 73.79],
  Warje: [18.46, 73.76],
  "Sinhagad Road": [18.46, 73.82],
  Shivajinagar: [18.52, 73.84],
  Swargate: [18.49, 73.84],
  Katraj: [18.46, 73.86],
  Yerwada: [18.57, 73.88],
  Camp: [18.51, 73.88],
  "Kalyani Nagar": [18.55, 73.91],
  "Viman Nagar": [18.60, 73.92],
  Kharadi: [18.58, 73.96],
  Hadapsar: [18.49, 73.94]
};

export default function AgentDashboard({ user, onLogout, darkMode, setDarkMode }) {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("deliveries"); // deliveries, history, profile, notifications
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState(false);
  const [failedModalOpen, setFailedModalOpen] = useState(false);
  const [failedReason, setFailedReason] = useState("Customer Not Available");
  const [failedRemarks, setFailedRemarks] = useState("");

  // Sidebar minimizing drawer state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // History tab filtering/pagination
  const [historySearch, setHistorySearch] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 5;

  // Profile Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    vehicleNumber: "",
    licenseNumber: ""
  });

  // Map reference
  const mapRef = useRef(null);
  const mapContainerId = "agent-leaflet-map";

  // 1. Fetch Agent Profile, Orders, Notifications
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const profileRes = await api.getAgentProfile();
      if (profileRes.success) {
        setProfile(profileRes.data);
        setEditForm({
          firstName: profileRes.data.firstName,
          lastName: profileRes.data.lastName,
          phone: profileRes.data.phone,
          vehicleNumber: profileRes.data.agentProfile?.vehicleNumber || "",
          licenseNumber: profileRes.data.agentProfile?.licenseNumber || ""
        });
      }

      const ordersRes = await api.getAgentOrders();
      if (ordersRes.success) {
        setOrders(ordersRes.data);
      }

      const notificationsRes = await api.getAgentNotifications();
      if (notificationsRes.success) {
        setNotifications(notificationsRes.data);
      }
    } catch (err) {
      console.error("Error loading agent dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Toggle availability status
  const handleAvailabilityToggle = async () => {
    if (!profile) return;
    const nextAvailability = !profile.agentProfile.availability;
    try {
      const res = await api.updateAgentAvailability(nextAvailability);
      if (res.success) {
        setProfile({
          ...profile,
          agentProfile: {
            ...profile.agentProfile,
            availability: nextAvailability
          }
        });
      }
    } catch (err) {
      console.error("Failed to update availability:", err);
    }
  };

  // Profile submission handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateAgentProfile(editForm);
      if (res.success) {
        setProfile(res.data);
        setEditModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // Status transition submit handler
  const handleStatusChange = async (orderId, nextStatus) => {
    setSubmittingStatus(true);
    try {
      const res = await api.updateAgentOrderStatus(orderId, nextStatus, remarks);
      if (res.success) {
        setRemarks("");
        // Reload dashboard
        await loadDashboardData();
      }
    } catch (err) {
      console.error("Failed to transition status:", err);
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleFailedStatusSubmit = async (e) => {
    e.preventDefault();
    setSubmittingStatus(true);
    try {
      const combinedRemarks = failedRemarks 
        ? `[${failedReason}] ${failedRemarks}` 
        : failedReason;
      
      const res = await api.updateAgentOrderStatus(selectedOrder.id, "FAILED", combinedRemarks);
      if (res.success) {
        setFailedModalOpen(false);
        setFailedRemarks("");
        await loadDashboardData();
      }
    } catch (err) {
      console.error("Failed to mark as failed:", err);
    } finally {
      setSubmittingStatus(false);
    }
  };

  // Calculate order stats
  const getStats = () => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const completed = orders.filter(o => o.status === "DELIVERED").length;
    const pending = orders.filter(o => ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(o.status)).length;
    const failed = orders.filter(o => o.status === "FAILED").length;
    return {
      todayCount: todayOrders.length,
      completed,
      pending,
      failed
    };
  };

  const stats = getStats();
  const activeOrders = orders.filter(o => ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(o.status));
  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // Initialize Map for selected order details view
  useEffect(() => {
    if (selectedOrder && activeTab === "deliveries") {
      // Small timeout to allow container element mounting
      setTimeout(() => {
        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) return;

        // Clean up previous map if exists
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // Parse pickup & drop zone centers
        const pCoords = ZONE_COORDS[selectedOrder.pickupZone?.name] || [18.52, 73.85];
        const dCoords = ZONE_COORDS[selectedOrder.dropZone?.name] || [18.53, 73.86];

        // Mock current agent location right in between
        const currentAgentLoc = [
          (pCoords[0] + dCoords[0]) / 2,
          (pCoords[1] + dCoords[1]) / 2
        ];

        // Initialize Leaflet map centered between pickup and drop
        const map = L.map(mapContainerId, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView(currentAgentLoc, 13);

        mapRef.current = map;

        // Add grayscale monochrome style tiles
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20
        }).addTo(map);

        // Customize Markers
        const pickupIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `<div style="background-color: var(--primary); border: 2px solid white; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const dropIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `<div style="background-color: var(--success, #10b981); border: 2px solid white; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const agentIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `<div style="background-color: var(--primary); border: 2px solid white; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        // Add Markers
        L.marker(pCoords, { icon: pickupIcon }).addTo(map).bindPopup("<b>Pickup Address:</b><br/>" + selectedOrder.pickupAddressLine);
        L.marker(dCoords, { icon: dropIcon }).addTo(map).bindPopup("<b>Destination:</b><br/>" + selectedOrder.dropAddressLine);
        const agentMarker = L.marker(currentAgentLoc, { icon: agentIcon }).addTo(map).bindPopup("<b>Your Current GPS Location</b>");

        // Draw Route line
        const routeLine = L.polyline([pCoords, currentAgentLoc, dCoords], {
          color: "var(--border-focus)",
          weight: 3,
          opacity: 0.8,
          dashArray: "6, 6"
        }).addTo(map);

        // Adjust bounds
        map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

        // Simulate GPS update every 12 seconds
        const timer = setInterval(() => {
          if (!mapRef.current) return;
          // Random walk nudge
          currentAgentLoc[0] += (Math.random() - 0.5) * 0.002;
          currentAgentLoc[1] += (Math.random() - 0.5) * 0.002;
          agentMarker.setLatLng(currentAgentLoc);
        }, 12000);

        return () => clearInterval(timer);
      }, 300);
    }
  }, [selectedOrderId, activeTab]);

  // Clean map reference on component unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Determine the next status transition
  const getNextStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case "ASSIGNED":
        return { label: "Start Pickup", status: "PICKED_UP" };
      case "PICKED_UP":
        return { label: "In Transit", status: "IN_TRANSIT" };
      case "IN_TRANSIT":
        return { label: "Out For Delivery", status: "OUT_FOR_DELIVERY" };
      case "OUT_FOR_DELIVERY":
        return [
          { label: "Delivered", status: "DELIVERED", isSuccess: true },
          { label: "Failed Delivery", status: "FAILED", isSuccess: false }
        ];
      default:
        return null;
    }
  };

  const nextStatusOptions = selectedOrder ? getNextStatusOptions(selectedOrder.status) : null;

  // Filter history list
  const historyOrders = orders.filter(o => {
    if (!["DELIVERED", "FAILED"].includes(o.status)) return false;
    if (historySearch) {
      return (
        o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()) ||
        o.customer.firstName.toLowerCase().includes(historySearch.toLowerCase()) ||
        o.customer.lastName.toLowerCase().includes(historySearch.toLowerCase())
      );
    }
    return true;
  });

  const totalHistoryPages = Math.ceil(historyOrders.length / historyPerPage);
  const paginatedHistory = historyOrders.slice(
    (historyPage - 1) * historyPerPage,
    historyPage * historyPerPage
  );

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <TrendingUp style={{ minWidth: "24px", color: "var(--text-sidebar-active)" }} />
          {!sidebarCollapsed && (
            <span className="sidebar-logo-text" style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-sidebar-active)" }}>
              Agent
            </span>
          )}
        </div>

        <nav className="sidebar-menu">
          <button
            onClick={() => { setActiveTab("deliveries"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "deliveries" ? "active" : ""}`}
            title={sidebarCollapsed ? "Assigned Deliveries" : ""}
          >
            <Truck size={20} />
            {!sidebarCollapsed && <span>Assigned Deliveries</span>}
            {!sidebarCollapsed && activeOrders.length > 0 && (
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "2px 6px", borderRadius: "10px", backgroundColor: "var(--danger)", color: "white" }}>
                {activeOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab("history"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "history" ? "active" : ""}`}
            title={sidebarCollapsed ? "Delivery History" : ""}
          >
            <FileText size={20} />
            {!sidebarCollapsed && <span>Delivery History</span>}
          </button>

          <button
            onClick={() => { setActiveTab("profile"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`}
            title={sidebarCollapsed ? "My Profile" : ""}
          >
            <User size={20} />
            {!sidebarCollapsed && <span>My Profile</span>}
          </button>

          <button
            onClick={() => { setActiveTab("notifications"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "notifications" ? "active" : ""}`}
            title={sidebarCollapsed ? "Notifications" : ""}
          >
            <Bell size={20} />
            {!sidebarCollapsed && <span>Notifications</span>}
            {!sidebarCollapsed && notifications.filter(n => !n.isRead).length > 0 && (
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "2px 6px", borderRadius: "10px", backgroundColor: "var(--primary)", color: "var(--text-active-item)" }}>
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={onLogout}
            className="sidebar-item"
            style={{ color: "#ef4444" }}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>

          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ display: "none" }}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header" style={{ padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
          <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              className="sidebar-toggle-btn"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontWeight: "700", fontSize: "1.05rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              LastMile Delivery Tracker
            </span>
          </div>

          <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="icon-button"
              style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "var(--radius-sm)", color: "var(--text-primary)" }}
              title="Toggle theme mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User profile dropdown avatar summary */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  {profile ? `${profile.firstName} ${profile.lastName}` : "Driver Agent"}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "600" }}>
                  {profile?.agentProfile?.currentZone?.name || "Assigned Driver"}
                </div>
              </div>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                <User size={18} className="text-primary" />
              </div>
            </div>


          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="page-container">
          {/* Welcome Dashboard Header (always shown at top) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "18px", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--primary)", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                {getGreeting()}, {profile ? profile.firstName : "Driver"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={13} /> {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                </span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={13} /> Hub: {profile?.agentProfile?.currentZone?.name || "Unassigned"}
                </span>
              </div>
            </div>

            {/* Availability Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-secondary)" }}>
                STATUS: {profile?.agentProfile?.availability ? "ONLINE" : "OFFLINE"}
              </span>
              <button
                type="button"
                onClick={handleAvailabilityToggle}
                style={{
                  width: "42px",
                  height: "22px",
                  borderRadius: "11px",
                  border: "none",
                  backgroundColor: profile?.agentProfile?.availability ? "var(--primary)" : "var(--border)",
                  position: "relative",
                  cursor: "pointer",
                  transition: "var(--transition)"
                }}
              >
                <div style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  position: "absolute",
                  top: "3px",
                  left: profile?.agentProfile?.availability ? "23px" : "3px",
                  transition: "var(--transition)"
                }} />
              </button>
            </div>
          </div>

          {/* SUMMARY STATS CARDS */}
          {activeTab === "deliveries" && !selectedOrderId && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "24px" }}>
              <div className="analytics-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Today's Deliveries</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--primary)" }}>{stats.todayCount}</div>
              </div>
              <div className="analytics-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <div style={{ color: "var(--success, #10b981)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Completed</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--success, #10b981)" }}>{stats.completed}</div>
              </div>
              <div className="analytics-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <div style={{ color: "var(--primary)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Pending</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--primary)" }}>{stats.pending}</div>
              </div>
              <div className="analytics-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <div style={{ color: "var(--danger, #ef4444)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Failed</div>
                <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--danger, #ef4444)" }}>{stats.failed}</div>
              </div>
            </div>
          )}

          {/* DELIVERIES TAB */}
          {activeTab === "deliveries" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {!selectedOrderId ? (
                <>
                  <h2 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-secondary)", margin: "0" }}>ACTIVE CONSIGNMENTS ({activeOrders.length})</h2>
                  {activeOrders.length === 0 ? (
                    <div style={{ padding: "48px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                      <CheckSquare size={36} style={{ color: "var(--text-muted)", marginBottom: "8px" }} />
                      <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--primary)", margin: "0 0 4px 0" }}>All Caught Up!</h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0" }}>No active deliveries currently assigned to you.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {activeOrders.map(o => (
                        <div key={o.id} className="table-card" style={{ padding: "18px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)", display: "flex", flexDirection: "column", gap: "12px", transition: "var(--transition)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "var(--primary)" }}>#{o.orderNumber}</span>
                            <span className={`status-badge ${o.status.toLowerCase()}`} style={{ fontSize: "0.65rem", padding: "4px 8px", borderRadius: "var(--radius-sm)" }}>
                              {o.status}
                            </span>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                            <div><strong>Recipient:</strong> {o.customer.firstName} {o.customer.lastName}</div>
                            <div><strong>Pickup Hub:</strong> {o.pickupZone?.name || "Warehouse"}</div>
                            <div><strong>Drop Address:</strong> {o.dropAddressLine}</div>
                            <div><strong>Weight / Payment:</strong> {o.billableWeight} kg | {o.paymentType}</div>
                          </div>

                          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", gap: "10px", marginTop: "4px" }}>
                            <button
                              onClick={() => setSelectedOrderId(o.id)}
                              className="btn btn-secondary"
                              style={{ flex: 1, fontSize: "0.75rem", padding: "6px 12px", borderRadius: "var(--radius-sm)" }}
                            >
                              <Eye size={14} style={{ marginRight: "4px" }} /> View Details
                            </button>
                            <button
                              onClick={() => { setSelectedOrderId(o.id); }}
                              className="btn btn-primary"
                              style={{ flex: 1, fontSize: "0.75rem", padding: "6px 12px", borderRadius: "var(--radius-sm)" }}
                            >
                              <Navigation size={14} style={{ marginRight: "4px" }} /> Navigate
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* ORDER DETAILS PANEL WITH LIVE MAP */
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
                  {/* Left info column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        onClick={() => setSelectedOrderId(null)}
                        className="btn btn-secondary"
                        style={{ fontSize: "0.7rem", padding: "4px 8px", borderRadius: "var(--radius-sm)" }}
                      >
                        ← Back to List
                      </button>
                      <h2 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)", margin: "0" }}>
                        CONSIGNMENT #{selectedOrder.orderNumber}
                      </h2>
                    </div>

                    {/* Specifications Card */}
                    <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.75rem" }}>
                        <div>
                          <div style={{ color: "var(--text-muted)", fontWeight: "600", marginBottom: "2px" }}>RECIPIENT CUSTOMER</div>
                          <div style={{ fontWeight: "700", color: "var(--primary)" }}>{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</div>
                          <div style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                            <Phone size={12} /> {selectedOrder.customer.phone}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: "var(--text-muted)", fontWeight: "600", marginBottom: "2px" }}>PAYMENT / WEIGHT</div>
                          <div style={{ fontWeight: "700", color: "var(--primary)" }}>{selectedOrder.paymentType}</div>
                          <div style={{ color: "var(--text-secondary)" }}>
                            COD Charge: ₹{selectedOrder.codCharge} | Weight: {selectedOrder.billableWeight} kg
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: "1px dashed var(--border)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.75rem" }}>
                        <div>
                          <div style={{ color: "var(--text-muted)", fontWeight: "600", marginBottom: "2px" }}>PICKUP DEPOT LOCATION</div>
                          <div style={{ color: "var(--primary)", fontWeight: "700" }}>{selectedOrder.pickupZone?.name} Logistics Hub</div>
                          <div style={{ color: "var(--text-secondary)" }}>{selectedOrder.pickupAddressLine}</div>
                        </div>
                        <div>
                          <div style={{ color: "var(--text-muted)", fontWeight: "600", marginBottom: "2px" }}>DELIVERY DESTINATION</div>
                          <div style={{ color: "var(--primary)", fontWeight: "700" }}>{selectedOrder.dropAddressLine}</div>
                          <div style={{ color: "var(--text-secondary)" }}>Pincode: {selectedOrder.dropPincode}</div>
                        </div>
                      </div>

                      {/* Status Transition Control buttons */}
                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "10px" }}>
                          NEXT OPERATION ACTION
                        </div>

                        {nextStatusOptions ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div className="form-group" style={{ marginBottom: "0" }}>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="Add transit status remarks (optional)..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                style={{ borderRadius: "var(--radius-sm)", fontSize: "0.75rem", padding: "6px 10px" }}
                              />
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                              {Array.isArray(nextStatusOptions) ? (
                                nextStatusOptions.map((opt) => (
                                  <button
                                    key={opt.status}
                                    type="button"
                                    disabled={submittingStatus}
                                    onClick={() => {
                                      if (opt.status === "FAILED") {
                                        setFailedReason("Customer Not Available");
                                        setFailedRemarks("");
                                        setFailedModalOpen(true);
                                      } else {
                                        handleStatusChange(selectedOrder.id, opt.status);
                                      }
                                    }}
                                    className={`btn ${opt.isSuccess ? "btn-primary" : "btn-secondary"}`}
                                    style={{ flex: 1, fontSize: "0.75rem", padding: "8px 14px", borderRadius: "var(--radius-sm)" }}
                                  >
                                    {opt.label}
                                  </button>
                                ))
                              ) : (
                                <button
                                  type="button"
                                  disabled={submittingStatus}
                                  onClick={() => handleStatusChange(selectedOrder.id, nextStatusOptions.status)}
                                  className="btn btn-primary"
                                  style={{ width: "100%", fontSize: "0.75rem", padding: "8px 14px", borderRadius: "var(--radius-sm)" }}
                                >
                                  {nextStatusOptions.label}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                            This order is currently {selectedOrder.status}. No further transitions are available.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline History */}
                    <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                      <h3 style={{ fontSize: "0.8rem", fontWeight: "800", color: "var(--primary)", margin: "0 0 12px 0", textTransform: "uppercase" }}>CONSIGNMENT JOURNEY TIMELINE</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {selectedOrder.trackingHistory?.map((hist, index) => (
                          <div key={hist.id} style={{ display: "flex", gap: "10px", fontSize: "0.75rem", position: "relative" }}>
                            {index !== selectedOrder.trackingHistory.length - 1 && (
                              <div style={{ position: "absolute", left: "6px", top: "14px", bottom: "-18px", width: "2px", backgroundColor: "var(--border)" }} />
                            )}
                            <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: index === 0 ? "var(--primary)" : "var(--border)", marginTop: "2px" }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: "700", color: "var(--primary)" }}>{hist.status}</span>
                                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                                  {new Date(hist.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{hist.remarks || "No remarks logged."}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right map column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-card)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Activity size={14} className="text-primary" />
                      <span style={{ fontSize: "0.7rem", fontWeight: "800", color: "var(--text-secondary)", textTransform: "uppercase" }}>LIVE GPS ROUTING MAP</span>
                    </div>

                    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden", position: "relative" }}>
                      {/* Leaflet Map Div */}
                      <div id={mapContainerId} style={{ width: "100%", height: "420px", zIndex: 1, filter: "grayscale(100%) contrast(1.05) brightness(0.95)" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)", margin: "0" }}>COMPLETED DELIVERIES JOURNAL</h2>
                
                {/* Search field */}
                <div className="header-search" style={{ width: "240px" }}>
                  <Search className="header-search-icon" />
                  <input
                    type="text"
                    placeholder="Search order or client..."
                    value={historySearch}
                    onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
                  />
                </div>
              </div>

              {paginatedHistory.length === 0 ? (
                <div style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  No archived logs matching search query.
                </div>
              ) : (
                <>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Order Code</th>
                        <th>Client Customer</th>
                        <th>Date Completed</th>
                        <th>Consignment State</th>
                        <th>Pricing Charge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedHistory.map(o => (
                        <tr key={o.id}>
                          <td><strong>#{o.orderNumber}</strong></td>
                          <td>{o.customer.firstName} {o.customer.lastName}</td>
                          <td>{new Date(o.updatedAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge ${o.status.toLowerCase()}`} style={{ fontSize: "0.65rem" }}>
                              {o.status}
                            </span>
                          </td>
                          <td>₹{o.totalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination control */}
                  {totalHistoryPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                      <button
                        onClick={() => setHistoryPage(prev => Math.max(prev - 1, 1))}
                        disabled={historyPage === 1}
                        className="btn btn-secondary btn-icon"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span style={{ fontSize: "0.8rem", alignSelf: "center", fontWeight: "700" }}>
                        Page {historyPage} of {totalHistoryPages}
                      </span>
                      <button
                        onClick={() => setHistoryPage(prev => Math.min(prev + 1, totalHistoryPages))}
                        disabled={historyPage === totalHistoryPages}
                        className="btn btn-secondary btn-icon"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
              <h2 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)", margin: "0 0 16px 0" }}>DRIVER ALERTS ARCHIVE</h2>

              {notifications.length === 0 ? (
                <div style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  No dispatcher warnings or updates logged.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ display: "flex", gap: "12px", padding: "12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Bell size={14} className="text-primary" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-primary)", fontWeight: "600" }}>{n.message}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "4px" }}>
                          {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && profile && (
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
              {/* Profile Details Card */}
              <div className="table-card" style={{ padding: "24px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)", display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                    <User size={32} className="text-primary" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.05rem", fontWeight: "900", color: "var(--primary)", margin: "0" }}>
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                      Registered Delivery Agent • ID: DRV-{profile.id}
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontWeight: "600" }}>EMAIL ADDRESS</div>
                    <div style={{ color: "var(--primary)", fontWeight: "700", marginTop: "2px" }}>{profile.email}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontWeight: "600" }}>CONTACT PHONE</div>
                    <div style={{ color: "var(--primary)", fontWeight: "700", marginTop: "2px" }}>{profile.phone}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontWeight: "600" }}>VEHICLE NUMBER</div>
                    <div style={{ color: "var(--primary)", fontWeight: "700", marginTop: "2px" }}>{profile.agentProfile?.vehicleNumber}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontWeight: "600" }}>VEHICLE SEGMENT</div>
                    <div style={{ color: "var(--primary)", fontWeight: "700", marginTop: "2px" }}>{profile.agentProfile?.vehicleType}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontWeight: "600" }}>DRIVING LICENSE</div>
                    <div style={{ color: "var(--primary)", fontWeight: "700", marginTop: "2px" }}>{profile.agentProfile?.licenseNumber}</div>
                  </div>
                  <div>
                    <div style={{ color: "var(--text-muted)", fontWeight: "600" }}>LOGISTICS ZONE</div>
                    <div style={{ color: "var(--primary)", fontWeight: "700", marginTop: "2px" }}>{profile.agentProfile?.currentZone?.name || "Unassigned"}</div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "6px" }}>
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="btn btn-primary"
                    style={{ width: "100%", fontSize: "0.75rem", padding: "8px 14px", borderRadius: "var(--radius-sm)" }}
                  >
                    Edit Profile Details
                  </button>
                </div>
              </div>

              {/* Safety Rules Panel */}
              <div className="table-card" style={{ padding: "24px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <h3 style={{ fontSize: "0.8rem", fontWeight: "800", color: "var(--primary)", margin: "0 0 12px 0", textTransform: "uppercase" }}>Driver Compliance Guidelines</h3>
                <ul style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "16px" }}>
                  <li>Always verify recipient name and COD amounts before status confirmation.</li>
                  <li>In case of delivery failure, log descriptive remarks on the status override sheet.</li>
                  <li>Maintain status toggles. Switch state to offline when not actively picking up consignments.</li>
                  <li>Obey all speed rules and local zoning regulations during transit.</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="modal-backdrop" onClick={() => setEditModalOpen(false)}>
          <form
            onSubmit={handleProfileSubmit}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <div className="modal-header">
              <span className="modal-title">Edit Profile Details</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setEditModalOpen(false)}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Registration Number *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={editForm.vehicleNumber}
                  onChange={(e) => setEditForm({ ...editForm, vehicleNumber: e.target.value })}
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Driver License Number *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={editForm.licenseNumber}
                  onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })}
                  style={{ borderRadius: "var(--radius-sm)" }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditModalOpen(false)}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mark as Failed Modal */}
      {failedModalOpen && selectedOrder && (
        <div className="modal-backdrop" onClick={() => setFailedModalOpen(false)}>
          <form
            onSubmit={handleFailedStatusSubmit}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: "var(--radius-md)", maxWidth: "480px" }}
          >
            <div className="modal-header">
              <span className="modal-title" style={{ color: "var(--danger, #ef4444)", fontWeight: "800" }}>Mark Delivery as Failed</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setFailedModalOpen(false)}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>Select Failure Reason *</label>
                <select
                  className="form-input"
                  value={failedReason}
                  onChange={(e) => setFailedReason(e.target.value)}
                  style={{ borderRadius: "var(--radius-sm)" }}
                  required
                >
                  <option value="Customer Not Available">Customer Not Available</option>
                  <option value="Wrong Address">Wrong Address</option>
                  <option value="Customer Refused Delivery">Customer Refused Delivery</option>
                  <option value="Unable to Contact Customer">Unable to Contact Customer</option>
                  <option value="Vehicle Breakdown">Vehicle Breakdown</option>
                  <option value="Weather Issue">Weather Issue</option>
                  <option value="Address Not Found">Address Not Found</option>
                  <option value="Other (Remarks)">Other (Remarks)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: "700" }}>Additional Remarks</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: "80px", resize: "vertical", borderRadius: "var(--radius-sm)" }}
                  placeholder="Enter details about why delivery failed..."
                  value={failedRemarks}
                  onChange={(e) => setFailedRemarks(e.target.value)}
                  required={failedReason === "Other (Remarks)"}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFailedModalOpen(false)}
                style={{ borderRadius: "var(--radius-sm)", flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingStatus}
                className="btn btn-primary"
                style={{ borderRadius: "var(--radius-sm)", flex: 1, backgroundColor: "var(--danger, #ef4444)", borderColor: "var(--danger, #ef4444)" }}
              >
                {submittingStatus ? "Submitting..." : "Confirm Failure"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
