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
| Mobile Application             | React Native + Expo+ Typescript    | Cross-platform mobile development                                          |
| Administrative Web Application | React + Vite                       | Interactive web-based dashboard                                            |
| Backend                        | Node.js + Express.js               | REST API and application services                                          |
| Database                       | MongoDB + Mongoose                 | Flexible storage for users, transportation data, journeys, and disruptions |
| Authentication                 | JWT + Bcrypt                       | Token-based authentication and secure password hashing                     |
| Maps / Geolocation             | Mapping API / Geolocation Services | Location-based journey planning and route visualization                    |
| Optimization                   | Multi-criteria Route Optimization  | Route generation, evaluation, and personalized ranking                     |
| API Testing                    | Postman                            | Backend API development and testing                                        |
| UI/UX Design                   | Figma                              | Interface design and prototyping                                           |
| Version Control                | Git + GitHub                       | Collaborative development and version management                           |

The implementation follows the core technology stack specified in the original proposal, including React Native, React, Node.js, Express.js, MongoDB, mapping services, JWT, Git/GitHub, Figma, and Postman. During development, TypeScript was introduced for frontend implementation, particularly within the React Native mobile application, to provide static type checking and improve code maintainability. This addition does not replace the core technologies declared in the original proposal but supports their implementation.


---

## 5. Quick Start

The complete BestRoute system can be started using Docker Compose.

```bash
git clone <repository-url>
cd Codecrushers
docker compose up --build
```

After the containers start:

* **Admin Dashboard:** http://localhost:5173
* **Backend API:** http://localhost:5000
* **Mobile Application:** http://localhost:8081

To stop the system:

```bash
docker compose down 
```

