const Journey = require("../models/Journey");
const User = require("../models/User");
const { detectAffectedJourney, fetchActiveDisruptions } = require("./disruptionService");
const { evaluateConnection, parseTimeToMinutes } = require("./connectionRiskService");
const { generateCandidateJourneys } = require("./journeyService");
const { rankCandidates } = require("./routeScoringService");
const {
  createDelayNotification,
  createConnectionRiskNotification,
  createJourneyChangeNotification,
  createAlternativeRouteNotification,
} = require("./notificationService");

/**
 * Add minutes to HH:mm or ISO string time
 */
const addMinutesToTime = (timeStr, minutesToAdd) => {
  if (!timeStr) return timeStr;
  const currentMins = parseTimeToMinutes(timeStr);
  const newMins = (currentMins + minutesToAdd) % 1440;
  const hours = String(Math.floor(newMins / 60)).padStart(2, "0");
  const mins = String(newMins % 60).padStart(2, "0");

  if (String(timeStr).includes("T")) {
    const parts = String(timeStr).split("T");
    return `${parts[0]}T${hours}:${mins}:00`;
  }
  return `${hours}:${mins}`;
};

/**
 * Calculate updated leg times applying delay minutes
 */
const calculateUpdatedJourney = (journey, impactData = {}) => {
  if (!journey || !journey.legs || journey.legs.length === 0) {
    return journey;
  }

  const segments = (impactData && impactData.affectedSegments) || [];

  const updatedLegs = journey.legs.map((leg, idx) => {
    const affected = segments.find((seg) => seg.legIndex === idx);
    const delay = affected ? affected.delayMinutes : 0;

    const newArrivalTime = delay > 0 ? addMinutesToTime(leg.arrivalTime, delay) : leg.arrivalTime;
    const newDepartureTime = delay > 0 && idx > 0 ? addMinutesToTime(leg.departureTime, delay) : leg.departureTime;

    return {
      ...(leg.toObject ? leg.toObject() : leg),
      arrivalTime: newArrivalTime,
      departureTime: newDepartureTime,
      delayMinutes: delay,
    };
  });

  return {
    ...(journey.toObject ? journey.toObject() : journey),
    legs: updatedLegs,
  };
};

/**
 * Re-evaluate connection risk between legs
 */
const checkRemainingConnections = (journey) => {
  if (!journey || !journey.legs || journey.legs.length <= 1) {
    return {
      isFeasible: true,
      riskLevel: "LOW",
      riskScore: 10,
      evaluations: [],
    };
  }

  let worstRiskScore = 0;
  let worstRiskLevel = "LOW";
  let overallFeasible = true;
  const evaluations = [];

  for (let i = 0; i < journey.legs.length - 1; i++) {
    const prevLeg = journey.legs[i];
    const nextLeg = journey.legs[i + 1];

    const evaluation = evaluateConnection(
      { mode: prevLeg.service ? prevLeg.service.type : "bus", arrivalTime: prevLeg.arrivalTime },
      { mode: nextLeg.service ? nextLeg.service.type : "train", departureTime: nextLeg.departureTime }
    );

    evaluations.push(evaluation);

    if (!evaluation.isFeasible) {
      overallFeasible = false;
    }

    if (evaluation.riskScore > worstRiskScore) {
      worstRiskScore = evaluation.riskScore;
      worstRiskLevel = evaluation.riskLevel;
    }
  }

  return {
    isFeasible: overallFeasible,
    riskLevel: worstRiskLevel,
    riskScore: worstRiskScore,
    evaluations,
  };
};

/**
 * Generate alternative candidate journeys using core journeyService
 */
const generateAlternativeJourneys = async (origin, destination) => {
  const result = await generateCandidateJourneys(origin, destination);
  return result ? result.candidates : [];
};

/**
 * Score alternative journeys using core routeScoringService
 */
const scoreAlternativeJourneys = (alternatives, preference = "fastest") => {
  return rankCandidates(alternatives, preference);
};

/**
 * Complete re-routing pipeline for a journey ID
 */
