# BestRoute - Intelligent Multimodal Public Transportation Platform

**CodeSplash '26 – Competition Theme 05: Intelligent Public Transportation Optimization System**

**Team:** CodeCrushers

**University:** Sabaragamuwa University of Sri Lanka

## Team Members

* W.G.M. Geewinda
* M.V.M.D.D.K. Samarawickrama
* A.T. Kalansooriya
* Y.V.A.T.S. Hettiarachchi
* W.M.A.U.B. Weerasinghe

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

### 3.1 Unified Multimodal Journey Planner

The platform combines multiple transportation modes into a single journey-planning process.

Supported transportation modes include:

* Buses
* Trains
* Taxis
* Three-wheelers
* Walking

The system is designed to allow additional transportation modes to be integrated in the future.

### 3.2 Personalized Journey Optimization

Passengers can select their preferred journey criteria:

* Fastest
* Cheapest
* Minimum walking
* Minimum transfers
* Most reliable

The route-ranking process adjusts according to the selected preference.

### 3.3 Complete Journey Comparison

The system presents multiple route options and allows passengers to compare:

* Total travel time
* Estimated cost
* Waiting time
* Number of transfers
* Walking distance
* Reliability
* Connection risk

### 3.4 Connection-Risk Detection

The system evaluates whether sufficient time is available between connecting services.

For example, if a train arrives at 10:15 AM and the connecting bus departs at 10:20 AM, the available transfer time is 5 minutes. If the estimated transfer requirement exceeds the available time, the connection is identified as high risk.

### 3.5 Disruption Monitoring

The system identifies transportation disruptions such as:

* Service delays
* Cancellations
* Road closures
* Traffic-related interruptions
* Route interruptions

### 3.6 Dynamic Journey Re-optimization

When a disruption affects an active journey, the system recalculates the remaining journey and recommends an alternative route.

For example:

**Original:** Bus → Train → Taxi
**Alternative:** Bus → Train → Bus → Taxi

The updated recommendation is provided to the passenger through the application.

### 3.7 Unified Journey Cost

The system calculates the estimated total cost of the complete journey instead of requiring passengers to calculate the cost of each transportation mode separately.

### 3.8 Passenger Notifications

The application provides notifications about:

* Upcoming transfers
* Delays
* Connection risks
* Journey changes
* Alternative routes

### 3.9 Administrative Dashboard

The administrative dashboard supports:

* Transportation service management
* Route and schedule management
* Disruption management
* Transportation data monitoring
* Basic usage analytics

---


## 4. Technology Stack

| Component                      | Technology                         | Purpose / Justification                                                    |
| ------------------------------ | ---------------------------------- | -------------------------------------------------------------------------- |
| Mobile Application             | React Native + Expo                | Cross-platform mobile development                                          |
| Administrative Web Application | React + Vite                       | Interactive web-based dashboard                                            |
| Backend                        | Node.js + Express.js               | REST API and application services                                          |
| Database                       | MongoDB + Mongoose                 | Flexible storage for users, transportation data, journeys, and disruptions |
| Authentication                 | JWT + Bcrypt                       | Token-based authentication and secure password hashing                     |
| Maps / Geolocation             | Mapping API / Geolocation Services | Location-based journey planning and route visualization                    |
| Optimization                   | Multi-criteria Route Optimization  | Route generation, evaluation, and personalized ranking                     |
| API Testing                    | Postman                            | Backend API development and testing                                        |
| UI/UX Design                   | Figma                              | Interface design and prototyping                                           |
| Version Control                | Git + GitHub                       | Collaborative development and version management                           |

The technology choices follow the stack specified in the original proposal, including React Native, React, Node.js, Express.js, MongoDB, mapping services, JWT, Git/GitHub, Figma, and Postman.

---

## 5. Repository File Structure

