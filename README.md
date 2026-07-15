# Last Mile Delivery Tracker

## 1. Project Overview

The Last Mile Delivery Tracker is an enterprise-grade logistics and fulfillment administration platform designed to optimize post-warehouse supply chain operations. The primary objective is to manage the final leg of shipments, matching packages with the most suitable delivery agent, tracking transit states in real time, and configuring dynamic routing, service coverage areas, and shipping rates.

The platform provides roles for Administrators (to supervise fleet logistics, manage pricing cards, define zonation polygons, and override shipments), Customers (to book shipments, estimate costs, and track packages in real time), and Delivery Agents (to update parcel statuses, handle delivery delays, and log failure reasons).

---

## 2. Features

### Admin Console
- Fleet Operations Dashboard: View total orders, transit states, agent metrics, and revenues in a unified operations hub.
- Zonation Configurator: Define city divisions by assigning predefined polygon boundaries and linking pin areas to active hubs.
- Pricing and Rate Engine: Manage B2B and B2C pricing cards, COD charges, and volumetric factor constants.
- Driver Dispatch Control: Add, edit, or disable agents, manually override routes, and reassign packages.
- Dynamic Bell Alerts: Monitor customer signups, booked orders, and delivered packages in real time.

### Customer Portal
- Self-Service Booking: Input package dimensions and coordinates to calculate exact shipping estimates.
- Linear Shipment Tracker: Monitor package status via a clean horizontal progress bar at every phase of the lifecycle, removing Leaflet maps to prevent clutter.
- Transaction Ledger: View historical spending, average shipping weight, preferred payment modes, and billing details.

### Delivery Agent App
- Order Management Panel: Inspect assigned orders, update order status to Out for Delivery, and verify delivery signatures.
- Standardized Failure Logging: Record delivery failures with mandatory reasons (Customer Not Available, Wrong Address, Customer Refused Delivery, Unable to Contact Customer, Vehicle Breakdown, Weather Issue, Address Not Found, Other) and custom remarks.
- Availability Toggle: Control working status (Online / Offline) through a clean, rigid toggle interface.

---

## 3. Tech Stack

| Component | Technology | Description |
|---|---|---|
| Frontend | React, Vite | Single Page Application framework with Hot Module Replacement |
| UI Styling | Vanilla CSS, Inter Font | Minimalist, high-contrast style using the Inter Google Font |
| Mapping Engine | Leaflet.js | OpenStreetMap-based interactive polygon zonation and pin marker mapper |
| Backend | Node.js, Express.js | REST API web server hosting secure service layers |
| Database ORM | Prisma ORM | Object-Relational Mapper mapping SQL transactions to database objects |
| Database | PostgreSQL | Relational database management system for persistent storage |
| Mail Transport | Nodemailer | SMTP client dispatching order confirmation and status transition notifications |
| APIs | Geoapify Geocoding API | Translates raw addresses into precise latitude and longitude coordinates |

---

## 4. Database Design

The database schema is mapped using Prisma ORM. Models include:

- User: Represents accounts for all roles (ADMIN, CUSTOMER, AGENT), storing name, credentials, and activation states.
- CustomerProfile: Stores details specific to clients, including company name and GST tax registration numbers.
- AgentProfile: Maps drivers to vehicles (BIKE, SCOOTER, CAR, VAN), license numbers, current zone assignments, and availability states.
- AdminProfile: Links user accounts to system administrator credentials.
- Zone: Represents a localized geographic logistics division linked to specific predefined polygons.
- Area: Represents a specific point area (pincode and lat/lng coordinates) linked to a parent zone hub.
- RateCard: Maps pricing configurations (base rate per Kg, COD surcharge) between specific pickup and drop zones for B2B and B2C shipments.
- Order: Houses core package details (dimensions, weights, charge estimates, payment modes, assigned agents, and delivery status).
- TrackingHistory: Immutably audits every status transition, updating operators, and custom remarks.
- Notification: Logs dispatched system notifications (emails and SMS) for users and agents.
- AgentLocation: Tracks real-time GPS coordinates of delivery agents.
- Reschedule: Logs orders that have been delayed, detailing old/new delivery dates, reasons, and reassigned agents.

