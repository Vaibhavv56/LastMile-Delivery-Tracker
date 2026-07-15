import React, { useState, useEffect } from "react";
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Sliders,
} from "lucide-react";
import { api } from "../utils/api";

export default function AgentsModule({
  setActiveModule,
  onOpenAssignOrderToAgent,
}) {
  const [agents, setAgents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Forms state
  const [newAgent, setNewAgent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "AgentPassword123",
    phone: "",
    vehicleNumber: "",
    vehicleType: "BIKE",
    licenseNumber: "",
    currentZoneId: "",
  });
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    vehicleNumber: "",
    vehicleType: "BIKE",
    licenseNumber: "",
    currentZoneId: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [agentsRes, ordersRes, zonesRes] = await Promise.all([
        api.getAgents(),
        api.getOrders({ limit: 1000 }),
        api.getZones(),
      ]);

      if (agentsRes.success) setAgents(agentsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data.orders);
      if (zonesRes.success) setZones(zonesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Aggregate stats per driver
  const getAgentStats = (agentId) => {
    const driverOrders = orders.filter((o) => o.assignedAgentId === agentId);
    const todayStr = new Date().toDateString();
    
    const assignedToday = driverOrders.filter(
      (o) => new Date(o.createdAt).toDateString() === todayStr
    ).length;
    const completed = driverOrders.filter((o) => o.status === "DELIVERED").length;
    const failed = driverOrders.filter((o) => o.status === "FAILED").length;
    const active = driverOrders.filter(
      (o) =>
        o.status !== "DELIVERED" &&
        o.status !== "FAILED"
    ).length;

    const rate = completed + failed > 0
      ? Math.round((completed / (completed + failed)) * 100)
      : 100;

    return {
      assignedToday,
      completed,
      failed,
      active,
      successRate: rate,
    };
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (
        !newAgent.firstName ||
        !newAgent.lastName ||
        !newAgent.email ||
        !newAgent.phone ||
        !newAgent.vehicleNumber ||
        !newAgent.licenseNumber ||
        !newAgent.currentZoneId
      ) {
        setErrorMessage("Please fill in all fields.");
        return;
      }

      const payload = {
        ...newAgent,
        currentZoneId: Number(newAgent.currentZoneId),
      };

      const res = await api.createAgent(payload);
      if (res.success) {
        setCreateOpen(false);
        setNewAgent({
          firstName: "",
          lastName: "",
          email: "",
          password: "AgentPassword123",
          phone: "",
          vehicleNumber: "",
          vehicleType: "BIKE",
          licenseNumber: "",
          currentZoneId: "",
        });
        loadData();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to create agent.");
    }
  };

  const handleEditAgent = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const payload = {
        ...editForm,
        currentZoneId: Number(editForm.currentZoneId),
      };
      const res = await api.updateAgent(selectedAgent.id, payload);
      if (res.success) {
        setEditOpen(false);
        loadData();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to update agent.");
    }
  };

  const handleToggleAvailability = async (agent) => {
    try {
      const newAvail = !agent.agentProfile?.availability;
      const res = await api.updateAgentAvailability(agent.id, newAvail);
      if (res.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisableAgent = async (agent) => {
    try {
      const confirmMsg = `Are you sure you want to ${
        agent.isActive ? "deactivate" : "activate"
      } agent ${agent.firstName} ${agent.lastName}?`;
      if (!window.confirm(confirmMsg)) return;

      if (agent.isActive) {
        const res = await api.deleteAgent(agent.id);
        if (res.success) loadData();
      } else {
        // Activate via update PUT
        const res = await api.updateAgent(agent.id, {
          firstName: agent.firstName,
          lastName: agent.lastName,
          phone: agent.phone,
          vehicleNumber: agent.agentProfile?.vehicleNumber || "",
          vehicleType: agent.agentProfile?.vehicleType || "BIKE",
          licenseNumber: agent.agentProfile?.licenseNumber || "",
          currentZoneId: agent.agentProfile?.currentZoneId || zones[0]?.id || 1,
          isActive: true,
        });
        if (res.success) loadData();
      }
    } catch (err) {
      alert(err.message || "Error changing agent state.");
    }
  };

  // Filters logic
  const filteredAgents = agents.filter((a) => {
    const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
    const queryMatch = fullName.includes(searchQuery.toLowerCase());
    
    let availabilityMatch = true;
    if (availabilityFilter === "online") {
      availabilityMatch = a.agentProfile?.availability === true;
    } else if (availabilityFilter === "busy") {
      availabilityMatch = a.agentProfile?.availability === false;
    }

    let zoneMatch = true;
    if (zoneFilter) {
      zoneMatch = a.agentProfile?.currentZoneId === Number(zoneFilter);
    }

    return queryMatch && availabilityMatch && zoneMatch;
  });

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Delivery Fleet</h1>
          <p className="page-subtitle">Oversee couriers, dispatch availability states, and track delivery stats</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
          <UserPlus size={16} /> Add Delivery Agent
        </button>
      </div>

      {/* Analytics Scoreboard Widgets */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Total Drivers</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", marginTop: "4px" }}>{agents.length}</div>
        </div>
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Online / Available</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--status-delivered)", marginTop: "4px" }}>
            {agents.filter((a) => a.agentProfile?.availability).length}
          </div>
        </div>
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Busy / Active</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--status-pending)", marginTop: "4px" }}>
            {agents.filter((a) => !a.agentProfile?.availability).length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-card" style={{ padding: "20px 24px", borderBottom: "none" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", width: "100%", justifyContent: "space-between" }}>
          <div className="header-search" style={{ width: "100%", maxWidth: "320px" }}>
            <Search className="header-search-icon" />
            <input
              type="text"
              placeholder="Search driver by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <select
              className="filter-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="online">Online / Available</option>
              <option value="busy">Busy / Inactive</option>
            </select>

            <select
              className="filter-select"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="">All Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Driver Cards Grid */}
      {loading ? (
        <div style={{ padding: "40px", textAlignment: "center" }}>Loading fleet drivers...</div>
      ) : filteredAgents.length === 0 ? (
        <div style={{ padding: "40px", textAlignment: "center", color: "var(--text-muted)" }}>
          No delivery agents found matching these criteria.
        </div>
      ) : (
        <div className="agents-grid fade-in">
          {filteredAgents.map((agent) => {
            const stats = getAgentStats(agent.id);
            return (
              <div className="agent-card" key={agent.id} style={{ opacity: agent.isActive ? 1 : 0.6 }}>
                <div className="agent-card-header">
                  <div className="agent-photo">
                    {agent.firstName ? agent.firstName[0].toUpperCase() : "A"}
                  </div>
                  <div className="agent-card-info">
                    <div className="agent-name">
                      {agent.firstName} {agent.lastName}
                    </div>
                    <div className="agent-phone">
                      <Phone size={10} style={{ marginRight: "4px" }} /> {agent.phone}
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <button
                    onClick={() => handleToggleAvailability(agent)}
                    style={{
                      border: "none",
                      background: agent.agentProfile?.availability
                        ? "var(--primary)"
                        : "var(--border)",
                      color: agent.agentProfile?.availability
                        ? "var(--bg-card)"
                        : "var(--text-muted)",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    {agent.agentProfile?.availability ? "Online" : "Offline"}
                  </button>
                </div>

                <div className="agent-card-body">
                  <div>
                    <div className="agent-stat-label">Zone</div>
                    <div className="agent-stat-value" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={12} className="text-muted" /> {agent.agentProfile?.currentZone?.name || `Zone ${agent.agentProfile?.currentZoneId || "N/A"}`}
                    </div>
                  </div>
                  <div>
                    <div className="agent-stat-label">Vehicle Type</div>
                    <div className="agent-stat-value" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Truck size={12} className="text-muted" /> {agent.agentProfile?.vehicleType} ({agent.agentProfile?.vehicleNumber || "N/A"})
                    </div>
                  </div>
                  <div>
                    <div className="agent-stat-label">Today's Jobs</div>
                    <div className="agent-stat-value" style={{ fontWeight: "800" }}>{stats.assignedToday} Jobs</div>
                  </div>
                  <div>
                    <div className="agent-stat-label">SLA Success</div>
                    <div className="agent-stat-value" style={{ color: "var(--status-delivered)" }}>
                      {stats.successRate}%
                    </div>
                  </div>
                </div>

                {/* Sub performance metrics */}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
                  <span>Delivered: <strong>{stats.completed}</strong></span>
                  <span>Failed: <strong>{stats.failed}</strong></span>
                  <span>Active Work: <strong style={{ color: "var(--primary)" }}>{stats.active}</strong></span>
                </div>

                <div className="agent-card-footer">
                  <span className={`status-badge ${agent.isActive ? "delivered" : "failed"}`} style={{ fontSize: "0.65rem", padding: "4px 8px" }}>
                    {agent.isActive ? "Account Active" : "Disabled"}
                  </span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      className="btn btn-secondary btn-icon"
                      onClick={() => {
                        setSelectedAgent(agent);
                        setEditForm({
                          firstName: agent.firstName,
                          lastName: agent.lastName,
                          phone: agent.phone,
                          vehicleNumber: agent.agentProfile?.vehicleNumber || "",
                          vehicleType: agent.agentProfile?.vehicleType || "BIKE",
                          licenseNumber: agent.agentProfile?.licenseNumber || "",
                          currentZoneId: agent.agentProfile?.currentZoneId || "",
                        });
                        setEditOpen(true);
                      }}
                      title="Edit Agent Info"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      className="btn btn-danger btn-icon"
                      onClick={() => handleDisableAgent(agent)}
                      title={agent.isActive ? "Disable Driver" : "Enable Driver"}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Agent Modal */}
      {createOpen && (
        <div className="modal-backdrop" onClick={() => setCreateOpen(false)}>
          <form
            onSubmit={handleCreateAgent}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">Onboard Fleet Agent</span>
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
                      value={newAgent.firstName}
                      onChange={(e) => setNewAgent({ ...newAgent, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newAgent.lastName}
                      onChange={(e) => setNewAgent({ ...newAgent, lastName: e.target.value })}
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
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Vehicle Type *</label>
                    <select
                      className="form-input"
                      value={newAgent.vehicleType}
                      onChange={(e) => setNewAgent({ ...newAgent, vehicleType: e.target.value })}
                    >
                      <option value="BIKE">Bike</option>
                      <option value="SCOOTER">Scooter</option>
                      <option value="CAR">Car</option>
                      <option value="VAN">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Vehicle Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., DL-3C-AB-1234"
                      required
                      value={newAgent.vehicleNumber}
                      onChange={(e) => setNewAgent({ ...newAgent, vehicleNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Driver License No. *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., DL1420110012345"
                      required
                      value={newAgent.licenseNumber}
                      onChange={(e) => setNewAgent({ ...newAgent, licenseNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Fulfillment Zone Hub *</label>
                    <select
                      className="form-input"
                      value={newAgent.currentZoneId}
                      onChange={(e) => setNewAgent({ ...newAgent, currentZoneId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Zone --</option>
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  Onboard Agent
                </button>
              </div>
            </form>
        </div>
      )}

      {/* Edit Agent Modal */}
      {editOpen && selectedAgent && (
        <div className="modal-backdrop" onClick={() => setEditOpen(false)}>
          <form
            onSubmit={handleEditAgent}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">Modify Agent - {selectedAgent.firstName}</span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setEditOpen(false)}
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
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
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
                  />
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Vehicle Type *</label>
                    <select
                      className="form-input"
                      value={editForm.vehicleType}
                      onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                    >
                      <option value="BIKE">Bike</option>
                      <option value="SCOOTER">Scooter</option>
                      <option value="CAR">Car</option>
                      <option value="VAN">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Vehicle Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editForm.vehicleNumber}
                      onChange={(e) => setEditForm({ ...editForm, vehicleNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">Driver License No. *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editForm.licenseNumber}
                      onChange={(e) => setEditForm({ ...editForm, licenseNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label">Fulfillment Zone Hub *</label>
                    <select
                      className="form-input"
                      value={editForm.currentZoneId}
                      onChange={(e) => setEditForm({ ...editForm, currentZoneId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Zone --</option>
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
        </div>
      )}
    </div>
  );
}
