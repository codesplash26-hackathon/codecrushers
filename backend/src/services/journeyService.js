const Stop = require("../models/Stop");
const TransportService = require("../models/TransportService");
const Route = require("../models/Route");
const Schedule = require("../models/Schedule");

// Find transportation data for a journey search
const searchJourney = async (origin, destination) => {
  // Get active transportation services
  const services = await TransportService.find({
    status: "active",
  });

  // Get all available stops
  const stops = await Stop.find();

  // Get active routes with related services and stops
  const routes = await Route.find({
    active: true,
  })
    .populate("service")
    .populate("stops");

  // Get schedules
  const schedules = await Schedule.find()
    .populate("route")
    .populate("departureStop")
    .populate("arrivalStop");

  return {
    origin,
    destination,
    services,
    stops,
    routes,
    schedules,
  };
};

module.exports = {
  searchJourney,
};