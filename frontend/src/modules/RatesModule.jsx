import React, { useState, useEffect } from "react";
import { DollarSign, Plus, Edit2, Trash2, Calendar, TrendingUp, MapPin } from "lucide-react";
import { api } from "../utils/api";

export default function RatesModule() {
  const [rates, setRates] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("intra"); // intra, inter, b2b, b2c

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState(null);

  // Forms state
  const [rateForm, setRateForm] = useState({
    pickupZoneId: "",
    dropZoneId: "",
    orderType: "B2C",
    ratePerKg: "",
    codCharge: "",
    effectiveFrom: new Date().toISOString().split("T")[0],
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [ratesRes, zonesRes] = await Promise.all([api.getRates(), api.getZones()]);
      if (ratesRes.success) setRates(ratesRes.data);
      if (zonesRes.success) setZones(zonesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (
        !rateForm.pickupZoneId ||
        !rateForm.dropZoneId ||
        !rateForm.orderType ||
        !rateForm.ratePerKg
      ) {
        setErrorMessage("Please fill all required fields.");
        return;
      }

      const payload = {
        pickupZoneId: Number(rateForm.pickupZoneId),
        dropZoneId: Number(rateForm.dropZoneId),
        orderType: rateForm.orderType,
        ratePerKg: Number(rateForm.ratePerKg),
        codCharge: Number(rateForm.codCharge || 0),
        effectiveFrom: new Date(rateForm.effectiveFrom).toISOString(),
      };

      if (editingRate) {
        const res = await api.updateRate(editingRate.id, payload);
        if (res.success) {
          setModalOpen(false);
          setEditingRate(null);
          loadData();
        }
      } else {
        const res = await api.createRate(payload);
        if (res.success) {
          setModalOpen(false);
          loadData();
        }
      }

      setRateForm({
        pickupZoneId: "",
        dropZoneId: "",
        orderType: "B2C",
        ratePerKg: "",
        codCharge: "",
        effectiveFrom: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to save rate.");
    }
  };

  const handleDeleteRate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rate card?")) return;
    try {
      const res = await api.deleteRate(id);
      if (res.success) loadData();
    } catch (err) {
      alert(err.message || "Failed to delete rate card.");
    }
  };

  // Filter rates by tab criteria
  const getFilteredRates = () => {
    switch (activeTab) {
      case "intra":
        return rates.filter((r) => r.pickupZoneId === r.dropZoneId);
      case "inter":
        return rates.filter((r) => r.pickupZoneId !== r.dropZoneId);
      case "b2b":
        return rates.filter((r) => r.orderType === "B2B");
      case "b2c":
        return rates.filter((r) => r.orderType === "B2C");
      default:
        return rates;
    }
  };

  const filteredRates = getFilteredRates();

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Rate Card Catalog</h1>
          <p className="page-subtitle">Configure cargo weight pricing rules and zone logistics margins</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Rate Card
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-btn ${activeTab === "intra" ? "active" : ""}`}
          onClick={() => setActiveTab("intra")}
        >
          Intra Zone (Local Same-Hub)
        </button>
        <button
          className={`tab-btn ${activeTab === "inter" ? "active" : ""}`}
          onClick={() => setActiveTab("inter")}
        >
          Inter Zone (Cross-Hub Transit)
        </button>
        <button
          className={`tab-btn ${activeTab === "b2b" ? "active" : ""}`}
          onClick={() => setActiveTab("b2b")}
        >
          B2B Rates
        </button>
        <button
          className={`tab-btn ${activeTab === "b2c" ? "active" : ""}`}
          onClick={() => setActiveTab("b2c")}
        >
          B2C Rates
        </button>
      </div>

      {/* Rate Table */}
      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading rate cards...</div>
          ) : filteredRates.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No rate cards found in this category. Click 'Add Rate Card' to register pricing rules.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pickup Hub Zone</th>
                  <th>Drop Hub Zone</th>
                  <th>Order Type</th>
                  <th>Base Rate / KG</th>
                  <th>COD Handling Charge</th>
                  <th>Effective Date</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRates.map((rate) => (
                  <tr key={rate.id}>
                    <td style={{ fontWeight: "700" }}>
                      <MapPin size={12} className="text-muted" style={{ marginRight: "4px", verticalAlign: "middle" }} /> {rate.pickupZone?.name || `Zone ${rate.pickupZoneId}`}
                    </td>
                    <td style={{ fontWeight: "700" }}>
                      <MapPin size={12} className="text-muted" style={{ marginRight: "4px", verticalAlign: "middle" }} /> {rate.dropZone?.name || `Zone ${rate.dropZoneId}`}
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      <span
                        className={`status-badge ${
                          rate.orderType === "B2B" ? "assigned" : "out_for_delivery"
                        }`}
                        style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                      >
                        {rate.orderType}
                      </span>
                    </td>
                    <td style={{ fontWeight: "800", color: "var(--primary)", fontSize: "0.9rem" }}>
                      ₹{Number(rate.ratePerKg).toFixed(2)}
                    </td>
                    <td style={{ fontWeight: "700" }}>₹{Number(rate.codCharge).toFixed(2)}</td>
                    <td>{new Date(rate.effectiveFrom).toLocaleDateString()}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      {new Date(rate.updatedAt).toLocaleString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => {
                            setEditingRate(rate);
                            setRateForm({
                              pickupZoneId: String(rate.pickupZoneId),
                              dropZoneId: String(rate.dropZoneId),
                              orderType: rate.orderType,
                              ratePerKg: String(rate.ratePerKg),
                              codCharge: String(rate.codCharge),
                              effectiveFrom: new Date(rate.effectiveFrom)
                                .toISOString()
                                .split("T")[0],
                            });
                            setModalOpen(true);
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-icon"
                          onClick={() => handleDeleteRate(rate.id)}
                        >
                          <Trash2 size={14} />
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

      {/* Modal Add / Edit Rate */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => { setModalOpen(false); setEditingRate(null); }}>
          <form
            onSubmit={handleRateSubmit}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-title">
                {editingRate ? "Modify Rate Card Details" : "Link New Weight Pricing Rule"}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => { setModalOpen(false); setEditingRate(null); }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
                {errorMessage && <div className="auth-error">{errorMessage}</div>}

                <div className="form-group row">
                  <div>
                    <label className="form-label">Pickup Hub Zone *</label>
                    <select
                      className="form-input"
                      required
                      value={rateForm.pickupZoneId}
                      onChange={(e) => setRateForm({ ...rateForm, pickupZoneId: e.target.value })}
                      disabled={editingRate !== null}
                    >
                      <option value="">-- Choose Zone --</option>
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Drop Hub Zone *</label>
                    <select
                      className="form-input"
                      required
                      value={rateForm.dropZoneId}
                      onChange={(e) => setRateForm({ ...rateForm, dropZoneId: e.target.value })}
                      disabled={editingRate !== null}
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

                <div className="form-group row">
                  <div>
                    <label className="form-label">Order Type / Client Segment *</label>
                    <select
                      className="form-input"
                      required
                      value={rateForm.orderType}
                      onChange={(e) => setRateForm({ ...rateForm, orderType: e.target.value })}
                      disabled={editingRate !== null}
                    >
                      <option value="B2C">B2C Retail</option>
                      <option value="B2B">B2B Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Base Rate per KG *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      value={rateForm.ratePerKg}
                      onChange={(e) => setRateForm({ ...rateForm, ratePerKg: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  <div>
                    <label className="form-label">COD Surcharge Handling (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      value={rateForm.codCharge}
                      onChange={(e) => setRateForm({ ...rateForm, codCharge: e.target.value })}
                      placeholder="e.g., 50.00"
                    />
                  </div>
                  <div>
                    <label className="form-label">Effective Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={rateForm.effectiveFrom}
                      onChange={(e) => setRateForm({ ...rateForm, effectiveFrom: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setModalOpen(false); setEditingRate(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRate ? "Update Pricing" : "Register Pricing"}
                </button>
              </div>
            </form>
        </div>
      )}
    </div>
  );
}
