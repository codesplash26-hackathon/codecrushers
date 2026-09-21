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

// Convert HH:mm time into minutes
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
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

  // Generate one-transfer candidates
  const transferCandidates = await generateOneTransferJourneys(
    nearbyOriginStops,
    nearbyDestinationStops,
    routes,
    schedules
  );

  // Combine direct and one-transfer candidates
  const allCandidates = [
    ...candidates,
    ...transferCandidates,
  ];

  return {
    origin,
    destination,
    nearbyOriginStops,
    nearbyDestinationStops,
    candidates: allCandidates,
  };
};

// Generate one-transfer candidate journeys
const generateOneTransferJourneys = async (
  nearbyOriginStops,
  nearbyDestinationStops,
  routes,
  schedules
) => {
  const candidates = [];

  for (const originStopData of nearbyOriginStops) {
    const originStop = originStopData.stop;

    for (const destinationStopData of nearbyDestinationStops) {
      const destinationStop = destinationStopData.stop;

      // Find possible first-leg schedules
      const firstLegSchedules = schedules.filter((schedule) => {
        if (!schedule.route || !schedule.departureStop || !schedule.arrivalStop) {
          return false;
        }

        const route = routes.find(
          (item) =>
            item._id.toString() === schedule.route._id.toString()
        );

        if (!route) {
          return false;
        }

        const stopIds = route.stops.map((stop) => stop._id.toString());

        const originIndex = stopIds.indexOf(
          originStop._id.toString()
        );

        const arrivalIndex = stopIds.indexOf(
          schedule.arrivalStop._id.toString()
        );

        return (
          schedule.departureStop._id.toString() ===
            originStop._id.toString() &&
          originIndex !== -1 &&
          arrivalIndex !== -1 &&
          originIndex < arrivalIndex
        );
      });

      for (const firstSchedule of firstLegSchedules) {
        const firstRoute = routes.find(
          (route) =>
            route._id.toString() ===
            firstSchedule.route._id.toString()
        );

        if (!firstRoute) {
          continue;
        }

        const transferStop = firstSchedule.arrivalStop;

        // Find second-leg schedules starting from the transfer stop
        const secondLegSchedules = schedules.filter((schedule) => {
          if (
            !schedule.route ||
            !schedule.departureStop ||
            !schedule.arrivalStop
          ) {
            return false;
          }

          // Must start from the transfer stop
          if (
            schedule.departureStop._id.toString() !==
            transferStop._id.toString()
          ) {
            return false;
          }

          // Second leg must arrive at the destination stop
          if (
            schedule.arrivalStop._id.toString() !==
            destinationStop._id.toString()
          ) {
            return false;
          }

          // Make sure it is a different route
          if (
            schedule.route._id.toString() ===
            firstSchedule.route._id.toString()
          ) {
            return false;
          }

          const secondRoute = routes.find(
            (route) =>
              route._id.toString() ===
              schedule.route._id.toString()
          );

          if (!secondRoute) {
            return false;
          }

          const stopIds = secondRoute.stops.map((stop) =>
            stop._id.toString()
          );

          const transferIndex = stopIds.indexOf(
            transferStop._id.toString()
          );

          const destinationIndex = stopIds.indexOf(
            destinationStop._id.toString()
          );

          return (
            transferIndex !== -1 &&
            destinationIndex !== -1 &&
            transferIndex < destinationIndex
          );
        });

        for (const secondSchedule of secondLegSchedules) {
          const firstArrival = timeToMinutes(
            firstSchedule.arrivalTime
          );

          const secondDeparture = timeToMinutes(
            secondSchedule.departureTime
          );

          // Second journey must depart after first journey arrives
          if (secondDeparture <= firstArrival) {
            continue;
          }

          const waitingTime = secondDeparture - firstArrival;

          const totalTravelTime =
            firstSchedule.travelTime +
            waitingTime +
            secondSchedule.travelTime;

          const totalFare =
            firstSchedule.fare +
            secondSchedule.fare;

          const secondRoute = routes.find(
            (route) =>
              route._id.toString() ===
              secondSchedule.route._id.toString()
          );

          candidates.push({
            type: "one_transfer",

            departureStop: originStop,
            transferStop: transferStop,
            arrivalStop: destinationStop,

            departureTime: firstSchedule.departureTime,
            arrivalTime: secondSchedule.arrivalTime,

            travelTime: totalTravelTime,
            waitingTime: waitingTime,

            fare: totalFare,

            transfers: 1,

            walkingToOriginStop: originStopData.distance,

            walkingFromDestinationStop:
              destinationStopData.distance,

            legs: [
              {
                service: firstRoute.service,
                route: firstRoute,
                departureStop: firstSchedule.departureStop,
                arrivalStop: firstSchedule.arrivalStop,
                departureTime: firstSchedule.departureTime,
                arrivalTime: firstSchedule.arrivalTime,
                travelTime: firstSchedule.travelTime,
                fare: firstSchedule.fare,
              },
              {
                service: secondRoute.service,
                route: secondRoute,
                departureStop: secondSchedule.departureStop,
                arrivalStop: secondSchedule.arrivalStop,
                departureTime: secondSchedule.departureTime,
                arrivalTime: secondSchedule.arrivalTime,
                travelTime: secondSchedule.travelTime,
                fare: secondSchedule.fare,
              },
            ],
          });
        }
      }
    }
  }

  return candidates;
};

module.exports = {
  calculateDistance,
  findNearbyStops,
  generateCandidateJourneys,
  generateOneTransferJourneys,
};