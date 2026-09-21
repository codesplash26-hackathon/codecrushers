const { evaluateConnection } = require("../services/connectionRiskService");

/**
 * Evaluate connection risk between two segments
 * POST /api/connection-risk/evaluate
 */
const evaluateConnectionRiskController = async (req, res, next) => {
  try {
    const { previousSegment, nextSegment } = req.body;

    if (!previousSegment || typeof previousSegment !== "object") {
      return res.status(400).json({
        success: false,
        message: "previousSegment object is required",
      });
    }

    if (!nextSegment || typeof nextSegment !== "object") {
      return res.status(400).json({
        success: false,
        message: "nextSegment object is required",
      });
    }

    if (!previousSegment.arrivalTime) {
      return res.status(400).json({
        success: false,
        message: "previousSegment.arrivalTime is required",
      });
    }

    if (!nextSegment.departureTime) {
      return res.status(400).json({
        success: false,
        message: "nextSegment.departureTime is required",
      });
    }

    const evaluation = evaluateConnection(previousSegment, nextSegment);

    return res.status(200).json({
      success: true,
      message: "Connection risk evaluated successfully",
      data: evaluation,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate connection risk",
      error: error.message,
    });
  }
};

module.exports = {
  evaluateConnectionRiskController,
};
