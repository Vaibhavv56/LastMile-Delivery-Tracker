import prisma from "../config/prisma.js";
import { generateOrderNumber } from "../utils/orderNumber.js";
import { sendOrderStatusEmail } from "./email.service.js";

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

const geocodeAddress = async (address) => {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (apiKey) {
    try {
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&limit=1&apiKey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates; // [lon, lat]
        return { lat: coords[1], lng: coords[0] };
      }
    } catch (e) {
      console.error("Geoapify geocoding failed:", e);
    }
  }

  // Fallback to Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { "User-Agent": "LastMileLogistics" } });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (e) {
    console.error("Nominatim fallback geocoding failed:", e);
  }
  return null;
};

const resolveAreaFromCoords = async (lat, lng) => {
  let matchedPoly = null;
  for (const poly of PREDEFINED_POLYGONS) {
    if (isPointInPolygon([lat, lng], poly.points)) {
      matchedPoly = poly;
      break;
    }
  }

  if (!matchedPoly) {
    throw new Error("Address is outside our active courier service coverage boundaries.");
  }

  // Find database Area record matching the polygon name
  const area = await prisma.area.findFirst({
    where: {
      name: {
        contains: matchedPoly.id,
        mode: "insensitive"
      }
    },
    include: {
      zone: true
    }
  });

  if (!area) {
    throw new Error(`The localized operational zone "${matchedPoly.name}" is not yet active in our system.`);
  }

  return area;
};

export const estimateOrderChargesService = async (data) => {
    let pickupArea;
    if (data.pickupAreaId) {
        pickupArea = await prisma.area.findUnique({
            where: { id: Number(data.pickupAreaId) },
            include: { zone: true }
        });
    } else {
        let lat = data.pickupLat;
        let lng = data.pickupLng;
        if (!lat || !lng) {
            const coords = await geocodeAddress(data.pickupAddress);
            if (!coords) throw new Error("Could not locate coordinates for the pickup address.");
            lat = coords.lat;
            lng = coords.lng;
        }
        pickupArea = await resolveAreaFromCoords(lat, lng);
    }

    if (!pickupArea) {
        throw new Error("Pickup Area not found.");
    }

    let dropArea;
    if (data.dropAreaId) {
        dropArea = await prisma.area.findUnique({
            where: { id: Number(data.dropAreaId) },
            include: { zone: true }
        });
    } else {
        let lat = data.dropLat;
        let lng = data.dropLng;
        if (!lat || !lng) {
            const coords = await geocodeAddress(data.dropAddress);
            if (!coords) throw new Error("Could not locate coordinates for the drop address.");
            lat = coords.lat;
            lng = coords.lng;
        }
        dropArea = await resolveAreaFromCoords(lat, lng);
    }

    if (!dropArea) {
        throw new Error("Drop Area not found.");
    }

    const volumetricWeight = (Number(data.lengthCm) * Number(data.widthCm) * Number(data.heightCm)) / 5000;
    const billableWeight = Math.max(Number(data.actualWeight), volumetricWeight);

    const rate = await prisma.rateCard.findFirst({
        where: {
            pickupZoneId: pickupArea.zoneId,
            dropZoneId: dropArea.zoneId,
            orderType: data.orderType
        }
    });

    if (!rate) {
        throw new Error("No operational service rate matches the solved routing.");
    }

    const deliveryCharge = Number(rate.ratePerKg) * billableWeight;
    const codCharge = data.paymentType === "COD" ? Number(rate.codCharge) : 0;
    const totalAmount = deliveryCharge + codCharge;

    return {
        volumetric: volumetricWeight.toFixed(2),
        billable: billableWeight.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        codCharge: codCharge.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        ratePerKg: rate.ratePerKg
    };
};