const rerouteJourney = async (journeyId) => {
  const journey = await Journey.findById(journeyId)
    .populate({ path: "legs.service" })
    .populate({ path: "legs.route" })
    .populate({ path: "legs.departureStop" })
    .populate({ path: "legs.arrivalStop" });

  if (!journey) {
    throw new Error("Journey not found");
  }

  const activeDisruptions = await fetchActiveDisruptions();
  const impactData = await detectAffectedJourney(journey, activeDisruptions);

  if (!impactData.affected) {
    return {
      originalJourneyId: journey._id,
      affected: false,
      reason: "No active disruptions affect this journey",
      connectionStatus: journey.connectionRiskLevel || "LOW",
      rerouted: false,
      alternatives: [],
    };
  }

  // Calculate updated times with delay applied
  const updatedJourney = calculateUpdatedJourney(journey, impactData);
  const connectionCheck = checkRemainingConnections(updatedJourney);

  const primaryImpact = impactData.affectedSegments[0];
  const delayMinutes = impactData.totalDelayMinutes;

  // Send initial delay notification
  await createDelayNotification(
    journey.user,
    journey._id,
    primaryImpact ? primaryImpact.disruptionId : null,
    primaryImpact ? primaryImpact.disruptionTitle : "Service",
    delayMinutes
  );

  let rerouted = false;
  let alternatives = [];
  let selectedAlternative = null;

  if (!connectionCheck.isFeasible || connectionCheck.riskLevel === "HIGH" || connectionCheck.riskLevel === "MISSED") {
    // Notify about connection risk
    await createConnectionRiskNotification(
      journey.user,
      journey._id,
      "bus",
      "train",
      connectionCheck.riskLevel
    );

    // Fetch user preference
    const user = await User.findById(journey.user);
    const userPref = user ? user.preferences : "fastest";

    // Generate alternative routes
    const rawAlternatives = await generateAlternativeJourneys(journey.origin, journey.destination);
    const scoredAlternatives = scoreAlternativeJourneys(rawAlternatives, userPref);

    alternatives = scoredAlternatives;

    if (alternatives.length > 0) {
      selectedAlternative = alternatives[0];
      rerouted = true;

      await createAlternativeRouteNotification(journey.user, journey._id, alternatives.length);
      await createJourneyChangeNotification(journey.user, journey._id, primaryImpact ? primaryImpact.disruptionTitle : "transport disruption");

      // Update journey in DB
      journey.status = "rerouted";
      journey.isAffectedByDisruption = true;
      journey.connectionRiskLevel = connectionCheck.riskLevel;
      journey.connectionRiskScore = connectionCheck.riskScore;
      await journey.save();
    }
  } else {
    // Updated but still feasible
    journey.connectionRiskLevel = connectionCheck.riskLevel;
    journey.connectionRiskScore = connectionCheck.riskScore;
    journey.isAffectedByDisruption = true;
    await journey.save();
  }

  return {
    originalJourneyId: journey._id,
    affected: true,
    reason: `Delay of ${delayMinutes} minutes (${primaryImpact ? primaryImpact.disruptionTitle : "Disruption"})`,
    connectionStatus: connectionCheck.riskLevel,
    riskScore: connectionCheck.riskScore,
    isFeasible: connectionCheck.isFeasible,
    rerouted,
    alternatives,
    selectedAlternative,
  };
};

/**
 * Process all active journeys when a disruption is created/updated
 */
const processDisruptionTrigger = async (disruption) => {
  if (!disruption) return;

  const activeJourneys = await Journey.find({ status: "active" });

  for (const journey of activeJourneys) {
    const impact = await detectAffectedJourney(journey, [disruption]);
    if (impact.affected) {
      await rerouteJourney(journey._id);
    }
  }
};

module.exports = {
  detectAffectedJourney,
  calculateUpdatedJourney,
  checkRemainingConnections,
  generateAlternativeJourneys,
  scoreAlternativeJourneys,
  rerouteJourney,
  processDisruptionTrigger,
};
