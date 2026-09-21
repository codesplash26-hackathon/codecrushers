const {
  generateCandidateJourneys,
} = require("../services/journeyService");

// Search and generate candidate journeys
const searchJourneyController = async (req, res) => {
  try {
    const { origin, destination } = req.body;

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

    const journeyData = await generateCandidateJourneys(
      origin,
      destination
    );

    res.status(200).json({
      success: true,
      message: "Candidate journeys generated successfully",
      data: journeyData,
    });
  } catch (error) {
    console.error("Journey search error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate candidate journeys",
      error: error.message,
    });
  }
};

module.exports = {
  searchJourneyController,
};