import React, { useState, useEffect } from "react";
import { User, Building, CloudLightning, ToggleLeft, Key, Check } from "lucide-react";

export default function SettingsModule({ user, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("profile"); // profile, company, apis, system
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Forms state loaded from localStorage or defaults
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "System",
    lastName: user?.lastName || "Admin",
    email: user?.email || "admin@gmail.com",
    phone: user?.phone || "9999999999",
    currentPassword: "",
    newPassword: "",
  });

  const [companyForm, setCompanyForm] = useState({
    name: "LastMile Delivery Tracker Pvt Ltd",
    registrationNo: "CIN-U72200DL2024PTC123456",
    address: "Fulfillment Block, Sector 62, Noida, UP, 201301",
    supportEmail: "support@lastmiletracker.com",
    supportPhone: "+91-120-9999999",
  });

  const [apiForm, setApiForm] = useState({
    smtpHost: "smtp.mailgun.org",
    smtpPort: "587",
    smtpUsername: "postmaster@lastmiletracker.com",
    smtpPassword: "••••••••••••••••",
    smsApiUrl: "https://api.twilio.com/2010-04-01/Accounts",
    smsToken: "••••••••••••••••••••••••••••••••",
    mapsKey: "AIzaSyD-••••••••••••••••••••-•••••••",
  });

  const [sysPrefs, setSysPrefs] = useState({
    timezone: "Asia/Kolkata",
    currency: "INR (₹)",
    unitSystem: "Metric (KG, CM)",
    autoDispatch: "true",
  });

  useEffect(() => {
    // Load persisted settings
    const savedCompany = localStorage.getItem("settings_company");
    const savedApis = localStorage.getItem("settings_apis");
    const savedPrefs = localStorage.getItem("settings_prefs");

    if (savedCompany) setCompanyForm(JSON.parse(savedCompany));
    if (savedApis) setApiForm(JSON.parse(savedApis));
    if (savedPrefs) setSysPrefs(JSON.parse(savedPrefs));
  }, []);

  const triggerSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
      });
    }
    triggerSaveSuccess();
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("settings_company", JSON.stringify(companyForm));
    triggerSaveSuccess();
  };

  const handleApiSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("settings_apis", JSON.stringify(apiForm));
    triggerSaveSuccess();
  };

  const handlePrefsSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("settings_prefs", JSON.stringify(sysPrefs));
    triggerSaveSuccess();
  };

  return (
    <div className="fade-in">
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Console Settings</h1>
          <p className="page-subtitle">Configure administrative policies, corporate credentials, and server nodes</p>
        </div>
        {saveSuccess && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "var(--status-delivered-bg)",
              color: "var(--status-delivered-text)",
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              fontSize: "0.85rem",
              fontWeight: "700",
              animation: "pulse 1.5s infinite",
            }}
          >
            <Check size={16} /> Preferences Saved Successfully
          </div>
        )}
      </div>

      {/* Tabs list */}
      <div className="tabs-navigation">
        <button
          className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} /> Admin Profile
        </button>
        <button
          className={`tab-btn ${activeTab === "company" ? "active" : ""}`}
          onClick={() => setActiveTab("company")}
        >
          <Building size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} /> Company Profile
        </button>
        <button
          className={`tab-btn ${activeTab === "apis" ? "active" : ""}`}
          onClick={() => setActiveTab("apis")}
        >
          <CloudLightning size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} /> API Integrations
        </button>
        <button
          className={`tab-btn ${activeTab === "system" ? "active" : ""}`}
          onClick={() => setActiveTab("system")}
        >
          <ToggleLeft size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} /> Preferences
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === "profile" && (
        <div className="table-card" style={{ padding: "28px", maxWidth: "680px" }}>
          <form onSubmit={handleProfileSubmit}>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "20px" }}>Credentials Update</h3>
            
            <div className="form-group row">
              <div>
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group row">
              <div>
                <label className="form-label">Corporate Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  disabled
                  value={profileForm.email}
                />
              </div>
              <div>
                <label className="form-label">Admin Phone *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "20px 0" }} />

            <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Key size={16} /> Security Settings
            </h3>
            
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={profileForm.currentPassword}
                onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={profileForm.newPassword}
                onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Profile Preferences
            </button>
          </form>
        </div>
      )}

      {/* Company Form */}
      {activeTab === "company" && (
        <div className="table-card" style={{ padding: "28px", maxWidth: "680px" }}>
          <form onSubmit={handleCompanySubmit}>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "20px" }}>Corporate Details</h3>

            <div className="form-group">
              <label className="form-label">Registered Corporate Name</label>
              <input
                type="text"
                className="form-input"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business Incorporation CIN (India)</label>
              <input
                type="text"
                className="form-input"
                value={companyForm.registrationNo}
                onChange={(e) => setCompanyForm({ ...companyForm, registrationNo: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Headquarters Registered Address</label>
              <input
                type="text"
                className="form-input"
                value={companyForm.address}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
              />
            </div>

            <div className="form-group row">
              <div>
                <label className="form-label">Billing Support Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={companyForm.supportEmail}
                  onChange={(e) => setCompanyForm({ ...companyForm, supportEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">Support Helpline</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.supportPhone}
                  onChange={(e) => setCompanyForm({ ...companyForm, supportPhone: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Company Profile
            </button>
          </form>
        </div>
      )}

      {/* APIs Integration Form */}
      {activeTab === "apis" && (
        <div className="table-card" style={{ padding: "28px", maxWidth: "680px" }}>
          <form onSubmit={handleApiSubmit}>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "20px" }}>SMTP Gateway Configuration</h3>
            
            <div className="form-group row">
              <div>
                <label className="form-label">SMTP Host</label>
                <input
                  type="text"
                  className="form-input"
                  value={apiForm.smtpHost}
                  onChange={(e) => setApiForm({ ...apiForm, smtpHost: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">SMTP Port</label>
                <input
                  type="text"
                  className="form-input"
                  value={apiForm.smtpPort}
                  onChange={(e) => setApiForm({ ...apiForm, smtpPort: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group row">
              <div>
                <label className="form-label">SMTP Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={apiForm.smtpUsername}
                  onChange={(e) => setApiForm({ ...apiForm, smtpUsername: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">SMTP Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={apiForm.smtpPassword}
                  onChange={(e) => setApiForm({ ...apiForm, smtpPassword: e.target.value })}
                />
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "20px 0" }} />

            <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "20px" }}>SMS Gateway (Twilio/BulkSMS)</h3>

            <div className="form-group row">
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">SMS Gateway API Endpoint</label>
                <input
                  type="text"
                  className="form-input"
                  value={apiForm.smsApiUrl}
                  onChange={(e) => setApiForm({ ...apiForm, smsApiUrl: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Auth Token API Key</label>
              <input
                type="password"
                className="form-input"
                value={apiForm.smsToken}
                onChange={(e) => setApiForm({ ...apiForm, smsToken: e.target.value })}
              />
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "20px 0" }} />

            <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "20px" }}>Google Maps Geocoding Developers</h3>

            <div className="form-group">
              <label className="form-label">Google Maps SDK API Key</label>
              <input
                type="password"
                className="form-input"
                value={apiForm.mapsKey}
                onChange={(e) => setApiForm({ ...apiForm, mapsKey: e.target.value })}
              />
              <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "6px" }}>
                Required to render delivery geocoding bounds and locate driver coordinates.
              </p>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Integration Nodes
            </button>
          </form>
        </div>
      )}

      {/* System Preferences Form */}
      {activeTab === "system" && (
        <div className="table-card" style={{ padding: "28px", maxWidth: "680px" }}>
          <form onSubmit={handlePrefsSubmit}>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "20px" }}>System Preferences</h3>

            <div className="form-group row">
              <div>
                <label className="form-label">Default Timezone</label>
                <select
                  className="form-input"
                  value={sysPrefs.timezone}
                  onChange={(e) => setSysPrefs({ ...sysPrefs, timezone: e.target.value })}
                >
                  <option value="Asia/Kolkata">India (IST - GMT+5:30)</option>
                  <option value="UTC">UTC / GMT</option>
                  <option value="America/New_York">New York (EST - GMT-5)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Currency Symbol</label>
                <select
                  className="form-input"
                  value={sysPrefs.currency}
                  onChange={(e) => setSysPrefs({ ...sysPrefs, currency: e.target.value })}
                >
                  <option value="INR (₹)">Rupees (INR - ₹)</option>
                  <option value="USD ($)">Dollars (USD - $)</option>
                  <option value="EUR (€)">Euros (EUR - €)</option>
                </select>
              </div>
            </div>

            <div className="form-group row">
              <div>
                <label className="form-label">Default Metric Units</label>
                <select
                  className="form-input"
                  value={sysPrefs.unitSystem}
                  onChange={(e) => setSysPrefs({ ...sysPrefs, unitSystem: e.target.value })}
                >
                  <option value="Metric (KG, CM)">Metric (KG, CM)</option>
                  <option value="Imperial (LB, IN)">Imperial (LBs, IN)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Auto Driver Allocator engine</label>
                <select
                  className="form-input"
                  value={sysPrefs.autoDispatch}
                  onChange={(e) => setSysPrefs({ ...sysPrefs, autoDispatch: e.target.value })}
                >
                  <option value="true">Enable Auto-Assignment Algorithm</option>
                  <option value="false">Manual Dispatcher Select Only</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Preferences
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
