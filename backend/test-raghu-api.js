const API_BASE_URL = "http://localhost:5000/api";

async function testRaghu() {
  try {
    console.log("1. Logging in as Raghu...");
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "raghu@gmail.com", password: "admin" })
    });
    
    const loginData = await loginRes.json();
    if (!loginRes.ok || !loginData.success) {
      console.error("Login failed:", loginData);
      return;
    }
    
    const token = loginData.token;
    const user = loginData.user;
    console.log("Login success! Token acquired. User:", user);
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
    
    const ordersUrl = `${API_BASE_URL}/orders?customerId=${user.id}&limit=100`;
    console.log(`Querying ${ordersUrl}...`);
    const res = await fetch(ordersUrl, { headers });
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
    
  } catch (err) {
    console.error("Execution failed:", err);
  }
}

testRaghu();
