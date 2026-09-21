const Disruption = require("../models/Disruption");
const { DISRUPTION_STATUS } = require("../config/constants");

/**
 * Fetch all active disruptions from DB
 */
const fetchActiveDisruptions = async () => {
  return await Disruption.find({ status: DISRUPTION_STATUS.ACTIVE })
    .populate("affectedService")
    .populate("affectedRoute")
    .populate("affectedStops");
};

/**
 * Detect whether a journey is affected by active disruptions
 * @param {Object} journey - Journey object (containing legs or route details)
 * @param {Array} disruptions - Array of active disruption objects (optional, fetched from DB if omitted)
 */
const detectAffectedJourney = async (journey, disruptions = null) => {
  if (!journey) {
    return { affected: false, totalDelayMinutes: 0, affectedSegments: [] };
  }

  const activeDisruptions = disruptions || (await fetchActiveDisruptions());

  if (!activeDisruptions || activeDisruptions.length === 0) {
    return { affected: false, totalDelayMinutes: 0, affectedSegments: [] };
  }

  // Determine legs of the journey
  const legs = journey.legs || (journey.route ? [{ route: journey.route, service: journey.service }] : []);

  const affectedSegments = [];
  let totalDelayMinutes = 0;

  legs.forEach((leg, index) => {
    const routeId = leg.route ? (leg.route._id ? leg.route._id.toString() : leg.route.toString()) : null;
    const serviceId = leg.service ? (leg.service._id ? leg.service._id.toString() : leg.service.toString()) : null;

    activeDisruptions.forEach((disruption) => {
      let isMatch = false;

      // Check route match
      if (disruption.affectedRoute) {
        const disrRouteId = disruption.affectedRoute._id
          ? disruption.affectedRoute._id.toString()
          : disruption.affectedRoute.toString();
        if (routeId && disrRouteId === routeId) {
          isMatch = true;
        }
      }

      // Check service match
      if (disruption.affectedService) {
        const disrServiceId = disruption.affectedService._id
          ? disruption.affectedService._id.toString()
          : disruption.affectedService.toString();
        if (serviceId && disrServiceId === serviceId) {
          isMatch = true;
        }
      }

      if (isMatch) {
        const delay = disruption.delayMinutes || 0;
        totalDelayMinutes += delay;

        affectedSegments.push({
          legIndex: index,
          segmentId: leg._id ? leg._id.toString() : `LEG_${index}`,
          routeId: routeId,
          serviceId: serviceId,
          disruptionId: disruption._id ? disruption._id.toString() : null,
          disruptionTitle: disruption.title,
          impactType: disruption.disruptionType || "DELAY",
          delayMinutes: delay,
          severity: disruption.severity || "MEDIUM",
        });
      }
    });
  });

  return {
    affected: affectedSegments.length > 0,
    totalDelayMinutes,
    affectedSegments,
  };
};

module.exports = {
  fetchActiveDisruptions,
  detectAffectedJourney,
};