export const createOrderService = async (data, adminId) => {

    // 1. Customer

    const customer = await prisma.user.findUnique({
        where: {
            id: data.customerId
        }
    });

    if (!customer || customer.role !== "CUSTOMER") {
        throw new Error("Customer not found.");
    }

    // 2. Pickup Area Resolution
    let pickupArea;
    if (data.pickupAreaId) {
        pickupArea = await prisma.area.findUnique({
            where: {
                id: Number(data.pickupAreaId)
            },
            include: {
                zone: true
            }
        });
    } else {
        let lat = data.pickupLat;
        let lng = data.pickupLng;
        if (!lat || !lng) {
            const coords = await geocodeAddress(data.pickupAddress);
            if (!coords) throw new Error("Could not locate coordinates for the pickup address.");
            lat = coords.lat;
            lng = coords.lng;
        }
        pickupArea = await resolveAreaFromCoords(lat, lng);
    }

    if (!pickupArea) {
        throw new Error("Pickup Area not found.");
    }

    // 3. Drop Area Resolution
    let dropArea;
    if (data.dropAreaId) {
        dropArea = await prisma.area.findUnique({
            where: {
                id: Number(data.dropAreaId)
            },
            include: {
                zone: true
            }
        });
    } else {
        let lat = data.dropLat;
        let lng = data.dropLng;
        if (!lat || !lng) {
            const coords = await geocodeAddress(data.dropAddress);
            if (!coords) throw new Error("Could not locate coordinates for the drop address.");
            lat = coords.lat;
            lng = coords.lng;
        }
        dropArea = await resolveAreaFromCoords(lat, lng);
    }

    if (!dropArea) {
        throw new Error("Drop Area not found.");
    }

    // 4. Volumetric Weight

    const volumetricWeight =
        (data.lengthCm *
            data.widthCm *
            data.heightCm) /
        5000;

    // 5. Billable Weight

    const billableWeight = Math.max(
        Number(data.actualWeight),
        volumetricWeight
    );

    // 6. Rate Card

    const rate = await prisma.rateCard.findFirst({

        where: {

            pickupZoneId: pickupArea.zoneId,

            dropZoneId: dropArea.zoneId,

            orderType: data.orderType

        }

    });

    if (!rate) {
        throw new Error("Rate Card not found.");
    }

    // 7. Charges

    const deliveryCharge =
        Number(rate.ratePerKg) * billableWeight;

    const codCharge =
        data.paymentType === "COD"
            ? Number(rate.codCharge)
            : 0;

    const totalAmount =
        deliveryCharge + codCharge;

    // 8. Order Number

    const orderNumber = generateOrderNumber();

    // 9. Create Order

    const order = await prisma.order.create({

        data: {

            orderNumber,

            customerId: customer.id,

            pickupAddressLine: data.pickupAddress,

            dropAddressLine: data.dropAddress,

            pickupPincode: pickupArea.pincode,

            dropPincode: dropArea.pincode,

            pickupZoneId: pickupArea.zoneId,

            dropZoneId: dropArea.zoneId,

            lengthCm: data.lengthCm,

            widthCm: data.widthCm,

            heightCm: data.heightCm,

            actualWeight: data.actualWeight,

            volumetricWeight,

            billableWeight,

            orderType: data.orderType,

            paymentType: data.paymentType,

            deliveryCharge,

            codCharge,

            totalAmount

        }

    });

    // 10. Tracking History

    await prisma.trackingHistory.create({

        data: {

            orderId: order.id,

            status: "PENDING",

            updatedById: adminId,

            remarks: "Order Created"

        }

    });

    // Trigger email notification
    sendOrderStatusEmail(order.id, "PENDING", "Order Created").catch(err => console.error("Email dispatch failed:", err));

    return order;

};

export const getAllOrdersService = async (query) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const where = {};

    if (query.status) {
        where.status = query.status;
    }

    if (query.customerId) {
        where.customerId = Number(query.customerId);
    }

    if (query.search) {
        where.orderNumber = {
            contains: query.search,
            mode: "insensitive"
        };
    }

    const [orders, total] = await Promise.all([

        prisma.order.findMany({

            where,

            skip,

            take: limit,

            orderBy: {
                createdAt: "desc"
            },

            include: {

                customer: true,

                assignedAgent: true,

                pickupZone: true,

                dropZone: true

            }

        }),

        prisma.order.count({ where })

    ]);

    return {

        total,

        page,

        totalPages: Math.ceil(total / limit),

        orders

    };

};


