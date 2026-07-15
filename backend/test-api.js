const API_BASE_URL = "http://localhost:5000/api";

async function runTests() {
  try {
    console.log("1. Testing login...");
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@gmail.com", password: "admin" })
    });
    
    const loginData = await loginRes.json();
    if (!loginRes.ok || !loginData.success) {
      console.error("Login failed:", loginData);
      return;
    }
    
    const token = loginData.token;
    console.log("Login success! Token acquired.");
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
    
    const endpoints = [
      "/admin/dashboard",
      "/orders",
      "/customers",
      "/agents",
      "/zones",
      "/areas",
      "/rates"
    ];
    
    for (const endpoint of endpoints) {
      console.log(`Querying ${endpoint}...`);
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      const data = await res.json();
      console.log(`Response ${endpoint}: Status ${res.status}, Success: ${data.success}, Items: ${Array.isArray(data.data) ? data.data.length : 'object'}`);
      if (!data.success) {
        console.error(`Error in ${endpoint}:`, data);
      }
    }
    
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

runTests();
