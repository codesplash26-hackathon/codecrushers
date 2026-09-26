const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Stop = require("./models/Stop");
const Route = require("./models/Route");
const Schedule = require("./models/Schedule");
const TransportService = require("./models/TransportService");
const Disruption = require("./models/Disruption");
const Journey = require("./models/Journey");
const DriverApplication = require("./models/DriverApplication");
const { DISRUPTION_TYPES, DISRUPTION_SEVERITY, DISRUPTION_STATUS } = require("./config/constants");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://bestroute005_db_user:c8KyNplW4yU6dg52@ac-byvlmkb-shard-00-00.kfztjty.mongodb.net:27017,ac-byvlmkb-shard-00-01.kfztjty.mongodb.net:27017,ac-byvlmkb-shard-00-02.kfztjty.mongodb.net:27017/bestroute?ssl=true&replicaSet=atlas-118t44-shard-0&authSource=admin&appName=BestRouteCluster";

async function seedDatabase(force = false) {
  if (mongoose.connection.readyState === 0) {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log("Connected successfully to:", mongoose.connection.name);
  }

  if (!force) {
    const [userCount, serviceCount, routeCount] = await Promise.all([
      User.countDocuments(),
      TransportService.countDocuments(),
      Route.countDocuments(),
    ]);
    if (userCount > 0 && serviceCount > 0 && routeCount > 0) {
      console.log(`Database already contains ${userCount} users, ${serviceCount} services, ${routeCount} routes. Auto-seed skipped.`);
      return;
    }
    console.log("Database missing collections. Running initial database population...");
  }

  // 1. Seed Users
  console.log("Seeding Users...");
  await User.deleteMany({});

  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedPassengerPassword = await bcrypt.hash("password123", 10);

  const adminUser = await User.create({
    name: "Admin",
    email: "admin@bestroute.lk",
    password: hashedAdminPassword,
    role: "admin",
  });

  // Also create a shorthand user for easy login with username "admin"
  await User.create({
    name: "System Admin",
    email: "admin@bestroute.com",
    password: hashedAdminPassword,
    role: "admin",
  });

  const passengerUser = await User.create({
    name: "Dasun Passenger",
    email: "passenger@bestroute.lk",
    password: hashedPassengerPassword,
    role: "passenger",
    preferences: "fastest",
  });

  const hashedGooglePassword = await bcrypt.hash("google_oauth_pass", 10);
  await User.create({
    name: "Malith Perera",
    email: "malith.perera@gmail.com",
    password: hashedGooglePassword,
    role: "passenger",
    preferences: "fastest",
  });
  await User.create({
    name: "CodeCrushers User",
    email: "user.codecrushers@gmail.com",
    password: hashedGooglePassword,
    role: "passenger",
    preferences: "fastest",
  });

  console.log(`Created admin (${adminUser.email}), passenger (${passengerUser.email}), and Google demo users`);

  // 2. Seed Stops
  console.log("Seeding Sri Lankan Transit Stops...");
  await Stop.deleteMany({});

  const stops = await Stop.insertMany([
    {
      name: "Colombo Fort Station",
      type: "railway_station",
      location: { latitude: 6.9344, longitude: 79.8509 },
      address: "Olcott Mawatha, Colombo 01",
    },
    {
      name: "Pettah Central Bus Stand",
      type: "terminal",
      location: { latitude: 6.9366, longitude: 79.8530 },
      address: "Bastian Mawatha, Colombo 11",
    },
    {
      name: "Maradana Junction",
      type: "bus_stop",
      location: { latitude: 6.9272, longitude: 79.8698 },
      address: "Maradana Road, Colombo 10",
    },
    {
      name: "Bambalapitiya Junction",
      type: "bus_stop",
      location: { latitude: 6.8915, longitude: 79.8576 },
      address: "Galle Road, Colombo 04",
    },
    {
      name: "Nugegoda Supermarket",
      type: "bus_stop",
      location: { latitude: 6.8724, longitude: 79.8988 },
      address: "High Level Road, Nugegoda",
    },
    {
      name: "Maharagama Clock Tower",
      type: "terminal",
      location: { latitude: 6.8483, longitude: 79.9267 },
      address: "High Level Road, Maharagama",
    },
    {
      name: "Moratuwa Cross Junction",
      type: "bus_stop",
      location: { latitude: 6.7730, longitude: 79.8816 },
      address: "Galle Road, Moratuwa",
    },
    {
      name: "Kandy Central Station",
      type: "railway_station",
      location: { latitude: 7.2906, longitude: 80.6337 },
      address: "Station Road, Kandy",
    },
  ]);

  const stopMap = {};
  stops.forEach((s) => (stopMap[s.name] = s._id));
  console.log(`Created ${stops.length} transit stops`);

  // 3. Seed Transport Services
  console.log("Seeding Transport Services...");
  await TransportService.deleteMany({});

  const services = await TransportService.insertMany([
    {
      name: "SLTB Kandy Express",
      type: "bus",
      operator: "SLTB / Private Transit",
      routes: 8,
      vehicles: 24,
      status: "active",
    },
    {
      name: "Sri Lanka Railways",
      type: "train",
      operator: "Sri Lanka Railways",
      routes: 5,
      vehicles: 12,
      status: "active",
    },
    {
      name: "Kandy Private Bus Alliance",
      type: "bus",
      operator: "Private Bus Association",
      routes: 14,
      vehicles: 38,
      status: "active",
    },
    {
      name: "PickMe Taxi Network",
      type: "taxi",
      operator: "PickMe LK",
      vehicles: 142,
      status: "active",
    },
    {
      name: "Tuk Alliance Colombo",
      type: "three_wheeler",
      operator: "Colombo Tuk Federation",
      vehicles: 89,
      status: "active",
    },
    {
      name: "Night Mail Coastal Line",
      type: "train",
      operator: "Sri Lanka Railways",
      routes: 2,
      vehicles: 3,
      status: "inactive",
    },
  ]);
  console.log(`Created ${services.length} transport services`);

  // 4. Seed Routes
  console.log("Seeding Routes...");
  await Route.deleteMany({});

  const route138 = await Route.create({
    service: services[0]._id,
    routeNumber: "138",
    name: "Pettah to Maharagama Express",
    stops: [
      stopMap["Pettah Central Bus Stand"],
      stopMap["Maradana Junction"],
      stopMap["Nugegoda Supermarket"],
      stopMap["Maharagama Clock Tower"],
    ],
    active: true,
  });

  const route100 = await Route.create({
    service: services[1]._id,
    routeNumber: "100",
    name: "Fort to Moratuwa Coastal",
    stops: [
      stopMap["Colombo Fort Station"],
      stopMap["Bambalapitiya Junction"],
      stopMap["Moratuwa Cross Junction"],
    ],
    active: true,
  });

  const mainTrainLine = await Route.create({
    service: services[1]._id,
    routeNumber: "MAIN-01",
    name: "Colombo Fort to Kandy Express",
    stops: [
      stopMap["Colombo Fort Station"],
      stopMap["Maradana Junction"],
      stopMap["Kandy Central Station"],
    ],
    active: true,
  });

  const route654 = await Route.create({
    service: services[2]._id,
    routeNumber: "654",
    name: "Kandy Road Express 654",
    stops: [
      stopMap["Pettah Central Bus Stand"],
      stopMap["Maradana Junction"],
      stopMap["Kandy Central Station"],
    ],
    active: true,
  });

  const peradeniyaTrain = await Route.create({
    service: services[1]._id,
    routeNumber: "R003",
    name: "Peradeniya Commuter Express",
    stops: [
      stopMap["Colombo Fort Station"],
      stopMap["Maradana Junction"],
    ],
    active: true,
  });
  console.log("Created 5 active transit routes");

  // 5. Seed Schedules
  console.log("Seeding Schedules...");
  await Schedule.deleteMany({});

  await Schedule.insertMany([
    {
      route: route138._id,
      departureStop: stopMap["Pettah Central Bus Stand"],
      arrivalStop: stopMap["Maharagama Clock Tower"],
      departureTime: "07:30 AM",
      arrivalTime: "08:25 AM",
      fare: 85,
      travelTime: 55,
    },
    {
      route: route138._id,
      departureStop: stopMap["Pettah Central Bus Stand"],
      arrivalStop: stopMap["Maharagama Clock Tower"],
      departureTime: "08:15 AM",
      arrivalTime: "09:10 AM",
      fare: 85,
      travelTime: 55,
    },
    {
      route: route100._id,
      departureStop: stopMap["Colombo Fort Station"],
      arrivalStop: stopMap["Moratuwa Cross Junction"],
      departureTime: "08:00 AM",
      arrivalTime: "08:50 AM",
      fare: 70,
      travelTime: 50,
    },
    {
      route: mainTrainLine._id,
      departureStop: stopMap["Colombo Fort Station"],
      arrivalStop: stopMap["Kandy Central Station"],
      departureTime: "07:00 AM",
      arrivalTime: "09:30 AM",
      fare: 350,
      travelTime: 150,
    },
    {
      route: route654._id,
      departureStop: stopMap["Pettah Central Bus Stand"],
      arrivalStop: stopMap["Kandy Central Station"],
      departureTime: "08:30 AM",
      arrivalTime: "11:45 AM",
      fare: 420,
      travelTime: 195,
    },
  ]);
  console.log("Created schedules");

  // 6. Seed Disruptions
  console.log("Seeding Disruptions...");
  await Disruption.deleteMany({});

  await Disruption.insertMany([
    {
      affectedService: services[0]._id,
      affectedRoute: route138._id,
      affectedTrip: "138-Morning-01",
      disruptionType: DISRUPTION_TYPES.DELAY,
      title: "Peak Hour Congestion near Maradana",
      description: "Heavy traffic at Maradana junction causing ~15 mins delay for Route 138 buses.",
      delayMinutes: 15,
      startTime: new Date(),
      status: DISRUPTION_STATUS.ACTIVE,
      severity: DISRUPTION_SEVERITY.MEDIUM,
      affectedStops: [stopMap["Maradana Junction"]],
      createdBy: adminUser._id,
    },
    {
      affectedService: services[1]._id,
      affectedRoute: mainTrainLine._id,
      affectedTrip: "Kandy-Express-0700",
      disruptionType: DISRUPTION_TYPES.DELAY,
      title: "Main Line Track Maintenance",
      description: "Speed restriction in effect between Ragama and Veyangoda. Expect 20-30 min delay.",
      delayMinutes: 25,
      startTime: new Date(),
      status: DISRUPTION_STATUS.ACTIVE,
      severity: DISRUPTION_SEVERITY.HIGH,
      affectedStops: [stopMap["Colombo Fort Station"], stopMap["Maradana Junction"]],
      createdBy: adminUser._id,
    },
    {
      affectedService: services[2]._id,
      affectedRoute: route654._id,
      affectedTrip: "Route-654-Trip",
      disruptionType: DISRUPTION_TYPES.ROAD_CLOSURE,
      title: "Route 654 Kandy Road Diversion",
      description: "Road resurfacing work on Kandy Road section. Buses diverted through bypass.",
      delayMinutes: 10,
      startTime: new Date(),
      status: DISRUPTION_STATUS.ACTIVE,
      severity: DISRUPTION_SEVERITY.MEDIUM,
      affectedStops: [stopMap["Pettah Central Bus Stand"]],
      createdBy: adminUser._id,
    },
  ]);
  console.log("Created sample active disruptions");

  // 7. Seed Journeys
  console.log("Seeding Passenger Journeys...");
  await Journey.deleteMany({});

  const sampleJourneys = [];
  for (let i = 0; i < 24; i++) {
    sampleJourneys.push({
      user: passengerUser._id,
      origin: { latitude: 6.9344, longitude: 79.8509 },
      destination: { latitude: 6.8483, longitude: 79.9267 },
      departureTime: "08:15 AM",
      arrivalTime: "09:10 AM",
      totalTravelTime: 55,
      totalFare: 85,
      transfers: i % 2,
      status: i % 4 === 0 ? "active" : "completed",
      isAffectedByDisruption: i % 3 === 0,
      connectionRiskLevel: i % 3 === 0 ? "MEDIUM" : "LOW",
      connectionRiskScore: 10,
      createdAt: new Date(),
    });
  }
  await Journey.insertMany(sampleJourneys);
  console.log("Created 24 sample commuter journeys");

  // 8. Seed Driver Applications
  console.log("Seeding Driver Applications...");
  await DriverApplication.deleteMany({});

  await DriverApplication.insertMany([
    {
      applicationId: "DAR01",
      user: passengerUser._id,
      fullName: "Kasun Perera",
      phone: "+94 77 123 4567",
      nic: "982345678V",
      licenseNumber: "B 1234567",
      vehicleType: "Taxi",
      vehicleNo: "WP CAB-1234",
      vehicleModel: "Toyota Prius",
      color: "Silver",
      status: "Pending",
      submitted: "2024-01-15",
    },
    {
      applicationId: "DAR02",
      fullName: "Nimal Silva",
      phone: "+94 71 234 5678",
      nic: "871234567V",
      licenseNumber: "B 7654321",
      vehicleType: "Tuk-tuk",
      vehicleNo: "WP TUK-3321",
      vehicleModel: "Bajaj RE 4S",
      color: "Red",
      status: "Approved",
      submitted: "2024-01-14",
    },
    {
      applicationId: "DAR03",
      fullName: "Priya Fernando",
      phone: "+94 76 345 6789",
      nic: "951234567V",
      licenseNumber: "B 5432167",
      vehicleType: "Taxi",
      vehicleNo: "WP CAB-5512",
      vehicleModel: "Suzuki Alto",
      color: "White",
      status: "Rejected",
      submitted: "2024-01-13",
    },
    {
      applicationId: "DAR04",
      fullName: "Roshan Jayawardena",
      phone: "+94 77 456 7890",
      nic: "921234567V",
      licenseNumber: "B 9876543",
      vehicleType: "Tuk-tuk",
      vehicleNo: "CP TUK-0098",
      vehicleModel: "TVS King",
      color: "Blue",
      status: "Pending",
      submitted: "2024-01-12",
    },
  ]);
  console.log("Created 4 sample driver applications");

  console.log("\n===========================================");
  console.log(" DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("===========================================");
  console.log("Admin login:     admin / admin123  (or admin@bestroute.lk)");
  console.log("Passenger login: passenger@bestroute.lk / password123");
  console.log("===========================================\n");
}

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase(true)
    .then(async () => {
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed with error:", err);
      process.exit(1);
    });
}
