/**
 * Dynamic Journey Re-optimization Engine
 * Recalculates remaining journey legs when a disruption renders a planned connection unfeasible.
 */

const MultimodalGenerator = require('./multimodalGenerator');
const RouteScorer = require('./routeScorer');

class DynamicRerouter {
  /**
   * Recalculate remaining journey from current location to target destination
   * @param {Object} currentJourney - Active journey object
   * @param {Object} currentLocation - Current passenger location & timestamp
   * @param {Object} disruption - Details of the disruption
   * @returns {Object} New alternative journey recommendation
   */
  static async recalculateJourney(currentJourney, currentLocation, disruption) {
    // Generate new routes from currentLocation to currentJourney.destination
    const newOptions = await MultimodalGenerator.generateCandidateRoutes({
      origin: currentLocation,
      destination: currentJourney.destination,
      departureTime: new Date(),
      allowedModes: currentJourney.allowedModes
    });

    const rankedNewRoutes = RouteScorer.rankRoutes(newOptions, currentJourney.userPreferences);
    return rankedNewRoutes[0] || null;
  }
}

module.exports = DynamicRerouter;
