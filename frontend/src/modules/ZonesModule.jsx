import React, { useState, useEffect, useRef } from "react";
import {
  Map,
  MapPin,
  Layers,
  Plus,
  Search,
  Sliders,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Activity,
  Eye,
  EyeOff,
  Navigation,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../utils/api";

// 20 Predefined Pune Region Polygons (Adjacent, Zero Overlaps)
// Predefined Localized Grid Polygons for Maharashtra Cities (Pune, Mumbai, Nagpur, Nashik)
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

// Helper: Point in Polygon Check (Ray Casting Algorithm)
function isPointInPolygon(point, polygonPoints) {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const xi = polygonPoints[i][0], yi = polygonPoints[i][1];
    const xj = polygonPoints[j][0], yj = polygonPoints[j][1];
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Helper: Hash-based Pastel Color Generation
const getPastelColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 80%, 75%)`;
};

const getDarkColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 80%, 40%)`;
};

export default function ZonesModule() {
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showActiveZones, setShowActiveZones] = useState(true);
  const [showInactivePolys, setShowInactivePolys] = useState(true);
  const [showAreas, setShowAreas] = useState(true);

  // Search State (Filter panel search)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("zone"); // zone, area
  const [dbSuggestions, setDbSuggestions] = useState([]);

  // Floating map search state (Google style)
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSuggestions, setMapSuggestions] = useState([]);
  const mapDebounceTimer = useRef(null);

  // Placement banner search state
  const [geocoderQuery, setGeocoderQuery] = useState("");
  const [geocoderLoading, setGeocoderLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimerRef = useRef(null);

  // Leaflet Map Refs
  const mapInstanceRef = useRef(null);
  const polygonsGroupRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Modals & Mode States
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [clickedPolygonId, setClickedPolygonId] = useState(null);
  const [clickedCoords, setClickedCoords] = useState(null); // {lat, lng}
  const [selectedActiveZone, setSelectedActiveZone] = useState(null); // Side panel
  const [selectedArea, setSelectedArea] = useState(null);
  const [addingAreaState, setAddingAreaState] = useState(false); // Map placement mode

  // Forms state
  const [zoneForm, setZoneForm] = useState({ name: "", description: "" });
  const [areaForm, setAreaForm] = useState({ name: "", pincode: "", zoneId: "" });
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Refs to read latest state in Leaflet callbacks
  const addingAreaStateRef = useRef(addingAreaState);
  const areaFormZoneIdRef = useRef(areaForm.zoneId);

  useEffect(() => {
    addingAreaStateRef.current = addingAreaState;
  }, [addingAreaState]);

  useEffect(() => {
    areaFormZoneIdRef.current = areaForm.zoneId;
  }, [areaForm.zoneId]);

  useEffect(() => {
    loadData();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize map ONLY after loading is false and DOM is rendered
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        initLeafletMap();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  async function loadData() {
    try {
      setLoading(true);
      const [zonesRes, areasRes, ordersRes, agentsRes] = await Promise.all([
        api.getZones(),
        api.getAreas(),
        api.getOrders({ limit: 1000 }),
        api.getAgents(),
      ]);

      if (zonesRes.success) setZones(zonesRes.data);
      if (areasRes.success) setAreas(areasRes.data);
      if (ordersRes.success) setOrders(ordersRes.data.orders);
      if (agentsRes.success) setAgents(agentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getViewboxForZone = (zone) => {
    if (!zone) return "72.50,22.00,80.90,15.60";
    
    const polyId = parseZonePolygon(zone);
    const polyIdLower = (polyId || "").toLowerCase();
    const nameLower = (zone.name || "").toLowerCase();
    const descLower = (zone.description || "").toLowerCase();

    // Match polygon IDs for specific cities
    const isMumbai = [
      "bandra", "khar", "andheri", "borivali", "dadar", "prabhadevi", 
      "colaba", "fort", "kurla", "ghatkopar", "thane"
    ].some(m => polyIdLower.includes(m) || nameLower.includes(m)) || 
    nameLower.includes("mumbai") || descLower.includes("mumbai");

    const isNashik = [
      "panchavati", "indira", "satpur", "cidco"
    ].some(n => polyIdLower.includes(n) || nameLower.includes(n)) || 
    nameLower.includes("nashik") || descLower.includes("nashik");

    const isNagpur = [
      "dharampeth", "sitabuldi", "sadar", "wardhaman", "pratap", "manish"
    ].some(n => polyIdLower.includes(n) || nameLower.includes(n)) || 
    nameLower.includes("nagpur") || descLower.includes("nagpur");

    if (isMumbai) {
      return "72.75,19.30,73.20,18.85"; // Mumbai
    }
    if (isNagpur) {
      return "79.00,21.25,79.20,21.05"; // Nagpur
    }
    if (isNashik) {
      return "73.70,20.05,73.85,19.90"; // Nashik
    }
    return "73.70,18.65,74.00,18.40"; // Default Pune
  };

  // Parse linked Polygon Name from description e.g. "[Polygon: Shivajinagar] description"
  const parseZonePolygon = (zone) => {
    if (!zone) return null;
    const desc = zone.description || "";
    const match = desc.match(/^\[Polygon:\s*([^\]]+)\]/);
    return match ? match[1] : null;
  };

  const cleanDescription = (desc) => {
    if (!desc) return "";
    return desc.replace(/^\[Polygon:\s*[^\]]+\]\s*/, "");
  };

  // Initialize Leaflet Map
  const initLeafletMap = () => {
    if (mapInstanceRef.current) return;

    const container = document.getElementById("leaflet-map-div");
    if (!container) return; // Guard: do not initialize if DOM element isn't rendered yet

    // Maharashtra Viewport Bounding Limits
    const maharashtraBounds = L.latLngBounds([15.0, 72.0], [22.5, 81.0]);

    // Create map instance centered at Pune center
    const map = L.map("leaflet-map-div", {
      zoomControl: true,
      maxZoom: 18,
      minZoom: 8,
      maxBounds: maharashtraBounds,
      maxBoundsViscosity: 1.0,
    }).setView([18.5204, 73.8567], 12);

    mapInstanceRef.current = map;

    // Add Light Tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Setup groups
    polygonsGroupRef.current = L.layerGroup().addTo(map);
    markersGroupRef.current = L.layerGroup().addTo(map);

    // Fix default Leaflet icon assets urls in Vite
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Intercept map click (only triggers when not clicking layer)
    map.on("click", (e) => {
      if (addingAreaStateRef.current) {
        alert("Area must be inside the selected zone's polygon boundary.");
      }
    });
  };

  // Synchronize Leaflet Layers when state updates
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonsGroupRef.current || !markersGroupRef.current) return;

    const map = mapInstanceRef.current;
    const polyGroup = polygonsGroupRef.current;
    const markerGroup = markersGroupRef.current;

    // Clear old layers
    polyGroup.clearLayers();
    markerGroup.clearLayers();

    // Map active zones by polygon ID
    const mappedZones = {};
    zones.forEach((z) => {
      const polyId = parseZonePolygon(z);
      if (polyId) {
        mappedZones[polyId] = z;
      }
    });

    // 1. Draw pre-defined Polygons
    PREDEFINED_POLYGONS.forEach((poly) => {
      const activeZone = mappedZones[poly.id];
      const isActive = !!activeZone;

      // Filter check
      if (isActive && !showActiveZones) return;
      if (!isActive && !showInactivePolys) return;

      const color = isActive ? "var(--primary-light)" : "transparent";
      const stroke = isActive ? "var(--border-focus)" : "var(--text-muted)";

      const leafletPoly = L.polygon(poly.points, {
        color: stroke,
        fillColor: color,
        fillOpacity: isActive ? 0.65 : 0,
        weight: isActive ? 2.5 : 2,
        dashArray: isActive ? null : "6, 6",
      });

      // Bind Double Click selection and activation to allow dragging to pan/move without accidental clicks
      leafletPoly.on("dblclick", (e) => {
        window.L.DomEvent.stopPropagation(e);

        const clickLat = e.latlng.lat;
        const clickLng = e.latlng.lng;

        if (addingAreaStateRef.current) {
          if (!areaFormZoneIdRef.current) {
            alert("Please select a target active zone in the placement banner first.");
            return;
          }

          const targetZone = zones.find(z => z.id === Number(areaFormZoneIdRef.current));
          const targetPolyId = parseZonePolygon(targetZone);

          if (poly.id !== targetPolyId) {
            alert(`Area coordinates must be inside the SELECTED zone: "${targetZone?.name}" (${targetPolyId})`);
            return;
          }

          if (!isPointInPolygon([clickLat, clickLng], poly.points)) {
            alert("Area must be inside the selected zone's boundary.");
            return;
          }

          // Valid! Save location and open registration form
          setClickedCoords({ lat: clickLat, lng: clickLng });
          setErrorMessage("");
          setAreaModalOpen(true);
        } else {
          // Normal selection
          if (isActive) {
            setSelectedActiveZone(activeZone);
            setSelectedArea(null);
          } else {
            // Activate inactive polygon
            setClickedPolygonId(poly.id);
            setZoneForm({ name: "", description: "" });
            setEditingZoneId(null);
            setZoneModalOpen(true);
            setSelectedActiveZone(null);
            setSelectedArea(null);
          }
        }
      });

      // Add hover tooltip to display zone name
      leafletPoly.bindTooltip(isActive ? activeZone.name : `Inactive: ${poly.name}`, {
        sticky: true,
        direction: "auto"
      });

      // Hover effects
      leafletPoly.on("mouseover", () => {
        leafletPoly.setStyle({
          weight: isActive ? 4 : 3,
          color: isActive ? "var(--primary)" : "var(--text-primary)",
          fillOpacity: isActive ? 0.8 : 0.15
        });
      });

      leafletPoly.on("mouseout", () => {
        leafletPoly.setStyle({
          weight: isActive ? 2.5 : 2,
          color: stroke,
          fillOpacity: isActive ? 0.65 : 0
        });
      });

      leafletPoly.addTo(polyGroup);
    });

    // 2. Draw Area Markers
    if (showAreas) {
      areas.forEach((area) => {
        // Skip drawing markers for areas that don't have valid coordinate mappings yet
        if (area.latitude === null || area.longitude === null || area.latitude === undefined || area.longitude === undefined) {
          return;
        }

        const isSelected = selectedArea?.id === area.id;
        const parentZone = zones.find(z => z.id === area.zoneId);

        // Position coordinates: area.latitude represents Lat, area.longitude represents Lng
        const marker = L.marker([area.latitude, area.longitude]);

        // Formulate popup detail card DOM
        const popupDiv = document.createElement("div");
        popupDiv.style.width = "220px";
        popupDiv.style.fontFamily = "var(--font-main)";
        popupDiv.innerHTML = `
          <h4 style="font-weight: 800; font-size: 0.85rem; margin-bottom: 4px;">Area: ${area.name}</h4>
          <div style="font-size: 0.75rem; color: #4b5563; margin-bottom: 8px; line-height: 1.4;">
            Pincode: <strong>${area.pincode}</strong><br/>
            Hub Zone: <strong style="color: var(--primary);">${parentZone ? parentZone.name : "N/A"}</strong><br/>
            Lat: ${area.latitude.toFixed(5)}<br/>Lng: ${area.longitude.toFixed(5)}
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 6px; border-top: 1px solid #e5e7eb; padding-top: 6px; margin-top: 6px;">
            <button id="btn-edit-${area.id}" style="padding: 3px 8px; font-size: 0.7rem; cursor: pointer; border: 1px solid #d1d5db; background: white; border-radius: 4px; font-weight: 600;">Edit</button>
            <button id="btn-del-${area.id}" style="padding: 3px 8px; font-size: 0.7rem; cursor: pointer; color: white; background: var(--status-failed); border: none; border-radius: 4px; font-weight: 600;">Delete</button>
          </div>
        `;

        marker.bindPopup(popupDiv);

        marker.on("popupopen", () => {
          setSelectedArea(area);
          setSelectedActiveZone(null);

          // Edit Area
          document.getElementById(`btn-edit-${area.id}`)?.addEventListener("click", () => {
            setClickedCoords({ lat: area.latitude, lng: area.longitude });
            setEditingAreaId(area.id);
            setAreaForm({
              name: area.name,
              pincode: area.pincode,
              zoneId: String(area.zoneId),
            });
            setAreaModalOpen(true);
            marker.closePopup();
          });

          // Delete Area
          document.getElementById(`btn-del-${area.id}`)?.addEventListener("click", () => {
            handleDeleteArea(area.id);
            marker.closePopup();
          });
        });

        marker.addTo(markerGroup);
      });
    }

    // Draggable Placement Marker in Placement Mode
    if (addingAreaState && clickedCoords) {
      const placementIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div style="background-color: var(--primary); border: 2px solid white; width: 20px; height: 20px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.3); margin-top: -10px; margin-left: -10px;"><div style="width: 6px; height: 6px; background-color: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [0, 0]
      });

      const placementMarker = L.marker([clickedCoords.lat, clickedCoords.lng], {
        icon: placementIcon,
        draggable: true
      });

      placementMarker.bindPopup("<strong>Drag me</strong> to set Area pin location, then click Confirm Pin Location.");
      
      placementMarker.on("dragend", (e) => {
        const newLatLng = e.target.getLatLng();
        setClickedCoords({ lat: newLatLng.lat, lng: newLatLng.lng });
      });

      placementMarker.addTo(markerGroup);
    }

  }, [zones, areas, showActiveZones, showInactivePolys, showAreas, addingAreaState, selectedArea, clickedCoords]);

  // Autocomplete search inside Database registry (Filter Panel)
  const handleDbSearchChange = (value) => {
    setSearchTerm(value);
    if (!value) {
      setDbSuggestions([]);
      return;
    }

    if (searchType === "zone") {
      const activeMatches = zones.filter((z) => z.name.toLowerCase().includes(value.toLowerCase()));
      const polyMatches = PREDEFINED_POLYGONS.filter((p) => 
        p.id.toLowerCase().includes(value.toLowerCase()) && 
        !zones.some((z) => parseZonePolygon(z) === p.id)
      );
      
      const combined = [
        ...activeMatches.map((z) => ({ ...z, type: "active" })),
        ...polyMatches.map((p) => ({ id: p.id, name: p.id, type: "inactive" }))
      ];
      setDbSuggestions(combined.slice(0, 6));
    } else {
      const filtered = areas.filter((a) => a.name.toLowerCase().includes(value.toLowerCase()) || (a.pincode && a.pincode.includes(value)));
      setDbSuggestions(filtered.slice(0, 6));
    }
  };

  const handleDbSuggestionSelect = (item) => {
    setSearchTerm(item.name);
    setDbSuggestions([]);

    if (searchType === "zone") {
      if (item.type === "active") {
        const polyId = parseZonePolygon(item);
        const poly = PREDEFINED_POLYGONS.find((p) => p.id === polyId);
        if (poly) {
          zoomToPolygon(poly.points);
          setSelectedActiveZone(item);
          setSelectedArea(null);
        }
      } else {
        const poly = PREDEFINED_POLYGONS.find((p) => p.id === item.id);
        if (poly) {
          zoomToPolygon(poly.points);
          setClickedPolygonId(poly.id);
          setZoneForm({ name: "", description: "" });
          setEditingZoneId(null);
          setZoneModalOpen(true);
          setSelectedActiveZone(null);
          setSelectedArea(null);
        }
      }
    } else {
      zoomToArea(item.latitude, item.longitude);
      setSelectedArea(item);
      setSelectedActiveZone(null);
    }
  };

  // Google Maps-style global place search inputs debouncer
  const handleMapSearchInputChange = (value) => {
    setMapSearchQuery(value);
    if (value.length < 2) {
      setMapSuggestions([]);
      return;
    }

    if (mapDebounceTimer.current) {
      clearTimeout(mapDebounceTimer.current);
    }

    mapDebounceTimer.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&viewbox=72.50,22.00,80.90,15.60&format=json&limit=5`;
        const response = await fetch(url, { headers: { "Accept-Language": "en" } });
        const results = await response.json();
        setMapSuggestions(results || []);
      } catch (err) {
        console.error("Map search suggestions failed:", err);
      }
    }, 300);
  };

  const handleMapSuggestionSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    const simpleName = place.display_name.split(',')[0];

    setMapSearchQuery(simpleName);
    setMapSuggestions([]);

    // Pan map to search result
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
    }

    // Identify which predefined polygon contains these coordinates
    let matchedPoly = null;
    for (const poly of PREDEFINED_POLYGONS) {
      if (isPointInPolygon([lat, lng], poly.points)) {
        matchedPoly = poly;
        break;
      }
    }

    if (matchedPoly) {
      // Active zones index mapping
      const mappedZones = {};
      zones.forEach((z) => {
        const polyId = parseZonePolygon(z);
        if (polyId) mappedZones[polyId] = z;
      });

      const activeZone = mappedZones[matchedPoly.id];
      if (activeZone) {
        setSelectedActiveZone(activeZone);
        setSelectedArea(null);
      } else {
        // Activate zone dialog
        setClickedPolygonId(matchedPoly.id);
        setZoneForm({ name: "", description: "" });
        setEditingZoneId(null);
        setZoneModalOpen(true);
        setSelectedActiveZone(null);
        setSelectedArea(null);
      }
    }
  };

  // Autocomplete handlers for placement form search
  const handleGeocoderInputChange = (value) => {
    setGeocoderQuery(value);
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const targetZone = zones.find((z) => z.id === Number(areaForm.zoneId));
        const viewbox = getViewboxForZone(targetZone);

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&viewbox=${viewbox}&bounded=1&format=json&limit=5&addressdetails=1`;
        const response = await fetch(url, { headers: { "Accept-Language": "en" } });
        const results = await response.json();
        setSuggestions(results || []);
      } catch (err) {
        console.error("Autocomplete failed:", err);
      }
    }, 300);
  };

  const handleSuggestionSelect = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    const simpleName = place.display_name.split(',')[0];
    
    setGeocoderQuery(simpleName);
    setSuggestions([]);

    const targetZone = zones.find((z) => z.id === Number(areaForm.zoneId));
    const targetPolyId = parseZonePolygon(targetZone);
    const polygon = PREDEFINED_POLYGONS.find((p) => p.id === targetPolyId);

    setClickedCoords({ lat, lng });
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
    }
    
    setAreaForm({
      ...areaForm,
      name: simpleName,
      pincode: place.address?.postcode || "",
    });
    setErrorMessage("");

    if (polygon && !isPointInPolygon([lat, lng], polygon.points)) {
      alert(`Note: "${simpleName}" coordinates are outside the selected "${targetZone?.name}" zone boundary polygon. Please drag the marker pin inside the border line before confirming.`);
    }
  };

  const handleGeocodeSearch = async (e) => {
    e.preventDefault();
    if (!geocoderQuery) return;
    if (!areaForm.zoneId) {
      alert("Please select a target active zone in the banner first.");
      return;
    }

    try {
      setGeocoderLoading(true);
      const targetZone = zones.find((z) => z.id === Number(areaForm.zoneId));
      const viewbox = getViewboxForZone(targetZone);

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geocoderQuery)}&viewbox=${viewbox}&bounded=1&format=json&limit=1`;
      const response = await fetch(url, { headers: { "Accept-Language": "en" } });
      const results = await response.json();
      
      if (results && results.length > 0) {
        const place = results[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);

        const targetPolyId = parseZonePolygon(targetZone);
        const polygon = PREDEFINED_POLYGONS.find((p) => p.id === targetPolyId);

        setClickedCoords({ lat, lng });
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
        }
        
        setAreaForm({
          ...areaForm,
          name: geocoderQuery,
          pincode: "",
        });
        setSuggestions([]);
        setErrorMessage("");

        if (polygon && !isPointInPolygon([lat, lng], polygon.points)) {
          alert(`Note: coordinates found are outside the selected "${targetZone?.name}" zone boundary polygon. Please drag the marker pin inside the border line before confirming.`);
        }
      } else {
        alert("Location not found in the selected city. Try a different place name.");
      }
    } catch (err) {
      console.error(err);
      alert("Search service failure. Please drag the marker or click inside the boundary manually.");
    } finally {
      setGeocoderLoading(false);
    }
  };

  // Form Submissions
  const handleZoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (!zoneForm.name) return;

      const polyId = clickedPolygonId || parseZonePolygon(zones.find(z => z.id === editingZoneId));
      const alreadyAssigned = zones.find(z => parseZonePolygon(z) === polyId && z.id !== editingZoneId);
      if (alreadyAssigned) {
        setErrorMessage("This region is already allocated to another active hub.");
        return;
      }

      const payload = {
        name: zoneForm.name,
        description: `[Polygon: ${polyId}] ${zoneForm.description}`,
      };

      let res;
      if (editingZoneId) {
        res = await api.updateZone(editingZoneId, payload);
      } else {
        res = await api.createZone(payload);
      }

      if (res.success) {
        setZoneModalOpen(false);
        setEditingZoneId(null);
        setClickedPolygonId(null);
        loadData();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save zone.");
    }
  };

  const handleAreaSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (!areaForm.name || !areaForm.pincode || !areaForm.zoneId) return;

      const payload = {
        name: areaForm.name,
        pincode: areaForm.pincode,
        zoneId: Number(areaForm.zoneId),
        latitude: clickedCoords.lat,
        longitude: clickedCoords.lng,
      };

      let res;
      if (editingAreaId) {
        res = await api.updateArea(editingAreaId, payload);
      } else {
        res = await api.createArea(payload);
      }

      if (res.success) {
        setAreaModalOpen(false);
        setEditingAreaId(null);
        setClickedCoords(null);
        setAddingAreaState(false);
        setGeocoderQuery("");
        loadData();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to save area.");
    }
  };

  const handleDeleteZone = async (id) => {
    if (!window.confirm("Deleting this zone will deactivate this region. Proceed?")) return;
    try {
      const res = await api.deleteZone(id);
      if (res.success) {
        setSelectedActiveZone(null);
        loadData();
      }
    } catch (err) {
      alert(err.message || "Error deleting zone.");
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm("Are you sure you want to delete this area marker?")) return;
    try {
      const res = await api.deleteArea(id);
      if (res.success) {
        setSelectedArea(null);
        loadData();
      }
    } catch (err) {
      alert(err.message || "Error deleting area.");
    }
  };

  // Zooming
  const zoomToPolygon = (polyPoints) => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds(polyPoints);
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
  };

  const zoomToArea = (lat, lng) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
  };

  const resetZoom = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([18.5204, 73.8567], 12, { animate: true });
  };

  return (
    <div className="fade-in">
      <div className="page-title-section" style={{ borderBottom: "2px solid var(--border)", paddingBottom: "16px", marginBottom: "20px" }}>
        <div>
          <h1 className="page-title" style={{ fontSize: "1.5rem", fontWeight: "800", letterSpacing: "-0.5px" }}>City Zonation Dashboard</h1>
          <p className="page-subtitle" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Configure polygon boundaries, hub coverage areas, and verify spatial coordinates on the map</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-secondary" onClick={resetZoom}>
            <RotateCcw size={16} /> Reset View
          </button>
          <button
            className={`btn ${addingAreaState ? "btn-danger" : "btn-secondary"}`}
            onClick={() => {
              setAddingAreaState(!addingAreaState);
              setSuggestions([]);
              setGeocoderQuery("");
              if (!addingAreaState) {
                setAreaForm({
                  name: "",
                  pincode: "",
                  zoneId: selectedActiveZone ? String(selectedActiveZone.id) : "",
                });
              }
            }}
          >
            {addingAreaState ? "Cancel Area Placement" : "Add Area Marker"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setClickedPolygonId("");
              setZoneForm({ name: "", description: "" });
              setEditingZoneId(null);
              setZoneModalOpen(true);
            }}
          >
            <Plus size={16} /> Create Zone
          </button>
        </div>
      </div>

      {/* Filters and Search panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "20px", marginBottom: "20px" }}>
        <div className="table-card" style={{ padding: "12px 20px", marginBottom: "0", display: "flex", gap: "16px", alignItems: "center", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
            <Sliders size={14} /> FILTERS:
          </span>
          <label style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "600" }}>
            <input type="checkbox" checked={showActiveZones} onChange={(e) => setShowActiveZones(e.target.checked)} />
            Active Zones
          </label>
          <label style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "600" }}>
            <input type="checkbox" checked={showInactivePolys} onChange={(e) => setShowInactivePolys(e.target.checked)} />
            Inactive Polygons
          </label>
          <label style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontWeight: "600" }}>
            <input type="checkbox" checked={showAreas} onChange={(e) => setShowAreas(e.target.checked)} />
            Area Pins
          </label>
        </div>

        {/* DB Registry Autocomplete Search */}
        <div className="table-card" style={{ padding: "12px 20px", marginBottom: "0", position: "relative", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", zIndex: dbSuggestions.length > 0 ? 1005 : 1 }}>
          <div style={{ display: "flex", gap: "8px", width: "100%" }}>
            <select
              className="filter-select"
              style={{ height: "36px", padding: "0 10px", fontSize: "0.8rem", borderRadius: "var(--radius-sm)" }}
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSearchTerm("");
                setDbSuggestions([]);
              }}
            >
              <option value="zone">Zone Name</option>
              <option value="area">Area Name</option>
            </select>
            <div className="header-search" style={{ flex: 1, height: "36px" }}>
              <Search className="header-search-icon" style={{ top: "10px" }} />
              <input
                type="text"
                placeholder={`Type to search registered ${searchType}s...`}
                value={searchTerm}
                onChange={(e) => handleDbSearchChange(e.target.value)}
                style={{ width: "100%", height: "100%", padding: "0 12px 0 36px", fontSize: "0.8rem", borderRadius: "var(--radius-sm)" }}
              />
            </div>
          </div>

          {/* DB Suggestions Dropdown */}
          {dbSuggestions.length > 0 && (
            <ul className="autocomplete-suggestions" style={{ width: "calc(100% - 40px)", left: "20px", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-lg)" }}>
              {dbSuggestions.map((item) => (
                <li key={item.id || item.name} onClick={() => handleDbSuggestionSelect(item)} style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {searchType === "zone" ? (
                    item.type === "active" ? (
                      <span>Active Hub: <strong>{item.name}</strong></span>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>Inactive Outline: <strong>{item.name}</strong></span>
                    )
                  ) : (
                    <span>Pin Area: <strong>{item.name}</strong> {item.pincode && `(${item.pincode})`}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {addingAreaState && (
        <div
          style={{
            backgroundColor: "var(--status-assigned-bg)",
            color: "var(--status-assigned-text)",
            padding: "16px 20px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.8rem",
            fontWeight: "700",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid rgba(37, 99, 235, 0.2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={16} className="text-primary" />
              <span style={{ color: "var(--text-primary)", fontWeight: "800" }}>
                Placement Mode Active: Drag the map marker pin or search below to locate the new Area coordinates
              </span>
            </div>
            <button className="btn btn-secondary" style={{ height: "36px", padding: "0 14px", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }} onClick={() => setAddingAreaState(false)}>
              Cancel Placement
            </button>
          </div>
          
          <div style={{ display: "flex", gap: "16px", alignItems: "center", width: "100%", borderTop: "1px dashed var(--border)", paddingTop: "12px", marginTop: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", fontWeight: "700" }}>Target Zone:</span>
              <select
                className="filter-select"
                value={areaForm.zoneId}
                onChange={(e) => {
                  const val = e.target.value;
                  setAreaForm({ ...areaForm, zoneId: val });
                  if (val) {
                    const targetZone = zones.find((z) => z.id === Number(val));
                    const targetPolyId = parseZonePolygon(targetZone);
                    const polygon = PREDEFINED_POLYGONS.find((p) => p.id === targetPolyId);
                    if (polygon && polygon.points.length > 0) {
                      const center = polygon.points[0];
                      setClickedCoords({ lat: center[0], lng: center[1] });
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.setView(center, 13, { animate: true });
                      }
                    }
                  } else {
                    setClickedCoords(null);
                  }
                }}
                style={{ height: "36px", padding: "0 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: "0.75rem", minWidth: "160px" }}
              >
                <option value="">-- Choose Active Zone --</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {areaForm.zoneId && (
              <div style={{ flex: 1, position: "relative", display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <form onSubmit={handleGeocodeSearch} style={{ display: "flex", gap: "8px", width: "100%" }}>
                    <input
                      type="text"
                      placeholder="Search local place or address inside selected zone..."
                      value={geocoderQuery}
                      onChange={(e) => handleGeocoderInputChange(e.target.value)}
                      className="form-input"
                      style={{ flex: 1, height: "36px", padding: "0 12px", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={geocoderLoading} style={{ height: "36px", padding: "0 16px", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}>
                      {geocoderLoading ? "Locating..." : "Find Coordinates"}
                    </button>
                  </form>
                  
                  {suggestions.length > 0 && (
                    <ul className="autocomplete-suggestions" style={{ position: "absolute", left: 0, right: 0, top: "38px", zIndex: 1001, backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-lg)", listStyle: "none", margin: 0, padding: 0 }}>
                      {suggestions.map((place) => (
                        <li
                          key={place.place_id}
                          onClick={() => handleSuggestionSelect(place)}
                          style={{ padding: "8px 12px", cursor: "pointer", fontSize: "0.75rem", color: "var(--text-primary)", borderBottom: "1px solid var(--border)" }}
                        >
                          {place.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    Selected Pin: {clickedCoords ? `${clickedCoords.lat.toFixed(4)}, ${clickedCoords.lng.toFixed(4)}` : "None"}
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!clickedCoords}
                    onClick={() => {
                      if (!clickedCoords) return;
                      const targetZone = zones.find((z) => z.id === Number(areaForm.zoneId));
                      const targetPolyId = parseZonePolygon(targetZone);
                      const polygon = PREDEFINED_POLYGONS.find((p) => p.id === targetPolyId);
                      
                      if (polygon && !isPointInPolygon([clickedCoords.lat, clickedCoords.lng], polygon.points)) {
                        alert(`The marker pin is currently OUTSIDE the selected "${targetZone?.name}" zone boundary. Please drag it inside the borders.`);
                        return;
                      }

                      setErrorMessage("");
                      setAreaForm({
                        ...areaForm,
                        name: geocoderQuery || "",
                        pincode: ""
                      });
                      setAreaModalOpen(true);
                    }}
                    style={{ height: "36px", padding: "0 16px", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
                  >
                    Confirm Pin Location
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Map Box & Side Detail panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
        
        {/* Real Leaflet Map Container with floating Google-style search overlay */}
        <div className="chart-card" style={{ padding: "0", overflow: "hidden", position: "relative", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
          
          {/* Floating Google Maps-style Search Overlay */}
          {!addingAreaState && (
            <div className="map-search-overlay" style={{ position: "absolute", top: "10px", left: "50px", zIndex: 1000, width: "280px" }}>
              <div className="autocomplete-container" style={{ width: "100%" }}>
                <div style={{ position: "relative", width: "100%", height: "36px", display: "flex", alignItems: "center", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-sm)" }}>
                  <Search size={14} style={{ position: "absolute", left: "12px", color: "var(--text-muted)", pointerEvents: "none" }} />
                  <input
                    type="text"
                    placeholder="Search Pune places..."
                    value={mapSearchQuery}
                    onChange={(e) => handleMapSearchInputChange(e.target.value)}
                    style={{ width: "100%", height: "100%", padding: "8px 12px 8px 36px", fontSize: "0.8rem", borderRadius: "var(--radius-sm)", border: "none", outline: "none", backgroundColor: "transparent", color: "var(--text-primary)" }}
                  />
                </div>
                {mapSuggestions.length > 0 && (
                  <ul className="autocomplete-suggestions" style={{ width: "100%", borderRadius: "var(--radius-sm)" }}>
                    {mapSuggestions.map((place) => (
                      <li key={place.place_id} onClick={() => handleMapSuggestionSelect(place)} style={{ padding: "8px 12px" }}>
                        {place.display_name.split(',')[0]} <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>({place.display_name.split(',').slice(1,3).join(',')})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Floating Eye Button to toggle all zones overlay */}
          <button
            type="button"
            onClick={() => setShowInactivePolys(!showInactivePolys)}
            title={showInactivePolys ? "Hide Unassigned Divisions" : "Show All Maharashtra Divisions"}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1000,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-primary)",
              transition: "var(--transition)",
            }}
          >
            {showInactivePolys ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          <div id="leaflet-map-div" style={{ width: "100%", height: "480px", position: "relative", zIndex: 1, filter: "grayscale(100%) contrast(1.05) brightness(0.95)" }} />
        </div>

        {/* Sidebar Details Drawer */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="activities-panel" style={{ width: "100%", minHeight: "320px", display: "flex", flexDirection: "column", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
            {selectedActiveZone ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--primary)" }}>
                    Zone Hub: {selectedActiveZone.name}
                  </h3>
                  <button
                    style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}
                    onClick={() => setSelectedActiveZone(null)}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Allocated Region:</span>{" "}
                    <strong>{parseZonePolygon(selectedActiveZone)}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Description:</span>
                    <p style={{ marginTop: "4px", backgroundColor: "var(--bg-app)", padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", lineLength: 1.4 }}>
                      {cleanDescription(selectedActiveZone.description) || "No description provided."}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "20px", margin: "10px 0" }}>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Linked Areas</div>
                      <strong style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
                        {areas.filter((a) => a.zoneId === selectedActiveZone.id).length}
                      </strong>
                    </div>
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Active Drivers</div>
                      <strong style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
                        {agents.filter((a) => a.agentProfile?.currentZoneId === selectedActiveZone.id).length}
                      </strong>
                    </div>
                  </div>

                  <h4 style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", marginTop: "10px", fontSize: "0.75rem", fontWeight: "800", color: "var(--text-primary)" }}>
                    Coverage List:
                  </h4>
                  <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
                    {areas.filter((a) => a.zoneId === selectedActiveZone.id).length === 0 ? (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>No areas linked to this hub yet.</span>
                    ) : (
                      areas
                        .filter((a) => a.zoneId === selectedActiveZone.id)
                        .map((a) => (
                          <div
                            key={a.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: "var(--bg-app)",
                              padding: "6px 10px",
                              borderRadius: "var(--radius-sm)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <span>Area: {a.name} ({a.pincode})</span>
                            <button
                              style={{ border: "none", background: "none", cursor: "pointer", color: "var(--status-failed)", fontWeight: "bold" }}
                              onClick={() => handleDeleteArea(a.id)}
                            >
                              ✕
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", borderTop: "1px solid var(--border)", paddingTop: "14px", marginTop: "14px" }}>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "6px", borderRadius: "var(--radius-sm)" }}
                    onClick={() => {
                      setEditingZoneId(selectedActiveZone.id);
                      setClickedPolygonId(parseZonePolygon(selectedActiveZone));
                      setZoneForm({
                        name: selectedActiveZone.name,
                        description: cleanDescription(selectedActiveZone.description),
                      });
                      setZoneModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ flex: 1, padding: "6px", borderRadius: "var(--radius-sm)" }}
                    onClick={() => handleDeleteZone(selectedActiveZone.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, color: "var(--text-muted)", textAlign: "center" }}>
                <Map size={36} style={{ marginBottom: "12px", color: "var(--primary)" }} />
                <h4 style={{ fontWeight: "800", color: "var(--text-primary)", fontSize: "0.85rem" }}>Fulfillment Hub Details</h4>
                <p style={{ fontSize: "0.7rem", marginTop: "4px", padding: "0 16px", lineHeight: "1.4" }}>
                  Select an active colored polygon on the map to inspect its logistics details, linked areas coverage, and active delivery fleet agents.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hub Zones & Covered Areas Directory */}
      <div className="table-card" style={{ marginTop: "30px", padding: "24px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "var(--primary)", marginBottom: "16px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
          <MapPin size={18} /> Hub Zones & Covered Areas Directory
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {zones.map((zone) => {
            const zoneAreas = areas.filter((a) => a.zoneId === zone.id);
            const polyId = parseZonePolygon(zone);

            return (
              <div 
                key={zone.id} 
                className="table-card" 
                style={{ 
                  display: "flex",
                  flexDirection: "column", 
                  alignItems: "stretch", 
                  padding: "16px", 
                  border: "1px solid var(--border)", 
                  borderRadius: "var(--radius-sm)", 
                  backgroundColor: "var(--bg-app)",
                  cursor: "default",
                  marginBottom: 0
                }}
              >
                {/* Zone Header Info */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "8px", marginBottom: "12px" }}>
                  <div>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-primary)", margin: 0 }}>
                      {zone.name}
                    </h4>
                    <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Region: {polyId}
                    </span>
                  </div>
                  
                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="btn btn-secondary btn-icon"
                      title="Focus on Map"
                      onClick={() => {
                        setSelectedActiveZone(zone);
                        const polygon = PREDEFINED_POLYGONS.find((p) => p.id === polyId);
                        if (polygon && polygon.points.length > 0) {
                          zoomToPolygon(polygon.points);
                        }
                      }}
                      style={{ padding: "4px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Navigation size={12} />
                    </button>
                    <button
                      className="btn btn-secondary btn-icon"
                      title="Edit"
                      onClick={() => {
                        setEditingZoneId(zone.id);
                        setClickedPolygonId(polyId);
                        setZoneForm({
                          name: zone.name,
                          description: cleanDescription(zone.description),
                        });
                        setZoneModalOpen(true);
                      }}
                      style={{ padding: "4px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Plus size={12} style={{ transform: "rotate(45deg)" }} />
                    </button>
                  </div>
                </div>

                {/* Covered Areas list */}
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                    Covered Areas ({zoneAreas.length})
                  </div>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: "120px", overflowY: "auto", paddingRight: "2px" }}>
                    {zoneAreas.length === 0 ? (
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        No coverage areas registered.
                      </span>
                    ) : (
                      zoneAreas.map((area) => (
                        <div
                          key={area.id}
                          style={{
                            fontSize: "0.65rem",
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "4px",
                            padding: "3px 6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            boxShadow: "var(--shadow-sm)"
                          }}
                        >
                          <span 
                            style={{ cursor: "pointer", fontWeight: "600", color: "var(--text-primary)" }} 
                            onClick={() => {
                              setSelectedActiveZone(zone);
                              zoomToArea(area.latitude, area.longitude);
                            }}
                            title="Focus area"
                          >
                            {area.name} ({area.pincode})
                          </span>
                          <button
                            onClick={() => handleDeleteArea(area.id)}
                            style={{
                              border: "none",
                              background: "none",
                              color: "var(--status-failed)",
                              cursor: "pointer",
                              fontSize: "0.65rem",
                              padding: 0,
                              fontWeight: "bold",
                              marginLeft: "2px"
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone Modal */}
      {zoneModalOpen && (
        <div className="modal-backdrop" onClick={() => { setZoneModalOpen(false); setClickedPolygonId(null); setEditingZoneId(null); }}>
          <form
            onSubmit={handleZoneSubmit}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <div className="modal-header">
              <span className="modal-title">
                {editingZoneId ? "Modify Hub Zone" : "Activate Predefined Zone Region"}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => { setZoneModalOpen(false); setClickedPolygonId(null); setEditingZoneId(null); }}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
                {errorMessage && <div className="auth-error">{errorMessage}</div>}
                
                <div className="form-group">
                  <label className="form-label">Predefined Polygon Region</label>
                  {clickedPolygonId ? (
                    <input type="text" className="form-input" value={clickedPolygonId} disabled style={{ borderRadius: "var(--radius-sm)" }} />
                  ) : (
                    <select
                      className="form-input"
                      required
                      value={clickedPolygonId || ""}
                      onChange={(e) => setClickedPolygonId(e.target.value)}
                      disabled={editingZoneId !== null}
                      style={{ borderRadius: "var(--radius-sm)" }}
                    >
                      <option value="">-- Choose Predefined Region --</option>
                      {PREDEFINED_POLYGONS.map((poly) => {
                        const isAssigned = !!zones.find(z => parseZonePolygon(z) === poly.id);
                        const cityPrefix = poly.id.includes("Bandra") || poly.id.includes("Andheri") || poly.id.includes("Borivali") || poly.id.includes("Dadar") || poly.id.includes("Colaba") || poly.id.includes("Kurla") || poly.id.includes("Thane") ? "Mumbai" :
                                           poly.id.includes("Dharampeth") || poly.id.includes("Sitabuldi") || poly.id.includes("Wardhaman") || poly.id.includes("Pratap") || poly.id.includes("Manish") ? "Nagpur" :
                                           poly.id.includes("Panchavati") || poly.id.includes("Indira") || poly.id.includes("Satpur") || poly.id.includes("CIDCO") ? "Nashik" : "Pune";
                        return (
                          <option key={poly.id} value={poly.id} disabled={isAssigned}>
                            [{cityPrefix}] {poly.name} {isAssigned ? "(Active)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Zone Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Pune West Hub, Kothrud Logistics Center"
                    required
                    value={zoneForm.name}
                    onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: "80px", borderRadius: "var(--radius-sm)" }}
                    placeholder="Hub warehouse description..."
                    value={zoneForm.description}
                    onChange={(e) => setZoneForm({ ...zoneForm, description: e.target.value })}
                  />
                </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setZoneModalOpen(false); setClickedPolygonId(null); setEditingZoneId(null); }}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: "var(--radius-sm)" }}>
                {editingZoneId ? "Save Changes" : "Activate Region"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Area Modal */}
      {areaModalOpen && (
        <div className="modal-backdrop" onClick={() => { setAreaModalOpen(false); setEditingAreaId(null); setClickedCoords(null); }}>
          <form
            onSubmit={handleAreaSubmit}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <div className="modal-header">
              <span className="modal-title">
                {editingAreaId ? "Modify Area Details" : "Register Area Coordinate"}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => { setAreaModalOpen(false); setEditingAreaId(null); setClickedCoords(null); }}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
                {errorMessage && <div className="auth-error">{errorMessage}</div>}

                <div className="form-group">
                  <label className="form-label">Coordinates Placement (Lat, Lng)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={clickedCoords ? `${clickedCoords.lat.toFixed(5)}, ${clickedCoords.lng.toFixed(5)}` : "N/A"}
                    disabled
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Area Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ideal Colony, Karve Road"
                    required
                    value={areaForm.name}
                    onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal Pincode *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 411038"
                    required
                    value={areaForm.pincode}
                    onChange={(e) => setAreaForm({ ...areaForm, pincode: e.target.value })}
                    style={{ borderRadius: "var(--radius-sm)" }}
                  />
                </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setAreaModalOpen(false); setEditingAreaId(null); setClickedCoords(null); }}
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: "var(--radius-sm)" }}>
                {editingAreaId ? "Save Changes" : "Link Area"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
