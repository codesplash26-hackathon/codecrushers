const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Stop = require("./models/Stop");
const TransportService = require("./models/TransportService");
const Route = require("./models/Route");
const Disruption = require("./models/Disruption");
const Journey = require("./models/Journey");
const Notification = require("./models/Notification");

const { evaluateConnection } = require("./services/connectionRiskService");
const { detectAffectedJourney } = require("./services/disruptionService");
const { rerouteJourney } = require("./services/reroutingService");
const { getUserNotifications } = require("./services/notificationService");

async function runFullPipelineTest() {
  console.log("=================================================");
  console.log("    BESTROUTE FULL BACKEND PIPELINE INTEGRATION   ");
  console.log("=================================================");

  console.log("\nConnecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✓ Connected to MongoDB.");

  // Clean test artifacts
  await User.deleteMany({ email: "test_passenger@bestroute.com" });
  await User.deleteMany({ email: "test_admin@bestroute.com" });

  // 1. Create Test Users
  console.log("\n--- [STEP 1] User Creation & Authentication Setup ---");
  const passenger = await User.create({
    name: "John Passenger",
    email: "test_passenger@bestroute.com",
    password: "hashedpassword123",
    role: "passenger",
    preferences: "fastest",
  });
  console.log("✓ Passenger user created:", passenger._id.toString());

  const admin = await User.create({
    name: "Admin User",
    email: "test_admin@bestroute.com",
    password: "hashedpassword123",
    role: "admin",
  });
  console.log("✓ Admin user created:", admin._id.toString());

  // 2. Create Test Transport Data (Stops, Services, Routes)
  console.log("\n--- [STEP 2] Setting up Transportation Data ---");
  const busStop1 = await Stop.create({
    name: "Colombo Central Bus Station",
    type: "bus_stop",
    location: { latitude: 6.9271, longitude: 79.8612 },
  });

  const trainStation = await Stop.create({
    name: "Fort Railway Station",
    type: "railway_station",
    location: { latitude: 6.9344, longitude: 79.8504 },
  });

  const busService = await TransportService.create({
    name: "Express Bus 100",
    type: "bus",
    operator: "SLTB",
    status: "active",
  });

  const trainService = await TransportService.create({
    name: "Intercity Express Train",
    type: "train",
    operator: "Sri Lanka Railways",
    status: "active",
  });

  const busRoute = await Route.create({
    service: busService._id,
    routeNumber: "100",
    name: "Route 100 Express",
    stops: [busStop1._id],
    active: true,
  });

  const trainRoute = await Route.create({
    service: trainService._id,
    routeNumber: "IC-01",
    name: "Main Line Intercity",
    stops: [trainStation._id],
    active: true,
  });

  console.log("✓ Bus Route created:", busRoute._id.toString());
  console.log("✓ Train Route created:", trainRoute._id.toString());

  // 3. Step 9: Connection Risk Evaluation Test
  console.log("\n--- [STEP 9 TEST] Connection Risk Calculation ---");
  const normalRisk = evaluateConnection(
    { mode: "bus", arrivalTime: "08:30" },
    { mode: "train", departureTime: "08:45" }
  );
  console.log("  08:30 Bus Arrival -> 08:45 Train Departure:");
  console.log("   - Risk Level:", normalRisk.riskLevel);
  console.log("   - Risk Score:", normalRisk.riskScore);
  console.log("   - Buffer Minutes:", normalRisk.bufferMinutes);
  console.log("   - Is Feasible:", normalRisk.isFeasible);

  const tightRisk = evaluateConnection(
    { mode: "bus", arrivalTime: "08:30" },
    { mode: "train", departureTime: "08:35" }
  );
  console.log("  08:30 Bus Arrival -> 08:35 Train Departure:");
  console.log("   - Risk Level:", tightRisk.riskLevel);
  console.log("   - Risk Score:", tightRisk.riskScore);
  console.log("   - Is Feasible:", tightRisk.isFeasible);

  // 4. Create Active Passenger Journey
  console.log("\n--- [STEP 11 TEST] Active Journey Creation ---");
  const activeJourney = await Journey.create({
    user: passenger._id,
    origin: { latitude: 6.9271, longitude: 79.8612 },
    destination: { latitude: 6.9344, longitude: 79.8504 },
    departureTime: "08:00",
    arrivalTime: "09:15",
    totalTravelTime: 75,
    totalFare: 150,
    transfers: 1,
    status: "active",
    legs: [
      {
        service: busService._id,
        route: busRoute._id,
        departureStop: busStop1._id,
        arrivalStop: trainStation._id,
        departureTime: "08:00",
        arrivalTime: "08:30",
        travelTime: 30,
        fare: 50,
      },
      {
        service: trainService._id,
        route: trainRoute._id,
        departureStop: trainStation._id,
        arrivalStop: trainStation._id,
        departureTime: "08:45",
        arrivalTime: "09:15",
        travelTime: 30,
        fare: 100,
      },
    ],
  });
  console.log("✓ Passenger Active Journey created:", activeJourney._id.toString());

  // 5. Step 10: Admin Creates a Disruption (Bus delayed by 20 minutes)
  console.log("\n--- [STEP 10 TEST] Disruption Management ---");
  const disruption = await Disruption.create({
    affectedRoute: busRoute._id,
    affectedService: busService._id,
    disruptionType: "DELAY",
    title: "Route 100 Heavy Traffic Delay",
    description: "20-minute delay due to road construction on Galle Road",
    delayMinutes: 20,
    status: "ACTIVE",
    severity: "HIGH",
    createdBy: admin._id,
  });
  console.log("✓ Disruption Created:", disruption.title, "| Delay:", disruption.delayMinutes, "mins");

  // 6. Step 10 Impact Detection & Step 11 Re-routing Trigger
  console.log("\n--- [STEP 11 TEST] Dynamic Re-routing Pipeline Execution ---");
  const impact = await detectAffectedJourney(activeJourney, [disruption]);
  console.log("  Journey Affected by Disruption?", impact.affected);
  console.log("  Affected Segments Count:", impact.affectedSegments.length);

  // Trigger automated re-routing
  const rerouteResult = await rerouteJourney(activeJourney._id);
  console.log("\n  Re-routing Result Output:");
  console.log("   - Original Journey ID:", rerouteResult.originalJourneyId.toString());
  console.log("   - Journey Affected:", rerouteResult.affected);
  console.log("   - Reason:", rerouteResult.reason);
  console.log("   - Connection Status:", rerouteResult.connectionStatus);
  console.log("   - Risk Score:", rerouteResult.riskScore);
  console.log("   - Feasible After Delay?:", rerouteResult.isFeasible);

  // 7. Step 12: Notification System Verification
  console.log("\n--- [STEP 12 TEST] Passenger Notification Retrieval ---");
  const notifications = await getUserNotifications(passenger._id);
  console.log("✓ Total Passenger Notifications Generated:", notifications.length);

  notifications.forEach((notif, idx) => {
    console.log(`\n  Notification #${idx + 1}:`);
    console.log(`   - Type: [${notif.type}]`);
    console.log(`   - Priority: [${notif.priority}]`);
    console.log(`   - Title: "${notif.title}"`);
    console.log(`   - Message: "${notif.message}"`);
  });

  // Clean up database test entries
  console.log("\nCleaning up test database entries...");
  await User.deleteMany({ email: { $in: ["test_passenger@bestroute.com", "test_admin@bestroute.com"] } });
  await Stop.deleteMany({ _id: { $in: [busStop1._id, trainStation._id] } });
  await TransportService.deleteMany({ _id: { $in: [busService._id, trainService._id] } });
  await Route.deleteMany({ _id: { $in: [busRoute._id, trainRoute._id] } });
  await Disruption.deleteMany({ _id: disruption._id });
  await Journey.deleteMany({ _id: activeJourney._id });
  await Notification.deleteMany({ user: passenger._id });

  await mongoose.disconnect();
  console.log("✓ Disconnected from MongoDB.");
  console.log("\n=================================================");
  console.log("   ALL STEPS 9–12 PIPELINE TESTS COMPLETED 100%   ");
  console.log("=================================================");
}

runFullPipelineTest().catch(async (err) => {
  console.error("Pipeline test failed:", err);
  await mongoose.disconnect();
});
