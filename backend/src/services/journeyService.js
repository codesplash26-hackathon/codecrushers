const Stop = require("../models/Stop");
const TransportService = require("../models/TransportService");
const Route = require("../models/Route");
const Schedule = require("../models/Schedule");

// Calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

// Find stops near a given location
const findNearbyStops = async (location, radiusKm = 2) => {
  const stops = await Stop.find();

  return stops
    .map((stop) => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        stop.location.latitude,
        stop.location.longitude
      );

      return {
        stop,
        distance,
      };
    })
    .filter((item) => item.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
};

// Generate candidate journeys
const generateCandidateJourneys = async (origin, destination) => {
  // 1. Find stops near origin
  const nearbyOriginStops = await findNearbyStops(origin);

  // 2. Find stops near destination
  const nearbyDestinationStops = await findNearbyStops(destination);

  // 3. Get active routes
  const routes = await Route.find({
    active: true,
  })
    .populate("service")
    .populate("stops");

  // 4. Get schedules
  const schedules = await Schedule.find()
    .populate("route")
    .populate("departureStop")
    .populate("arrivalStop");

  const candidates = [];

  // 5. Compare origin and destination stops with routes
  for (const originStopData of nearbyOriginStops) {
    const originStop = originStopData.stop;

    for (const destinationStopData of nearbyDestinationStops) {
      const destinationStop = destinationStopData.stop;

      for (const route of routes) {
        const stopIds = route.stops.map((stop) => stop._id.toString());

        const originIndex = stopIds.indexOf(originStop._id.toString());
        const destinationIndex = stopIds.indexOf(
          destinationStop._id.toString()
        );

        // Route must contain both stops
        if (originIndex === -1 || destinationIndex === -1) {
          continue;
        }

        // Destination must come after origin
        if (originIndex >= destinationIndex) {
          continue;
        }

        // Find schedules for this route and stop pair
        const matchingSchedules = schedules.filter((schedule) => {
          if (!schedule.route) {
            return false;
          }

          return (
            schedule.route._id.toString() === route._id.toString() &&
            schedule.departureStop &&
            schedule.arrivalStop &&
            schedule.departureStop._id.toString() ===
              originStop._id.toString() &&
            schedule.arrivalStop._id.toString() ===
              destinationStop._id.toString()
          );
        });

        for (const schedule of matchingSchedules) {
          candidates.push({
            type: "direct",
            service: route.service,
            route: route,
            departureStop: originStop,
            arrivalStop: destinationStop,
            departureTime: schedule.departureTime,
            arrivalTime: schedule.arrivalTime,
            fare: schedule.fare,
            travelTime: schedule.travelTime,
            walkingToOriginStop: originStopData.distance,
            walkingFromDestinationStop: destinationStopData.distance,
            transfers: 0,
          });
        }
      }
    }
  }

  return {
    origin,
    destination,
    nearbyOriginStops,
    nearbyDestinationStops,
    candidates,
  };
};

module.exports = {
  calculateDistance,
  findNearbyStops,
  generateCandidateJourneys,
};