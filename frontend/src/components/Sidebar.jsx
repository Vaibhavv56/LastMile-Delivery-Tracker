import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  MapPin,
  DollarSign,
  CircleDollarSign,
  History,
  AlertTriangle,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Globe,
} from "lucide-react";

export default function Sidebar({
  activeModule,
  setActiveModule,
  collapsed,
  setCollapsed,
  onLogout,
  mobileOpen,
  setMobileOpen,
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "agents", label: "Delivery Agents", icon: Truck },
    { id: "zones", label: "Zones & Areas", icon: MapPin },
    { id: "rates", label: "Rate Cards", icon: DollarSign },
    { id: "cod", label: "COD Charges", icon: CircleDollarSign },
    { id: "failed", label: "Failed Deliveries", icon: AlertTriangle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleItemClick = (id) => {
    setActiveModule(id);
    setMobileOpen(false); // Close sidebar on mobile after clicking
  };

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
    >
      <div className="sidebar-logo">
        <TrendingUp style={{ minWidth: "24px", color: "var(--text-sidebar-active)" }} />
        {!collapsed && <span className="sidebar-logo-text">Admin</span>}
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`sidebar-item ${isActive ? "active" : ""}`}
              title={collapsed ? item.label : ""}
            >
              <IconComponent size={20} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={onLogout}
          className="sidebar-item"
          style={{ color: "#ef4444" }}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          style={{ display: "none" }} // Show toggle inside header instead for cleaner UX, but available
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}