---

## 5. Logistics Workflow

The system manages parcels through the following sequential stages:

1. Customer Books Shipment: The client enters pickup/drop addresses, package dimensions, weight, payment types, and order type (B2B/B2C).
2. Address Geocoding: The backend queries the Geoapify API to translate the addresses into exact latitude and longitude coordinates.
3. Zone Detection: A Point-in-Polygon (Ray Casting) algorithm checks the coordinates against defined zonation polygons to identify the pickup and destination hubs.
4. Rate Calculation: The pricing engine checks weight, dimensions, pickup/drop zones, and order type against active Rate Cards, including COD surcharges if applicable.
5. Order Creation: The order is recorded in the database with a unique order number, status set to PENDING, and base transaction logs initialized.
6. Agent Assignment: An automated dispatch engine assigns the package to the least busy available driver assigned to that pickup zone.
7. Delivery Tracking: The agent moves the order from ASSIGNED to PICKED_UP, IN_TRANSIT, and OUT_FOR_DELIVERY, updating the horizontal tracking bar for both the admin and the customer.
8. Delivered / Failed Delivery: The agent signs off the order as DELIVERED or logs a reason for FAILED status. Failed deliveries prompt admin action for rescheduling or agent reassignment.

---

## 6. Rate Calculation Engine

The system uses a strict calculation structure to estimate shipping costs:

- Actual Weight: The measured physical weight of the package in kilograms.
- Volumetric Weight: Estimated volume weight calculated using the standard volumetric factor:
  Volumetric Weight = (Length in cm * Width in cm * Height in cm) / 5000
- Billable Weight: The higher value of the Actual Weight versus the Volumetric Weight.
- Pickup/Drop Zone Detection: The system identifies parent zones for both origin and destination addresses.
- Rate Card Lookup: The engine searches the database for a RateCard matching the detected pickup zone, drop zone, and OrderType (B2B or B2C).
- Base Pricing: Calculates the shipping fee by multiplying the Billable Weight by the Base Rate per Kg specified in the RateCard.
- COD Charges: If PaymentType is COD, a flat surcharge defined in the matching RateCard is added.
- Final Amount: Sum of the base pricing and COD charge.

---

## 7. Zone Detection

The platform maps coordinates to delivery zones through the following layers:

- Geocoding Conversion: The Geoapify Autocomplete API provides place suggestions during booking. The Geoapify Geocoding API then converts the selected addresses into coordinates.
- Ray Casting Algorithm: The system checks if the coordinates are inside predefined polygon boundaries using a Point-in-Polygon algorithm.
- Rate Card Association: Once zones are detected, the system pulls the rate card matching the pickup-to-destination zone pair.
- Abstracted Zonation: Customers never see zones, areas, or polygons. They enter standard addresses, while the system handles zonation on the backend.

---

## 8. Auto Agent Assignment

When an order is created, the system assigns a delivery driver using these criteria:

- Status Check: Identifies agents in the database with availability set to True, isActive set to True, and role set to AGENT.
- Zone Matching: Filters agents whose currentZoneId matches the order's pickupZoneId.
- Workload Optimization: Calculates active workloads (orders with statuses other than DELIVERED or FAILED) for all matched agents, and assigns the order to the agent with the fewest active tasks.
- Manual Override: Admins can manually override this assignment at any time on the Orders panel by clicking "Assign Agent".

---

## 9. Failed Delivery Handling

If an agent cannot deliver a package:

