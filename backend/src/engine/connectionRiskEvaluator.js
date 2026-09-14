/**
 * Connection Risk Evaluator Module
 * Evaluates whether sufficient transfer buffer time is available between connecting modes (e.g. Bus -> Train).
 */

class ConnectionRiskEvaluator {
  /**
   * Evaluate transfer risk between two connecting transport segments
   * @param {Object} seg1 - Previous segment arrival details
   * @param {Object} seg2 - Next segment departure details
   * @returns {Object} { riskLevel: 'LOW' | 'MEDIUM' | 'HIGH', availableBufferMinutes, requiredMinBufferMinutes }
   */
  static evaluateTransferRisk(seg1, seg2) {
    const minRequiredBufferMinutes = 10; // Minimum safe transfer time
    const availableBufferMinutes = (new Date(seg2.departureTime) - new Date(seg1.arrivalTime)) / (1000 * 60);

    let riskLevel = 'LOW';
    if (availableBufferMinutes < minRequiredBufferMinutes) {
      riskLevel = 'HIGH';
    } else if (availableBufferMinutes < minRequiredBufferMinutes + 5) {
      riskLevel = 'MEDIUM';
    }

    return {
      riskLevel,
      availableBufferMinutes,
      requiredMinBufferMinutes: minRequiredBufferMinutes
    };
  }
}

module.exports = ConnectionRiskEvaluator;
