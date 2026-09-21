const {
  MIN_TRANSFER_TIME,
  HIGH_RISK_BUFFER,
  MEDIUM_RISK_BUFFER,
  MODE_MIN_TRANSFER_TIMES,
  RISK_LEVELS,
  RISK_SCORES,
} = require("../config/connectionRisk");

/**
 * Convert time input (ISO string, HH:mm, or Date) to minutes from midnight
 */
const parseTimeToMinutes = (timeInput) => {
  if (!timeInput) return 0;

  if (timeInput instanceof Date) {
    return timeInput.getHours() * 60 + timeInput.getMinutes();
  }

  const str = String(timeInput).trim();

  // ISO string check e.g. "2026-09-21T08:30:00"
  if (str.includes("T")) {
    const dateObj = new Date(str);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.getHours() * 60 + dateObj.getMinutes();
    }
  }

  // HH:mm or HH:mm:ss format
  if (str.includes(":")) {
    const parts = str.split(":").map(Number);
    return parts[0] * 60 + (parts[1] || 0);
  }

  // Fallback timestamp in ms or numeric minutes
  const num = Number(str);
  if (!isNaN(num)) {
    if (num > 1440) {
      // Milliseconds timestamp
      const dateObj = new Date(num);
      return dateObj.getHours() * 60 + dateObj.getMinutes();
    }
    return num;
  }

  return 0;
};

/**
 * Calculate transfer time in minutes between arrival of prev segment and departure of next segment
 */
const calculateTransferTime = (arrivalTime, departureTime) => {
  const arrMins = parseTimeToMinutes(arrivalTime);
  const depMins = parseTimeToMinutes(departureTime);

  let diff = depMins - arrMins;
  // Handle overnight wrapping (e.g. 23:50 arrival, 00:20 departure)
  if (diff < -720) {
    diff += 1440;
  }

  return diff;
};

/**
 * Calculate minimum required transfer time based on modes and locations
 */
const calculateRequiredTransferTime = (previousSegment = {}, nextSegment = {}) => {
  const prevMode = (previousSegment.mode || previousSegment.type || "bus").toLowerCase();
  const nextMode = (nextSegment.mode || nextSegment.type || "bus").toLowerCase();

  const prevMin = MODE_MIN_TRANSFER_TIMES[prevMode] || MIN_TRANSFER_TIME;
  const nextMin = MODE_MIN_TRANSFER_TIMES[nextMode] || MIN_TRANSFER_TIME;

  let required = Math.max(prevMin, nextMin);

  // If different modes (e.g. Bus -> Train), add a 2-minute intermodal walking/station change buffer
  if (prevMode !== nextMode && prevMode !== "walking" && nextMode !== "walking") {
    required += 2;
  }

  return required;
};

/**
 * Calculate risk evaluation from transfer time and required transfer time
 */
const calculateConnectionRisk = (transferTimeMinutes, requiredTransferTimeMinutes) => {
  const bufferMinutes = transferTimeMinutes - requiredTransferTimeMinutes;

  if (transferTimeMinutes <= 0) {
    return {
      transferTimeMinutes,
      requiredTransferTimeMinutes,
      bufferMinutes,
      riskLevel: RISK_LEVELS.MISSED,
      riskScore: RISK_SCORES.MISSED,
      isFeasible: false,
      reason: "Connection missed (Departure occurs before or at arrival time)",
    };
  }

  if (transferTimeMinutes < requiredTransferTimeMinutes) {
    return {
      transferTimeMinutes,
      requiredTransferTimeMinutes,
      bufferMinutes,
      riskLevel: RISK_LEVELS.MISSED,
      riskScore: 95,
      isFeasible: false,
      reason: "Insufficient transfer time",
    };
  }

  if (bufferMinutes < HIGH_RISK_BUFFER) {
    return {
      transferTimeMinutes,
      requiredTransferTimeMinutes,
      bufferMinutes,
      riskLevel: RISK_LEVELS.HIGH,
      riskScore: RISK_SCORES.HIGH,
      isFeasible: true,
      reason: "Tight transfer window - high connection risk",
    };
  }

  if (bufferMinutes < MEDIUM_RISK_BUFFER) {
    return {
      transferTimeMinutes,
      requiredTransferTimeMinutes,
      bufferMinutes,
      riskLevel: RISK_LEVELS.MEDIUM,
      riskScore: RISK_SCORES.MEDIUM,
      isFeasible: true,
      reason: "Moderate transfer buffer available",
    };
  }

  return {
    transferTimeMinutes,
    requiredTransferTimeMinutes,
    bufferMinutes,
    riskLevel: RISK_LEVELS.LOW,
    riskScore: RISK_SCORES.LOW,
    isFeasible: true,
    reason: "Sufficient transfer buffer",
  };
};

/**
 * Evaluate connection between two journey segments
 */
const evaluateConnection = (previousSegment, nextSegment) => {
  if (!previousSegment || !nextSegment) {
    throw new Error("Both previousSegment and nextSegment are required for connection risk evaluation");
  }

  const arrivalTime = previousSegment.arrivalTime || previousSegment.arrivalTimeStr;
  const departureTime = nextSegment.departureTime || nextSegment.departureTimeStr;

  if (!arrivalTime || !departureTime) {
    throw new Error("previousSegment must have arrivalTime and nextSegment must have departureTime");
  }

  const transferTime = calculateTransferTime(arrivalTime, departureTime);
  const requiredTime = calculateRequiredTransferTime(previousSegment, nextSegment);

  return calculateConnectionRisk(transferTime, requiredTime);
};

module.exports = {
  parseTimeToMinutes,
  calculateTransferTime,
  calculateRequiredTransferTime,
  calculateConnectionRisk,
  evaluateConnection,
};
