const User = require("../models/User");

const {
  generateCandidateJourneys,
} = require("../services/journeyService");

const {
  rankCandidates,
} = require("../services/routeScoringService");

// Search, generate and rank candidate journeys
const searchJourneyController = async (req, res) => {
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
    console.error("Journey search error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search for journey",
      error: error.message,
    });
  }
};

module.exports = {
  searchJourneyController,
};