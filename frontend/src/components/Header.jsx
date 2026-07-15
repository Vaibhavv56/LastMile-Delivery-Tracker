import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";

export default function Header({
  activeModule,
  setActiveModule,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  user,
  onLogout,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
  notifications = [],
  markAllNotificationsRead,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const profileRef = useRef(null);
  const notifyRef = useRef(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBreadcrumbLabel = () => {
    switch (activeModule) {
      case "dashboard":
        return "Dashboard";
      case "orders":
        return "Orders";
      case "customers":
        return "Customers";
      case "agents":
        return "Delivery Agents";
      case "zones":
        return "Zones & Areas";
      case "rates":
        return "Rate Cards";
      case "cod":
        return "COD Charges";
      case "tracking":
        return "Tracking History";
      case "failed":
        return "Failed Deliveries";
      case "notifications":
        return "Notifications Log";
      case "analytics":
        return "Analytics";
      case "settings":
        return "Settings";
      default:
        return "Home";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="top-header" style={{ padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
      <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          className="sidebar-toggle-btn"
          onClick={() => {
            if (window.innerWidth <= 768) {
              setMobileOpen(!mobileOpen);
            } else {
              setCollapsed(!collapsed);
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
          className="icon-button"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
          style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "var(--radius-sm)", color: "var(--text-primary)" }}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="profile-menu" ref={notifyRef} style={{ position: "relative" }}>
          <button
            className="icon-button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            title="Notifications"
            style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", position: "relative" }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notification-badge" style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                backgroundColor: "var(--status-failed)",
                color: "white",
                borderRadius: "50%",
                fontSize: "0.75rem",
                fontWeight: "800",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1",
                border: "2px solid var(--bg-card)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="dropdown-menu" style={{ width: "320px", padding: "12px", position: "absolute", right: 0, top: "44px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", zIndex: 100 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700" }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    style={{
                      border: "none",
                      background: "none",
                      color: "var(--primary)",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div
                style={{
                  maxHeight: "240px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {notifications.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", padding: "12px 0", textAlign: "center" }}>
                    No new alerts
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: "8px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: notif.isRead ? "transparent" : "var(--primary-light)",
                        fontSize: "0.75rem",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <p style={{ color: "var(--text-primary)", fontWeight: notif.isRead ? "400" : "600" }}>
                        {notif.message}
                      </p>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={() => {
                  setActiveModule("notifications");
                  setNotificationsOpen(false);
                }}
                className="btn btn-secondary"
                style={{ width: "100%", fontSize: "0.75rem", marginTop: "8px", padding: "6px" }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-menu" ref={profileRef} style={{ position: "relative" }}>
          <button
            className="profile-avatar"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              border: "none",
              background: "var(--primary-light)",
              color: "var(--text-primary)",
              cursor: "pointer",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.85rem",
              transition: "var(--transition)",
            }}
          >
            {user?.firstName ? user.firstName[0].toUpperCase() : "A"}
          </button>

          {profileDropdownOpen && (
            <div className="dropdown-menu" style={{ position: "absolute", right: 0, top: "44px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", width: "180px", zIndex: 100 }}>
              <button
                onClick={() => {
                  setActiveModule("settings");
                  setProfileDropdownOpen(false);
                }}
                className="dropdown-item"
              >
                <User size={14} />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setActiveModule("settings");
                  setProfileDropdownOpen(false);
                }}
                className="dropdown-item"
              >
                <Settings size={14} />
                <span>System Settings</span>
              </button>
              <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 0" }} />
              <button
                onClick={() => {
                  onLogout();
                  setProfileDropdownOpen(false);
                }}
                className="dropdown-item"
                style={{ color: "var(--status-failed)" }}
              >
                <LogOut size={14} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
