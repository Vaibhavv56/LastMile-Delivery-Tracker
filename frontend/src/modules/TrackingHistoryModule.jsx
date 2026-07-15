import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  History, 
  Clock, 
  User, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert,
  Globe,
  Truck,
  MapPin,
  Compass,
  CheckCircle,
  AlertTriangle,
  Map,
  Layers,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { api } from "../utils/api";
import { io } from "socket.io-client";

// WebSockets connection URL derived from API base URL
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const socketUrl = apiBaseUrl.replace("/api", "");

// 20 Predefined Pune Region Polygons for Maharashtra Cities
const PREDEFINED_POLYGONS = [
  // --- PUNE ---
  {
    id: "Hinjewadi",
    name: "Hinjewadi",
    points: [
      [18.610, 73.720],
      [18.610, 73.770],
      [18.570, 73.770],
      [18.570, 73.720]
    ]
  },
  {
    id: "Wakad",
    name: "Wakad",
    points: [
      [18.610, 73.770],
      [18.610, 73.820],
      [18.570, 73.820],
      [18.570, 73.770]
    ]
  },
  {
    id: "Pimpri-Chinchwad",
    name: "Pimpri-Chinchwad",
    points: [
      [18.650, 73.770],
      [18.650, 73.820],
      [18.610, 73.820],
      [18.610, 73.770]
    ]
  },
  {
    id: "Bhosari",
    name: "Bhosari",
    points: [
      [18.650, 73.820],
      [18.650, 73.870],
      [18.610, 73.870],
      [18.610, 73.820]
    ]
  },
  {
    id: "Bavdhan",
    name: "Bavdhan",
    points: [
      [18.570, 73.720],
      [18.570, 73.770],
      [18.490, 73.770],
      [18.490, 73.720]
    ]
  },
  {
    id: "Baner",
    name: "Baner",
    points: [
      [18.570, 73.770],
      [18.570, 73.820],
      [18.540, 73.820],
      [18.540, 73.770]
    ]
  },
  {
    id: "Pashan",
    name: "Pashan",
    points: [
      [18.540, 73.770],
      [18.540, 73.820],
      [18.510, 73.820],
      [18.510, 73.770]
    ]
  },
  {
    id: "Aundh",
    name: "Aundh",
    points: [
      [18.610, 73.820],
      [18.610, 73.860],
      [18.540, 73.860],
      [18.540, 73.820]
    ]
  },
  {
    id: "Kothrud",
    name: "Kothrud",
    points: [
      [18.510, 73.770],
      [18.510, 73.820],
      [18.480, 73.820],
      [18.480, 73.770]
    ]
  },
  {
    id: "Warje",
    name: "Warje",
    points: [
      [18.480, 73.720],
      [18.480, 73.800],
      [18.440, 73.800],
      [18.440, 73.720]
    ]
  },
  {
    id: "Sinhagad Road",
    name: "Sinhagad Road",
    points: [
      [18.480, 73.800],
      [18.480, 73.840],
      [18.440, 73.840],
      [18.440, 73.800]
    ]
  },
  {
    id: "Shivajinagar",
    name: "Shivajinagar",
    points: [
      [18.540, 73.820],
      [18.540, 73.860],
      [18.510, 73.860],
      [18.510, 73.820]
    ]
  },
  {
    id: "Swargate",
    name: "Swargate",
    points: [
      [18.510, 73.820],
      [18.510, 73.860],
      [18.480, 73.860],
      [18.480, 73.820]
    ]
  },
  {
    id: "Katraj",
    name: "Katraj",
    points: [
      [18.480, 73.840],
      [18.480, 73.880],
      [18.440, 73.880],
      [18.440, 73.840]
    ]
  },
  {
    id: "Yerwada",
    name: "Yerwada",
    points: [
      [18.610, 73.860],
      [18.610, 73.900],
      [18.540, 73.900],
      [18.540, 73.860]
    ]
  },
  {
    id: "Camp",
    name: "Camp",
    points: [
      [18.540, 73.860],
      [18.540, 73.900],
      [18.480, 73.900],
      [18.480, 73.860]
    ]
  },
  {
    id: "Kalyani Nagar",
    name: "Kalyani Nagar",
    points: [
      [18.580, 73.900],
      [18.580, 73.940],
      [18.540, 73.940],
      [18.540, 73.900]
    ]
  },
  {
    id: "Viman Nagar",
    name: "Viman Nagar",
    points: [
      [18.620, 73.900],
      [18.620, 73.940],
      [18.580, 73.940],
      [18.580, 73.900]
    ]
  },
  {
    id: "Kharadi",
    name: "Kharadi",
    points: [
      [18.620, 73.940],
      [18.620, 73.980],
      [18.540, 73.980],
      [18.540, 73.940]
    ]
  },
  {
    id: "Hadapsar",
    name: "Hadapsar",
    points: [
      [18.540, 73.900],
      [18.540, 73.980],
      [18.440, 73.980],
      [18.440, 73.900]
    ]
  },
  // --- MUMBAI ---
  {
    id: "Bandra-Khar",
    name: "Bandra-Khar",
    points: [
      [19.070, 72.820],
      [19.070, 72.850],
      [19.040, 72.850],
      [19.040, 72.820]
    ]
  },
  {
    id: "Andheri West",
    name: "Andheri West",
    points: [
      [19.140, 72.810],
      [19.140, 72.840],
      [19.100, 72.840],
      [19.100, 72.810]
    ]
  },
  {
    id: "Andheri East",
    name: "Andheri East",
    points: [
      [19.140, 72.840],
      [19.140, 72.880],
      [19.100, 72.880],
      [19.100, 72.840]
    ]
  },
  {
    id: "Borivali",
    name: "Borivali",
    points: [
      [19.240, 72.820],
      [19.240, 72.860],
      [19.200, 72.860],
      [19.200, 72.820]
    ]
  },
  {
    id: "Dadar-Prabhadevi",
    name: "Dadar-Prabhadevi",
    points: [
      [19.040, 72.820],
      [19.040, 72.850],
      [19.000, 72.850],
      [19.000, 72.820]
    ]
  },
  {
    id: "Colaba-Fort",
    name: "Colaba-Fort",
    points: [
      [18.940, 72.800],
      [18.940, 72.840],
      [18.890, 72.840],
      [18.890, 72.800]
    ]
  },
  {
    id: "Kurla-Ghatkopar",
    name: "Kurla-Ghatkopar",
    points: [
      [19.100, 72.880],
      [19.100, 72.920],
      [19.050, 72.920],
      [19.050, 72.880]
    ]
  },
  {
    id: "Thane West",
    name: "Thane West",
    points: [
      [19.220, 72.950],
      [19.220, 72.990],
      [19.170, 72.990],
      [19.170, 72.950]
    ]
  },
  // --- NAGPUR ---
  {
    id: "Dharampeth",
    name: "Dharampeth",
    points: [
      [21.150, 79.040],
      [21.150, 79.080],
      [21.120, 79.080],
      [21.120, 79.040]
    ]
  },
  {
    id: "Sitabuldi-Sadar",
    name: "Sitabuldi-Sadar",
    points: [
      [21.170, 79.070],
      [21.170, 79.100],
      [21.130, 79.100],
      [21.130, 79.070]
    ]
  },
  {
    id: "Wardhaman Nagar",
    name: "Wardhaman Nagar",
    points: [
      [21.170, 79.110],
      [21.170, 79.150],
      [21.130, 79.150],
      [21.130, 79.110]
    ]
  },
  {
    id: "Pratap Nagar",
    name: "Pratap Nagar",
    points: [
      [21.120, 79.040],
      [21.120, 79.080],
      [21.090, 79.080],
      [21.090, 79.040]
    ]
  },
  {
    id: "Manish Nagar",
    name: "Manish Nagar",
    points: [
      [21.100, 79.080],
      [21.100, 79.120],
      [21.070, 79.120],
      [21.070, 79.080]
    ]
  },
  // --- NASHIK ---
  {
    id: "Panchavati",
    name: "Panchavati",
    points: [
      [20.030, 73.780],
      [20.030, 73.820],
      [20.000, 73.820],
      [20.000, 73.780]
    ]
  },
  {
    id: "Indira Nagar",
    name: "Indira Nagar",
    points: [
      [19.980, 73.780],
      [19.980, 73.820],
      [19.950, 73.820],
      [19.950, 73.780]
    ]
  },
  {
    id: "Satpur",
    name: "Satpur",
    points: [
      [20.020, 73.720],
      [20.020, 73.770],
      [19.970, 73.770],
      [19.970, 73.720]
    ]
  },
  {
    id: "CIDCO",
    name: "CIDCO",
    points: [
      [20.000, 73.750],
      [20.000, 73.790],
      [19.960, 73.790],
      [19.960, 73.750]
    ]
  }
];

