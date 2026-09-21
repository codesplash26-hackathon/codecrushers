# Passenger Notification API Documentation

## Get Passenger Notifications

- **Endpoint**: `GET /api/notifications`
- **Authentication**: JWT Bearer Token

### Response Example

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "607d1b2f5a2b3c4d5e6f7a8e",
      "type": "DELAY",
      "title": "Bus Route 100 Delayed",
      "message": "Bus Route 100 is delayed by approximately 15 minutes.",
      "priority": "HIGH",
      "isRead": false,
      "createdAt": "2026-09-21T08:30:00.000Z"
    },
    {
      "_id": "607d1b2f5a2b3c4d5e6f7a8f",
      "type": "ALTERNATIVE_ROUTE",
      "title": "Alternative Route Available",
      "message": "Your current journey is affected. 1 alternative route(s) available.",
      "priority": "HIGH",
      "isRead": false
    }
  ]
}
```

## Mark Notification as Read

- **Endpoint**: `PATCH /api/notifications/:id/read`
- **Authentication**: JWT Bearer Token