- Failure Modal: The agent click "Mark as Failed" in the agent app, which opens a mandatory modal to select a reason (e.g. Customer Not Available, Wrong Address, Vehicle Breakdown) and enter custom remarks.
- Database Logging: The status is updated to FAILED, and the reason and remarks are logged to the immutable TrackingHistory table (e.g. "[Customer Not Available] Door was locked").
- Client Notifications: The system logs the failure and dispatches an email to the customer.
- Admin Intervention: The order is flagged in the Admin console, allowing the admin to schedule a retry or assign a new agent.

---

## 10. API Documentation

### Authentication Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| POST | /api/auth/login | Public | Authenticates credentials and returns a JWT token |
| POST | /api/auth/activate-agent | Public | Sets user password on first-time login |
| POST | /api/auth/change-password | Private | Updates user password |

### Orders Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| POST | /api/orders | Admin, Customer | Creates a new delivery order |
| POST | /api/orders/estimate | Admin, Customer | Calculates billable weight and estimated cost |
| GET | /api/orders | Admin, Customer | Retrieves all registered orders |
| GET | /api/orders/:id | Admin, Customer | Retrieves order details by database ID |
| PATCH | /api/orders/:id/assign-agent | Admin | Manually assigns an agent to an order |
| PATCH | /api/orders/:id/status | Admin | Overrides order status |

### Zones Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| POST | /api/zones | Admin | Creates a new delivery zone |
| GET | /api/zones | Admin | Retrieves all active zones |
| GET | /api/zones/:id | Admin | Retrieves zone details by ID |
| PUT | /api/zones/:id | Admin | Updates zone name or details |
| DELETE | /api/zones/:id | Admin | Deactivates a zone |

### Areas Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| POST | /api/areas | Admin | Pins a coverage area inside a zone |
| GET | /api/areas | Admin | Retrieves all pinned area coordinates |
| GET | /api/areas/:id | Admin | Retrieves area details by ID |
| PUT | /api/areas/:id | Admin | Updates area details |
| DELETE | /api/areas/:id | Admin | Deletes an area pin |

### Rate Cards Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| POST | /api/rates | Admin | Registers a rate card path |
| GET | /api/rates | Admin | Retrieves all rate cards |
| GET | /api/rates/:id | Admin | Retrieves rate card details by ID |
| PUT | /api/rates/:id | Admin | Updates rate card pricing |
| DELETE | /api/rates/:id | Admin | Deletes a rate card |

### Customers Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| POST | /api/customers | Admin | Registers a new customer |
| GET | /api/customers | Admin | Retrieves all customers |
| GET | /api/customers/:id | Admin | Retrieves customer profile by ID |
| PUT | /api/customers/:id | Admin | Updates customer information |
| DELETE | /api/customers/:id | Admin | Suspends a customer account |

### Agents Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| POST | /api/agents | Admin | Registers a new delivery agent |
| GET | /api/agents | Admin | Retrieves all delivery agents |
| GET | /api/agents/:id | Admin | Retrieves agent profile by ID |
| PUT | /api/agents/:id | Admin | Updates agent details |
| DELETE | /api/agents/:id | Admin | Disables an agent account |

### Agent Dashboard Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| GET | /api/agent-dashboard/profile | Agent | Retrieves driver profile details |
| PUT | /api/agent-dashboard/profile | Agent | Updates driver profile details |
| PATCH | /api/agent-dashboard/availability | Agent | Toggles Online/Offline status |
| GET | /api/agent-dashboard/orders | Agent | Retrieves assigned orders |
| GET | /api/agent-dashboard/orders/:id | Agent | Retrieves order details |
| PATCH | /api/agent-dashboard/orders/:id/status | Agent | Updates delivery status or logs failure reasons |
| GET | /api/agent-dashboard/notifications | Agent | Retrieves driver notifications |

### Notifications & Tracking Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| GET | /api/notifications | Admin | Retrieves system logs and alerts |
| GET | /api/tracking/:orderId | Admin, Customer | Retrieves order history logs by order ID |