For detailed setup instructions, see [Setup and Run Instructions](#7._Setup_and_Run_Instructions).

---


## 6. Repository File Structure

```text
codecrushers/
│
├── admin-dashboard/                                    # Web Admin Portal (React + Vite)
│   ├── public/                                         # Public static assets
│   ├── src/
│   │   ├── assets/                                     # UI icons, logos, and images
│   │   ├── components/                                 # Reusable dashboard UI components
│   │   │   ├── Login.jsx                               # Admin authentication modal/card
│   │   │   ├── Modal.jsx                               # Universal dynamic popup modal
│   │   │   ├── Navbar.jsx                              # Top navigation bar with dark mode & notifications
│   │   │   └── Sidebar.jsx                             # Collapsible navigation drawer with pinned footer
│   │   ├── context/                                    # Global state providers
│   │   │   ├── AuthContext.jsx                         # Admin authentication & token state
│   │   │   └── ToastContext.jsx                        # Global toast notification management
│   │   ├── pages/                                      # Admin view screens
│   │   │   ├── AdminSecurityPage.jsx                   # Roles, permissions, audit logs & security settings
│   │   │   ├── AnalyticsPage.jsx                       # Data visualization, passenger trends & insights
│   │   │   ├── DashboardHome.jsx                       # Main overview dashboard with KPIs & active disruptions
│   │   │   ├── DisruptionManagement.jsx                # Disruption broadcast, tracking & resolution screen
│   │   │   ├── DriverApplicationsPage.jsx              # Driver verification & onboarding applications
│   │   │   ├── DriverManagementPage.jsx                # Active driver fleet records & status
│   │   │   ├── MonitoringPage.jsx                      # Real-time network health & service latency
│   │   │   ├── RouteScheduleManagement.jsx             # Transit route builder & sequence manager
│   │   │   ├── SchedulesManagement.jsx                 # Timetable & departure/arrival schedule manager
│   │   │   ├── ServicesManagement.jsx                  # Multi-modal service & operator fleet management
│   │   │   ├── SettingsPage.jsx                        # Platform configuration & preferences
│   │   │   ├── StopsManagement.jsx                     # Bus stops, train stations & terminal coordinates
│   │   │   ├── UsersPage.jsx                           # User management, role assignment & profile inspection
│   │   │   └── VehicleManagementPage.jsx               # Vehicle registry, inspections & maintenance
│   │   ├── services/                                   # API communication layer
│   │   │   ├── adminService.js                         # REST client for administrative CRUD operations
│   │   │   └── api.js                                  # Axios/Fetch base instance & auth interceptors
│   │   ├── App.css                                     # Global dashboard styling & theme variables
│   │   ├── App.jsx                                     # Main router & layout container
│   │   ├── index.css                                   # Tailwind / CSS reset & typography imports
│   │   └── main.jsx                                    # Application bootstrap & DOM entry point
│   ├── eslint.config.js                                # Linter configuration
│   ├── index.html                                      # HTML template
│   ├── package.json                                    # Frontend dependencies & scripts
│   └── vite.config.js                                  # Vite bundling & server configuration
│
├── backend/                                            # Core REST API (Node.js, Express & MongoDB)
│   ├── src/
│   │   ├── config/                                     # System configuration & DB connections
│   │   │   ├── connectionRisk.js                       # Connection risk thresholds & calculation parameters
│   │   │   ├── constants.js                            # Enums (disruption types, severities, user roles)
│   │   │   └── db.js                                   # Mongoose MongoDB connection handler
│   │   ├── controllers/                                # Route controllers & business logic
│   │   │   ├── adminController.js                      # Dashboard aggregate KPIs & audit stats
│   │   │   ├── authController.js                       # User authentication, registration & JWT issuance
│   │   │   ├── connectionRiskController.js             # Real-time transfer risk assessments
│   │   │   ├── disruptionController.js                 # Incident management, re-routing triggers
│   │   │   ├── journeyController.js                    # Passenger trip planning & execution
│   │   │   ├── notificationController.js               # Push & in-app alerts dispatch
│   │   │   ├── routeController.js                      # Transit route definitions & stop sequences
│   │   │   ├── scheduleController.js                   # Timetable creation & departures lookup
│   │   │   ├── stopController.js                       # Station/Stop geolocation & terminal info
│   │   │   ├── transportServiceController.js           # Fleet operators & service categories
│   │   │   └── userController.js                       # User account management & permissions
│   │   ├── middleware/                                 # Request handling pipelines
│   │   │   ├── authMiddleware.js                       # JWT verification & token authentication
│   │   │   ├── errorHandler.js                         # Global centralized error handler
│   │   │   └── roleMiddleware.js                       # Role-based access control (RBAC)
│   │   ├── models/                                     # Mongoose data schemas
│   │   │   ├── Disruption.js                           # Service interruptions, delays & diversions
│   │   │   ├── Journey.js                              # Multi-modal passenger journey itineraries
│   │   │   ├── Notification.js                         # User notification logs & read states
│   │   │   ├── Route.js                                # Transit route lines & sequence associations
│   │   │   ├── Schedule.js                             # Operating schedules & timetable entries
│   │   │   ├── Stop.js                                 # Stations, bus stands & geographic coordinates
│   │   │   ├── TransportService.js                     # Public/private transport agencies & modes
│   │   │   └── User.js                                 # Registered passenger & administrator accounts
│   │   ├── routes/                                     # Express endpoint definitions
│   │   │   ├── adminRoutes.js                          # /api/admin
│   │   │   ├── authRoutes.js                           # /api/auth
│   │   │   ├── connectionRiskRoutes.js                 # /api/connection-risk
│   │   │   ├── disruptionRoutes.js                     # /api/disruptions
│   │   │   ├── journeyRoutes.js                        # /api/journeys
│   │   │   ├── notificationRoutes.js                   # /api/notifications
│   │   │   ├── routeRoutes.js                          # /api/routes
│   │   │   ├── scheduleRoutes.js                       # /api/schedules
│   │   │   ├── stopRoutes.js                           # /api/stops
│   │   │   ├── transportServiceRoutes.js               # /api/services
│   │   │   └── userRoutes.js                           # /api/users
│   │   ├── services/                                   # Domain algorithms & background calculations
│   │   │   ├── connectionRiskService.js                # Connection probability & delay buffer engine
│   │   │   ├── disruptionService.js                    # Disruption lifecycle & status management
│   │   │   ├── journeyService.js                       # Multi-modal pathfinding & routing algorithm
│   │   │   ├── notificationService.js                  # Automated alert creation & triggers
│   │   │   ├── reroutingService.js                     # Dynamic rerouting engine upon disruptions
│   │   │   └── routeScoringService.js                  # Best-route scoring (time, cost, convenience)
│   │   ├── seed_dashboard_data.js                      # Database initialization & sample data populator
│   │   └── server.js                                   # Express app instantiation & listener
│   ├── .env.example                                    # Environment configuration (Mongo URI, Port, JWT)
│   └── package.json                                    # Backend dependencies & startup scripts
│
├── mobile-app/                                         # Passenger Mobile Client (React Native + Expo)
│   ├── assets/                                         # App icons, splash screens & graphics
│   ├── src/
│   │   ├── components/                                 # Reusable mobile UI components
│   │   │   ├── BottomNavigationBar.tsx                 # Persistent tab navigation bar
│   │   │   ├── RealisticRouteMap.tsx                   # Interactive map view with route polyline & stops
│   │   │   └── ThemeToggle.tsx                         # Light/Dark mode switcher
│   │   ├── constants/                                  # Visual design tokens
│   │   │   └── theme.ts                                # Color palettes, typography & spacing rules
│   │   ├── context/                                    # Application state
│   │   │   └── ThemeContext.tsx                        # Mobile theme provider
│   │   ├── navigations/                                # Navigation stacks
│   │   │   └── AppNavigator.tsx                        # React Navigation stack & screen routing
│   │   ├── screens/                                    # Mobile application screens
│   │   │   ├── AvailableVehiclesScreen.tsx             # Nearby taxis, tuk-tuks & buses
│   │   │   ├── CompareRoutesScreen.tsx                 # Side-by-side multi-route evaluation
│   │   │   ├── DriverRegistrationScreen.tsx            # Driver onboarding form
│   │   │   ├── ForgotPasswordScreen.tsx                # Password recovery flow
│   │   │   ├── HomeScreen.tsx                          # Main passenger discovery & search hub
│   │   │   ├── JourneysScreen.tsx                      # Saved itineraries & journey history
│   │   │   ├── LiveTrackingScreen.tsx                  # Real-time GPS vehicle position tracking
│   │   │   ├── loginscreen.tsx                         # User login screen
│   │   │   ├── NotificationsScreen.tsx                 # Passenger travel alert notifications
│   │   │   ├── OnboardingScreen.tsx                    # First-time introduction walkthrough
│   │   │   ├── ProfileScreen.tsx                       # User profile, history & preferences
│   │   │   ├── RegisterScreen.tsx                      # New passenger registration
│   │   │   ├── RideProgressScreen.tsx                  # In-transit navigation & step-by-step guidance
│   │   │   ├── RouteDetailScreen.tsx                   # Single route stop sequence, timetable & fare
│   │   │   ├── RouteResultsScreen.tsx                  # Ranked route recommendations
│   │   │   └── SplashScreen.tsx                        # App launch splash animation
│   │   └── services/                                   # Network & API client
│   │       ├── api.ts                                  # Mobile API client configuration
│   │       └── authService.ts                          # Authentication & local secure storage
│   ├── app.json                                        # Expo application manifest
│   ├── App.tsx                                         # Root mobile component
│   ├── babel.config.js                                 # Babel compilation rules
│   ├── metro.config.js                                 # Metro bundler config
│   ├── package.json                                    # Mobile dependencies
│   ├── tailwind.config.js                              # NativeWind / Tailwind styling config
│   └── tsconfig.json                                   # TypeScript compiler options
│
├── data/                                               # Mock datasets & initial seed files
│   ├── fares.json                                      # Base transit fare matrices
│   ├── routes.json                                     # Seed route definitions
│   ├── sample_disruptions.json                         # Predefined disruption incidents
│   ├── schedules.json                                  # Timetable departure records
│   └── stops.json                                      # Terminal & station geolocation seeds
│
├── docs/                                               # Technical & API Documentation
│   ├── api/                                            # Individual endpoint specifications
│   │   ├── connection-risk.md                          # Connection risk API documentation
│   │   ├── disruptions.md                              # Disruption broadcast API documentation
│   │   ├── notifications.md                            # Push notification API documentation
│   │   └── rerouting.md                                # Rerouting engine API documentation
│   ├── API_SPECIFICATION.md                            # Complete REST API specification
│   └── ARCHITECTURE.md                                 # High-level system architecture & diagrams
│
├── Documentation/                                      # Project Management & Design Reports
│   ├── System-Design/                                  # Diagrams & technical design artifacts
│   ├── Team-Charter/                                   # Team roles, responsibilities & milestones
│   └── testing-reports/                                # Unit & integration test outcomes
├── .gitignore                                          
├── logo.png                                            # BestRoute platform branding logo
└── README.md                                           # Comprehensive project overview & setup guide

```
---
## 7. Setup and Run Instructions

The recommended way to run the BestRoute system is using Docker Compose. Docker Compose starts the required database, backend, administrative dashboard, and mobile application services together.

### 7.1 Prerequisites

Install the following before running the project:

* **Git**
* **Docker Desktop** with Docker Compose support

No separate MongoDB installation is required because MongoDB runs as a Docker container.

Node.js and npm are also not required for the Docker-based setup.

---

### 7.2 Clone the Repository

Clone the repository and navigate to the project directory:

```bash
git clone <repository-url>
cd CodeCrushers
```

---

### 7.3 Environment Configuration

The Docker Compose configuration provides the required configuration for the backend service, including:

```text
PORT=5000
MONGO_URI=mongodb://mongodb:27017/bestroute
JWT_SECRET=<configured by Docker Compose>
```

The backend connects to the MongoDB Docker service using the service name `mongodb`.

No MongoDB Atlas account or separate MongoDB installation is required when using the Docker Compose setup.


---

### 7.4 Build and Start the Complete System

From the root directory of the repository, run:

```bash
docker compose up --build
```

This command builds and starts the following services:

* **MongoDB** – Database service
* **Backend** – Node.js + Express.js API
* **Administrative Dashboard** – React + Vite web application
* **Mobile Application** – React Native + Expo application container

The first build may take some time because Docker needs to download the required images and build the application containers.

---

### 7.5 Accessing the Services

After the containers start successfully, the services are available through the following ports.

| Service                  | Address                 | Purpose                       |
| ------------------------ | ----------------------- | ----------------------------- |
| MongoDB                  | `localhost:27017`       | Database service              |
| Backend API              | `http://localhost:5000` | REST API and backend services |
| Administrative Dashboard | `http://localhost:5173` | Web-based admin dashboard     |
| Mobile Application       | `http://localhost:8081` | Mobile application container  |

The MongoDB service is used internally by the backend and normally does not need to be accessed directly through a browser.

Open the following address in a web browser to access the administrative dashboard:

```text
http://localhost:5173
```

The backend API is available at:

```text
http://localhost:5000
```

---

### 7.6 Docker Compose Services

The `docker-compose.yml` file defines the following services:

#### MongoDB

```text
mongodb
```

Uses the `mongo:7.0` Docker image and stores database data in the `mongo_data` Docker volume.

#### Backend

```text
backend
```

Builds the Node.js + Express.js backend from the `backend/Dockerfile`.

The backend is exposed on:

```text
http://localhost:5000
```

The backend depends on the MongoDB service.

#### Administrative Dashboard

```text
admin-dashboard
```

Builds the administrative web application from the `admin-dashboard/Dockerfile`.

The dashboard is exposed on:

```text
http://localhost:5173
```

#### Mobile Application

```text
mobile-app
```

Builds the passenger mobile application from the `mobile-app/Dockerfile`.

The mobile application service is exposed on:

```text
http://localhost:8081
```

---

### 7.7 Stopping the Application

To stop the running services, press:

```text
Ctrl + C
```

or run:

```bash
docker compose down
```

To stop the services and remove the stored MongoDB Docker volume:

```bash
docker compose down -v
```

> Removing the volume deletes the MongoDB data stored by the Docker Compose environment.

---

### 7.8 Rebuilding the Application

If changes are made to the source code or Docker configuration, rebuild the services using:

```bash
docker compose up --build
```

To run the containers in the background:

```bash
docker compose up --build -d
```

To view running containers:

```bash
docker compose ps
```

To view service logs:

```bash
docker compose logs
```

---

### 7.9 Verifying the Setup

After running:

```bash
docker compose up --build
```

verify that all four services start successfully:

```text
mongodb
backend
admin-dashboard
mobile-app
```

Then verify that:

1. The backend starts on port `5000`.
2. MongoDB starts successfully.
3. The administrative dashboard loads at `http://localhost:5173`.
4. The backend can connect to MongoDB.
5. The mobile application container starts on port `8081`.
6. Authentication and the main application functionality can be tested successfully.

If a service fails to start, check the Docker Compose logs:

```bash
docker compose logs
```
---
### 7.10 Running the Mobile Application with Expo Go

The passenger mobile application is developed using **React Native and Expo**. Although the mobile application is included as a Docker Compose service, the Expo development server must be accessible from the device running Expo Go.

After starting the Docker services:

```bash
docker compose up --build
```

the mobile application development server runs on port `8081`.

#### Option 1: Run using Expo Go on a Physical Device

1. Install **Expo Go** on the Android or iOS device.
2. Connect the mobile device and the development computer to the same Wi-Fi network.
3. From the project root, navigate to the mobile application:

```bash
cd mobile-app
```

4. Start the Expo development server:

```bash
npx expo start
```

5. Expo will display a QR code in the terminal or browser.
6. Scan the QR code using Expo Go.
7. The BestRoute passenger application will open on the device.

> If the Expo development server is already running through Docker, use the Expo server provided by the Docker container instead of starting a second Expo server. Ensure that the Expo/Metro port and network configuration allow the physical device to connect to the container.

#### Option 2: Run the Mobile Application Locally

For mobile development and testing, the Expo application can also be started directly from the `mobile-app` directory.

```bash
cd mobile-app
npm install
npx expo start
```

Then:

1. Open **Expo Go** on the mobile device.
2. Scan the displayed QR code.
3. Ensure the mobile device and development computer are connected to the same network.

#### Mobile Application API Configuration

When testing the mobile application on a physical device, the API base URL should point to an address accessible from the mobile device.

For example:

```text
http://<YOUR-COMPUTER-IP>:5000
```

Do not use:

```text
http://localhost:5000
```

when accessing the backend from a physical mobile device, because `localhost` refers to the mobile device itself.

The backend must therefore be accessible on the local network, and the required firewall and Docker port configuration must allow the mobile device to reach port `5000`.



---

## 8. Environment Variables and Configuration

The Docker Compose configuration provides the required backend environment variables.

### Backend Configuration

The following variables are configured for the backend service:

```env
PORT=5000
MONGO_URI=mongodb://mongodb:27017/bestroute
JWT_SECRET=<configured by Docker Compose>
```

### Variable Description

| Variable     | Purpose                                            |
| ------------ | -------------------------------------------------- |
| `PORT`       | Defines the port used by the backend API           |
| `MONGO_URI`  | Defines the MongoDB connection used by the backend |
| `JWT_SECRET` | Secret used for JWT-based authentication           |

The `MONGO_URI` uses:

```text
mongodb://mongodb:27017/bestroute
```

because `mongodb` is the MongoDB service name defined in `docker-compose.yml`.


---

## 9. Known Limitations and Assumptions

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
## 10. Security Considerations

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

## 11. Change Log

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

The original proposal specified the primary technologies and technical approach for the project. The core technologies remain unchanged, including React Native, React, Node.js, Express.js, MongoDB, JWT, and multi-criteria route optimization.

During development, TypeScript was introduced for frontend implementation, particularly in the React Native mobile application. TypeScript was adopted to provide static type checking, improve code reliability, reduce type-related errors, and support maintainable development as the application grows.

This change is an implementation-level addition to the existing React/React Native stack and does not change the overall system architecture or the core technologies declared in the original proposal.


---

## 12. Future Enhancements

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



