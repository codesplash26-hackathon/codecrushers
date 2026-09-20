const { searchJourney } = require("../services/journeyService");

// Search for possible journeys
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
        message: "Destination latitude and longitude are required",
      });
    }

    const journeyData = await searchJourney(origin, destination);

    res.status(200).json({
      success: true,
      message: "Journey search completed successfully",
      data: journeyData,
    });
  } catch (error) {
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