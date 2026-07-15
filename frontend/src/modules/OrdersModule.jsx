import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  UserCheck,
  CheckSquare,
  XCircle,
  Plus,
  Calendar,
  Layers,
  MapPin,
  Scale,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Map,
  Users,
  Truck,
  Activity,
  Compass,
  CheckCircle2,
  User
} from "lucide-react";
import { api } from "../utils/api";

export default function OrdersModule({
  searchQuery,
  setSearchQuery,
  createFormOpen,
  setCreateFormOpen,
  failedOnly = false,
}) {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [statusFilter, setStatusFilter] = useState(failedOnly ? "FAILED" : "");
  const [typeFilter, setTypeFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");

  // Lists for dropdown options
  const [customers, setCustomers] = useState([]);
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [agents, setAgents] = useState([]);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [assignAgentOpen, setAssignAgentOpen] = useState(false);
  const [statusOverrideOpen, setStatusOverrideOpen] = useState(false);

  // Forms state
  const [newOrder, setNewOrder] = useState({
    customerId: "",
    pickupAreaId: "",
    dropAreaId: "",
    pickupAddress: "",
    dropAddress: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    actualWeight: "",
    orderType: "B2C",
    paymentType: "PREPAID",
  });
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [overrideStatus, setOverrideStatus] = useState("PENDING");
  const [statusRemarks, setStatusRemarks] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDropdowns();
  }, []);

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter, typeFilter, paymentFilter, customerFilter, searchQuery, failedOnly]);

  async function loadDropdowns() {
    try {
      const [custRes, zonesRes, areasRes, agentsRes] = await Promise.all([
        api.getCustomers(),
        api.getZones(),
        api.getAreas(),
        api.getAgents(),
      ]);
      if (custRes.success) setCustomers(custRes.data);
      if (zonesRes.success) setZones(zonesRes.data);
      if (areasRes.success) setAreas(areasRes.data);
      if (agentsRes.success) setAgents(agentsRes.data);
    } catch (err) {
      console.error("Error loading dropdown data:", err);
    }
  }

  async function loadOrders() {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        status: statusFilter || (failedOnly ? "FAILED" : undefined),
        customerId: customerFilter || undefined,
        search: searchQuery || undefined,
      };

      const res = await api.getOrders(params);
      if (res.success) {
        let list = res.data.orders;
        // Client side filtering for filters not supported by basic backend query params
        if (typeFilter) {
          list = list.filter((o) => o.orderType === typeFilter);
        }
        if (paymentFilter) {
          list = list.filter((o) => o.paymentType === paymentFilter);
        }
        if (zoneFilter) {
          list = list.filter(
            (o) =>
              o.pickupZoneId === Number(zoneFilter) ||
              o.dropZoneId === Number(zoneFilter)
          );
        }
        setOrders(list);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (
        !newOrder.customerId ||
        !newOrder.pickupAreaId ||
        !newOrder.dropAreaId ||
        !newOrder.pickupAddress ||
        !newOrder.dropAddress ||
        !newOrder.lengthCm ||
        !newOrder.widthCm ||
        !newOrder.heightCm ||
        !newOrder.actualWeight
      ) {
        setErrorMessage("Please fill all required fields.");
        return;
      }

      const payload = {
        customerId: Number(newOrder.customerId),
        pickupAreaId: Number(newOrder.pickupAreaId),
        dropAreaId: Number(newOrder.dropAreaId),
        pickupAddress: newOrder.pickupAddress,
        dropAddress: newOrder.dropAddress,
        lengthCm: Number(newOrder.lengthCm),
        widthCm: Number(newOrder.widthCm),
        heightCm: Number(newOrder.heightCm),
        actualWeight: Number(newOrder.actualWeight),
        orderType: newOrder.orderType,
        paymentType: newOrder.paymentType,
      };

      const res = await api.createOrder(payload);
      if (res.success) {
        setCreateFormOpen(false);
        setNewOrder({
          customerId: "",
          pickupAreaId: "",
          dropAreaId: "",
          pickupAddress: "",
          dropAddress: "",
          lengthCm: "",
          widthCm: "",
          heightCm: "",
          actualWeight: "",
          orderType: "B2C",
          paymentType: "PREPAID",
        });
        loadOrders();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to create order.");
    }
  };

  const handleAssignAgent = async (e) => {
    e.preventDefault();
    try {
      if (!selectedAgentId) return;
      const res = await api.assignAgent(selectedOrder.id, Number(selectedAgentId));
      if (res.success) {
        setAssignAgentOpen(false);
        loadOrders();
        // Update detail overlay if open
        if (detailsOpen && selectedOrder?.id === res.data.id) {
          viewDetails(res.data.id);
        }
      }
    } catch (err) {
      alert(err.message || "Error assigning agent.");
    }
  };

  const handleAutoAssign = async () => {
    try {
      const res = await api.assignAgent(selectedOrder.id, "auto");
      if (res.success) {
        setAssignAgentOpen(false);
        loadOrders();
        // Update detail overlay if open
        if (detailsOpen && selectedOrder?.id === res.data.id) {
          viewDetails(res.data.id);
        }
      }
    } catch (err) {
      alert(err.message || "Error auto-assigning agent.");
    }
  };

  const handleOverrideStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateOrderStatus(
        selectedOrder.id,
        overrideStatus,
        statusRemarks || `Status updated to ${overrideStatus}`
      );
      if (res.success) {
        setStatusOverrideOpen(false);
        setStatusRemarks("");
        loadOrders();
        // Update detail overlay if open
        if (detailsOpen) {
          viewDetails(selectedOrder.id);
        }
      }
    } catch (err) {
      alert(err.message || "Error updating status.");
    }
  };

  const viewDetails = async (id) => {
    try {
      const res = await api.getOrderById(id);
      if (res.success) {
        setSelectedOrder(res.data);
        setDetailsOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const viewTracking = async (id) => {
    try {
      const res = await api.getOrderById(id);
      if (res.success) {
        setSelectedOrder(res.data);
        setTrackingOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div>
          <h1 className="page-title">{failedOnly ? "Failed Deliveries Logger" : "Fulfillment Shipments"}</h1>
          <p className="page-subtitle">
            {failedOnly
              ? "Oversee and initiate retries on failed packages"
              : "Review transit status, override status logs, and configure drivers"}
          </p>
        </div>
        {!failedOnly && (
          <button className="btn btn-primary" onClick={() => setCreateFormOpen(true)}>
            <Plus size={16} /> Create Order
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="table-card">
        <div className="table-controls" style={{ gap: "12px" }}>
          <div className="table-filters" style={{ width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
            <div className="header-search" style={{ width: "100%", maxWidth: "240px" }}>
              <Search className="header-search-icon" />
              <input
                type="text"
                placeholder="Search order code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {!failedOnly && (
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="FAILED">Failed</option>
              </select>
            )}

            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Segments</option>
              <option value="B2B">B2B Business</option>
              <option value="B2C">B2C Retail</option>
            </select>

            <select
              className="filter-select"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Payments</option>
              <option value="PREPAID">Prepaid</option>
              <option value="COD">COD Surcharge</option>
            </select>

            <select
              className="filter-select"
              value={customerFilter}
              onChange={(e) => {
                setCustomerFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={zoneFilter}
              onChange={(e) => {
                setZoneFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pagination-info" style={{ fontWeight: "600" }}>
            Total Found: {total} Shipments
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container">
          {loading ? (
            <div style={{ padding: "40px", textAlignment: "center", display: "flex", justifyContent: "center" }}>
              <Activity className="animate-spin" size={32} style={{ animation: "pulse 1.5s infinite" }} />
            </div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "40px", textAlignment: "center", color: "var(--text-muted)" }}>
              No shipments matching these filters were found in the database.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Actions</th>
                  <th>Customer Name</th>
                  <th>Pickup Hub</th>
                  <th>Drop Hub</th>
                  <th>Segment</th>
                  <th>Payment</th>
                  <th>Assigned Driver</th>
                  <th>Billable Wt (KG)</th>
                  <th>Shipment Fee</th>
                  <th>Status</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: "700", color: "var(--primary)" }}>{order.orderNumber}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary btn-icon"
                          title="View Details"
                          onClick={() => viewDetails(order.id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          title="Track Order"
                          onClick={() => viewTracking(order.id)}
                        >
                          <Compass size={16} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          title="Reassign Driver"
                          onClick={() => {
                            setSelectedOrder(order);
                            setSelectedAgentId(order.assignedAgentId || "");
                            setAssignAgentOpen(true);
                          }}
                        >
                          <UserCheck size={16} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          title="Override Status"
                          onClick={() => {
                            setSelectedOrder(order);
                            setOverrideStatus(order.status);
                            setStatusOverrideOpen(true);
                          }}
                        >
                          <CheckSquare size={16} />
                        </button>
                      </div>
                    </td>
                    <td>
                      {order.customer
                        ? `${order.customer.firstName} ${order.customer.lastName}`
                        : "System User"}
                    </td>
                    <td>{order.pickupZone?.name || `Zone ${order.pickupZoneId}`}</td>
                    <td>{order.dropZone?.name || `Zone ${order.dropZoneId}`}</td>
                    <td style={{ fontWeight: "600" }}>{order.orderType}</td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          color: order.paymentType === "COD" ? "var(--status-pending)" : "var(--primary)",
                        }}
                      >
                        {order.paymentType}
                      </span>
                    </td>
                    <td>
                      {order.assignedAgent ? (
                        <span style={{ fontWeight: "500" }}>
                          {order.assignedAgent.firstName} {order.assignedAgent.lastName}
                        </span>
                      ) : (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                          onClick={() => {
                            setSelectedOrder(order);
                            setSelectedAgentId(order.assignedAgentId || "");
                            setAssignAgentOpen(true);
                          }}
                        >
                          Assign Agent
                        </button>
                      )}
                    </td>
                    <td style={{ fontWeight: "600" }}>{Number(order.billableWeight).toFixed(2)} KG</td>
                    <td style={{ fontWeight: "700" }}>₹{Number(order.totalAmount).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="table-pagination">
          <span className="pagination-info">
            Page {page} of {totalPages || 1}
          </span>
          <div className="pagination-actions">
            <button
              className="btn btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button
              className="btn btn-secondary"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Order Details Overlay */}
      {detailsOpen && selectedOrder && (
        <div className="modal-backdrop" onClick={() => setDetailsOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: "720px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-title">Shipment: {selectedOrder.orderNumber}</span>
                <span
                  className={`status-badge ${selectedOrder.status.toLowerCase()}`}
                  style={{ marginLeft: "12px" }}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => setDetailsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Info Blocks Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-app)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Users size={16} className="text-primary" /> Customer Info
                  </h4>
                  <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)" }}>
                    {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    Email: {selectedOrder.customer?.email}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    Phone: {selectedOrder.customer?.phone}
                  </p>
                </div>

                <div style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-app)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Truck size={16} className="text-primary" /> Assigned Logistics Agent
                  </h4>
                  {selectedOrder.assignedAgent ? (
                    <>
                      <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)" }}>
                        {selectedOrder.assignedAgent.firstName} {selectedOrder.assignedAgent.lastName}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        Phone: {selectedOrder.assignedAgent.phone}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        ID: #{selectedOrder.assignedAgent.id}
                      </p>
                    </>
                  ) : (
                    <div style={{ textAlign: "center", padding: "10px 0" }}>
                      <p style={{ fontSize: "0.8rem", color: "var(--status-failed-text)", fontWeight: "600" }}>No driver assigned</p>
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: "8px", padding: "4px 8px", fontSize: "0.75rem" }}
                        onClick={() => {
                          setAssignAgentOpen(true);
                        }}
                      >
                        Assign Driver Now
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Pickup & Drop Addresses */}
              <div style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)", marginBottom: "24px" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={16} className="text-primary" /> Routing Terminals
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem" }}>
                  <div>
                    <span style={{ fontWeight: "700", color: "var(--status-out-for-delivery-text)" }}>PICKUP:</span>{" "}
                    {selectedOrder.pickupAddressLine} (Pincode: {selectedOrder.pickupPincode}, Hub: {selectedOrder.pickupZone?.name})
                  </div>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
                    <span style={{ fontWeight: "700", color: "var(--status-failed-text)" }}>DROP:</span>{" "}
                    {selectedOrder.dropAddressLine} (Pincode: {selectedOrder.dropPincode}, Hub: {selectedOrder.dropZone?.name})
                  </div>
                </div>
              </div>

              {/* Weight, Volume, Pricing breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Scale size={16} className="text-primary" /> Physical Dimensions
                  </h4>
                  <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 0", color: "var(--text-muted)" }}>Package Size</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>
                          {Number(selectedOrder.lengthCm)} × {Number(selectedOrder.widthCm)} × {Number(selectedOrder.heightCm)} cm
                        </td>
                      </tr>
                      <br />
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 0", color: "var(--text-muted)" }}>Actual Weight</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>{Number(selectedOrder.actualWeight).toFixed(2)} KG</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 0", color: "var(--text-muted)" }}>Volumetric Weight</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>{Number(selectedOrder.volumetricWeight).toFixed(2)} KG</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "6px 0", fontWeight: "700", color: "var(--primary)" }}>Billable Weight</td>
                        <td style={{ textAlign: "right", fontWeight: "800", color: "var(--primary)" }}>
                          {Number(selectedOrder.billableWeight).toFixed(2)} KG
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <DollarSign size={16} className="text-primary" /> Invoice Breakdown
                  </h4>
                  <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 0", color: "var(--text-muted)" }}>Delivery Fee</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹{Number(selectedOrder.deliveryCharge).toFixed(2)}</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 0", color: "var(--text-muted)" }}>COD Surcharge</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>₹{Number(selectedOrder.codCharge).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "6px 0", fontWeight: "700", color: "var(--text-primary)" }}>Total Amount</td>
                        <td style={{ textAlign: "right", fontWeight: "800", color: "var(--text-primary)", fontSize: "0.9rem" }}>
                          ₹{Number(selectedOrder.totalAmount).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: "12px", padding: "6px", backgroundColor: "var(--primary-light)", borderRadius: "var(--radius-sm)", fontSize: "0.7rem", textAlign: "center", color: "var(--primary)", fontWeight: "600" }}>
                    Method: {selectedOrder.paymentType} • Segment: {selectedOrder.orderType}
                  </div>
                </div>
              </div>

              {/* Vertical timeline (Immutable logs) */}
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "800", marginBottom: "14px" }}>
                  Immutable Tracking History
                </h4>
                {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
                  <div className="timeline-container">
                    {selectedOrder.trackingHistory.map((item) => (
                      <div className="timeline-event" key={item.id}>
                        <div className={`timeline-badge ${item.status.toLowerCase()}`} />
                        <div className="timeline-event-content">
                          <div className="timeline-event-header">
                            <span className="timeline-event-title">{item.status}</span>
                            <span className="timeline-event-time">
                              {new Date(item.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {item.remarks && <p className="timeline-event-remarks">{item.remarks}</p>}
                          <div className="timeline-event-operator">
                            Updated By: {item.updatedBy?.firstName} {item.updatedBy?.lastName} ({item.updatedBy?.role})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>No tracking updates found.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetailsOpen(false)}>
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Agent Modal */}
      {assignAgentOpen && selectedOrder && (
        <div className="modal-backdrop" onClick={() => setAssignAgentOpen(false)}>
          <form
            onSubmit={handleAssignAgent}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">Assign Agent - {selectedOrder.orderNumber}</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setAssignAgentOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Available Fleet Agents</label>
                <select
                  className="form-input"
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  required
                >
                  <option value="">-- Choose Agent --</option>
                  {agents.map((agent) => (
                    <option
                      key={agent.id}
                      value={agent.id}
                      disabled={!agent.agentProfile?.availability}
                    >
                      {agent.firstName} {agent.lastName} (Phone: {agent.phone})
                      {!agent.agentProfile?.availability ? " - Busy/Offline" : ""}
                    </option>
                  ))}
                </select>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "6px" }}>
                  Only available agents are eligible for instant courier dispatches.
                </p>
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
                  onClick={() => setAssignAgentOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!selectedAgentId}>
                  Assign Driver
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Status Override Modal */}
      {statusOverrideOpen && selectedOrder && (
        <div className="modal-backdrop" onClick={() => setStatusOverrideOpen(false)}>
          <form
            onSubmit={handleOverrideStatus}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">Override Status - {selectedOrder.orderNumber}</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setStatusOverrideOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Select Logistics Stage</label>
                <select
                  className="form-input"
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                >
                  <option value="PENDING">PENDING (Unassigned)</option>
                  <option value="ASSIGNED">ASSIGNED (Driver allocated)</option>
                  <option value="PICKED_UP">PICKED_UP (Received at center)</option>
                  <option value="IN_TRANSIT">IN_TRANSIT (Between hubs)</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY (Last-mile courier)</option>
                  <option value="DELIVERED">DELIVERED (Handed over)</option>
                  <option value="FAILED">FAILED (Fulfillment failure)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Audit Trail Remarks / Reasons</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  placeholder="Enter manual change description (e.g., Customer rescheduled, package status verified manually)"
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStatusOverrideOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Override Status
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Order Modal */}
      {createFormOpen && (
        <div className="modal-backdrop" onClick={() => setCreateFormOpen(false)}>
          <form
            onSubmit={handleCreateOrder}
            className="modal-content"
            style={{ maxWidth: "620px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">Book New Shipment Cargo</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setCreateFormOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
                {errorMessage && <div className="auth-error">{errorMessage}</div>}

                <div className="form-group">
                  <label className="form-label">Select Client / Customer *</label>
                  <select
                    className="form-input"
                    value={newOrder.customerId}
                    onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Pickup Hub Area *</label>
                    <select
                      className="form-input"
                      value={newOrder.pickupAreaId}
                      onChange={(e) => setNewOrder({ ...newOrder, pickupAreaId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Area --</option>
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.pincode})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Drop Hub Area *</label>
                    <select
                      className="form-input"
                      value={newOrder.dropAreaId}
                      onChange={(e) => setNewOrder({ ...newOrder, dropAreaId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Area --</option>
                      {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.pincode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Pickup Address *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter house no, street name, landmarks"
                    value={newOrder.pickupAddress}
                    onChange={(e) => setNewOrder({ ...newOrder, pickupAddress: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Drop Address *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter house no, street name, landmarks"
                    value={newOrder.dropAddress}
                    onChange={(e) => setNewOrder({ ...newOrder, dropAddress: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Length (cm) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={newOrder.lengthCm}
                      onChange={(e) => setNewOrder({ ...newOrder, lengthCm: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Width (cm) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={newOrder.widthCm}
                      onChange={(e) => setNewOrder({ ...newOrder, widthCm: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Height (cm) *</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={newOrder.heightCm}
                      onChange={(e) => setNewOrder({ ...newOrder, heightCm: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Actual Weight (KG) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={newOrder.actualWeight}
                      onChange={(e) => setNewOrder({ ...newOrder, actualWeight: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Client Segment *</label>
                    <select
                      className="form-input"
                      value={newOrder.orderType}
                      onChange={(e) => setNewOrder({ ...newOrder, orderType: e.target.value })}
                    >
                      <option value="B2C">B2C Retail</option>
                      <option value="B2B">B2B Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Payment Category *</label>
                    <select
                      className="form-input"
                      value={newOrder.paymentType}
                      onChange={(e) => setNewOrder({ ...newOrder, paymentType: e.target.value })}
                    >
                      <option value="PREPAID">Prepaid</option>
                      <option value="COD">Cash on Delivery (COD)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCreateFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Shipment Booking
                </button>
              </div>
            </form>
        </div>
      )}

      {/* Track Order Modal */}
      {trackingOpen && selectedOrder && (() => {
        const steps = [
          { label: "Order Created", key: "PENDING" },
          { label: "Agent Assigned", key: "ASSIGNED" },
          { label: "Picked Up", key: "PICKED_UP" },
          { label: "In Transit", key: "IN_TRANSIT" },
          { label: "Out For Delivery", key: "OUT_FOR_DELIVERY" },
          { label: "Delivered", key: "DELIVERED" }
        ];

        const getStepIndex = (status) => {
          if (status === "FAILED" || status === "CANCELLED") return -1;
          return steps.findIndex(s => s.key === status);
        };

        const currentStepIdx = getStepIndex(selectedOrder.status);

        return (
          <div className="modal-backdrop" onClick={() => setTrackingOpen(false)}>
            <div
              className="modal-content"
              style={{ maxWidth: "780px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="modal-title" style={{ fontSize: "1.1rem", fontWeight: "900" }}>Track Shipment: {selectedOrder.orderNumber}</span>
                  <span
                    className={`status-badge ${selectedOrder.status.toLowerCase()}`}
                    style={{ marginLeft: "12px" }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <button
                  className="btn btn-secondary btn-icon"
                  onClick={() => setTrackingOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "20px" }}>
                {/* Horizontal Progress Timeline */}
                <div className="table-card" style={{ padding: "24px 16px 34px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-app)", position: "relative" }}>
                  <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    {/* Background Track Line */}
                    <div style={{
                      position: "absolute",
                      top: "16px",
                      left: "5%",
                      right: "5%",
                      height: "4px",
                      backgroundColor: "var(--border)",
                      zIndex: 1
                    }}></div>

                    {/* Completed Progress Line */}
                    {currentStepIdx >= 0 && (
                      <div style={{
                        position: "absolute",
                        top: "16px",
                        left: "5%",
                        width: `${(currentStepIdx / (steps.length - 1)) * 90}%`,
                        height: "4px",
                        backgroundColor: selectedOrder.status === "FAILED" ? "#ef4444" : "var(--primary)",
                        zIndex: 2,
                        transition: "width 0.4s ease"
                      }}></div>
                    )}

                    {/* Steps */}
                    {steps.map((s, idx) => {
                      const isPast = currentStepIdx >= idx;
                      const isCurrent = currentStepIdx === idx;
                      const isFailed = selectedOrder.status === "FAILED" && idx === 5;
                      
                      let stepColor = "var(--border)";
                      let textWeight = "500";
                      let textColor = "var(--text-muted)";
                      
                      if (isCurrent) {
                        stepColor = isFailed ? "#ef4444" : "var(--primary)";
                        textWeight = "800";
                        textColor = "var(--text-primary)";
                      } else if (isPast) {
                        stepColor = isFailed ? "#ef4444" : "#10b981";
                        textWeight = "700";
                        textColor = "var(--text-secondary)";
                      }

                      return (
                        <div key={idx} style={{
                          position: "relative",
                          zIndex: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "16%"
                        }}>
                          {/* Step Icon Node */}
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: isCurrent ? "var(--bg-card)" : (isPast ? stepColor : "var(--bg-app)"),
                            border: `3px solid ${isCurrent ? stepColor : (isPast ? "transparent" : "var(--border)")}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isPast && !isCurrent ? "#ffffff" : stepColor,
                            boxShadow: isCurrent ? `0 0 10px ${stepColor}80` : "none",
                            transition: "all 0.3s ease",
                            cursor: "default"
                          }}>
                            {isPast && !isCurrent ? (
                              <CheckCircle2 size={14} style={{ color: "#ffffff" }} />
                            ) : (
                              <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: stepColor
                              }}></div>
                            )}
                          </div>

                          {/* Step Label */}
                          <div style={{
                            marginTop: "8px",
                            fontSize: "0.6rem",
                            fontWeight: textWeight,
                            color: textColor,
                            textAlign: "center",
                            lineHeight: "1.2",
                            wordBreak: "break-word"
                          }}>
                            {isFailed ? "Failed" : s.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Two-Column Info Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "20px" }}>
                  {/* Left Column: Shipment specifications */}
                  <div className="table-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <h4 style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
                      Routing & Specifications
                    </h4>
                    <div style={{ fontSize: "0.75rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div><strong>Pickup Location:</strong> {selectedOrder.pickupAddressLine} (Zone: {selectedOrder.pickupZone?.name})</div>
                      <div><strong>Delivery Location:</strong> {selectedOrder.dropAddressLine} (Zone: {selectedOrder.dropZone?.name})</div>
                      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                        <span>Billable Weight:</span>
                        <strong>{Number(selectedOrder.billableWeight).toFixed(2)} KG</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Payment Method:</span>
                        <strong>{selectedOrder.paymentType}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Fulfillment Mode:</span>
                        <strong>{selectedOrder.orderType}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "8px", color: "var(--primary)", fontWeight: "800" }}>
                        <span>Fulfillment Charge:</span>
                        <span>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Fleet agent & History logs */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Delivery Partner */}
                    <div className="table-card" style={{ padding: "14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 10px 0" }}>
                        Delivery Partner
                      </h4>
                      {selectedOrder.assignedAgent ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.75rem" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <User size={16} className="text-primary" />
                          </div>
                          <div>
                            <div style={{ fontWeight: "700" }}>{selectedOrder.assignedAgent.firstName} {selectedOrder.assignedAgent.lastName}</div>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Phone: {selectedOrder.assignedAgent.phone}</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic" }}>No delivery partner assigned yet.</div>
                      )}
                    </div>

                    {/* Audit Logs */}
                    <div className="table-card" style={{ padding: "14px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", margin: "0 0 10px 0" }}>
                        Audit logs
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "140px", overflowY: "auto", paddingRight: "4px" }}>
                        {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
                          [...selectedOrder.trackingHistory].reverse().map((log, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "8px", fontSize: "0.65rem", borderBottom: idx === selectedOrder.trackingHistory.length - 1 ? "none" : "1px solid var(--border)", paddingBottom: "8px" }}>
                              <div style={{ minWidth: "100px", color: "var(--text-muted)" }}>
                                {new Date(log.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "700" }}>{log.status}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.6rem", marginTop: "1px" }}>{log.remarks}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>No logs recorded.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setTrackingOpen(false)}>
                  Close Tracker
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
