# Disruption Management API Documentation

## Create Disruption

Create a new service disruption (Simulated or Real-Time). Automatically triggers passenger re-routing and notification pipelines.

- **Endpoint**: `POST /api/disruptions`
- **Authentication**: JWT Bearer Token (Role: `admin`)
- **Content-Type**: `application/json`

### Request Body Example

```json
{
  "affectedRoute": "607d1b2f5a2b3c4d5e6f7a8b",
  "disruptionType": "DELAY",
  "title": "Bus Route 100 Delayed",
  "description": "Heavy traffic on main corridor causing 15 min delay",
  "delayMinutes": 15,
  "severity": "HIGH"
}
```

### Response Example

```json
{
  "success": true,
  "message": "Disruption created successfully",
  "data": {
    "_id": "607d1b2f5a2b3c4d5e6f7a8c",
    "disruptionType": "DELAY",
    "title": "Bus Route 100 Delayed",
    "delayMinutes": 15,
    "status": "ACTIVE",
    "severity": "HIGH",
    "createdAt": "2026-09-21T08:30:00.000Z"
  }
}
```

## Get Active Disruptions

- **Endpoint**: `GET /api/disruptions/active`
- **Authentication**: Public

### Response Example

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "607d1b2f5a2b3c4d5e6f7a8c",
      "title": "Bus Route 100 Delayed",
      "delayMinutes": 15,
      "status": "ACTIVE"
    }
  ]
}
```
