# BestRoute System Architecture & Data Flow

## 1. Overview
BestRoute is an intelligent multimodal public transportation optimization platform. It combines Buses, Trains, Taxis, Three-Wheelers, and Walking into unified journey solutions with real-time disruption monitoring and dynamic re-routing.

## 2. Layered System Architecture

```
+-----------------------------------------------------------------------+
|                         PRESENTATION LAYER                            |
|   +---------------------------------+  +--------------------------+   |
|   | Passenger App (React Native)    |  | Admin Web (React + Vite) |   |
|   +---------------------------------+  +--------------------------+   |
+-----------------------------------------------------------------------+
                                   | HTTP REST / JSON
+-----------------------------------------------------------------------+
|                         APPLICATION LAYER                             |
|   +-------------------+  +--------------------+  +----------------+   |
|   | Auth Service      |  | Journey Planner    |  | Notifications  |   |
|   +-------------------+  +--------------------+  +----------------+   |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
|                      OPTIMIZATION LAYER (ENGINE)                      |
|   +---------------------+  +---------------+  +-------------------+   |
|   | Multimodal Generator|  | Route Scorer  |  | Connection Risk   |   |
|   +---------------------+  +---------------+  +-------------------+   |
|   +---------------------+  +--------------------------------------+   |
|   | Disruption Monitor  |  | Dynamic Re-router                    |   |
|   +---------------------+  +--------------------------------------+   |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
|                          DATABASE & DATA LAYER                        |
|   +---------------------------------------------------------------+   |
|   | MongoDB (Users, Routes, Stops, Schedules, Disruptions, Logs)   |   |
|   +---------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

## 3. Route Scoring Formula
$$\text{Route Score} = w_1(\text{Time}) + w_2(\text{Cost}) + w_3(\text{Waiting}) + w_4(\text{Transfers}) + w_5(\text{Walking}) + w_6(\text{Risk})$$
Weights adapt dynamically based on passenger selected preferences:
- **Fastest**: Higher weight $w_1$
- **Cheapest**: Higher weight $w_2$
- **Minimum Walking**: Higher weight $w_5$
- **Minimum Transfers**: Higher weight $w_4$
- **Most Reliable**: Higher weight $w_6$