---

## 11. Project Structure

```text
admin-02/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── agent.controller.js
│   │   │   ├── agentDashboard.controller.js
│   │   │   ├── area.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── customer.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── rate.controller.js
│   │   │   └── zone.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── routes/
│   │   │   ├── admin.routes.js
│   │   │   ├── agent.routes.js
│   │   │   ├── agentDashboard.routes.js
│   │   │   ├── area.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── customer.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── rate.routes.js
│   │   │   └── zone.routes.js
│   │   ├── services/
│   │   │   ├── agent.service.js
│   │   │   ├── area.service.js
│   │   │   ├── customer.service.js
│   │   │   ├── email.service.js
│   │   │   ├── order.service.js
│   │   │   ├── rate.service.js
│   │   │   └── zone.service.js
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── orderNumber.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src/
    │   ├── assets/
    │   │   └── hero.png
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   └── Sidebar.jsx
    │   ├── modules/
    │   │   ├── AgentDashboard.jsx
    │   │   ├── AgentsModule.jsx
    │   │   ├── AnalyticsModule.jsx
    │   │   ├── CODChargesModule.jsx
    │   │   ├── CustomerDashboard.jsx
    │   │   ├── CustomersModule.jsx
    │   │   ├── DashboardHome.jsx
    │   │   ├── FailedDeliveriesModule.jsx
    │   │   ├── NotificationsModule.jsx
    │   │   ├── OrdersModule.jsx
    │   │   ├── RatesModule.jsx
    │   │   ├── SettingsModule.jsx
    │   │   ├── TrackingHistoryModule.jsx
    │   │   └── ZonesModule.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 12. Installation

Follow these steps to set up and configure the application locally.

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   cd backend
2. Install the backend dependencies:
   npm install
3. Create a .env file based on .env.example and populate it with your local configurations (database URL, JWT keys, Geoapify API keys, and SMTP server details).

### Database Migration and Schema Generation
1. Deploy the database schema to your PostgreSQL database:
   npx prisma migrate dev --name init
2. Generate the Prisma Client schema:
   npx prisma generate
3. Seed the database with base mock configurations (Default Admin: admin@gmail.com / admin, Zones, and Rate Cards):
   npx prisma db seed

### Default Testing Credentials
You can log in to the application using the following predefined testing accounts:

- Administrator:
  Email: admin@gmail.com
  Password: admin

- Customer:
  Email: vaibhav.pujari231@vit.edu
  Password: 123456

- Delivery Agent:
  Email: narendra.modi@gmail.com (or narendra.modi@@gmail.com)
  Password: Ronaldo1$

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   cd frontend
2. Install the frontend dependencies:
   npm install

---

## 13. Environment Variables

Create a .env file in the backend folder using the following variables:

```text
DATABASE_URL="postgresql://username:password@localhost:5432/last_mile?schema=public"
JWT_SECRET="your_jwt_secret_key"
PORT=5000
GEOAPIFY_API_KEY="your_geoapify_api_key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
SMTP_FROM="LastMile Logistics <your_email@gmail.com>"
```

---

## 14. Running the Project

1. Run the Backend API server:
   cd backend
   npm run dev
2. Run the Frontend client:
   cd frontend
   npm run dev
3. Open your browser and navigate to the local address displayed by Vite (usually http://localhost:5173).

---

## 15. Future Improvements

- Live GPS Tracking: Render real-time GPS locations of delivery agents on maps using web sockets.
- ETA Prediction: Integrate machine learning algorithms to predict accurate package arrival times.
- Route Optimization: Use Dijkstra's or genetic algorithms to generate optimal multi-stop routes for agents.
- Analytics Dashboard: Introduce visual charts, heatmaps, and performance metrics for admins.
- Push Notifications: Support Web Push notifications for real-time order alerts.
- AI-powered Route Optimization: Dynamically recalculate routes based on live traffic reports.
