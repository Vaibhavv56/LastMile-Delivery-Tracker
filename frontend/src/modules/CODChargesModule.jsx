import React, { useState, useEffect } from "react";
import { CircleDollarSign, Edit2, Check, X, ShieldAlert, MapPin } from "lucide-react";
import { api } from "../utils/api";

export default function CODChargesModule() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await api.getRates();
      if (res.success) {
        setRates(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStartEdit = (rate) => {
    setEditingId(rate.id);
    setEditValue(String(rate.codCharge));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setErrorMessage("");
  };

  const handleSaveCOD = async (rate) => {
    setErrorMessage("");
    try {
      const parsedVal = Number(editValue);
      if (isNaN(parsedVal) || parsedVal < 0) {
        setErrorMessage("Please enter a valid positive number.");
        return;
      }

      const res = await api.updateRate(rate.id, {
        pickupZoneId: rate.pickupZoneId,
        dropZoneId: rate.dropZoneId,
        orderType: rate.orderType,
        ratePerKg: rate.ratePerKg,
        codCharge: parsedVal,
        effectiveFrom: rate.effectiveFrom,
      });

      if (res.success) {
        setEditingId(null);
        loadData();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to update COD Charge.");
    }
  };

  // Aggregated averages for summary widgets
  const b2bCodRates = rates.filter((r) => r.orderType === "B2B");
  const b2cCodRates = rates.filter((r) => r.orderType === "B2C");

  const avgB2bCod =
    b2bCodRates.length > 0
      ? b2bCodRates.reduce((acc, r) => acc + Number(r.codCharge), 0) / b2bCodRates.length
      : 0;

  const avgB2cCod =
    b2cCodRates.length > 0
      ? b2cCodRates.reduce((acc, r) => acc + Number(r.codCharge), 0) / b2cCodRates.length
      : 0;

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div>
          <h1 className="page-title">COD Surcharges Configuration</h1>
          <p className="page-subtitle">Configure Cash on Delivery logistics processing premiums</p>
        </div>
      </div>

      {/* Aggregate Insight Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "20px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Average B2C COD Surcharge</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--status-pending)", marginTop: "4px" }}>
            ₹{avgB2cCod.toFixed(2)}
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Based on {b2cCodRates.length} retail zone rates
          </p>
        </div>

        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "20px", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Average B2B COD Surcharge</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--primary)", marginTop: "4px" }}>
            ₹{avgB2bCod.toFixed(2)}
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Based on {b2bCodRates.length} corporate zone rates
          </p>
        </div>
      </div>

      {/* COD Charge Edit table */}
      <div className="table-card">
        <div className="table-controls">
          <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>COD Surcharges by Route Zone</h3>
          {errorMessage && <span style={{ color: "var(--status-failed)", fontSize: "0.8rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}><ShieldAlert size={14} /> {errorMessage}</span>}
        </div>
        <div className="table-container">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading COD charges...</div>
          ) : rates.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No route rate cards registered yet. COD charges are configured on rate cards.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Pickup Hub Zone</th>
                  <th>Drop Hub Zone</th>
                  <th>Order Type / Segment</th>
                  <th>COD Surcharge (₹)</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr key={rate.id}>
                    <td style={{ fontWeight: "700" }}>
                      <MapPin size={12} className="text-muted" style={{ marginRight: "4px", verticalAlign: "middle" }} /> {rate.pickupZone?.name || `Zone ${rate.pickupZoneId}`}
                    </td>
                    <td style={{ fontWeight: "700" }}>
                      <MapPin size={12} className="text-muted" style={{ marginRight: "4px", verticalAlign: "middle" }} /> {rate.dropZone?.name || `Zone ${rate.dropZoneId}`}
                    </td>
                    <td>
                      <span className={`status-badge ${rate.orderType === "B2B" ? "assigned" : "out_for_delivery"}`}>
                        {rate.orderType}
                      </span>
                    </td>
                    <td>
                      {editingId === rate.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: "700" }}>₹</span>
                          <input
                            type="number"
                            className="form-input"
                            style={{ width: "100px", padding: "4px 8px" }}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                          ₹{Number(rate.codCharge).toFixed(2)}
                        </strong>
                      )}
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      {new Date(rate.updatedAt).toLocaleString()}
                    </td>
                    <td>
                      {editingId === rate.id ? (
                        <div className="action-buttons">
                          <button
                            className="btn btn-primary btn-icon"
                            style={{ backgroundColor: "var(--status-delivered)", width: "28px", height: "28px" }}
                            onClick={() => handleSaveCOD(rate)}
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            className="btn btn-secondary btn-icon"
                            style={{ width: "28px", height: "28px" }}
                            onClick={handleCancelEdit}
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-secondary btn-icon"
                          style={{ width: "28px", height: "28px" }}
                          onClick={() => handleStartEdit(rate)}
                          title="Edit COD Charge"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
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
