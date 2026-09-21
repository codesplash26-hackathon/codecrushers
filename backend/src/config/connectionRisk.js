module.exports = {
  // Default transfer thresholds in minutes
  MIN_TRANSFER_TIME: 5,
  HIGH_RISK_BUFFER: 3,
  MEDIUM_RISK_BUFFER: 8,

  // Mode-specific minimum required transfer times (in minutes)
  MODE_MIN_TRANSFER_TIMES: {
    bus: 5,
    train: 7,
    taxi: 3,
    three_wheeler: 3,
    walking: 2,
  },

  // Risk levels
  RISK_LEVELS: {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    MISSED: "MISSED",
  },

  // Risk scores (normalized 0 - 100)
  RISK_SCORES: {
    LOW: 10,
    MEDIUM: 40,
    HIGH: 80,
    MISSED: 100,
  },
};