```text
BestRoute/
├── backend/                       # Node.js + Express.js API & Route Optimization Engine
│   ├── src/
│   │   ├── config/                # Database & Environment configuration
│   │   │   ├── constants.js       # App constants (Modes, Preferences, Disruption types)
│   │   │   └── db.js              # MongoDB database connection setup
│   │   ├── controllers/           # HTTP Request Controllers
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── disruptionController.js
│   │   │   ├── journeyController.js
│   │   │   ├── notificationController.js
│   │   │   ├── routeController.js
│   │   │   └── userController.js
│   │   ├── engine/                # Core Optimization & Intelligence Layer
│   │   │   ├── connectionRiskEvaluator.js  # Transfer buffer time risk evaluator
│   │   │   ├── disruptionMonitor.js        # Active journey disruption detector
│   │   │   ├── dynamicRerouter.js          # Real-time journey re-optimizer
│   │   │   ├── multimodalGenerator.js      # Multimodal route combination generator
│   │   │   └── routeScorer.js              # Multi-criteria route scoring engine
│   │   ├── middlewares/           # Express Middlewares
│   │   │   ├── authMiddleware.js       # JWT authentication validator
│   │   │   ├── errorHandler.js         # Global error handler
│   │   │   ├── roleMiddleware.js         # Role-based access control (RBAC)
│   │   │   └── validationMiddleware.js   # Request schema validator
│   │   ├── models/                # MongoDB (Mongoose) Data Models
│   │   │   ├── Analytics.js            # Usage metrics & event logs
│   │   │   ├── Disruption.js           # Delays, cancellations, road closures
│   │   │   ├── Journey.js              # Planned & active journey records
│   │   │   ├── Notification.js         # Push notification alerts
│   │   │   ├── Preference.js           # Passenger optimization weights
│   │   │   ├── Route.js                # Transit routes & fare matrices
│   │   │   ├── Schedule.js             # Timetables & stop departure times
│   │   │   ├── Stop.js                 # Stations & bus stop locations
│   │   │   └── User.js                 # User profile & authentication
│   │   ├── routes/                # Express API Route Handlers
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── disruptionRoutes.js
│   │   │   ├── journeyRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── routeRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── seeds/                 # Transit data seeding script
│   │   │   └── seedData.js
│   │   ├── services/              # External Integrations & Gateway Services
│   │   │   ├── mappingService.js       # Leaflet / Mapbox distance matrix service
│   │   │   └── notificationService.js  # Push notification service gateway
│   │   └── utils/                 # Utility Helper Functions
│   │       ├── haversine.js            # Geospatial distance calculator
│   │       └── logger.js               # Structured logger
│   ├── .env.example               # Backend environment variables template
│   ├── package.json               # Backend dependencies & npm scripts
│   └── server.js                  # Main Express Server Entrypoint
│
├── mobile-app/                    # React Native Passenger Mobile Application (Expo)
│   ├── src/
│   │   ├── components/            # Reusable UI Components
│   │   ├── constants/             # Application Theme & System Constants
│   │   │   └── theme.ts
│   │   ├── navigations/           # React Navigation Setup
│   │   │   └── AppNavigator.tsx   # Main Stack Navigator
│   │   ├── screens/               # Mobile Screens & Pages
│   │   │   ├── SplashScreen.tsx   # Animated Splash screen
│   │   │   ├── OnboardingScreen.tsx # 3-step Multimodal Onboarding flow
│   │   │   ├── loginscreen.tsx    # Authentication screen
│   │   │   └── HomeScreen.tsx     # Main passenger landing screen
│   │   └── services/              # API & Location Services
│   │       └── api.js             # Axios API instance
│   ├── App.tsx                    # Mobile App Main Root Component
│   ├── app.json                   # Expo Application Configuration
│   └── package.json               # Mobile dependencies & Expo scripts
│
├── admin-dashboard/               # Administrative Web Dashboard (React + Vite)
│   ├── src/
│   │   ├── components/            # Admin UI Components
│   │   │   ├── AnalyticsChart.jsx       # Visual transit analytics chart
│   │   │   ├── DisruptionForm.jsx       # Disruption broadcast form
│   │   │   ├── MetricsCard.jsx          # KPI Metric summary card
│   │   │   ├── Navbar.jsx               # Header navigation bar
│   │   │   ├── RouteTable.jsx           # Route overview table
│   │   │   ├── ScheduleEditor.jsx       # Timetable editor component
│   │   │   ├── Sidebar.jsx              # Side navigation bar
│   │   │   └── TransitMap.jsx           # Live transit monitoring map
│   │   ├── context/               # React Context Providers
│   │   │   ├── AdminContext.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── pages/                 # Admin Dashboard Pages
│   │   │   ├── AnalyticsPage.jsx        # Transportation usage analytics
│   │   │   ├── DashboardHome.jsx        # Admin overview dashboard
│   │   │   ├── DisruptionManagement.jsx # Incident & disruption control
│   │   │   ├── RouteScheduleManagement.jsx # Timetable & route editor
│   │   │   ├── ServicesManagement.jsx   # Operator & transport mode manager
│   │   │   ├── SettingsPage.jsx         # System configuration page
│   │   │   ├── TransitDataMonitoring.jsx # Real-time transit map monitor
│   │   │   └── UsersPage.jsx            # User management page
│   │   ├── services/              # Admin API Services
│   │   │   ├── adminService.js
│   │   │   ├── api.js
│   │   │   ├── disruptionService.js
│   │   │   └── routeService.js
│   │   ├── utils/                 # Constants & Helper Functions
│   │   │   └── constants.js
│   │   ├── App.jsx                # Web App Main Component & Router
│   │   └── main.jsx               # Vite Entrypoint
│   ├── index.html                 # HTML Template
│   ├── package.json               # Web Dashboard dependencies & scripts
│   └── vite.config.js             # Vite configuration
│
├── data/                          # Datasets & Seed Files
│   ├── fares.json                 # Transport fare matrices
│   ├── routes.json                # Bus & Train route definitions
│   ├── sample_disruptions.json    # Test disruption data
│   ├── schedules.json             # Timetables & stop departure times
│   └── stops.json                 # Station & bus stop coordinates
│
├── docs/                          # Architecture & API Specifications
│   ├── API_SPECIFICATION.md       # Complete REST API Endpoint Documentation
│   └── ARCHITECTURE.md            # System Architecture & Optimization Formulas
│
├── .env.example                   # Master Environment Template
├── .gitignore                     # Git exclusion rules
└── README.md                      # Project Documentation (This File)
```

