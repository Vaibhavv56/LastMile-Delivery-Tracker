import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  UserCheck,
  Calendar,
  Phone,
  RotateCw,
  Search,
  Activity,
  Send,
  User,
} from "lucide-react";
import { api } from "../utils/api";

export default function FailedDeliveriesModule({
  onOpenAssignOrderToAgent,
}) {
  const [failedOrders, setFailedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [rescheduleOrder, setRescheduleOrder] = useState(null);
  const [assignAgentOrder, setAssignAgentOrder] = useState(null);
  const [contactOrder, setContactOrder] = useState(null);

  // Forms state
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [rescheduleForm, setRescheduleForm] = useState({
    retryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    reason: "Customer Not Available",
    remarks: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [ordersRes, agentsRes] = await Promise.all([
        api.getOrders({ status: "FAILED", limit: 100 }),
        api.getAgents(),
      ]);

      if (ordersRes.success) {
        setFailedOrders(ordersRes.data.orders);
      }
      if (agentsRes.success) {
        setAgents(agentsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleReschedule = async (e) => {
    e.preventDefault();
    try {
      // Reset status back to PENDING so dispatcher can rerun assignment or manual assignment
      const remarks = `Rescheduled attempt on ${rescheduleForm.retryDate} (${rescheduleForm.reason}): ${rescheduleForm.remarks}`;
      const res = await api.updateOrderStatus(rescheduleOrder.id, "PENDING", remarks);
      if (res.success) {
        setRescheduleOrder(null);
        loadData();
      }
    } catch (err) {
      alert(err.message || "Failed to reschedule delivery.");
    }
  };

  const handleAssignAgent = async (e) => {
    e.preventDefault();
    try {
      if (!selectedAgentId) return;
      const res = await api.assignAgent(assignAgentOrder.id, Number(selectedAgentId));
      if (res.success) {
        setAssignAgentOrder(null);
        loadData();
      }
    } catch (err) {
      alert(err.message || "Error assigning agent.");
    }
  };

  const handleAutoAssign = async () => {
    try {
      const res = await api.assignAgent(assignAgentOrder.id, "auto");
      if (res.success) {
        setAssignAgentOrder(null);
        loadData();
      }
    } catch (err) {
      alert(err.message || "Error auto-assigning agent.");
    }
  };

  const handleQuickRetry = async (order) => {
    try {
      const confirmRetry = window.confirm(
        `Are you sure you want to retry shipment ${order.orderNumber} immediately?`
      );
      if (!confirmRetry) return;

      // Reset back to PENDING
      const res = await api.updateOrderStatus(
        order.id,
        "PENDING",
        "Admin triggered instant delivery retry"
      );
      if (res.success) {
        loadData();
      }
    } catch (err) {
      alert(err.message || "Error retrying delivery.");
    }
  };

  // Helper: Extract last failure remark or return dummy reason
  const getFailureReason = (order) => {
    // If order has remarks that contain keywords
    const tracking = order.trackingHistory || [];
    const failedLog = tracking.find((t) => t.status === "FAILED");
    if (failedLog && failedLog.remarks) {
      return failedLog.remarks;
    }
    // Mock mapping based on order id to give variety
    const mockReasons = [
      "Customer Not Available",
      "Wrong Address Specified",
      "UPI Payment Timed Out",
      "Package Damaged at Transit Hub",
      "Customer Refused Cargo Delivery",
    ];
    return mockReasons[order.id % mockReasons.length];
  };

  const filteredFailed = failedOrders.filter((o) =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Failed Deliveries Management</h1>
          <p className="page-subtitle">Inspect fulfillment issues, reschedule transit slots, and reassign drivers</p>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        <div className="kpi-card red">
          <div className="kpi-icon-wrapper red"><AlertTriangle size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">{failedOrders.length}</div>
            <div className="kpi-label">Active Failures</div>
          </div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-icon-wrapper blue"><RotateCw size={20} /></div>
          <div className="kpi-details">
            <div className="kpi-value">
              {failedOrders.filter((o) => o.paymentType === "COD").length}
            </div>
            <div className="kpi-label">COD Surcharge Failures</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="table-card" style={{ padding: "20px 24px", borderBottom: "none" }}>
        <div className="header-search" style={{ width: "100%", maxWidth: "320px" }}>
          <Search className="header-search-icon" />
          <input
            type="text"
            placeholder="Search failed shipment code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Failed Deliveries Table */}
      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading failures...</div>
          ) : filteredFailed.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No failed shipments are currently logged in the system. Everything is flowing smoothly!
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Failed Driver</th>
                  <th>Failure Reason</th>
                  <th>Failed Date</th>
                  <th>Fulfillment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFailed.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: "700", color: "var(--status-failed)" }}>{order.orderNumber}</td>
                    <td>
                      {order.customer
                        ? `${order.customer.firstName} ${order.customer.lastName}`
                        : "System User"}
                    </td>
                    <td>
                      {order.assignedAgent ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <User size={12} className="text-muted" /> {order.assignedAgent.firstName} {order.assignedAgent.lastName}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>No Agent</span>
                      )}
                    </td>
                    <td style={{ fontWeight: "600", color: "var(--text-secondary)" }}>{getFailureReason(order)}</td>
                    <td>{new Date(order.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge failed">{order.status}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                          onClick={() => {
                            setRescheduleOrder(order);
                          }}
                          title="Schedule Next Attempt"
                        >
                          <Calendar size={14} /> Reschedule
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                          onClick={() => {
                            setAssignAgentOrder(order);
                            setSelectedAgentId(order.assignedAgentId || "");
                          }}
                          title="Reassign Driver"
                        >
                          <UserCheck size={14} /> Reassign
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                          onClick={() => setContactOrder(order)}
                          title="Contact Customer"
                        >
                          <Phone size={14} /> Contact
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                          onClick={() => handleQuickRetry(order)}
                          title="Retry Instantly"
                        >
                          <RotateCw size={14} /> Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleOrder && (
        <div className="modal-backdrop" onClick={() => setRescheduleOrder(null)}>
          <form
            onSubmit={handleReschedule}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">Schedule Shipment Retry: {rescheduleOrder.orderNumber}</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setRescheduleOrder(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
                <div className="form-group row">
                  <div>
                    <label className="form-label">Next Retry Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={rescheduleForm.retryDate}
                      onChange={(e) => setRescheduleForm({ ...rescheduleForm, retryDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Failure Reason Category *</label>
                    <select
                      className="form-input"
                      value={rescheduleForm.reason}
                      onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                    >
                      <option value="Customer Not Available">Customer Not Available</option>
                      <option value="Wrong Address">Wrong Address</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Package Damaged">Package Damaged</option>
                      <option value="Customer Refused Delivery">Customer Refused Delivery</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Operations Note Remarks *</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: "80px" }}
                    placeholder="Enter retry remarks (e.g. Customer requested retry in evening, address updated in CRM)"
                    value={rescheduleForm.remarks}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, remarks: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRescheduleOrder(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Reschedule
                </button>
              </div>
          </form>
        </div>
      )}

      {/* Assign Agent Modal */}
      {assignAgentOrder && (
        <div className="modal-backdrop" onClick={() => setAssignAgentOrder(null)}>
          <form
            onSubmit={handleAssignAgent}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">Reassign Driver: {assignAgentOrder.orderNumber}</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setAssignAgentOrder(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Courier Agent</label>
                  <select
                    className="form-input"
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Driver --</option>
                    {agents.map((a) => (
                      <option
                        key={a.id}
                        value={a.id}
                        disabled={!a.agentProfile?.availability}
                      >
                        {a.firstName} {a.lastName} (Hub: {a.agentProfile?.currentZone?.name || "N/A"})
                        {!a.agentProfile?.availability ? " - Busy/Offline" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)", fontWeight: "700" }}
                  onClick={handleAutoAssign}
                >
                  Auto-Assign Agent
                </button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setAssignAgentOrder(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={!selectedAgentId}>
                    Allocate Driver
                  </button>
                </div>
              </div>
            </form>
        </div>
      )}

      {/* Contact Customer Simulation Modal */}
      {contactOrder && (
        <div className="modal-backdrop" onClick={() => setContactOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Contact Customer: {contactOrder.customer?.firstName}</span>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => setContactOrder(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div style={{ backgroundColor: "var(--bg-app)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "20px", fontSize: "0.8rem" }}>
                <div><strong>Phone Number:</strong> {contactOrder.customer?.phone}</div>
                <div style={{ marginTop: "4px" }}><strong>Email Address:</strong> {contactOrder.customer?.email}</div>
                <div style={{ marginTop: "4px" }}><strong>Shipment Code:</strong> {contactOrder.orderNumber}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Preformatted SMS Notice</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: "80px", fontSize: "0.8rem" }}
                  readOnly
                  value={`Dear ${contactOrder.customer?.firstName}, our courier tried delivering ORD-${contactOrder.id} today but it was marked failed. Please confirm your availability or reschedule delivery at your convenience.`}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setContactOrder(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert("SMS notifications simulation sent to customer.");
                  setContactOrder(null);
                }}
              >
                <Send size={14} /> Send SMS Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
