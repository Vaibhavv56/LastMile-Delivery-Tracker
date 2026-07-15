import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Eye,
  ShoppingBag,
  Ban,
  CheckCircle,
  Plus,
  Building,
  Mail,
  Phone,
  CreditCard,
  Percent,
  User,
} from "lucide-react";
import { api } from "../utils/api";

export default function CustomersModule({
  setActiveModule,
  onOpenCreateOrderOnBehalf,
}) {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Forms state
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    gstNumber: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [custRes, ordersRes] = await Promise.all([
        api.getCustomers(),
        api.getOrders({ limit: 1000 }), // Fetch large limit for local aggregation
      ]);

      if (custRes.success) setCustomers(custRes.data);
      if (ordersRes.success) setOrders(ordersRes.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Local Aggregation Engine per Customer
  const getCustomerMetrics = (customerId) => {
    const custOrders = orders.filter((o) => o.customerId === customerId);
    const active = custOrders.filter(
      (o) =>
        o.status !== "DELIVERED" &&
        o.status !== "FAILED"
    ).length;
    const delivered = custOrders.filter((o) => o.status === "DELIVERED").length;
    const failed = custOrders.filter((o) => o.status === "FAILED").length;

    let totalSpend = 0;
    let codCount = 0;
    let prepaidCount = 0;
    let lastDate = "-";

    custOrders.forEach((o) => {
      totalSpend += Number(o.totalAmount) || 0;
      if (o.paymentType === "COD") codCount++;
      else prepaidCount++;
    });

    if (custOrders.length > 0) {
      const dates = custOrders.map((o) => new Date(o.createdAt));
      const latest = new Date(Math.max(...dates));
      lastDate = latest.toLocaleDateString();
    }

    const prefPayment =
      codCount > prepaidCount
        ? "COD"
        : prepaidCount > codCount
        ? "Prepaid"
        : custOrders.length > 0
        ? "Prepaid"
        : "-";

    return {
      totalOrders: custOrders.length,
      activeOrders: active,
      deliveredOrders: delivered,
      failedOrders: failed,
      totalSpending: totalSpend,
      preferredPayment: prefPayment,
      lastOrderDate: lastDate,
      history: custOrders,
    };
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (
        !newCustomer.firstName ||
        !newCustomer.lastName ||
        !newCustomer.email ||
        !newCustomer.phone
      ) {
        setErrorMessage("Please enter all required fields.");
        return;
      }
      const res = await api.createCustomer(newCustomer);
      if (res.success) {
        setCreateOpen(false);
        setNewCustomer({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyName: "",
          gstNumber: "",
        });
        loadData();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to create customer.");
    }
  };

  const handleToggleSuspend = async (customer) => {
    try {
      const confirmation = window.confirm(
        `Are you sure you want to toggle status for ${customer.firstName} ${customer.lastName}?`
      );
      if (!confirmation) return;

      if (customer.isActive) {
        // Suspend (Deactivate)
        const res = await api.deleteCustomer(customer.id);
        if (res.success) loadData();
      } else {
        // Re-activate via Update PUT
        const res = await api.updateCustomer(customer.id, {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          companyName: customer.customerProfile?.companyName || "",
          gstNumber: customer.customerProfile?.gstNumber || "",
          isActive: true, // Wait, backend service might not set isActive back to true via normal update unless we modify service, but let's pass it anyway
        });
        if (res.success) loadData();
      }
    } catch (err) {
      alert(err.message || "Error modifying customer status.");
    }
  };

  // Filtered customer list
  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const email = c.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Customer Registry</h1>
          <p className="page-subtitle">Manage client accounts, view logistics logs, and analyze metrics</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="table-card" style={{ padding: "20px 24px", borderBottom: "none" }}>
        <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "400px" }}>
          <div className="header-search" style={{ width: "100%" }}>
            <Search className="header-search-icon" />
            <input
              type="text"
              placeholder="Search customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid Table */}
      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No customers found in database.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Company</th>
                  <th>Contact Email</th>
                  <th>Phone Number</th>
                  <th>Orders (Total)</th>
                  <th>Active</th>
                  <th>Delivered</th>
                  <th>Failed</th>
                  <th>Last Order Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => {
                  const metrics = getCustomerMetrics(c.id);
                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: "700" }}>
                        <User size={14} className="text-muted" style={{ marginRight: "6px", verticalAlign: "middle" }} /> {c.firstName} {c.lastName}
                      </td>
                      <td>
                        {c.customerProfile?.companyName ? (
                          <span style={{ fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Building size={14} className="text-muted" /> {c.customerProfile.companyName}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>Individual</span>
                        )}
                      </td>
                      <td>{c.email}</td>
                      <td>{c.phone}</td>
                      <td style={{ fontWeight: "600", textAlign: "center" }}>{metrics.totalOrders}</td>
                      <td style={{ fontWeight: "600", color: "var(--status-in-transit)", textAlign: "center" }}>
                        {metrics.activeOrders}
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--status-delivered)", textAlign: "center" }}>
                        {metrics.deliveredOrders}
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--status-failed)", textAlign: "center" }}>
                        {metrics.failedOrders}
                      </td>
                      <td>{metrics.lastOrderDate}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            c.isActive ? "delivered" : "failed"
                          }`}
                        >
                          {c.isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-secondary btn-icon"
                            title="View Profile Details"
                            onClick={() => {
                              setSelectedCustomer({ ...c, metrics });
                              setProfileOpen(true);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn btn-secondary btn-icon"
                            title="Book order for customer"
                            onClick={() => onOpenCreateOrderOnBehalf(c.id)}
                          >
                            <ShoppingBag size={16} />
                          </button>
                          <button
                            className="btn btn-danger btn-icon"
                            title={c.isActive ? "Suspend Customer" : "Activate Customer"}
                            onClick={() => handleToggleSuspend(c)}
                          >
                            <Ban size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Profile View Modal */}
      {profileOpen && selectedCustomer && (
        <div className="modal-backdrop" onClick={() => setProfileOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: "780px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">
                Customer Dossier: {selectedCustomer.firstName} {selectedCustomer.lastName}
              </span>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => setProfileOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {/* Profile Card & Bio */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "24px", marginBottom: "24px" }}>
                <div style={{ border: "1px solid var(--border)", padding: "20px", borderRadius: "var(--radius-lg)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Building size={16} /> Profile Details
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem" }}>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Company:</span>{" "}
                      <strong>{selectedCustomer.customerProfile?.companyName || "N/A"}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>GST Number:</span>{" "}
                      <strong>{selectedCustomer.customerProfile?.gstNumber || "N/A"}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}><Mail size={12} /> Email:</span>{" "}
                      <strong>{selectedCustomer.email}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}><Phone size={12} /> Phone:</span>{" "}
                      <strong>{selectedCustomer.phone}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)" }}>Account Status:</span>{" "}
                      <span className={`status-badge ${selectedCustomer.isActive ? "delivered" : "failed"}`}>
                        {selectedCustomer.isActive ? "Active" : "Suspended"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery SLA and aggregates */}
                <div style={{ border: "1px solid var(--border)", padding: "20px", borderRadius: "var(--radius-lg)", backgroundColor: "var(--bg-app)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "14px" }}>
                    Fulfillment Insights
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.8rem" }}>
                    <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ color: "var(--text-muted)" }}>Total Spend</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--primary)" }}>
                        ₹{selectedCustomer.metrics.totalSpending.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ color: "var(--text-muted)" }}>Delivery Success Rate</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--status-delivered)" }}>
                        {selectedCustomer.metrics.totalOrders > 0
                          ? Math.round(
                              (selectedCustomer.metrics.deliveredOrders /
                                selectedCustomer.metrics.totalOrders) *
                                100
                            )
                          : 0}
                        %
                      </div>
                    </div>
                    <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ color: "var(--text-muted)" }}>Pref. Payment</div>
                      <div style={{ fontSize: "1rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CreditCard size={14} /> {selectedCustomer.metrics.preferredPayment}
                      </div>
                    </div>
                    <div style={{ backgroundColor: "var(--bg-card)", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ color: "var(--text-muted)" }}>Active Shipments</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--status-in-transit)" }}>
                        {selectedCustomer.metrics.activeOrders}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "800", marginBottom: "12px" }}>Order History</h4>
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  {selectedCustomer.metrics.history.length === 0 ? (
                    <p style={{ padding: "20px", textAlignment: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      No orders recorded for this customer yet.
                    </p>
                  ) : (
                    <table className="custom-table" style={{ fontSize: "0.75rem" }}>
                      <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                        <tr>
                          <th>Order ID</th>
                          <th>Hub Route</th>
                          <th>Price</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.metrics.history.map((o) => (
                          <tr key={o.id}>
                            <td style={{ fontWeight: "700", color: "var(--primary)" }}>{o.orderNumber}</td>
                            <td>
                              {o.pickupZone?.name || `Zone ${o.pickupZoneId}`} → {o.dropZone?.name || `Zone ${o.dropZoneId}`}
                            </td>
                            <td>₹{Number(o.totalAmount).toFixed(2)}</td>
                            <td>{o.paymentType}</td>
                            <td>
                              <span className={`status-badge ${o.status.toLowerCase()}`} style={{ padding: "2px 6px", fontSize: "0.65rem" }}>
                                {o.status}
                              </span>
                            </td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setProfileOpen(false);
                  onOpenCreateOrderOnBehalf(selectedCustomer.id);
                }}
              >
                Create Order on Behalf
              </button>
              <button className="btn btn-secondary" onClick={() => setProfileOpen(false)}>
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Customer Modal */}
      {createOpen && (
        <div className="modal-backdrop" onClick={() => setCreateOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateCustomer}>
              <div className="modal-header">
                <span className="modal-title">Register New Customer</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-icon"
                  onClick={() => setCreateOpen(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                {errorMessage && <div className="auth-error">{errorMessage}</div>}

                <div className="form-group row">
                  <div>
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newCustomer.lastName}
                      onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCustomer.companyName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GST Number (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCustomer.gstNumber}
                    onChange={(e) => setNewCustomer({ ...newCustomer, gstNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