export default function TrackingHistoryModule() {
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // WebSocket Connection States
  const [socketConnected, setSocketConnected] = useState(false);

  // Leaflet Map Refs
  const mapInstanceRef = useRef(null);
  const polygonsGroupRef = useRef(null);
  const areasGroupRef = useRef(null);
  const agentsGroupRef = useRef(null);
  const ordersGroupRef = useRef(null);
  const routePathGroupRef = useRef(null);
  const socketRef = useRef(null);

  // Mount API Calls & WebSockets Connection
  useEffect(() => {
    loadControlCenterData();

    // Establish WebSocket Connection
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("Control Center connected to Socket.IO Server");
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("Control Center disconnected from Socket.IO Server");
    });

    // Real-time updates handler
    socket.on("agent:location", (data) => {
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          if (agent.id === data.agentId) {
            return {
              ...agent,
              agentProfile: {
                ...agent.agentProfile,
                location: {
                  latitude: data.latitude,
                  longitude: data.longitude
                }
              }
            };
          }
          return agent;
        })
      );
    });

    socket.on("order:status", (data) => {
      setOrders(prevOrders => 
        prevOrders.map(o => {
          if (o.id === data.orderId) {
            return { ...o, status: data.status };
          }
          return o;
        })
      );
    });

    socket.on("order:created", (data) => {
      setOrders(prevOrders => [data, ...prevOrders]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch timeline logs when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      fetchTimelineLogs(selectedOrder.id);
    } else {
      setSelectedOrderDetails(null);
    }
  }, [selectedOrder]);

  // Leaflet Map Initialization Hook
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        initControlCenterMap();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Re-draw Map Layers when data arrays or selected order updates
  useEffect(() => {
    if (!loading && mapInstanceRef.current) {
      drawMapElements();
    }
  }, [loading, zones, areas, orders, agents, selectedOrder]);

  async function loadControlCenterData() {
    try {
      setLoading(true);
      const [zonesRes, areasRes, ordersRes, agentsRes] = await Promise.all([
        api.getZones(),
        api.getAreas(),
        api.getOrders({ limit: 100 }),
        api.getAgents()
      ]);

      if (zonesRes.success) setZones(zonesRes.data);
      if (areasRes.success) setAreas(areasRes.data);
      if (ordersRes.success) setOrders(ordersRes.data.orders);
      if (agentsRes.success) setAgents(agentsRes.data);
    } catch (err) {
      console.error("Failed to load control center assets:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTimelineLogs(orderId) {
    try {
      setLoadingTimeline(true);
      const res = await api.getOrderById(orderId);
      if (res.success) {
        setSelectedOrderDetails(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch order history:", err);
    } finally {
      setLoadingTimeline(false);
    }
  }

  // Helper: Get pickup & drop coordinates by pincode
  const getOrderCoords = (order) => {
    const pickupArea = areas.find(a => a.pincode === order.pickupPincode);
    const dropArea = areas.find(a => a.pincode === order.dropPincode);

    return {
      pickup: pickupArea ? { lat: pickupArea.latitude, lng: pickupArea.longitude, name: pickupArea.name } : null,
      drop: dropArea ? { lat: dropArea.latitude, lng: dropArea.longitude, name: dropArea.name } : null
    };
  };

  const initControlCenterMap = () => {
    if (mapInstanceRef.current) return;

    const container = document.getElementById("logistics-control-map");
    if (!container) return;

    // Centered around Pune center coordinate
    const map = window.L.map("logistics-control-map", {
      zoomControl: true,
      maxZoom: 18,
      minZoom: 8,
      maxBounds: window.L.latLngBounds([15.0, 72.0], [22.5, 81.0]),
      maxBoundsViscosity: 1.0,
    }).setView([18.5204, 73.8567], 12);

    mapInstanceRef.current = map;

    // Dark Map theme for Logistics Operations Centers (CARTO Dark Matter)
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    polygonsGroupRef.current = window.L.layerGroup().addTo(map);
    areasGroupRef.current = window.L.layerGroup().addTo(map);
    agentsGroupRef.current = window.L.layerGroup().addTo(map);
    ordersGroupRef.current = window.L.layerGroup().addTo(map);
    routePathGroupRef.current = window.L.layerGroup().addTo(map);

    // Fix default Leaflet assets URLs
    delete window.L.Icon.Default.prototype._getIconUrl;
    window.L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  };

  const drawMapElements = () => {
    const polyGroup = polygonsGroupRef.current;
    const areasGroup = areasGroupRef.current;
    const agentsGroup = agentsGroupRef.current;
    const ordersGroup = ordersGroupRef.current;
    const routeGroup = routePathGroupRef.current;

    // Clear previous layers
    polyGroup.clearLayers();
    areasGroup.clearLayers();
    agentsGroup.clearLayers();
    ordersGroup.clearLayers();
    routeGroup.clearLayers();

    // Map active zones by polygon ID
    const activeZoneIds = {};
    zones.forEach(z => {
      const match = z.polygonId || z.name;
      activeZoneIds[match] = z;
    });

    // 1. Draw Predefined Zone Polygons
    PREDEFINED_POLYGONS.forEach(poly => {
      const activeZone = activeZoneIds[poly.id] || activeZoneIds[poly.name];
      const isActive = !!activeZone;

      const fill = isActive ? "rgba(59, 130, 246, 0.25)" : "transparent";
      const stroke = isActive ? "#3b82f6" : "#4b5563";

      const leafletPoly = window.L.polygon(poly.points, {
        color: stroke,
        fillColor: fill,
        fillOpacity: isActive ? 0.3 : 0,
        weight: isActive ? 2 : 1,
        dashArray: isActive ? null : "4, 4"
      });

      leafletPoly.bindTooltip(isActive ? activeZone.name : `Inactive: ${poly.name}`, {
        sticky: true,
        direction: "auto"
      });

      // Hover effects
      leafletPoly.on("mouseover", () => {
        leafletPoly.setStyle({
          weight: isActive ? 3 : 2,
          color: isActive ? "#60a5fa" : "#9ca3af",
          fillOpacity: isActive ? 0.45 : 0.1
        });
      });

      leafletPoly.on("mouseout", () => {
        leafletPoly.setStyle({
          weight: isActive ? 2 : 1,
          color: stroke,
          fillOpacity: isActive ? 0.3 : 0
        });
      });

      leafletPoly.addTo(polyGroup);
    });

    // 2. Draw Hubs / Areas
    areas.forEach(area => {
      if (!area.latitude || !area.longitude) return;

      const hubIcon = window.L.divIcon({
        className: "custom-hub-pin",
        html: `<div style="background-color: #2563eb; border: 2px solid white; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px rgba(37, 99, 235, 0.8);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      window.L.marker([area.latitude, area.longitude], { icon: hubIcon })
        .bindTooltip(`Warehouse Hub: <strong>${area.name}</strong> (${area.pincode})`, { direction: "top" })
        .addTo(areasGroup);
    });

    // 3. Draw Delivery Agents
    agents.forEach(agent => {
      const loc = agent.agentProfile?.location;
      const zoneName = agent.agentProfile?.currentZone?.name || "N/A";
      const isAvailable = agent.agentProfile?.availability ?? false;

      // Fallback coordinates if live tracking not initialized
      let lat = loc?.latitude;
      let lng = loc?.longitude;

      if (!lat || !lng) {
        // Fallback to zone's center or default center
        const fallbackPoly = PREDEFINED_POLYGONS.find(p => p.id === zoneName || p.name === zoneName);
        if (fallbackPoly && fallbackPoly.points.length > 0) {
          lat = fallbackPoly.points[0][0] + 0.01;
          lng = fallbackPoly.points[0][1] + 0.01;
        } else {
          return; // Skip drawing off-grid agents
        }
      }

      const agentColor = isAvailable ? "#22c55e" : "#eab308"; // green = available, yellow = busy/in-transit

      const truckIcon = window.L.divIcon({
        className: "custom-agent-pin",
        html: `
          <div style="background-color: ${agentColor}; padding: 6px; border-radius: 50%; border: 1.5px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = window.L.marker([lat, lng], { icon: truckIcon })
        .bindTooltip(`
          <div style="font-size:0.75rem; line-height:1.3;">
            <strong>Agent:</strong> ${agent.firstName} ${agent.lastName}<br/>
            <strong>Zone:</strong> ${zoneName}<br/>
            <strong>Status:</strong> <span style="color:${agentColor}; font-weight:800;">${isAvailable ? "Available" : "On Delivery"}</span>
          </div>
        `, { direction: "top" })
        .addTo(agentsGroup);

      // Open popup on select if assigned to currently active order
      if (selectedOrder && selectedOrder.assignedAgentId === agent.id) {
        marker.openTooltip();
      }
    });

    // 4. Render Active Order Path & pins if selected
    if (selectedOrder) {
      const coords = getOrderCoords(selectedOrder);
      if (coords.pickup && coords.drop) {
        // Draw Pickup Pin (Green Dot)
        const pickupIcon = window.L.divIcon({
          className: "custom-pickup-pin",
          html: `<div style="background-color: #10b981; border: 2px solid white; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 2px 8px rgba(16,185,129,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; font-weight: 800;">P</div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        window.L.marker([coords.pickup.lat, coords.pickup.lng], { icon: pickupIcon })
          .bindPopup(`<strong>Pickup:</strong> ${selectedOrder.pickupAddressLine}`)
          .addTo(ordersGroup);

        // Draw Drop Pin (Red Dot)
        const dropIcon = window.L.divIcon({
          className: "custom-drop-pin",
          html: `<div style="background-color: #ef4444; border: 2px solid white; width: 16px; height: 16px; border-radius: 50%; box-shadow: 0 2px 8px rgba(239,68,68,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; font-weight: 800;">D</div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        window.L.marker([coords.drop.lat, coords.drop.lng], { icon: dropIcon })
          .bindPopup(`<strong>Drop Address:</strong> ${selectedOrder.dropAddressLine}`)
          .addTo(ordersGroup);

        // Draw blue connection route line
        const polyline = window.L.polyline([[coords.pickup.lat, coords.pickup.lng], [coords.drop.lat, coords.drop.lng]], {
          color: "#3b82f6",
          weight: 4,
          opacity: 0.8,
          dashArray: "6, 6"
        }).addTo(routeGroup);

        // Auto zoom & center map to fit the route bounds
        mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [80, 80] });
      }
    } else {
      // Draw tiny status markers for other active orders to show distribution density
      orders.forEach(o => {
        if (["ASSIGNED", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(o.status)) {
          const coords = getOrderCoords(o);
          if (coords.pickup) {
            window.L.circleMarker([coords.pickup.lat, coords.pickup.lng], {
              radius: 4,
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.7,
              weight: 1
            }).bindTooltip(`Active Consignment: ${o.orderNumber}`).addTo(ordersGroup);
          }
        }
      });
    }
  };

  // Filters Orders based on search query and status filter tabs
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customer?.firstName && o.customer.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.pickupAddressLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.dropAddressLine.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === "ALL" ? true :
      statusFilter === "IN_TRANSIT" ? o.status === "IN_TRANSIT" || o.status === "OUT_FOR_DELIVERY" :
      o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
      {/* Title Section */}
      <div className="page-title-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid var(--border)" }}>
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Compass className="text-primary" /> Live Logistics Control Center
          </h1>
          <p className="page-subtitle">Real-time status updates and live tracking routes dashboard</p>
        </div>

        {/* Live Status indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "var(--bg-card)", padding: "8px 16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          {socketConnected ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#22c55e", fontSize: "0.75rem", fontWeight: "700" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block", animation: "pulse 1.2s infinite" }} /> SOCKET.IO LIVE
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#ef4444", fontSize: "0.75rem", fontWeight: "700" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block" }} /> SERVER OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px", flex: 1, minHeight: 0 }}>
        {/* Left Side: Map Center */}
        <div style={{ position: "relative", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#111" }}>
          
          <div id="logistics-control-map" style={{ width: "100%", height: "100%", zIndex: 1 }} />

          {/* Floating Map Legend Indicator */}
          <div style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            zIndex: 10,
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            border: "1px solid #374151",
            borderRadius: "var(--radius-md)",
            padding: "12px",
            color: "#fff",
            fontSize: "0.7rem",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
          }}>
            <div style={{ fontWeight: "700", borderBottom: "1px solid #374151", paddingBottom: "4px", marginBottom: "4px" }}>Control Center Legends</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2563eb", display: "inline-block" }} /> Warehouse Hub / Area</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} /> Agent Available</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#eab308", display: "inline-block" }} /> Agent On-Delivery</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} /> Order Pickup Coordinate (P)</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block" }} /> Order Drop Coordinate (D)</div>
          </div>
        </div>

        {/* Right Side: Active Shipments Control Panel */}
        <div className="table-card" style={{ display: "flex", flexDirection: "column", padding: "16px", height: "100%", minHeight: 0, backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
          {/* Panel Search */}
          <div style={{ marginBottom: "12px" }}>
            <div className="header-search" style={{ margin: 0, width: "100%" }}>
              <Search className="header-search-icon" />
              <input
                type="text"
                placeholder="Search ORD#, client, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", height: "36px", fontSize: "0.75rem" }}
              />
            </div>
          </div>

          {/* Quick Filter tabs */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px", overflowX: "auto", paddingBottom: "4px" }}>
            {["ALL", "ASSIGNED", "IN_TRANSIT", "DELIVERED", "FAILED"].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.65rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  border: statusFilter === tab ? "1px solid var(--primary)" : "1px solid var(--border)",
                  backgroundColor: statusFilter === tab ? "var(--primary-light)" : "var(--bg-app)",
                  color: statusFilter === tab ? "var(--primary)" : "var(--text-secondary)",
                  whiteSpace: "nowrap"
                }}
              >
                {tab === "IN_TRANSIT" ? "TRANSIT" : tab}
              </button>
            ))}
          </div>

          {/* Selected Order Details View or Orders List */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", minHeight: 0 }}>
            {selectedOrder ? (
              // Order tracking detail sheet
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                {/* Back button */}
                <button
                  onClick={() => { setSelectedOrder(null); }}
                  style={{
                    padding: "6px 10px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-app)",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    width: "fit-content",
                    color: "var(--text-primary)"
                  }}
                >
                  ← Back to List
                </button>

                {/* Card details */}
                <div style={{ border: "1px solid var(--border)", padding: "12px", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-app)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "800" }}>{selectedOrder.orderNumber}</span>
                    <span className={`status-badge ${selectedOrder.status.toLowerCase()}`} style={{ fontSize: "0.6rem" }}>{selectedOrder.status}</span>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>Customer: <strong>{selectedOrder.customer?.firstName || "Raghu"}</strong></div>
                    <div>From: <strong>{selectedOrder.pickupAddressLine}</strong></div>
                    <div>To: <strong>{selectedOrder.dropAddressLine}</strong></div>
                    <div>Assigned Driver: <strong>{selectedOrder.assignedAgent ? `${selectedOrder.assignedAgent.firstName} ${selectedOrder.assignedAgent.lastName}` : "No Driver Assigned"}</strong></div>
                  </div>
                </div>

                {/* Scans timeline */}
                <div style={{ flex: 1, overflowY: "auto", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-secondary)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <History size={12} /> Shipment Checkpoints
                  </div>

                  {loadingTimeline ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                      <Clock className="animate-spin" size={20} />
                    </div>
                  ) : !selectedOrderDetails?.trackingHistory || selectedOrderDetails.trackingHistory.length === 0 ? (
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", padding: "16px" }}>No history found.</div>
                  ) : (
                    <div className="timeline-container" style={{ paddingLeft: "10px" }}>
                      {selectedOrderDetails.trackingHistory.map(log => (
                        <div className="timeline-event" key={log.id} style={{ paddingBottom: "12px" }}>
                          <div className={`timeline-badge ${log.status.toLowerCase()}`} style={{ left: "-4px", width: "8px", height: "8px" }} />
                          <div className="timeline-event-content" style={{ padding: 0, border: "none", background: "none" }}>
                            <div style={{ fontSize: "0.7rem", fontWeight: "800", color: "var(--text-primary)" }}>{log.status}</div>
                            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{new Date(log.createdAt).toLocaleString()}</div>
                            {log.remarks && <div style={{ fontSize: "0.65rem", marginTop: "2px", color: "var(--text-muted)" }}>{log.remarks}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Orders checklist list
              <>
                {filteredOrders.length === 0 ? (
                  <div style={{ padding: "30px", textAlignment: "center", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                    No active consignments found.
                  </div>
                ) : (
                  filteredOrders.map(o => (
                    <div
                      key={o.id}
                      onClick={() => { setSelectedOrder(o); }}
                      style={{
                        padding: "12px",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-app)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-primary)" }}>{o.orderNumber}</span>
                        <span className={`status-badge ${o.status.toLowerCase()}`} style={{ fontSize: "0.6rem", padding: "1px 5px" }}>{o.status}</span>
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Route: {o.pickupZone?.name || "Hub"} ➔ {o.dropZone?.name || "Drop"}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--border)", paddingTop: "6px", fontSize: "0.65rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Agent: <strong>{o.assignedAgent ? o.assignedAgent.firstName : "Unassigned"}</strong></span>
                        <ChevronRight size={12} className="text-muted" />
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
