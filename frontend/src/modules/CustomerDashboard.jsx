import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../utils/api";
import {
  TrendingUp,
  Package,
  PlusCircle,
  Compass,
  FileText,
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Search,
  Sliders,
  DollarSign,
  Weight,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen
} from "lucide-react";

// Predefined Localized Grid Polygons for Maharashtra Cities
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
      [20.010, 73.720],
      [20.010, 73.760],
      [19.970, 73.760],
      [19.970, 73.720]
    ]
  },
  {
    id: "CIDCO",
    name: "CIDCO",
    points: [
      [19.970, 73.740],
      [19.970, 73.780],
      [19.930, 73.780],
      [19.930, 73.740]
    ]
  }
];

export default function CustomerDashboard({ user, onLogout, darkMode, setDarkMode }) {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, book, track, orders, history, notifications, profile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Database cache states
  const [orders, setOrders] = useState([]);
  const [areas, setAreas] = useState([]);
  const [rates, setRates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);

  // Selected Order for tracking or detailed view
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Forms state
  const [bookingForm, setBookingForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    actualWeight: "1.0",
    lengthCm: "10",
    widthCm: "10",
    heightCm: "10",
    paymentType: "PREPAID",
    orderType: "B2C",
    pickupAreaId: "",
    dropAreaId: "",
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [mappingMode, setMappingMode] = useState("pickup"); // pickup, drop
  const [pricingEstimate, setPricingEstimate] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [geocoderQuery, setGeocoderQuery] = useState("");
  const [geocoderLoading, setGeocoderLoading] = useState(false);

  const [geoapifyKey, setGeoapifyKey] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);

  // Profile forms
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    companyName: "",
    gstNumber: "",
  });
  const [editProfileMode, setEditProfileMode] = useState(false);

  // Password change forms
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Orders list filters & Search
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersFilter, setOrdersFilter] = useState("ALL");
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersLimit] = useState(6);

  // History list filters & Search
  const [historySearch, setHistorySearch] = useState("");
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit] = useState(6);

  // Map refs
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const mapMarkersGroup = useRef(null);

  useEffect(() => {
    loadCustomerData();
    api.getConfig().then(res => {
      if (res.success && res.geoapifyApiKey) {
        setGeoapifyKey(res.geoapifyApiKey);
      }
    }).catch(err => console.error("Error loading config:", err));

    // Refresh interval every 30 seconds for live order state updates
    const interval = setInterval(loadCustomerData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync Leaflet map rendering for Book Shipment
  useEffect(() => {
    if (activeTab !== "book") {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
      return;
    }

    // Give react time to mount container
    setTimeout(() => {
      const container = document.getElementById("customer-booking-map");
      if (!container || leafletMapInstance.current) return;

      const map = L.map("customer-booking-map", {
        zoomControl: true,
        maxZoom: 18,
        minZoom: 8,
        maxBounds: L.latLngBounds([15.0, 72.0], [22.5, 81.0]),
        maxBoundsViscosity: 1.0,
      }).setView([18.5204, 73.8567], 12);

      leafletMapInstance.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap contributors © CARTO",
        subdomains: "abcd",
        maxZoom: 20
      }).addTo(map);

      // Add grayscale filter wrapper
      container.style.filter = "grayscale(100%)";

      // Marker group
      mapMarkersGroup.current = L.layerGroup().addTo(map);

      // Map click handler to place pins
      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        handleMapPinSet(lat, lng);
      });

      // Render existing pins
      renderBookingPins();
    }, 200);
  }, [activeTab, mappingMode, pickupCoords, dropCoords]);

  // Leaflet tracking map sync disabled since map is replaced with horizontal status bar

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      // Fetch customer orders (scoped by customerId parameter)
      console.log("loadCustomerData - requesting customerId:", user?.id);
      const ordersRes = await api.getOrders({ customerId: user?.id, limit: 100 });
      console.log("loadCustomerData - ordersRes response:", ordersRes);
      const areasRes = await api.getAreas();

      if (ordersRes.success) {
        console.log("loadCustomerData - setting orders state to:", ordersRes.data.orders);
        setOrders(ordersRes.data.orders);
      }
      if (areasRes.success) setAreas(areasRes.data);

      // Recover customer profile details
      const customerRecord = areasRes.success
        ? await fetchCustomerProfile()
        : null;

      // Extract unread notifications from tracking histories
      if (ordersRes.success) {
        const logs = [];
        ordersRes.data.orders.slice(0, 15).forEach(o => {
          if (o.trackingHistory && o.trackingHistory.length > 0) {
            o.trackingHistory.forEach(h => {
              logs.push({
                id: h.id,
                orderNumber: o.orderNumber,
                status: h.status,
                remarks: h.remarks || "Status updated.",
                createdAt: h.createdAt
              });
            });
          }
        });
        logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerProfile = async () => {
    try {
      const res = await api.getCustomerById(user.id);
      if (res?.success && res.data) {
        const item = res.data;
        setProfile(item);
        setProfileForm({
          firstName: item.firstName,
          lastName: item.lastName,
          phone: item.phone || "",
          companyName: item.customerProfile?.companyName || "",
          gstNumber: item.customerProfile?.gstNumber || "",
        });
        return item;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // Raycasting checking coordinates inside polygon
  const isPointInPolygon = (point, vs) => {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0], yi = vs[i][1];
      const xj = vs[j][0], yj = vs[j][1];
      const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Resolve City boundary based on Predefined polygon ID name
  const getViewboxForZone = (polyName) => {
    const pLower = (polyName || "").toLowerCase();
    const isMumbai = [
      "bandra", "khar", "andheri", "borivali", "dadar", "prabhadevi", 
      "colaba", "fort", "kurla", "ghatkopar", "thane"
    ].some(m => pLower.includes(m));

    const isNashik = [
      "panchavati", "indira", "satpur", "cidco"
    ].some(n => pLower.includes(n));

    const isNagpur = [
      "dharampeth", "sitabuldi", "sadar", "wardhaman", "pratap", "manish"
    ].some(n => pLower.includes(n));

    if (isMumbai) return "72.75,19.30,73.20,18.85";
    if (isNagpur) return "79.00,21.25,79.20,21.05";
    if (isNashik) return "73.70,20.05,73.85,19.90";
    return "73.70,18.65,74.00,18.40"; // Pune
  };

  // Detect Area and Zone when clicking or searching
  const detectAreaFromCoords = (lat, lng, targetType) => {
    let matchedPoly = null;
    for (const poly of PREDEFINED_POLYGONS) {
      if (isPointInPolygon([lat, lng], poly.points)) {
        matchedPoly = poly;
        break;
      }
    }

    if (!matchedPoly) {
      alert("Coordinates lie outside our service zonation coverage boundaries in Maharashtra.");
      return null;
    }

    // Match database Area row
    const matchedArea = areas.find(a => {
      const dbName = (a.name || "").toLowerCase();
      const pId = matchedPoly.id.toLowerCase();
      return dbName.includes(pId) || pId.includes(dbName);
    });

    if (!matchedArea) {
      alert(`Located polygon "${matchedPoly.name}" but it is not yet registered by the administrator in the database. Please contact support.`);
      return null;
    }

    if (targetType === "pickup") {
      setBookingForm(prev => ({
        ...prev,
        pickupAreaId: String(matchedArea.id),
      }));
      setPickupCoords({ lat, lng, name: matchedArea.name });
    } else {
      setBookingForm(prev => ({
        ...prev,
        dropAreaId: String(matchedArea.id),
      }));
      setDropCoords({ lat, lng, name: matchedArea.name });
    }

    return matchedArea;
  };

  const handleMapPinSet = (lat, lng) => {
    detectAreaFromCoords(lat, lng, mappingMode);
  };

  const renderBookingPins = () => {
    if (!leafletMapInstance.current || !mapMarkersGroup.current) return;
    const group = mapMarkersGroup.current;
    group.clearLayers();

    // Render Pickup Marker (Green Dot)
    if (pickupCoords) {
      const greenIcon = L.divIcon({
        className: "custom-pickup-pin",
        html: `<div style="background-color: #10b981; border: 2px solid white; width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; font-weight: 900;">P</div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([pickupCoords.lat, pickupCoords.lng], { icon: greenIcon })
        .bindPopup(`<strong>Pickup:</strong> ${pickupCoords.name || "Selected Location"}`)
        .addTo(group);
    }

    // Render Drop Marker (Red Dot)
    if (dropCoords) {
      const redIcon = L.divIcon({
        className: "custom-drop-pin",
        html: `<div style="background-color: #ef4444; border: 2px solid white; width: 18px; height: 18px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; font-weight: 900;">D</div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([dropCoords.lat, dropCoords.lng], { icon: redIcon })
        .bindPopup(`<strong>Drop:</strong> ${dropCoords.name || "Selected Location"}`)
        .addTo(group);
    }
  };
  const fetchSuggestions = async (text, type) => {
    if (!text || text.length < 3 || !geoapifyKey) {
      if (type === "pickup") setPickupSuggestions([]);
      else setDropSuggestions([]);
      return;
    }

    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&filter=countrycode:in&limit=5&apiKey=${geoapifyKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.features) {
        const list = data.features.map(f => ({
          formatted: f.properties.formatted,
          lat: f.properties.lat,
          lon: f.properties.lon
        }));
        if (type === "pickup") setPickupSuggestions(list);
        else setDropSuggestions(list);
      }
    } catch (err) {
      console.error("Autocomplete failed:", err);
    }
  };

  const handleSelectSuggestion = (suggestion, type) => {
    if (type === "pickup") {
      setBookingForm(prev => ({ ...prev, pickupAddress: suggestion.formatted }));
      setPickupCoords({ lat: suggestion.lat, lng: suggestion.lon, name: suggestion.formatted });
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
    } else {
      setBookingForm(prev => ({ ...prev, dropAddress: suggestion.formatted }));
      setDropCoords({ lat: suggestion.lat, lng: suggestion.lon, name: suggestion.formatted });
      setDropSuggestions([]);
      setShowDropSuggestions(false);
    }
  };

  const recalculatePricingEstimates = async () => {
    if (!bookingForm.pickupAddress || !bookingForm.dropAddress) {
      alert("Please enter both Pickup and Drop Addresses first.");
      return;
    }

    try {
      setEstimating(true);
      setPricingEstimate(null);
      const res = await api.estimateOrderCharges({
        pickupAddress: bookingForm.pickupAddress,
        dropAddress: bookingForm.dropAddress,
        pickupLat: pickupCoords?.lat,
        pickupLng: pickupCoords?.lng,
        dropLat: dropCoords?.lat,
        dropLng: dropCoords?.lng,
        actualWeight: Number(bookingForm.actualWeight),
        lengthCm: Number(bookingForm.lengthCm),
        widthCm: Number(bookingForm.widthCm),
        heightCm: Number(bookingForm.heightCm),
        paymentType: bookingForm.paymentType,
        orderType: bookingForm.orderType,
      });

      if (res.success) {
        setPricingEstimate(res.data);
      } else {
        setPricingEstimate({ error: res.message || "Failed to estimate pricing." });
      }
    } catch (err) {
      setPricingEstimate({ error: err.message || "This routing is outside our active operational zones." });
    } finally {
      setEstimating(false);
    }
  };

  useEffect(() => {
    if (pricingEstimate && !pricingEstimate.error) {
      // Auto update if params change, but avoid throwing alert popups
      api.estimateOrderCharges({
        pickupAddress: bookingForm.pickupAddress,
        dropAddress: bookingForm.dropAddress,
        pickupLat: pickupCoords?.lat,
        pickupLng: pickupCoords?.lng,
        dropLat: dropCoords?.lat,
        dropLng: dropCoords?.lng,
        actualWeight: Number(bookingForm.actualWeight),
        lengthCm: Number(bookingForm.lengthCm),
        widthCm: Number(bookingForm.widthCm),
        heightCm: Number(bookingForm.heightCm),
        paymentType: bookingForm.paymentType,
        orderType: bookingForm.orderType,
      }).then(res => {
        if (res.success) setPricingEstimate(res.data);
      }).catch(err => {
        setPricingEstimate({ error: err.message });
      });
    }
  }, [bookingForm.actualWeight, bookingForm.lengthCm, bookingForm.widthCm, bookingForm.heightCm, bookingForm.paymentType, bookingForm.orderType]);

  // Google Maps Nominatim Search inside selected zonation area
  const handleGeocoderSearch = async (e) => {
    e.preventDefault();
    if (!geocoderQuery) return;
    
    // Find active viewbox scope
    let viewbox = "72.50,22.00,80.90,15.60";
    if (mappingMode === "pickup" && pickupCoords) {
      viewbox = getViewboxForZone(pickupCoords.name);
    } else if (mappingMode === "drop" && dropCoords) {
      viewbox = getViewboxForZone(dropCoords.name);
    }

    try {
      setGeocoderLoading(true);
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geocoderQuery)}&viewbox=${viewbox}&bounded=1&format=json&limit=1`;
      const response = await fetch(url, { headers: { "Accept-Language": "en" } });
      const results = await response.json();

      if (results && results.length > 0) {
        const place = results[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        const matchedArea = detectAreaFromCoords(lat, lng, mappingMode);
        if (matchedArea && leafletMapInstance.current) {
          leafletMapInstance.current.setView([lat, lng], 14, { animate: true });
        }
      } else {
        alert("Address search found no coordinates in this city boundary.");
      }
    } catch (e) {
      console.error(e);
      alert("Location query service failed. Click on the map directly.");
    } finally {
      setGeocoderLoading(false);
    }
  };

  const handleBookShipmentSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.pickupAddress || !bookingForm.dropAddress) {
      alert("Please fill in both pickup and drop addresses.");
      return;
    }
    if (pricingEstimate?.error) {
      alert("Cannot create order: " + pricingEstimate.error);
      return;
    }

    let currentEstimate = pricingEstimate;
    if (!currentEstimate) {
      try {
        setLoading(true);
        const res = await api.estimateOrderCharges({
          pickupAddress: bookingForm.pickupAddress,
          dropAddress: bookingForm.dropAddress,
          pickupLat: pickupCoords?.lat,
          pickupLng: pickupCoords?.lng,
          dropLat: dropCoords?.lat,
          dropLng: dropCoords?.lng,
          actualWeight: Number(bookingForm.actualWeight),
          lengthCm: Number(bookingForm.lengthCm),
          widthCm: Number(bookingForm.widthCm),
          heightCm: Number(bookingForm.heightCm),
          paymentType: bookingForm.paymentType,
          orderType: bookingForm.orderType,
        });
        if (res.success) {
          currentEstimate = res.data;
          setPricingEstimate(res.data);
        } else {
          alert(res.message || "Failed to calculate shipment costs.");
          setLoading(false);
          return;
        }
      } catch (err) {
        alert(err.message || "Addresses are outside our active operational zones.");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }

    try {
      setLoading(true);
      const res = await api.createOrder({
        customerId: user.id,
        pickupAddress: bookingForm.pickupAddress,
        dropAddress: bookingForm.dropAddress,
        pickupLat: pickupCoords?.lat,
        pickupLng: pickupCoords?.lng,
        dropLat: dropCoords?.lat,
        dropLng: dropCoords?.lng,
        actualWeight: Number(bookingForm.actualWeight),
        lengthCm: Number(bookingForm.lengthCm),
        widthCm: Number(bookingForm.widthCm),
        heightCm: Number(bookingForm.heightCm),
        paymentType: bookingForm.paymentType,
        orderType: bookingForm.orderType,
        totalAmount: Number(currentEstimate?.totalAmount || 0),
      });

      if (res.success) {
        setBookingForm({
          pickupAddress: "",
          dropAddress: "",
          actualWeight: "1.0",
          lengthCm: "10",
          widthCm: "10",
          heightCm: "10",
          paymentType: "PREPAID",
          orderType: "B2C",
          pickupAreaId: "",
          dropAreaId: "",
        });
        setPickupCoords(null);
        setDropCoords(null);
        setPricingEstimate(null);
        setSelectedOrderId(res.data.id);
        setActiveTab("track");
        loadCustomerData();
      }
    } catch (err) {
      alert(err.message || "Failed to book shipment.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.updateCustomer(user.id, profileForm);
      if (res.success) {
        setEditProfileMode(false);
        fetchCustomerProfile();
      }
    } catch (err) {
      alert(err.message || "Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Confirm password does not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (res.success) {
        setPasswordMessage("Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setPasswordError(err.message || "Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  // Metrics filtering computed properties
  const customerOrders = orders.filter(o => Number(o.customerId) === Number(user.id));
  const activeOrders = customerOrders.filter(o => !["DELIVERED", "FAILED", "CANCELLED"].includes(o.status));
  const deliveredOrders = customerOrders.filter(o => o.status === "DELIVERED");
  const pendingOrders = customerOrders.filter(o => ["PENDING", "ASSIGNED"].includes(o.status));
  const cancelledOrders = customerOrders.filter(o => o.status === "CANCELLED");

  // Orders list pagination
  const filteredOrders = customerOrders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(ordersSearch.toLowerCase());
    if (ordersFilter === "ALL") return matchesSearch;
    if (ordersFilter === "PENDING") return matchesSearch && ["PENDING", "ASSIGNED"].includes(o.status);
    if (ordersFilter === "IN_TRANSIT") return matchesSearch && ["PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(o.status);
    return matchesSearch && o.status === ordersFilter;
  });

  const totalOrdersPages = Math.ceil(filteredOrders.length / ordersLimit);
  const paginatedOrders = filteredOrders.slice((ordersPage - 1) * ordersLimit, ordersPage * ordersLimit);

  // History list pagination
  const archivedOrders = customerOrders.filter(o => ["DELIVERED", "FAILED", "CANCELLED"].includes(o.status));
  const filteredHistory = archivedOrders.filter(o => o.orderNumber.toLowerCase().includes(historySearch.toLowerCase()));
  const totalHistoryPages = Math.ceil(filteredHistory.length / historyLimit);
  const paginatedHistory = filteredHistory.slice((historyPage - 1) * historyLimit, historyPage * historyLimit);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="app-container">
      {/* Collapsible Left Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-logo">
          <TrendingUp style={{ minWidth: "24px", color: "var(--text-sidebar-active)" }} />
          {!sidebarCollapsed && (
            <span className="sidebar-logo-text" style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-sidebar-active)" }}>
              Customer
            </span>
          )}
        </div>

        <nav className="sidebar-menu">
          <button
            onClick={() => { setActiveTab("dashboard"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "dashboard" ? "active" : ""}`}
            title={sidebarCollapsed ? "Dashboard" : ""}
          >
            <Layers size={20} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => { setActiveTab("book"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "book" ? "active" : ""}`}
            title={sidebarCollapsed ? "Book Shipment" : ""}
          >
            <PlusCircle size={20} />
            {!sidebarCollapsed && <span>Book Shipment</span>}
          </button>

          <button
            onClick={() => { setActiveTab("orders"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "orders" ? "active" : ""}`}
            title={sidebarCollapsed ? "My Orders" : ""}
          >
            <Package size={20} />
            {!sidebarCollapsed && <span>My Orders</span>}
          </button>

          <button
            onClick={() => { setActiveTab("history"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "history" ? "active" : ""}`}
            title={sidebarCollapsed ? "Delivery History" : ""}
          >
            <FileText size={20} />
            {!sidebarCollapsed && <span>Delivery History</span>}
          </button>

          <button
            onClick={() => { setActiveTab("notifications"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "notifications" ? "active" : ""}`}
            title={sidebarCollapsed ? "Notifications" : ""}
          >
            <Bell size={20} />
            {!sidebarCollapsed && <span>Notifications</span>}
            {!sidebarCollapsed && notifications.length > 0 && (
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", padding: "2px 6px", borderRadius: "10px", backgroundColor: "var(--primary)", color: "var(--text-active-item)" }}>
                {notifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab("profile"); setSelectedOrderId(null); setMobileSidebarOpen(false); }}
            className={`sidebar-item ${activeTab === "profile" ? "active" : ""}`}
            title={sidebarCollapsed ? "My Profile" : ""}
          >
            <User size={20} />
            {!sidebarCollapsed && <span>My Profile</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={onLogout}
            className="sidebar-item"
            style={{ color: "#ef4444" }}
            title={sidebarCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ display: "none" }}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header" style={{ padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
          <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              className="sidebar-toggle-btn"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontWeight: "700", fontSize: "1.05rem", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              LastMile Logistics
            </span>
          </div>

          <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="icon-button"
              style={{ border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "var(--radius-sm)", color: "var(--text-primary)" }}
              title="Toggle theme mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-primary)" }}>
                  {profile ? `${profile.firstName} ${profile.lastName}` : (user ? `${user.firstName} ${user.lastName || ""}` : "Valued Customer")}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "600" }}>
                  {profile?.customerProfile?.companyName || "Personal Account"}
                </div>
              </div>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                <User size={18} className="text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="page-container" style={{ padding: "24px", overflowY: "auto", height: "calc(100vh - 64px)" }}>
          
          {/* Welcome Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "18px", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--primary)", margin: "0 0 6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                {getGreeting()}, {profile?.firstName || user?.firstName || "Customer"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={13} /> {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          </div>

          {/* DASHBOARD HOME */}
          {activeTab === "dashboard" && !selectedOrderId && (
            <div className="fade-in">
              {/* Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px", marginBottom: "24px" }}>
                <div className="analytics-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Active Orders</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--primary)" }}>{activeOrders.length}</div>
                </div>
                <div className="analytics-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Delivered Orders</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--status-delivered)" }}>{deliveredOrders.length}</div>
                </div>
                <div className="analytics-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Pending Deliveries</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--status-pending)" }}>{pendingOrders.length}</div>
                </div>
                <div className="analytics-card" style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>Cancelled Orders</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "var(--status-failed)" }}>{cancelledOrders.length}</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="table-card" style={{ padding: "20px", marginBottom: "24px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>Quick Actions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                  <button onClick={() => setActiveTab("book")} className="btn btn-secondary" style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderRadius: "var(--radius-md)" }}>
                    <PlusCircle size={24} className="text-primary" />
                    <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>Book Shipment</span>
                  </button>
                  <button onClick={() => { setActiveTab("orders"); }} className="btn btn-secondary" style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderRadius: "var(--radius-md)" }}>
                    <Search size={24} className="text-primary" />
                    <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>Track Order</span>
                  </button>
                  <button onClick={() => setActiveTab("orders")} className="btn btn-secondary" style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderRadius: "var(--radius-md)" }}>
                    <Package size={24} className="text-primary" />
                    <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>View Orders</span>
                  </button>
                  <button onClick={() => setActiveTab("profile")} className="btn btn-secondary" style={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderRadius: "var(--radius-md)" }}>
                    <User size={24} className="text-primary" />
                    <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>Profile</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>Recent Shipments</h3>
                {customerOrders.length === 0 ? (
                  <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    No shipments found. Click Book Shipment to start.
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                    {customerOrders.slice(0, 4).map(o => (
                      <div key={o.id} style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: "800" }}>#{o.orderNumber}</span>
                            <span className={`status-badge ${o.status.toLowerCase()}`} style={{ fontSize: "0.65rem" }}>{o.status}</span>
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "4px" }}>
                            <span><strong>From:</strong> {o.pickupAddressLine}</span>
                            <span><strong>To:</strong> {o.dropAddressLine}</span>
                            <span><strong>Est. Delivery:</strong> {new Date(o.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                          <button onClick={() => { setSelectedOrderId(o.id); setActiveTab("orders"); }} className="btn btn-secondary" style={{ flex: 1, padding: "4px 8px", fontSize: "0.7rem" }}>
                            View Details
                          </button>
                          <button onClick={() => { setSelectedOrderId(o.id); setActiveTab("track"); }} className="btn btn-primary" style={{ flex: 1, padding: "4px 8px", fontSize: "0.7rem" }}>
                            Track Shipment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "book" && (
            <div className="fade-in" style={{ maxWidth: "680px", margin: "0 auto" }}>
              {/* Form Input fields */}
              <div className="table-card" style={{ padding: "24px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <PlusCircle size={18} /> Book Courier Shipment
                </h3>

                <form onSubmit={handleBookShipmentSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  
                  <div className="form-group" style={{ position: "relative" }}>
                    <label className="form-label">Pickup Full Address *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="Enter city and detailed pickup street address..."
                      value={bookingForm.pickupAddress}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBookingForm({ ...bookingForm, pickupAddress: val });
                        fetchSuggestions(val, "pickup");
                        setShowPickupSuggestions(true);
                      }}
                      onFocus={() => setShowPickupSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                      style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                    />
                    {showPickupSuggestions && pickupSuggestions.length > 0 && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        zIndex: 1000,
                        maxHeight: "200px",
                        overflowY: "auto",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        marginTop: "4px"
                      }}>
                        {pickupSuggestions.map((s, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectSuggestion(s, "pickup")}
                            style={{
                              padding: "10px 12px",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              color: "var(--text-primary)",
                              borderBottom: idx === pickupSuggestions.length - 1 ? "none" : "1px solid var(--border)",
                              backgroundColor: "transparent",
                              transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "var(--border)"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                          >
                            {s.formatted}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group" style={{ position: "relative" }}>
                    <label className="form-label">Drop Full Address *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="Enter city and detailed destination drop address..."
                      value={bookingForm.dropAddress}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBookingForm({ ...bookingForm, dropAddress: val });
                        fetchSuggestions(val, "drop");
                        setShowDropSuggestions(true);
                      }}
                      onFocus={() => setShowDropSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowDropSuggestions(false), 200)}
                      style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                    />
                    {showDropSuggestions && dropSuggestions.length > 0 && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        zIndex: 1000,
                        maxHeight: "200px",
                        overflowY: "auto",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        marginTop: "4px"
                      }}>
                        {dropSuggestions.map((s, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectSuggestion(s, "drop")}
                            style={{
                              padding: "10px 12px",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              color: "var(--text-primary)",
                              borderBottom: idx === dropSuggestions.length - 1 ? "none" : "1px solid var(--border)",
                              backgroundColor: "transparent",
                              transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "var(--border)"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                          >
                            {s.formatted}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                    <div className="form-group">
                      <label className="form-label">Weight (Kg) *</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        required
                        value={bookingForm.actualWeight}
                        onChange={(e) => setBookingForm({ ...bookingForm, actualWeight: e.target.value })}
                        style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">L (cm)</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={bookingForm.lengthCm}
                        onChange={(e) => setBookingForm({ ...bookingForm, lengthCm: e.target.value })}
                        style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">W (cm)</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={bookingForm.widthCm}
                        onChange={(e) => setBookingForm({ ...bookingForm, widthCm: e.target.value })}
                        style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">H (cm)</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={bookingForm.heightCm}
                        onChange={(e) => setBookingForm({ ...bookingForm, heightCm: e.target.value })}
                        style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div className="form-group">
                      <label className="form-label">Payment Mode</label>
                      <select
                        className="filter-select"
                        value={bookingForm.paymentType}
                        onChange={(e) => setBookingForm({ ...bookingForm, paymentType: e.target.value })}
                        style={{ height: "38px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      >
                        <option value="PREPAID">Prepaid (Cards/UPI)</option>
                        <option value="COD">Cash on Delivery (COD)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Consignment Type</label>
                      <select
                        className="filter-select"
                        value={bookingForm.orderType}
                        onChange={(e) => setBookingForm({ ...bookingForm, orderType: e.target.value })}
                        style={{ height: "38px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      >
                        <option value="B2C">B2C Retail Delivery</option>
                        <option value="B2B">B2B Corporate Dispatch</option>
                      </select>
                    </div>
                  </div>

                  {/* Estimation box */}
                  {pricingEstimate && (
                    <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", fontSize: "0.75rem" }}>
                      {pricingEstimate.error ? (
                        <div style={{ color: "var(--status-failed)", fontWeight: "600" }}>{pricingEstimate.error}</div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-muted)" }}>Billing Weight:</span>
                            <strong>{pricingEstimate.billable} Kg (Volumetric: {pricingEstimate.volumetric} Kg)</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-muted)" }}>Delivery Charge:</span>
                            <strong>₹{pricingEstimate.deliveryCharge}</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--text-muted)" }}>COD Surcharge:</span>
                            <strong>₹{pricingEstimate.codCharge}</strong>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "6px", marginTop: "4px", fontSize: "0.85rem" }}>
                            <span style={{ fontWeight: "800" }}>Total Cost Estimate:</span>
                            <strong style={{ color: "var(--primary)" }}>₹{pricingEstimate.totalAmount}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                    <button
                      type="button"
                      onClick={recalculatePricingEstimates}
                      disabled={estimating || !bookingForm.pickupAddress || !bookingForm.dropAddress}
                      className="btn btn-secondary"
                      style={{ flex: 1, height: "42px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}
                    >
                      {estimating ? "Calculating..." : "Calculate Delivery Cost"}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading || !bookingForm.pickupAddress || !bookingForm.dropAddress || !!pricingEstimate?.error}
                      style={{ flex: 1, height: "42px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem" }}
                    >
                      {loading ? "Registering Shipment..." : "Confirm Booking"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "track" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {!selectedOrderId ? (
                <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                      <Compass size={18} /> Track Active Shipments
                    </h3>
                  </div>

                  {customerOrders.length === 0 ? (
                    <div style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      No shipments registered yet.
                    </div>
                  ) : (
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Order Code</th>
                          <th>Route Path</th>
                          <th>Booking Date</th>
                          <th>State Status</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.map(o => (
                          <tr key={o.id}>
                            <td><strong>#{o.orderNumber}</strong></td>
                            <td>{o.pickupAddressLine} ➔ {o.dropAddressLine}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${o.status.toLowerCase()}`} style={{ fontSize: "0.65rem" }}>
                                {o.status}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                onClick={() => setSelectedOrderId(o.id)}
                                className="btn btn-primary"
                                style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                              >
                                Track Shipment
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                (() => {
                  const order = orders.find(o => o.id === selectedOrderId);
                  if (!order) return null;

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

                  const currentStepIdx = getStepIndex(order.status);

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      {/* Back button & order title */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button
                          onClick={() => setSelectedOrderId(null)}
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}
                        >
                          ➔ Back to List
                        </button>
                        <span className={`status-badge ${order.status.toLowerCase()}`} style={{ padding: "6px 14px", fontSize: "0.75rem" }}>
                          {order.status}
                        </span>
                      </div>

                      {/* Horizontal Progress Timeline */}
                      <div className="table-card" style={{ padding: "30px 24px 40px 24px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "30px" }}>Delivery Progress Status</h3>
                        
                        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          {/* Background Track Line */}
                          <div style={{
                            position: "absolute",
                            top: "20px",
                            left: "4%",
                            right: "4%",
                            height: "4px",
                            backgroundColor: "var(--border)",
                            zIndex: 1
                          }}></div>

                          {/* Completed Progress Line */}
                          {currentStepIdx >= 0 && (
                            <div style={{
                              position: "absolute",
                              top: "20px",
                              left: "4%",
                              width: `${(currentStepIdx / (steps.length - 1)) * 92}%`,
                              height: "4px",
                              backgroundColor: order.status === "FAILED" ? "#ef4444" : "var(--primary)",
                              zIndex: 2,
                              transition: "width 0.4s ease"
                            }}></div>
                          )}

                          {/* Steps */}
                          {steps.map((s, idx) => {
                            const isPast = currentStepIdx >= idx;
                            const isCurrent = currentStepIdx === idx;
                            const isFailed = order.status === "FAILED" && idx === 5;
                            
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
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  backgroundColor: isCurrent ? "var(--bg-card)" : (isPast ? stepColor : "var(--bg-app)"),
                                  border: `4px solid ${isCurrent ? stepColor : (isPast ? "transparent" : "var(--border)")}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: isPast && !isCurrent ? "#ffffff" : stepColor,
                                  boxShadow: isCurrent ? `0 0 14px ${stepColor}80` : "none",
                                  transition: "all 0.3s ease",
                                  cursor: "default"
                                }}>
                                  {isPast && !isCurrent ? (
                                    <CheckCircle2 size={18} style={{ color: "#ffffff" }} />
                                  ) : (
                                    <div style={{
                                      width: "10px",
                                      height: "10px",
                                      borderRadius: "50%",
                                      backgroundColor: stepColor
                                    }}></div>
                                  )}
                                </div>

                                {/* Step Label */}
                                <div style={{
                                  marginTop: "12px",
                                  fontSize: "0.7rem",
                                  fontWeight: textWeight,
                                  color: textColor,
                                  textAlign: "center",
                                  lineHeight: "1.2",
                                  wordBreak: "break-word"
                                }}>
                                  {isFailed ? "Delivery Failed" : s.label}
                                </div>
                                {isCurrent && (
                                  <div style={{
                                    position: "absolute",
                                    top: "64px",
                                    fontSize: "0.65rem",
                                    color: stepColor,
                                    fontWeight: "700",
                                    textTransform: "uppercase",
                                    whiteSpace: "nowrap"
                                  }}>
                                    Current Stage
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detail info panels row */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        {/* Shipment Info Panel */}
                        <div className="table-card" style={{ padding: "24px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                          <h3 style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "20px" }}>Shipment Information</h3>
                          <table className="custom-table" style={{ border: "none" }}>
                            <tbody>
                              <tr>
                                <td style={{ fontWeight: "700", width: "150px", border: "none", color: "var(--text-muted)", fontSize: "0.75rem" }}>Order Number</td>
                                <td style={{ fontWeight: "800", border: "none", color: "var(--primary)", fontSize: "0.8rem" }}>#{order.orderNumber}</td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: "700", border: "none", color: "var(--text-muted)", fontSize: "0.75rem" }}>Pickup Address</td>
                                <td style={{ border: "none", fontSize: "0.75rem" }}>{order.pickupAddressLine} ({order.pickupPincode})</td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: "700", border: "none", color: "var(--text-muted)", fontSize: "0.75rem" }}>Delivery Address</td>
                                <td style={{ border: "none", fontSize: "0.75rem" }}>{order.dropAddressLine} ({order.dropPincode})</td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: "700", border: "none", color: "var(--text-muted)", fontSize: "0.75rem" }}>Volumetric Weight</td>
                                <td style={{ border: "none", fontSize: "0.75rem" }}>{Number(order.volumetricWeight).toFixed(2)} kg</td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: "700", border: "none", color: "var(--text-muted)", fontSize: "0.75rem" }}>Billable Weight</td>
                                <td style={{ border: "none", fontSize: "0.75rem" }}>{Number(order.billableWeight).toFixed(2)} kg</td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: "700", border: "none", color: "var(--text-muted)", fontSize: "0.75rem" }}>Payment Option</td>
                                <td style={{ border: "none", fontSize: "0.75rem" }}><span className="status-badge" style={{ backgroundColor: "var(--border)", color: "var(--text-primary)" }}>{order.paymentType}</span></td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: "700", border: "none", color: "var(--text-muted)", fontSize: "0.75rem" }}>Courier Charges</td>
                                <td style={{ border: "none", fontWeight: "700", color: "var(--text-primary)", fontSize: "0.75rem" }}>₹{Number(order.totalAmount).toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Partner & Live log Panel */}
                        <div className="table-card" style={{ padding: "24px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)", display: "flex", flexDirection: "column", gap: "20px" }}>
                          <div>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>Courier Delivery Partner</h3>
                            {order.assignedAgent ? (
                              <div style={{ padding: "14px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", display: "flex", alignItems: "center", gap: "14px" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <User size={20} className="text-primary" />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                  <div style={{ fontSize: "0.8rem", fontWeight: "800" }}>{order.assignedAgent.firstName} {order.assignedAgent.lastName}</div>
                                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Phone: {order.assignedAgent.phone || "N/A"}</div>
                                  {order.assignedAgent.agentProfile && (
                                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "600" }}>
                                      Vehicle: {order.assignedAgent.agentProfile.vehicleType} ({order.assignedAgent.agentProfile.vehicleNumber})
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "12px", border: "1px dashed var(--border)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                                Partner assignment is in progress...
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 style={{ fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>Tracking Activity Logs</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
                              {order.trackingHistory && order.trackingHistory.length > 0 ? (
                                [...order.trackingHistory].reverse().map((log, idx) => (
                                  <div key={idx} style={{ display: "flex", gap: "10px", fontSize: "0.7rem", borderBottom: idx === order.trackingHistory.length - 1 ? "none" : "1px solid var(--border)", paddingBottom: "10px" }}>
                                    <div style={{ minWidth: "110px", color: "var(--text-muted)" }}>
                                      {new Date(log.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{log.status}</div>
                                      <div style={{ color: "var(--text-muted)", fontSize: "0.65rem", marginTop: "2px" }}>{log.remarks}</div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>No tracking logs found.</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* MY ORDERS */}
          {activeTab === "orders" && !selectedOrderId && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Filters Header */}
              <div className="table-card" style={{ padding: "16px 20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {["ALL", "PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"].map(mode => (
                    <button
                      key={mode}
                      onClick={() => { setOrdersFilter(mode); setOrdersPage(1); }}
                      className={`btn ${ordersFilter === mode ? "btn-primary" : "btn-secondary"}`}
                      style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="header-search" style={{ width: "240px" }}>
                  <Search className="header-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by order code..."
                    value={ordersSearch}
                    onChange={(e) => { setOrdersSearch(e.target.value); setOrdersPage(1); }}
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                {paginatedOrders.length === 0 ? (
                  <div style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    No shipments match the filter query.
                  </div>
                ) : (
                  <>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Order Code</th>
                          <th>Pincodes</th>
                          <th>Method</th>
                          <th>Weight</th>
                          <th>Charges</th>
                          <th>State Status</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrders.map(o => (
                          <tr key={o.id}>
                            <td><strong>#{o.orderNumber}</strong></td>
                            <td>{o.pickupPincode} ➔ {o.dropPincode}</td>
                            <td><span style={{ fontSize: "0.7rem", fontWeight: "700" }}>{o.paymentType}</span></td>
                            <td>{o.actualWeight} Kg</td>
                            <td><strong>₹{o.totalAmount}</strong></td>
                            <td>
                              <span className={`status-badge ${o.status.toLowerCase()}`} style={{ fontSize: "0.65rem" }}>
                                {o.status}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => { setSelectedOrderId(o.id); }}
                                  className="btn btn-secondary"
                                  style={{ padding: "3px 8px", fontSize: "0.7rem" }}
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => { setSelectedOrderId(o.id); setActiveTab("track"); }}
                                  className="btn btn-primary"
                                  style={{ padding: "3px 8px", fontSize: "0.7rem" }}
                                >
                                  Track
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {totalOrdersPages > 1 && (
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                        <button
                          disabled={ordersPage === 1}
                          onClick={() => setOrdersPage(p => p - 1)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                        >
                          Prev
                        </button>
                        <span style={{ fontSize: "0.75rem", alignSelf: "center", color: "var(--text-muted)" }}>
                          Page {ordersPage} of {totalOrdersPages}
                        </span>
                        <button
                          disabled={ordersPage === totalOrdersPages}
                          onClick={() => setOrdersPage(p => p + 1)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* DETAILED ORDER VIEWER */}
          {selectedOrderId && activeTab === "orders" && (
            (() => {
              const order = orders.find(o => o.id === selectedOrderId);
              if (!order) return null;

              return (
                <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setSelectedOrderId(null)} className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
                      ➔ Back to list
                    </button>
                    <button onClick={() => window.print()} className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
                      Download Invoice
                    </button>
                  </div>

                  <div className="table-card" style={{ padding: "24px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "14px" }}>
                      <div>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: "900", margin: "0" }}>Order Number: #{order.orderNumber}</h2>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Logged: {new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      <div>
                        <h4 style={{ fontWeight: "800", fontSize: "0.85rem", marginBottom: "8px" }}>Logistics Addresses</h4>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span><strong>Pickup Area:</strong> Pincode: {order.pickupPincode}</span>
                          <span><strong>Pickup Street:</strong> {order.pickupAddressLine}</span>
                          <span style={{ margin: "4px 0" }}>➔</span>
                          <span><strong>Destination Area:</strong> Pincode: {order.dropPincode}</span>
                          <span><strong>Destination Street:</strong> {order.dropAddressLine}</span>
                        </div>
                      </div>

                      <div>
                        <h4 style={{ fontWeight: "800", fontSize: "0.85rem", marginBottom: "8px" }}>Consignment Dimensions</h4>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span>Weight: <strong>{order.actualWeight} Kg</strong></span>
                          <span>Dimensions: <strong>{order.lengthCm} x {order.widthCm} x {order.heightCm} cm</strong></span>
                          <span>Payment Type: <strong>{order.paymentType}</strong></span>
                          <span>Estimated Charges: <strong style={{ color: "var(--primary)", fontSize: "0.85rem" }}>₹{order.totalAmount}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* DELIVERY HISTORY */}
          {activeTab === "history" && (
            <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="table-card" style={{ padding: "16px 20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: "800", margin: "0" }}>ARCHIVED SHIPPED JOURNAL</h3>
                
                <div className="header-search" style={{ width: "240px" }}>
                  <Search className="header-search-icon" />
                  <input
                    type="text"
                    placeholder="Search order number..."
                    value={historySearch}
                    onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
                  />
                </div>
              </div>

              <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                {paginatedHistory.length === 0 ? (
                  <div style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    No completed or archived logs matching search query.
                  </div>
                ) : (
                  <>
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Order Code</th>
                          <th>Pincodes</th>
                          <th>Method</th>
                          <th>Date Ended</th>
                          <th>Charges</th>
                          <th>Status Badge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedHistory.map(o => (
                          <tr key={o.id}>
                            <td><strong>#{o.orderNumber}</strong></td>
                            <td>{o.pickupPincode} ➔ {o.dropPincode}</td>
                            <td>{o.paymentType}</td>
                            <td>{new Date(o.updatedAt).toLocaleDateString()}</td>
                            <td><strong>₹{o.totalAmount}</strong></td>
                            <td>
                              <span className={`status-badge ${o.status.toLowerCase()}`} style={{ fontSize: "0.65rem" }}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {totalHistoryPages > 1 && (
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                        <button
                          disabled={historyPage === 1}
                          onClick={() => setHistoryPage(p => p - 1)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                        >
                          Prev
                        </button>
                        <span style={{ fontSize: "0.75rem", alignSelf: "center", color: "var(--text-muted)" }}>
                          Page {historyPage} of {totalHistoryPages}
                        </span>
                        <button
                          disabled={historyPage === totalHistoryPages}
                          onClick={() => setHistoryPage(p => p + 1)}
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px" }}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS LOG */}
          {activeTab === "notifications" && (
            <div className="fade-in table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Bell size={18} /> Consignment Operations Alert Trail
              </h3>
              {notifications.length === 0 ? (
                <div style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  No notifications recorded yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: "12px 16px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: "800" }}>Shipment #{n.orderNumber} status changed to {n.status}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Remarks: {n.remarks}</div>
                      </div>
                      <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "600" }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY PROFILE */}
          {activeTab === "profile" && (
            <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
              {/* Profile Details Edit Form */}
              <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <User size={18} /> Customer Profile Details
                </h3>

                <form onSubmit={handleUpdateProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        disabled={!editProfileMode}
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        disabled={!editProfileMode}
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Read-Only)</label>
                    <input
                      type="email"
                      className="form-input"
                      disabled
                      value={profile?.email || ""}
                      style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      disabled={!editProfileMode}
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px" }}>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        disabled={!editProfileMode}
                        value={profileForm.companyName}
                        onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                        style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GST Identification</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        disabled={!editProfileMode}
                        value={profileForm.gstNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, gstNumber: e.target.value })}
                        style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "6px", display: "flex", gap: "10px" }}>
                    {editProfileMode ? (
                      <>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
                          Save Changes
                        </button>
                        <button type="button" onClick={() => setEditProfileMode(false)} className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setEditProfileMode(true)} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.8rem" }}>
                        Edit Profile
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Password Management */}
              <div className="table-card" style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", backgroundColor: "var(--bg-card)" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Key size={18} /> Update Account Security Password
                </h3>

                <form onSubmit={handleChangePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {passwordError && <div className="auth-error" style={{ fontSize: "0.75rem" }}>{passwordError}</div>}
                  {passwordMessage && <div className="auth-success" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--success, #10b981)", color: "var(--success, #10b981)", padding: "10px", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", fontWeight: "600", textAlign: "center" }}>{passwordMessage}</div>}

                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-input"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      required
                      placeholder="Minimum 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      style={{ borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", height: "38px", borderRadius: "var(--radius-sm)", fontSize: "0.8rem" }}>
                    Update Security Password
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