export const getOrderByIdService = async (id) => {

    return await prisma.order.findUnique({

        where: {
            id
        },

        include: {

            customer: true,

            assignedAgent: true,

            pickupZone: true,

            dropZone: true,

            trackingHistory: {

                orderBy: {
                    createdAt: "asc"
                },

                include: {
                    updatedBy: true
                }

            }

        }

    });

};

export const assignAgentService = async (
    orderId,
    agentId,
    adminId
) => {

    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        }
    });

    if (!order) {
        throw new Error("Order not found.");
    }

    let resolvedAgentId;

    if (agentId === "auto" || !agentId) {
        const eligibleAgents = await prisma.user.findMany({
            where: {
                role: "AGENT",
                isActive: true,
                agentProfile: {
                    availability: true
                }
            },
            include: {
                agentProfile: true,
                assignedOrders: {
                    where: {
                        status: {
                            notIn: ["DELIVERED", "FAILED"]
                        }
                    }
                }
            }
        });

        if (eligibleAgents.length === 0) {
            throw new Error("No available agents found for auto-assignment.");
        }

        const scoredAgents = eligibleAgents.map(agent => {
            const belongsToPickupZone = agent.agentProfile && agent.agentProfile.currentZoneId === order.pickupZoneId;
            const activeOrdersCount = agent.assignedOrders.length;
            const score = (belongsToPickupZone ? 1000 : 0) - activeOrdersCount;
            return { agent, score };
        });

        scoredAgents.sort((a, b) => b.score - a.score);
        resolvedAgentId = scoredAgents[0].agent.id;
    } else {
        resolvedAgentId = Number(agentId);
    }

    const agent = await prisma.user.findUnique({

        where: {
            id: resolvedAgentId
        },

        include: {
            agentProfile: true
        }

    });

    if (!agent || agent.role !== "AGENT") {
        throw new Error("Agent not found.");
    }

    if (!agent.agentProfile || !agent.agentProfile.availability) {
        throw new Error("Agent is unavailable.");
    }

    const updatedOrder = await prisma.order.update({

        where: {
            id: orderId
        },

        data: {

            assignedAgentId: resolvedAgentId,

            status: "ASSIGNED"

        }

    });

    await prisma.trackingHistory.create({

        data: {

            orderId,

            status: "ASSIGNED",

            updatedById: adminId,

            remarks: agentId === "auto"
                ? `Auto-assigned to ${agent.firstName} ${agent.lastName}`
                : `Assigned to ${agent.firstName} ${agent.lastName}`

        }

    });

    // Trigger email notification
    const agentRemarks = agentId === "auto"
        ? `Auto-assigned to ${agent.firstName} ${agent.lastName}`
        : `Assigned to ${agent.firstName} ${agent.lastName}`;
    sendOrderStatusEmail(orderId, "ASSIGNED", agentRemarks).catch(err => console.error("Email dispatch failed:", err));

    return updatedOrder;

};

export const updateOrderStatusService = async (
    orderId,
    status,
    remarks,
    userId
) => {

    const order = await prisma.order.findUnique({

        where: {
            id: orderId
        }

    });

    if (!order) {
        throw new Error("Order not found.");
    }

    const updatedOrder = await prisma.order.update({

        where: {
            id: orderId
        },

        data: {
            status
        }

    });

    await prisma.trackingHistory.create({

        data: {

            orderId,

            status,

            updatedById: userId,

            remarks

        }

    });

    // Trigger email notification
    sendOrderStatusEmail(orderId, status, remarks).catch(err => console.error("Email dispatch failed:", err));

    return updatedOrder;

};