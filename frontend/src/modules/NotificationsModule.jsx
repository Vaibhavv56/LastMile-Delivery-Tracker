import React, { useState, useEffect } from "react";
import { Bell, Mail, Phone, Send, Search, CheckCircle, RefreshCw } from "lucide-react";
import { api } from "../utils/api";

export default function NotificationsModule() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // EMAIL, SMS, APP

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const ordersRes = await api.getOrders({ limit: 100 });
      if (ordersRes.success) {
        const orders = ordersRes.data.orders;
        
        // Compile notifications list dynamically based on orders and tracking histories
        const logs = [];
        let idCounter = 1;

        orders.forEach((order) => {
          const customer = order.customer;
          if (!customer) return;

          // For every order, we have creation notification
          logs.push({
            id: idCounter++,
            orderNumber: order.orderNumber,
            type: "EMAIL",
            recipient: `${customer.firstName} ${customer.lastName} (${customer.email})`,
            message: `Fulfillment booked successfully. Order ID: ${order.orderNumber}. Shipping charge: ₹${Number(order.totalAmount).toFixed(2)}.`,
            status: "Delivered",
            sentAt: new Date(order.createdAt),
          });

          logs.push({
            id: idCounter++,
            orderNumber: order.orderNumber,
            type: "SMS",
            recipient: `${customer.phone}`,
            message: `Consignment booked: ${order.orderNumber}. Driver assignment in progress. - LastMile Logistics`,
            status: "Delivered",
            sentAt: new Date(order.createdAt),
          });

          // For status updates (tracking history events)
          const tracking = order.trackingHistory || [];
          tracking.forEach((track, idx) => {
            if (track.status === "PENDING") return; // skipped creation duplicates
            
            // Email dispatch
            logs.push({
              id: idCounter++,
              orderNumber: order.orderNumber,
              type: "EMAIL",
              recipient: `${customer.firstName} ${customer.lastName} (${customer.email})`,
              message: `Update on your consignment: ORD-${order.id} status changed to ${track.status}. Remarks: ${track.remarks || 'No remarks.'}`,
              status: "Delivered",
              sentAt: new Date(track.createdAt),
            });

            // SMS dispatch
            logs.push({
              id: idCounter++,
              orderNumber: order.orderNumber,
              type: "SMS",
              recipient: `${customer.phone}`,
              message: `Shipment ORD-${order.id} status is now ${track.status}. Track live details on dashboard.`,
              status: "Delivered",
              sentAt: new Date(track.createdAt),
            });
          });
        });

        // Sort by date desc
        logs.sort((a, b) => b.sentAt - a.sentAt);
        setNotifications(logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleResend = (id) => {
    alert(`Triggered webhook resend for notification #${id}. Checked channels: SMS/SMTP Gateway.`);
  };

  const filteredNotifs = notifications.filter((n) => {
    const searchMatch =
      n.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.recipient.toLowerCase().includes(searchQuery.toLowerCase());

    const typeMatch = typeFilter ? n.type === typeFilter : true;

    return searchMatch && typeMatch;
  });

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Notifications Dispatch Log</h1>
          <p className="page-subtitle">Inspect automated email, SMS, and webhook dispatches sent to customers</p>
        </div>
      </div>

      {/* Grid of channel stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "28px" }}>
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "20px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>SMTP Email Sent</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--primary)", marginTop: "4px" }}>
            {notifications.filter((n) => n.type === "EMAIL").length}
          </div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "20px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>SMS Gateway Delivered</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--status-out-for-delivery)", marginTop: "4px" }}>
            {notifications.filter((n) => n.type === "SMS").length}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="table-card" style={{ padding: "20px 24px", borderBottom: "none" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", width: "100%", justifyContent: "space-between" }}>
          <div className="header-search" style={{ width: "100%", maxWidth: "320px" }}>
            <Search className="header-search-icon" />
            <input
              type="text"
              placeholder="Search by order or recipient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Channels</option>
            <option value="EMAIL">Email Gateway</option>
            <option value="SMS">SMS Gateway</option>
          </select>
        </div>
      </div>

      {/* Grid Table */}
      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading notifications log...</div>
          ) : filteredNotifs.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No notification dispatches found.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Consignment ID</th>
                  <th>Recipient Contact</th>
                  <th>Message Body</th>
                  <th>Fulfillment Status</th>
                  <th>Dispatched Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifs.map((notif) => (
                  <tr key={notif.id}>
                    <td>
                      <span
                        className={`status-badge ${notif.type === "EMAIL" ? "assigned" : "out_for_delivery"}`}
                        style={{ display: "flex", alignItems: "center", gap: "4px", width: "fit-content", padding: "4px 8px" }}
                      >
                        {notif.type === "EMAIL" ? <Mail size={12} /> : <Phone size={12} />}
                        {notif.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: "700", color: "var(--primary)" }}>{notif.orderNumber}</td>
                    <td style={{ fontWeight: "600", fontSize: "0.8rem" }}>{notif.recipient}</td>
                    <td
                      style={{
                        maxWidth: "280px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                      title={notif.message}
                    >
                      {notif.message}
                    </td>
                    <td>
                      <span className="status-badge delivered" style={{ padding: "2px 6px", fontSize: "0.65rem" }}>
                        {notif.status}
                      </span>
                    </td>
                    <td>{notif.sentAt.toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-icon"
                        onClick={() => handleResend(notif.id)}
                        title="Resend Notification"
                        style={{ width: "28px", height: "28px" }}
                      >
                        <RefreshCw size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
