const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const showToast = (message, type = "success") => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `custom-toast ${type}`;
  toast.style.cssText = `
    min-width: 280px;
    max-width: 400px;
    padding: 12px 18px;
    border-radius: var(--radius-sm, 6px);
    background-color: var(--bg-card, #fff);
    border: 1px solid var(--border, #e4e4e7);
    color: var(--text-primary, #18181b);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    pointer-events: auto;
    animation: toastFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transition: all 0.3s ease;
  `;

  if (type === "success") {
    toast.style.borderLeft = "4px solid var(--success, #10b981)";
  } else {
    toast.style.borderLeft = "4px solid var(--danger, #ef4444)";
  }

  toast.innerHTML = `
    <span>${message}</span>
    <button style="background: none; border: none; font-size: 0.95rem; cursor: pointer; color: var(--text-muted, #71717a); padding-left: 12px;">✕</button>
  `;

  toast.querySelector("button").onclick = () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  };

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
};

const getSuccessMessage = (url, method) => {
  const lowercaseUrl = url.toLowerCase();
  
  if (method === "DELETE") {
    return "Delete action successful";
  }

  if (lowercaseUrl.includes("/orders")) {
    if (lowercaseUrl.includes("/assign-agent")) {
      return "Agent assigned successful";
    }
    if (lowercaseUrl.includes("/status")) {
      return "Order status updated successful";
    }
    return "Order placed successful";
  }
  
  if (lowercaseUrl.includes("/customers")) {
    return method === "POST" ? "Customer added successful" : "Customer updated successful";
  }

  if (lowercaseUrl.includes("/agents")) {
    if (lowercaseUrl.includes("/availability")) {
      return "Agent status updated successful";
    }
    return method === "POST" ? "Agent onboarding successful" : "Agent details updated successful";
  }

  if (lowercaseUrl.includes("/zones")) {
    return method === "POST" ? "Zone activated successful" : "Zone modified successful";
  }

  if (lowercaseUrl.includes("/areas")) {
    return method === "POST" ? "Area registered successful" : "Area modified successful";
  }

  if (lowercaseUrl.includes("/rates")) {
    return method === "POST" ? "Rate rule created successful" : "Rate rule updated successful";
  }

  return "Action successful";
};

const customFetch = async (url, options = {}) => {
  const method = options.method || "GET";
  const response = await window.fetch(url, options);
  
  if (response.ok && ["POST", "PUT", "DELETE", "PATCH"].includes(method.toUpperCase()) && !url.includes("/auth/login")) {
    const message = getSuccessMessage(url, method);
    showToast(message, "success");
  }
  
  return response;
};

const fetch = customFetch;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Force reload to send user back to the login overlay
      window.location.href = "/";
    }
    throw new Error(data.message || `API error: ${response.status}`);
  }
  return data;
};

export const api = {
  // Config
  getConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return handleResponse(response);
  },

  // Auth
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  activateAgent: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/activate-agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(response);
  },

  // Dashboard
  getDashboardData: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Orders
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== "")
    ).toString();
    const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getOrderById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  estimateOrderCharges: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/estimate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  assignAgent: async (orderId, agentId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/assign-agent`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ agentId: Number(agentId) }),
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (orderId, status, remarks = "") => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status, remarks }),
    });
    return handleResponse(response);
  },

  // Customers
  getCustomers: async () => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getCustomerById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createCustomer: async (customerData) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(customerData),
    });
    return handleResponse(response);
  },

  updateCustomer: async (id, customerData) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(customerData),
    });
    return handleResponse(response);
  },

  deleteCustomer: async (id) => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Agents
  getAgents: async () => {
    const response = await fetch(`${API_BASE_URL}/agents`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAgentById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createAgent: async (agentData) => {
    const response = await fetch(`${API_BASE_URL}/agents`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(agentData),
    });
    return handleResponse(response);
  },

  updateAgent: async (id, agentData) => {
    const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(agentData),
    });
    return handleResponse(response);
  },

  deleteAgent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateAgentAvailability: async (id, availability) => {
    const response = await fetch(`${API_BASE_URL}/agents/${id}/availability`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ availability: Boolean(availability) }),
    });
    return handleResponse(response);
  },

  // Zones
  getZones: async () => {
    const response = await fetch(`${API_BASE_URL}/zones`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getZoneById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/zones/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createZone: async (zoneData) => {
    const response = await fetch(`${API_BASE_URL}/zones`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(zoneData),
    });
    return handleResponse(response);
  },

  updateZone: async (id, zoneData) => {
    const response = await fetch(`${API_BASE_URL}/zones/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(zoneData),
    });
    return handleResponse(response);
  },

  deleteZone: async (id) => {
    const response = await fetch(`${API_BASE_URL}/zones/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Areas
  getAreas: async () => {
    const response = await fetch(`${API_BASE_URL}/areas`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAreaById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createArea: async (areaData) => {
    const response = await fetch(`${API_BASE_URL}/areas`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(areaData),
    });
    return handleResponse(response);
  },

  updateArea: async (id, areaData) => {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(areaData),
    });
    return handleResponse(response);
  },

  deleteArea: async (id) => {
    const response = await fetch(`${API_BASE_URL}/areas/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Rates
  getRates: async () => {
    const response = await fetch(`${API_BASE_URL}/rates`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getRateById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/rates/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createRate: async (rateData) => {
    const response = await fetch(`${API_BASE_URL}/rates`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        ...rateData,
        pickupZoneId: Number(rateData.pickupZoneId),
        dropZoneId: Number(rateData.dropZoneId),
        ratePerKg: Number(rateData.ratePerKg),
        codCharge: Number(rateData.codCharge || 0),
      }),
    });
    return handleResponse(response);
  },

  updateRate: async (id, rateData) => {
    const response = await fetch(`${API_BASE_URL}/rates/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        ...rateData,
        pickupZoneId: Number(rateData.pickupZoneId),
        dropZoneId: Number(rateData.dropZoneId),
        ratePerKg: Number(rateData.ratePerKg),
        codCharge: Number(rateData.codCharge || 0),
      }),
    });
    return handleResponse(response);
  },

  deleteRate: async (id) => {
    const response = await fetch(`${API_BASE_URL}/rates/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // Agent Dashboard Endpoints
  getAgentProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/agent-dashboard/profile`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateAgentProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/agent-dashboard/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  updateAgentAvailability: async (availability) => {
    const response = await fetch(`${API_BASE_URL}/agent-dashboard/availability`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ availability: Boolean(availability) }),
    });
    return handleResponse(response);
  },

  getAgentOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/agent-dashboard/orders`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAgentOrderById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/agent-dashboard/orders/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateAgentOrderStatus: async (id, status, remarks = "") => {
    const response = await fetch(`${API_BASE_URL}/agent-dashboard/orders/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status, remarks }),
    });
    return handleResponse(response);
  },

  getAgentNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/agent-dashboard/notifications`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};
