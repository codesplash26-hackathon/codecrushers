const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transportServiceRoutes = require("./routes/transportServiceRoutes");
const stopRoutes = require("./routes/stopRoutes");
const routeRoutes = require("./routes/routeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const journeyRoutes = require("./routes/journeyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

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

//  routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", transportServiceRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/journeys", journeyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`BestRoute backend running on port ${PORT}`);
});