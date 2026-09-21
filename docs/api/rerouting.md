# Dynamic Journey Re-routing API Documentation

## Trigger Manual Reroute / Status Check

Checks whether an active journey is affected by disruptions, recalculates connection risk, scores alternative routes using existing route scoring, and generates passenger notifications.

- **Endpoint**: `POST /api/journeys/:id/reroute`
- **Authentication**: JWT Bearer Token

### Response Example

```json
{
  "success": true,
  "message": "Journey rerouting check completed",
  "data": {
    "originalJourneyId": "607d1b2f5a2b3c4d5e6f7a8d",
    "affected": true,
    "reason": "Delay of 15 minutes (Bus Route 100 Delayed)",
    "connectionStatus": "MISSED",
    "riskScore": 95,
    "isFeasible": false,
    "rerouted": true,
    "alternatives": [
      {
        "type": "direct",
        "travelTime": 45,
        "fare": 120,
        "transfers": 0,
        "score": 0.85
      }
    ],
    "selectedAlternative": {
      "type": "direct",
      "travelTime": 45,
      "score": 0.85
    }
  }
}
```
