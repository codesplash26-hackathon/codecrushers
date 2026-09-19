# BestRoute – Mobile Application

The **BestRoute Mobile Application** is the passenger-facing component of the BestRoute intelligent multimodal public transportation optimization platform.

It helps passengers plan, compare, and monitor complete journeys across multiple transportation modes such as **buses, trains, taxis, three-wheelers, and walking**.

Instead of planning each part of a journey separately, the application provides a unified view of the complete journey and helps passengers select routes based on their preferences.

## Features

* **User Authentication**

  * Passenger registration and login
  * Secure authentication using JWT

* **Journey Planning**

  * Enter origin and destination
  * Select departure or arrival time
  * Search for available multimodal journeys

* **Personalized Route Optimization**

  * Fastest route
  * Cheapest route
  * Minimum walking
  * Minimum transfers
  * Most reliable route

* **Route Comparison**

  * Compare multiple journey options
  * View total travel time
  * View estimated cost
  * View waiting time
  * View number of transfers
  * View walking distance
  * View connection risk

* **Connection-Risk Detection**

  * Identifies potentially difficult transfers
  * Helps passengers avoid connections with insufficient transfer time

* **Journey Monitoring**

  * Monitor an active journey
  * Track journey progress
  * Receive relevant journey updates

* **Disruption Notifications**

  * Delay notifications
  * Cancellation alerts
  * Connection-risk alerts
  * Journey change notifications

* **Dynamic Re-routing**

  * Detects disruptions affecting the selected journey
  * Generates alternative journey options
  * Provides updated route recommendations

* **Favourite Journeys**

  * Save frequently used journeys for easier access

## Technology Stack

| Technology                 | Purpose                          |
| -------------------------- | -------------------------------- |
| React Native               | Mobile application development   |
| Expo                       | Development and testing          |
| NativeWind                 | Styling and responsive UI        |
| Node.js                    | Backend runtime                  |
| Express.js                 | REST API                         |
| MongoDB                    | Data storage                     |
| JWT                        | Authentication                   |
| Mapping / Geolocation APIs | Location and route visualization |
| Git & GitHub               | Version control                  |
| Figma                      | UI/UX design                     |

The project proposal specifies React Native for the passenger mobile application, Node.js and Express.js for backend services, MongoDB for data storage, mapping/geolocation services, JWT authentication, and Git/GitHub for version control.

## Application Flow

```text
Login / Registration
        ↓
Enter Origin & Destination
        ↓
Select Journey Preferences
        ↓
Search Available Journeys
        ↓
Generate Multimodal Routes
        ↓
Evaluate & Rank Routes
        ↓
Compare Routes
        ↓
Select Journey
        ↓
Monitor Journey
        ↓
Receive Disruption Alert
        ↓
Re-optimize Journey if Required
        ↓
Complete Journey
```

This follows the passenger flow defined in the project proposal.


## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Mobile App

```bash
cd mobile-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Expo Development Server

```bash
npx expo start
```

### 5. Run the Application

You can run the application using:

* **Expo Go** on a physical Android/iOS device
* **Android Emulator**
* **iOS Simulator** (macOS)

## Backend Connection

The mobile application communicates with the BestRoute backend through REST APIs.

The general communication flow is:

```text
Mobile Application
        ↓
Backend API
        ↓
Journey Planning / Optimization Services
        ↓
Transportation Data
        ↓
Route Recommendation
        ↓
Mobile Application
```

The proposed architecture follows this passenger-application → backend API → optimization engine → transportation data/external services → route recommendation flow.

## Main Passenger Functions

| Function           | Description                                             |
| ------------------ | ------------------------------------------------------- |
| Authentication     | Register and securely access the application            |
| Journey Search     | Search for multimodal journeys                          |
| Route Optimization | Rank journeys according to passenger preferences        |
| Route Comparison   | Compare journey time, cost, transfers, walking and risk |
| Journey Selection  | Select a suitable recommended journey                   |
| Journey Monitoring | Monitor an active journey                               |
| Disruption Alerts  | Receive notifications about journey disruptions         |
| Dynamic Re-routing | Receive alternative routes when disruptions occur       |
| Favourite Journeys | Save frequently used journeys                           |

## Development Status

🚧 **Currently in Development**

The mobile application is being developed as part of the **CodeCrushers – BestRoute** project for **CodeSplash '26 Theme 05: Intelligent Public Transportation Optimization System**.




