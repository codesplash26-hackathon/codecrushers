/**
 * Multi-Criteria Route Scorer
 * Formula: Route Score = w1(Time) + w2(Cost) + w3(Waiting) + w4(Transfers) + w5(Walking) + w6(Risk)
 */

class RouteScorer {
  /**
   * Calculate normalized score for a route candidate based on passenger weights
   * @param {Object} route - Candidate route object
   * @param {Object} preferenceWeights - { travelTime, cost, waitingTime, transfers, walkingDistance, connectionRisk }
   * @returns {Number} Calculated Route Score (lower score = higher rank)
   */
  static scoreRoute(route, preferenceWeights) {
    const w1 = preferenceWeights.travelTime || 0.3;
    const w2 = preferenceWeights.cost || 0.2;
    const w3 = preferenceWeights.waitingTime || 0.15;
    const w4 = preferenceWeights.transfers || 0.15;
    const w5 = preferenceWeights.walkingDistance || 0.1;
    const w6 = preferenceWeights.connectionRisk || 0.1;

    const timeScore = route.totalDurationMinutes || 0;
    const costScore = route.totalCost || 0;
    const waitingScore = route.totalWaitingTimeMinutes || 0;
    const transferScore = (route.transfersCount || 0) * 10;
    const walkingScore = (route.totalWalkingDistanceMeters || 0) / 100;
    const riskScore = route.connectionRiskScore || 1;

    return (
      w1 * timeScore +
      w2 * costScore +
      w3 * waitingScore +
      w4 * transferScore +
      w5 * walkingScore +
      w6 * riskScore
    );
  }

  /**
   * Rank candidate routes according to preference
   */
  static rankRoutes(routes, preferenceWeights) {
    return routes
      .map(route => ({
        ...route,
        score: this.scoreRoute(route, preferenceWeights)
      }))
      .sort((a, b) => a.score - b.score);
  }
}

module.exports = RouteScorer;
