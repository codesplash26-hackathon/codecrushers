# Connection Risk API Documentation

## Evaluate Connection Risk

Evaluates transfer feasibility and risk level between two journey segments.

- **Endpoint**: `POST /api/connection-risk/evaluate`
- **Authentication**: Optional / Public
- **Content-Type**: `application/json`

### Request Body Example

```json
{
  "previousSegment": {
    "mode": "bus",
    "arrivalTime": "2026-09-21T08:30:00",
    "locationId": "STOP_001"
  },
  "nextSegment": {
    "mode": "train",
    "departureTime": "2026-09-21T08:45:00",
    "locationId": "STATION_001"
  }
}
```

### Response Example (Low / Moderate Risk - Feasible)

```json
{
  "success": true,
  "message": "Connection risk evaluated successfully",
  "data": {
    "transferTimeMinutes": 15,
    "requiredTransferTimeMinutes": 9,
    "bufferMinutes": 6,
    "riskLevel": "MEDIUM",
    "riskScore": 40,
    "isFeasible": true,
    "reason": "Moderate transfer buffer available"
  }
}
```

### Response Example (Missed Connection - Infeasible)

```json
{
  "success": true,
  "message": "Connection risk evaluated successfully",
  "data": {
    "transferTimeMinutes": 5,
    "requiredTransferTimeMinutes": 9,
    "bufferMinutes": -4,
    "riskLevel": "MISSED",
    "riskScore": 95,
    "isFeasible": false,
    "reason": "Insufficient transfer time"
  }
}
```
