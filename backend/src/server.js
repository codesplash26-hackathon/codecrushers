const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const seedDatabase = require("./seed");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transportServiceRoutes = require("./routes/transportServiceRoutes");
const stopRoutes = require("./routes/stopRoutes");
const routeRoutes = require("./routes/routeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const journeyRoutes = require("./routes/journeyRoutes");
const connectionRiskRoutes = require("./routes/connectionRiskRoutes");
const disruptionRoutes = require("./routes/disruptionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  await connectDB();
  try {
    await seedDatabase(false);
  } catch (err) {
    console.warn("Auto-seed notice:", err.message);
  }
})();

app.get("/", (req, res) => {
  res.json({
    message: "BestRoute Backend API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BestRoute API is healthy",
  });
});

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", transportServiceRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/journeys", journeyRoutes);
app.use("/api/connection-risk", connectionRiskRoutes);
app.use("/api/disruptions", disruptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`BestRoute backend running on port ${PORT}`);
});