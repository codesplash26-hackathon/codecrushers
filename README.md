<p align="center">
  <img src="./logo.png" alt="BestRoute Logo" width="220" />
</p>

# BestRoute - Intelligent Multimodal Public Transportation Optimization System

[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-Ready-2496ED?logo=docker&logoColor=white)](#6-quick-start-build--start-with-docker-compose)
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**CodeSplash '26 – Competition Theme 05: Intelligent Public Transportation Optimization System**

---

## Team Information

* **Team Name:** CodeCrushers
* **University:** Sabaragamuwa University of Sri Lanka

### Team Members
* **W.G.M. Geewinda**
* **M.V.M.D.D.K. Samarawickrama**
* **A.T. Kalansooriya**
* **Y.V.A.T.S. Hettiarachchi**
* **W.M.A.U.B. Weerasinghe**

---

## Table of Contents

1. [Project Description](#1-project-description)
2. [Problem Being Solved](#2-problem-being-solved)
3. [Key Features](#3-key-features)
4. [Technology Stack & Justifications](#4-technology-stack--justifications)
5. [Prerequisites](#5-prerequisites)
6. [Quick Start: Build & Start with Docker Compose](#6-quick-start-build--start-with-docker-compose)
7. [How to Access the Application](#7-how-to-access-the-application)
8. [Environment Variables and Configurations](#8-environment-variables-and-configurations)
9. [Important Setup Instructions & Alternative Run Modes](#9-important-setup-instructions--alternative-run-modes)
10. [Repository File Structure](#10-repository-file-structure)
11. [Known Limitations and Assumptions](#11-known-limitations-and-assumptions)
12. [Security Considerations](#12-security-considerations)
13. [Change Log & Technical Approach Changes](#13-change-log--technical-approach-changes)
14. [Future Enhancements](#14-future-enhancements)
---

## 1. Project Description

**BestRoute** is an intelligent multimodal public transportation optimization platform designed to help passengers plan, compare, and manage journeys that involve multiple transportation modes.

The platform considers transportation modes such as **buses, trains, taxis, three-wheelers, and walking** and combines them into complete journey options. It evaluates routes using factors such as travel time, waiting time, cost, walking distance, number of transfers, reliability, and connection risk.

Passengers can select their preferred journey criteria, such as:

* Fastest journey
* Cheapest journey
* Minimum walking
* Minimum transfers
* Most reliable journey

The system generates and ranks suitable multimodal routes based on these preferences. It can also respond to transportation disruptions by identifying alternative routes for affected journeys.

The proposed solution consists of a **passenger mobile application, backend services, transportation data layer, route optimization engine, and administrative dashboard**.


---

## 2. Problem Being Solved

Public transportation journeys often require passengers to combine multiple transportation services. For example, a journey may require a bus to a railway station, a train to another location, and a taxi or three-wheeler to reach the final destination.

Currently, passengers may need to plan each part of such a journey separately. This creates several difficulties:

* Difficulty identifying suitable combinations of transportation modes
* Difficulty comparing complete journey duration and cost
* Uncertainty about transfer times
* Risk of missing connections
* Limited support when services are delayed or cancelled
* Lack of a unified view of the complete journey

**BestRoute addresses this problem by treating the journey as one connected multimodal route instead of planning each transportation segment independently.**


---

## 3. Key Features

* **Unified Multimodal Route Planner:** Generates multi-leg itineraries combining walking, buses, trains, and taxis/tuk-tuks.
* **Multi-Criteria Optimization:** Ranks candidate routes dynamically according to selected preference filters (Fastest, Cheapest, Min Walking, Min Transfers, Most Reliable).
* **Connection-Risk Engine:** Evaluates transfer buffers between arrival at a station and departure of the connecting service, flagging high-risk transitions before booking or traveling.
* **Real-Time Disruption Monitoring:** Ingests and broadcasts transit disruptions (delays, cancellations, diversions, route blocks) with severity ratings.
* **Dynamic Journey Re-Optimization:** Automatically computes and suggests alternate routes for active journeys impacted by newly reported disruptions.
* **Cumulative Fare Calculation:** Predicts total journey costs across all multimodal legs in a single summary.
* **Web Administrative Portal:** Full transit operations management including stops, routes, timetables, operator fleets, real-time disruption publishing, user permissions, and analytics.

---

## 4. Technology Stack & Justifications

| Component | Technology / Library | Justification |
| :--- | :--- | :--- |
| **Mobile / Passenger App** | **React Native + Expo + TypeScript** | Enables unified cross-platform mobile development (iOS/Android) and browser-accessible web bundling with Expo Web. TypeScript provides static type safety for complex transit and itinerary objects. |
| **Admin Dashboard** | **React 18 + Vite** | Lightweight, high-performance administrative web application with instant Hot Module Replacement (HMR), component-driven state architecture, and fast load times. |
| **Admin UI Styling** | **Vanilla CSS & Theme Variables** | Granular control over UI aesthetics, glassmorphism, responsive drawer navigation, custom modal systems, and dark/light color schemes without bulky utility frameworks. |
| **Backend API** | **Node.js + Express.js** | Asynchronous, non-blocking I/O ideal for handling concurrent route queries, live incident updates, and RESTful service orchestration. |
| **Database** | **MongoDB + Mongoose ODM** | Document-oriented NoSQL model perfectly suited for hierarchical transit itineraries, geo-coordinate pairs (`[longitude, latitude]`), flexible stop sequences, and evolving disruption logs. |
| **Authentication** | **JWT (JSON Web Tokens) + Bcrypt** | Stateless, secure authentication for both mobile and web clients. Passwords hashed using standard cryptographic salt rounds. |
| **Containerization** | **Docker & Docker Compose** | Guarantees consistent environment replication across Windows, macOS, and Linux with zero host dependency conflicts. |
| **Web Server** | **Nginx (Alpine)** | Serves compiled static production bundles for both Admin Dashboard and Mobile Web applications with minimal memory footprint and instant startup. |
| **API Testing** | **Postman** | Comprehensive testing of REST endpoints, status codes, payload validations, and authentication middleware. |
| **UI/UX Design** | **Figma** | High-fidelity prototyping, design tokens, and user journey wireframing. |

---

## 5. Prerequisites

Before running the project, ensure your workstation meets the following prerequisites:

### Required for Docker Setup (Recommended)
1. **Git:** Installed and accessible in your command line (`git --version`).
2. **Docker Desktop:** Version 20.10+ with **Docker Compose v2+** enabled (`docker compose version`).
   * *Windows / macOS:* Ensure Docker Desktop is running and WSL2/hypervisor backend is active.
   * *Linux:* Ensure Docker engine and Docker Compose plugin are installed and the Docker daemon is active.
3. **System Resources:** Minimum 4 GB RAM and ~3 GB free storage space for container images.

> **Note:** When using Docker Compose, **Node.js, npm, and MongoDB do NOT need to be installed on your host machine**. All runtimes, libraries, and databases are provisioned automatically inside isolated Docker containers.

### Optional (Only for Local Development without Docker)
* **Node.js:** v18.x or v20.x LTS (`node -v`)
* **npm:** v9.x or v10.x (`npm -v`)
* **MongoDB:** Local instance running on port 27017 or a MongoDB Atlas connection string.
* **Expo Go App:** (Optional) Installed on an Android/iOS device if testing mobile functionality on a physical phone.

---

## 6. Quick Start: Build & Start with Docker Compose

Evaluators can clone the repository and launch the complete multi-service system with a single command.

### Step 1: Clone the Repository
Open your terminal or command prompt and clone the repository:
```bash
git clone https://github.com/kalansooriya12/codecrushers.git
cd codecrushers
```

### Step 2: Build and Start All Services
Run the following standard Docker Compose command from the root directory:

```bash
docker compose up --build
```


### What Happens Automatically
When this command runs, Docker Compose orchestrates the following:
1. **MongoDB Service (`mongodb`):** Starts MongoDB 7.0 and mounts a persistent volume `mongo_data`.
2. **Backend API Service (`backend`):** Builds the Node.js application, connects to MongoDB, and **automatically seeds the database** with essential routes, stops, schedules, transport operators, disruptions, and default user accounts upon first launch.
3. **Admin Dashboard Service (`admin-dashboard`):** Compiles the Vite React application and serves it via an Nginx web server on port `80` (mapped to host port `5173`).
4. **Passenger Application Service (`mobile-app`):** Generates the Expo web bundle and serves it via an Nginx web server on port `80` (mapped to host port `8081`).

---

## 7. How to Access the Application

Once Docker Compose finishes building and starts the containers, access the platform components through your web browser:

| Application / Service | URL | Default Port | Description |
| :--- | :--- | :--- | :--- |
| **Admin Dashboard** | **`http://localhost:5173`** | `5173` | Web portal for transit operators, route managers, and disruption broadcasting |
| **Passenger Application (Web/Mobile)** | **`http://localhost:8081`** | `8081` | Passenger interface for searching multimodal routes, tracking journeys, and receiving alerts |
| **Backend REST API** | **`http://localhost:5000`** | `5000` | Node.js Express API root endpoint |
| **API Health Check** | **`http://localhost:5000/api/health`** | `5000` | Real-time JSON health check endpoint |
| **MongoDB Database** | **`localhost:27017`** | `27017` | Direct MongoDB connection for inspection tools (e.g., MongoDB Compass) |

---

### Evaluator Demo Credentials

The database is pre-seeded with test accounts ready for immediate evaluation:

#### 1. Administrator Account (Admin Dashboard)
* **Access URL:** `http://localhost:5173`
* **Username:** `admin` 
* **Password:** `admin`
* **Role:** Platform Administrator
* **Features to Test:**
  * View Transit Network Overview & KPIs.
  * Manage Transport Services, Routes, Stops, and Schedules.
  * Broadcast new Disruption alerts (e.g., service delays, road closures) and resolve them.
  * View Passenger activity and Driver applications.

#### 2. Passenger Account (Mobile / Web Client)
* **Access URL:** `http://localhost:8081`
* **Email:** `passenger@bestroute.lk`
* **Password:** `password123`
* **Role:** Passenger
* **Features to Test:**
  * Search multimodal routes between origins and destinations.
  * Filter by optimization criteria (Fastest, Cheapest, Min Walking, Min Transfers, Most Reliable).
  * Inspect step-by-step multimodal journey itineraries with connection risk indicators.
  * Receive real-time alerts when active disruptions impact planned routes.
  * Self-registration of new passenger accounts directly through the Sign Up screen.

---

## 8. Environment Variables and Configurations

### Zero-Configuration Docker Setup
When running via `docker compose up --build`, **no manual `.env` file configuration is needed**. The `docker-compose.yml` file automatically injects all required environment variables into the containers:

```yaml
# Injected automatically in docker-compose.yml
PORT=5000
MONGO_URI=mongodb://mongodb:27017/bestroute
JWT_SECRET=BestRoute_Secure_JWT_2026_x7K9mP2q
```

### Environment Variable Reference

| Variable | Injected Value (Docker) | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port on which the backend Express server listens. |
| `MONGO_URI` | `mongodb://mongodb:27017/bestroute` | Connection URI pointing to the internal Docker service container named `mongodb`. |
| `JWT_SECRET` | `BestRoute_Secure_JWT_2026_x7K9mP2q` | Secret key used by Bcrypt and jsonwebtoken to sign and verify authentication tokens. |

### Configuration for Manual / Local Non-Docker Runs
If you choose to run the backend directly on your host machine without Docker:
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `MONGO_URI` in `backend/.env` to point to your local MongoDB (`mongodb://localhost:27017/bestroute`) or cloud MongoDB Atlas URI.

### Client API URL Auto-Detection
* **Admin Dashboard:** Defaults to communicating with `http://localhost:5000/api`.
* **Mobile / Web App:** Features an intelligent auto-detection resolver (`mobile-app/src/services/api.ts`):
  * In web browser mode (`http://localhost:8081`), it uses `http://localhost:5000/api`.
  * In Expo Go mobile mode, it auto-detects the host computer's local IP address over the Wi-Fi network.

---

## 9. Important Setup Instructions & Alternative Run Modes

### 9.1 Verifying Container Health
Check the status of running containers at any time:
```bash
docker compose ps
```
All four services should display status `Up` or `running`:
* `bestroute-mongo`
* `bestroute-backend`
* `bestroute-admin`
* `bestroute-mobile`

To verify API responsiveness:
```bash
curl http://localhost:5000/api/health
# Expected Response: {"success":true,"message":"BestRoute API is healthy"}
```

### 9.2 Viewing Logs
To stream live logs from all services:
```bash
docker compose logs -f
```
Or view logs for a specific service:
```bash
docker compose logs -f backend
docker compose logs -f admin-dashboard
docker compose logs -f mobile-app
```

### 9.3 Stopping and Resetting the Containers
* **To stop all services:**
  ```bash
  docker compose down
  ```
* **To stop all services and wipe the database volume (clean reset):**
  ```bash
  docker compose down -v
  ```
  *(Upon the next `docker compose up --build`, the database will automatically re-seed from scratch.)*

---

### 9.4 Running the Mobile Application on a Physical Device via Expo Go (Optional)
If you wish to test the passenger experience on a physical smartphone rather than the containerized web view:

1. Install **Expo Go** from the Google Play Store (Android) or Apple App Store (iOS).
2. Connect your mobile phone and your development computer to the **same Wi-Fi network**.
3. Open a separate terminal and navigate to `mobile-app`:
   ```bash
   cd mobile-app
   npm install
   npx expo start
   ```
4. A QR code will display in your terminal.
5. Open Expo Go on your mobile phone and scan the QR code.
6. The app will bundle and open natively on your smartphone.

> **Network Note:** When testing on a physical phone, ensure your computer's firewall allows inbound connections on port `5000` (Backend) and port `8081` (Metro).

---

### 9.5 Running Services Locally Without Docker (Bare-Metal)
If you wish to run services individually outside Docker:

#### 1. Start MongoDB
Ensure MongoDB is running locally on port `27017` or use MongoDB Atlas.

#### 2. Start the Backend API
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

#### 3. Start the Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
# Runs on http://localhost:5173
```

#### 4. Start the Mobile Client
```bash
cd mobile-app
npm install
npm run web
# Runs on http://localhost:8081
```

---

## 10. Repository File Structure

```text
codecrushers/
├── docker-compose.yml                      # Multi-container orchestration definition
├── logo.png                                # Platform branding logo
├── README.md                               # Comprehensive documentation & evaluation guide
│
├── admin-dashboard/                        # Administrative Web Application (React + Vite)
│   ├── Dockerfile                          # Multi-stage Docker build (Node.js build -> Nginx alpine)
│   ├── nginx.conf                          # Nginx configuration for single-page application routing
│   ├── package.json                        # Frontend dependencies & build scripts
│   ├── vite.config.js                      # Vite server & bundler configuration
│   └── src/
│       ├── components/                     # Reusable UI widgets (Navbar, Sidebar, Modal, Login)
│       ├── context/                        # Global state management (AuthContext, ToastContext)
│       ├── pages/                          # Management views (Dashboard, Routes, Stops, Disruptions, Analytics)
│       ├── services/                       # REST client & API interceptors
│       └── App.jsx                         # Main router & layout structure
│
├── backend/                                # Core REST API Service (Node.js & Express)
│   ├── Dockerfile                          # Backend container with native build toolchain (python/make/g++)
│   ├── package.json                        # Backend dependencies & startup scripts
│   ├── .env.example                        # Reference environment file for local execution
│   └── src/
│       ├── config/                         # Database connections, constants & risk thresholds
│       ├── controllers/                    # Route handlers (auth, routes, journeys, disruptions, risk)
│       ├── middleware/                     # JWT authentication, role verification, error handlers
│       ├── models/                         # Mongoose schemas (User, Route, Stop, Schedule, Disruption)
│       ├── routes/                         # Express API route endpoints (/api/*)
│       ├── services/                       # Multi-criteria scoring, rerouting, & connection risk algorithms
│       ├── seed.js                         # Automated database seeder with realistic transit data
│       └── server.js                       # Express application bootstrap & listener
│
├── mobile-app/                             # Passenger Mobile Client (React Native + Expo)
│   ├── Dockerfile                          # Production container (Expo web export -> Nginx alpine)
│   ├── nginx.conf                          # Web server routing configuration for mobile web
│   ├── app.json                            # Expo application configuration & manifest
│   ├── package.json                        # React Native dependencies & scripts
│   ├── tsconfig.json                       # TypeScript compiler configuration
│   └── src/
│       ├── components/                     # Custom mobile components (BottomNav, RouteMap, ThemeToggle)
│       ├── constants/                      # Visual tokens & color palette
│       ├── context/                        # Theme and application context
│       ├── navigations/                    # React Navigation stack & tab definitions
│       ├── screens/                        # Passenger screens (Home, RouteResults, Compare, LiveTracking)
│       └── services/                       # Mobile API client with automatic host detection
│
├── data/                                   # Seed JSON datasets
│   ├── fares.json                          # Transit fare stage rules
│   ├── routes.json                         # Public bus and railway route seeds
│   ├── sample_disruptions.json             # Disruption scenarios for testing
│   ├── schedules.json                      # Departure timetables
│   └── stops.json                          # Bus stop and railway station geographic coordinates
│
├── docs/                                   # Technical architecture & API documentation
│   ├── API_SPECIFICATION.md                # REST API endpoints, request/response contracts
│   ├── ARCHITECTURE.md                     # System architecture & component interaction diagrams
│   └── api/                                # Deep-dive documentation for core algorithmic endpoints
│
└── Documentation/                          # Project management, design & test artifacts
    ├── System-Design/                      # System diagrams & technical artifacts
    ├── Team-Charter/                       # Team roles, responsibilities, & project roadmap
    └── testing-reports/                    # Test outcomes & verification records
```

---

## 11. Known Limitations and Assumptions

The current prototype has the following limitations and assumptions:

* The initial implementation focuses on a **limited geographical area** and selected transportation services.
* Transportation data may be based on **controlled or publicly available datasets** rather than complete real-time data.
* Real-time transportation information may not be available for all transportation providers.
* Some disruption scenarios may use **simulated data** for demonstration and testing.
* Route recommendations depend on the availability and accuracy of transportation data.
* The number of possible multimodal routes is controlled using route, distance, time, availability, and transfer constraints.
* Machine-learning-based prediction is not the primary optimization approach because sufficient historical transportation data may not be available.
* Estimated travel times, fares, or service information may differ from actual conditions.
* External mapping, transportation, and notification services may have availability or usage limitations.

---

## 12. Security Considerations

* **Token-Based Authentication:** Stateless JWTs with secure expiration limits secure all protected endpoints across both web and mobile clients.
* **Password Encryption:** Passenger and administrator passwords are encrypted using Bcrypt with strong cryptographic salt rounds.
* **Role-Based Access Control (RBAC):** Distinct roles (`passenger`, `admin`, `operator`) enforced via Express middleware (`roleMiddleware.js`), preventing unauthorized modifications to transit schedules, routes, and disruption alerts.
* **Input Sanitization & Error Handling:** Global centralized error middleware sanitizes database queries, preventing SQL/NoSQL injection and shielding internal stack traces from client responses.

---

## 13. Change Log & Technical Approach Changes

### Version History
* **v1.0.0 – Baseline Implementation (September 2026):**
  * Core backend REST API with Express and MongoDB.
  * User authentication with JWT and Bcrypt.
  * Multi-criteria journey scoring engine (duration, cost, walking, transfers, reliability).
  * Connection risk detection heuristic.
  * React administrative dashboard and React Native passenger mobile app.
* **v1.1.0 – Containerization & Zero-Config Deployment (September 2026):**
  * Implemented multi-stage Docker build pipelines for Backend, Admin Dashboard, and Mobile Web application.
  * Configured Nginx reverse serving for compiled static web bundles.
  * Orchestrated multi-container ecosystem via Docker Compose (`docker compose up --build`).
  * Integrated automatic database bootstrapping and seeding on startup.
  * Added dynamic host IP auto-resolution for mobile and web environments.

---

### Technology & Technical Approach Changes

1. **Adoption of TypeScript for Frontend Mobile Implementation:**
   * *Rationale:* The original project proposal specified React Native for the passenger mobile app. During development, TypeScript was adopted alongside React Native to enforce strict compile-time types for multi-leg journey itineraries, GPS coordinate pairs, and API response contracts.
   * *Impact:* Significantly reduced runtime null/undefined errors during complex itinerary rendering without modifying the core React Native framework or backend APIs.

2. **Zero-Configuration Automated Database Seeding:**
   * *Rationale:* To eliminate manual setup steps for evaluators, an automatic seed check was introduced into `backend/src/server.js`. If MongoDB contains no user records, the server automatically populates realistic transit corridors, schedules, operator fleets, disruptions, and test accounts.
   * *Impact:* Evaluators can run a single command (`docker compose up --build`) and immediately log in and test all platform features without running database scripts or importing JSON collections manually.

---
## 14. Future Enhancements

Potential future improvements include:

* Predictive transportation analytics
* Smart ticketing
* Integrated digital payments
* Accessibility-aware routing
* Carbon-aware journey planning
* Provider analytics
* Expansion to additional cities and transportation providers


---

## Acknowledgments
Developed by **CodeCrushers** for **CodeSplash '26**. Sabaragamuwa University of Sri Lanka.
