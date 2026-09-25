const User = require("../models/User");
const Journey = require("../models/Journey");

const {
  generateCandidateJourneys,
} = require("../services/journeyService");

const {
  rankCandidates,
} = require("../services/routeScoringService");

const {
  rerouteJourney,
} = require("../services/reroutingService");

// Search, generate and rank candidate journeys
const searchJourneyController = async (req, res, next) => {
  try {
    const { origin, destination, preference } = req.body;

    // Validate origin
    if (
      !origin ||
      origin.latitude === undefined ||
      origin.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Origin latitude and longitude are required",
      });
    }

    // Validate destination
    if (
      !destination ||
      destination.latitude === undefined ||
      destination.longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Destination latitude and longitude are required",
      });
    }

    // Get the authenticated user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Use request preference if provided.
    // Otherwise use the user's saved preference.
    const selectedPreference =
      preference || user.preferences || "fastest";

    // Generate candidate journeys
    const journeyData = await generateCandidateJourneys(
      origin,
      destination
    );

    // Rank candidates
    const rankedCandidates = rankCandidates(
      journeyData.candidates,
      selectedPreference
    );

    res.status(200).json({
      success: true,
      message: "Journey search completed successfully",
      data: {
        origin: journeyData.origin,
        destination: journeyData.destination,
        preference: selectedPreference,
        nearbyOriginStops: journeyData.nearbyOriginStops,
        nearbyDestinationStops:
          journeyData.nearbyDestinationStops,
        candidates: rankedCandidates,
      },
    });
  } catch (error) {
    if (next) return next(error);
    console.error("Journey search error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search for journey",
      error: error.message,
    });
  }
};

/**
 * Save an active journey for a passenger
 * POST /api/journeys/active
 */
const createActiveJourneyController = async (req, res, next) => {
  try {
    const { origin, destination, legs, departureTime, arrivalTime, totalTravelTime, totalFare, transfers } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: "Origin and destination are required",
      });
    }

    const journey = await Journey.create({
      user: req.user._id,
      origin,
      destination,
      departureTime,
      arrivalTime,
      totalTravelTime,
      totalFare,
      transfers: transfers || (legs ? Math.max(0, legs.length - 1) : 0),
      legs: legs || [],
      status: "active",
    });

    const populatedJourney = await Journey.findById(journey._id)
      .populate("legs.service")
      .populate("legs.route")
      .populate("legs.departureStop")
      .populate("legs.arrivalStop");

    return res.status(201).json({
      success: true,
      message: "Active journey created successfully",
      data: populatedJourney,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create active journey",
      error: error.message,
    });
  }
};

/**
 * Manually trigger re-routing for a journey
 * POST /api/journeys/:id/reroute
 */
const rerouteJourneyController = async (req, res, next) => {
  try {
    const result = await rerouteJourney(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Journey rerouting check completed",
      data: result,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reroute journey",
      error: error.message,
    });
  }
};

/**
 * Get all journeys (admin/monitoring)
 * GET /api/journeys
 */
const getJourneysController = async (req, res, next) => {
  try {
    const journeys = await Journey.find()
      .populate("user", "name email")
      .populate("legs.service")
      .populate("legs.route")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: journeys.length,
      data: journeys,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch journeys",
      error: error.message,
    });
  }
};

module.exports = {
  searchJourneyController,
  createActiveJourneyController,
  rerouteJourneyController,
  getJourneysController,
};