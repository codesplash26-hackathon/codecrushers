# BestRoute - Intelligent Multimodal Public Transportation Platform

> **Competition Theme 05** | **Team:** CodeCrushers (Sabaragamuwa University of Sri Lanka)  
> **Authors:** W.G.M. Geewinda, M.V.M.D.D.K. Samarawickrama, A.T. Kalansooriya, Y.V.A.T.S. Hettiarachchi, W.M.A.U.B. Weerasinghe

---

## 📌 Project Overview
**BestRoute** is a comprehensive multimodal public transportation planning and dynamic optimization platform designed to provide passengers with a unified solution for planning, comparing, monitoring, and dynamically re-routing complete journeys across multiple modes of transit (Buses, Trains, Taxis, Three-Wheelers, and Walking).

---

## 📁 Repository File Structure

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
├── mobile/                        # React Native Passenger Mobile Application (Expo)
│   ├── src/
│   │   ├── components/            # Reusable UI Components
│   │   │   ├── DisruptionAlertModal.jsx # Real-time disruption alert modal
│   │   │   ├── JourneyMap.jsx           # Interactive route map component
│   │   │   ├── PreferenceSelector.jsx   # Passenger preference filter selector
│   │   │   ├── RouteCard.jsx            # Journey option comparison card
│   │   │   ├── SearchBar.jsx            # Location search bar
│   │   │   ├── TransferRiskBadge.jsx    # Risk indicator badge
│   │   │   └── TransportBadge.jsx       # Mode icon badge (Bus/Train/Taxi/Walk)
│   │   ├── constants/             # Application Theme & System Constants
│   │   │   ├── config.js
│   │   │   └── theme.js
│   │   ├── context/               # React Context Providers
│   │   │   ├── AuthContext.js
│   │   │   ├── JourneyContext.js
│   │   │   └── LocationContext.js
│   │   ├── navigation/            # React Navigation Setup
│   │   │   ├── AppNavigator.jsx         # Main Stack Navigator
│   │   │   ├── AuthNavigator.jsx        # Login / Register Stack Navigator
│   │   │   └── TabNavigator.jsx         # Bottom Tab Navigation
│   │   ├── screens/               # Mobile Screens & Pages
│   │   │   ├── DisruptionAlertScreen.jsx # Re-routing recommendation screen
│   │   │   ├── HomeScreen.jsx           # Main passenger landing screen
│   │   │   ├── JourneyDetailsScreen.jsx  # Detailed itinerary & leg breakdown
│   │   │   ├── JourneySearchScreen.jsx   # Origin/Destination search screen
│   │   │   ├── LiveTrackingScreen.jsx    # Live active journey tracking screen
│   │   │   ├── LoginScreen.jsx          # Authentication screen
│   │   │   ├── PreferencesScreen.jsx    # Passenger preference settings screen
│   │   │   ├── RegisterScreen.jsx       # Account registration screen
│   │   │   ├── RouteComparisonScreen.jsx # Ranked route alternatives screen
│   │   │   └── SavedJourneysScreen.jsx  # Favorite routes screen
│   │   ├── services/              # API & Location Services
│   │   │   ├── api.js                   # Axios API instance
│   │   │   ├── authService.js           # Authentication API service
│   │   │   ├── journeyService.js        # Journey planning API service
│   │   │   ├── locationService.js       # Device GPS service
│   │   │   └── notificationService.js   # Expo Push Notification service
│   │   └── utils/                 # Mobile Helper Utilities
│   │       └── formatters.js            # Time & Currency formatters
│   ├── App.js                     # Mobile App Main Root Component
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

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Passenger Mobile Application** | React Native (Expo), React Navigation |
| **Administrative Web Dashboard** | React, Vite, React Router, Leaflet Maps |
| **Backend Runtime & Framework** | Node.js, Express.js |
| **Database & Geospatial Storage** | MongoDB, Mongoose (GeoJSON 2dsphere indexing) |
| **Authentication & Security** | JSON Web Tokens (JWT), Bcrypt |
| **Optimization Engine** | Multi-Criteria Route Optimization Scoring Algorithm |

---

