# BestRoute API Specification

## Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` - Register a new passenger or admin account.
- `POST /api/auth/login` - Authenticate user and issue JWT token.

## Journey & Optimization Endpoints (`/api/journey`)
- `POST /api/journey/plan` - Generate ranked multimodal route recommendations.
- `POST /api/journey/reoptimize` - Trigger dynamic journey recalculation upon disruption.

## Transit Route Endpoints (`/api/routes`)
- `GET /api/routes` - Retrieve active transport routes and schedules.
- `POST /api/routes` - Create a new transport route (Admin).

## Disruption Endpoints (`/api/disruptions`)
- `GET /api/disruptions/active` - List active transportation disruptions.
- `POST /api/disruptions/report` - Broadcast new disruption (Admin).

## Admin & Analytics Endpoints (`/api/admin`)
- `GET /api/admin/stats` - Fetch administrative metrics & usage insights.
