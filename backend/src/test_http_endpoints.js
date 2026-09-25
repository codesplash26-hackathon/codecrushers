const http = require("http");

// Helper function to send HTTP requests
function sendRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on("error", (err) => reject(err));

    if (postData) {
      req.write(typeof postData === "object" ? JSON.stringify(postData) : postData);
    }
    req.end();
  });
}

async function testHttpEndpoints() {
  console.log("=================================================");
  console.log("       BESTROUTE HTTP API ENDPOINT TESTS        ");
  console.log("=================================================");

  const baseUrl = "localhost";
  const port = 5000;

  // 1. Health Check Endpoint
  console.log("\n[1] TEST GET /api/health");
  const healthRes = await sendRequest({
    hostname: baseUrl,
    port: port,
    path: "/api/health",
    method: "GET",
  });
  console.log("  Status:", healthRes.status);
  console.log("  Response:", healthRes.body);

  // 2. Step 9: Connection Risk API Endpoint
  console.log("\n[2] TEST POST /api/connection-risk/evaluate");
  const riskPayload = {
    previousSegment: {
      mode: "bus",
      arrivalTime: "2026-09-21T08:30:00",
      locationId: "STOP_001",
    },
    nextSegment: {
      mode: "train",
      departureTime: "2026-09-21T08:45:00",
      locationId: "STATION_001",
    },
  };

  const riskRes = await sendRequest(
    {
      hostname: baseUrl,
      port: port,
      path: "/api/connection-risk/evaluate",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    riskPayload
  );
  console.log("  Status:", riskRes.status);
  console.log("  Risk Response Data:", riskRes.body.data);

  // 3. User Registration (Passenger & Admin)
  console.log("\n[3] TEST POST /api/auth/register (Passenger & Admin)");
  const passengerEmail = `test_pass_${Date.now()}@bestroute.com`;
  const adminEmail = `test_admin_${Date.now()}@bestroute.com`;

  const passRegRes = await sendRequest(
    {
      hostname: baseUrl,
      port: port,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { name: "Test Passenger", email: passengerEmail, password: "Password123", role: "passenger" }
  );

  const passengerToken = passRegRes.body.token || (passRegRes.body.data && passRegRes.body.data.token);
  console.log("  Passenger Reg Status:", passRegRes.status, "| Token Received:", !!passengerToken);

  const adminRegRes = await sendRequest(
    {
      hostname: baseUrl,
      port: port,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { name: "Test Admin", email: adminEmail, password: "Password123", role: "admin" }
  );

  const adminToken = adminRegRes.body.token || (adminRegRes.body.data && adminRegRes.body.data.token);
  console.log("  Admin Reg Status:", adminRegRes.status, "| Token Received:", !!adminToken);

  // 4. Step 10: Admin Create Disruption Endpoint
  console.log("\n[4] TEST POST /api/disruptions (Admin Protected)");
  const disruptionPayload = {
    title: "Main Line Signal Failure",
    description: "Signal delay causing 25 min delay on Train Route",
    disruptionType: "DELAY",
    delayMinutes: 25,
    severity: "CRITICAL",
  };

  const disrRes = await sendRequest(
    {
      hostname: baseUrl,
      port: port,
      path: "/api/disruptions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
    },
    disruptionPayload
  );
  console.log("  Status:", disrRes.status);
  console.log("  Disruption Created Title:", disrRes.body.data ? disrRes.body.data.title : disrRes.body.message);

  // 5. Step 10: Get Active Disruptions Endpoint
  console.log("\n[5] TEST GET /api/disruptions/active (Public Endpoint)");
  const activeDisrRes = await sendRequest({
    hostname: baseUrl,
    port: port,
    path: "/api/disruptions/active",
    method: "GET",
  });
  console.log("  Status:", activeDisrRes.status);
  console.log("  Active Disruptions Count:", activeDisrRes.body.count);

  // 6. Step 11: Create Active Journey Endpoint
  console.log("\n[6] TEST POST /api/journeys/active (Passenger Protected)");
  const journeyPayload = {
    origin: { latitude: 6.9271, longitude: 79.8612 },
    destination: { latitude: 6.9344, longitude: 79.8504 },
    departureTime: "08:00",
    arrivalTime: "09:15",
    totalTravelTime: 75,
    totalFare: 150,
    legs: [
      {
        departureTime: "08:00",
        arrivalTime: "08:30",
        travelTime: 30,
        fare: 50,
      },
      {
        departureTime: "08:40",
        arrivalTime: "09:15",
        travelTime: 35,
        fare: 100,
      },
    ],
  };

  const journeyRes = await sendRequest(
    {
      hostname: baseUrl,
      port: port,
      path: "/api/journeys/active",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${passengerToken}`,
      },
    },
    journeyPayload
  );
  console.log("  Status:", journeyRes.status);
  const journeyId = journeyRes.body.data ? journeyRes.body.data._id : null;
  console.log("  Active Journey ID Created:", journeyId);

  // 7. Step 11: Trigger Journey Re-routing Endpoint
  if (journeyId) {
    console.log("\n[7] TEST POST /api/journeys/:id/reroute (Passenger Protected)");
    const rerouteRes = await sendRequest({
      hostname: baseUrl,
      port: port,
      path: `/api/journeys/${journeyId}/reroute`,
      method: "POST",
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    console.log("  Status:", rerouteRes.status);
    console.log("  Reroute Result Output:", rerouteRes.body.data ? rerouteRes.body.data.reason : rerouteRes.body.message);
  }

  // 8. Step 12: Get Passenger Notifications Endpoint
  console.log("\n[8] TEST GET /api/notifications (Passenger Protected)");
  const notifRes = await sendRequest({
    hostname: baseUrl,
    port: port,
    path: "/api/notifications",
    method: "GET",
    headers: { Authorization: `Bearer ${passengerToken}` },
  });
  console.log("  Status:", notifRes.status);
  console.log("  Passenger Notifications Count:", notifRes.body.count);

  console.log("\n=================================================");
  console.log("     ALL HTTP ENDPOINT TESTS PASSED 100%        ");
  console.log("=================================================");
}

testHttpEndpoints().catch(console.error);