---

## 6. Setup and Run Instructions

### 6.1 Prerequisites

Install the following before running the project:

* **Node.js** (LTS version recommended)
* **npm**
* **MongoDB Atlas account or MongoDB instance**
* **Git**
* **Expo Go** mobile application for testing the React Native application
* A code editor such as **Visual Studio Code**

---

### 6.2 Clone the Repository

```bash
git clone <repository-url>
cd BestRoute
```

---

### 6.3 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

The backend API will run on the configured local port.

---

### 6.4 Mobile Application Setup

Open a new terminal and navigate to:

```bash
cd mobile-app
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

The application can then be tested using **Expo Go** on a compatible mobile device.

---

### 6.5 Administrative Dashboard Setup

Open another terminal and navigate to:

```bash
cd admin-dashboard
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the local URL for the administrative dashboard.

---

## 7. Environment Variables

Environment-specific configuration should not be committed to the repository.

The backend requires configuration such as:

```env
PORT=
MONGO_URI=
JWT_SECRET=
```


---

## 8. Known Limitations and Assumptions

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

These limitations are consistent with the challenges and mitigation strategies identified in the original project proposal.

---
## 9. Security Considerations

The system incorporates security measures including:

* JWT-based authentication
* Password hashing
* Role-based access control
* Protected API endpoints
* Input validation
* Secure handling of user information
* Controlled administrative access
* Secure handling of location information

Location information is intended to be collected and processed only when required for journey planning or related functionality.

---

## 10. Change Log

### Version 1.0.0 – September 2026

* Implemented the core backend structure.
* Implemented user authentication.
* Added transportation data models and APIs.
* Implemented journey search functionality.
* Implemented candidate route generation.
* Implemented route evaluation and optimization components.
* Added mobile application structure.
* Added administrative dashboard structure.
* Added project documentation and testing documentation.

### Technology & Technical Approach Changes

The original proposal specified the primary technologies and technical approach that would be used during development. The project is being implemented using the declared core technologies, including React Native, React, Node.js, Express.js, MongoDB, JWT, and multi-criteria route optimization.


---

## 11. Future Enhancements

Potential future improvements include:

* Predictive transportation analytics
* Smart ticketing
* Integrated digital payments
* Accessibility-aware routing
* Carbon-aware journey planning
* Provider analytics
* Expansion to additional cities and transportation providers

These enhancements are identified as possible future extensions in the original proposal.

---



