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
- `GET /api/admin/dashboard-stats` - Fetch comprehensive overview metrics, mode splits & disruptions.
- `GET /api/admin/settings` - Retrieve multimodal journey weights, fares, policies & database configuration.
- `PUT /api/admin/settings` - Persist updated system settings to MongoDB.
- `POST /api/admin/settings/reset` - Restore system parameters to factory defaults.
- `POST /api/admin/settings/reseed` - Re-populate MongoDB with fresh transit demo data & accounts.

