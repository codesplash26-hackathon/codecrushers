const Stop = require("../models/Stop");

// Create a stop
const createStop = async (req, res) => {
  try {
    const { name, type, location, address } = req.body;

    if (
      !name ||
      !type ||
      !location ||
      location.latitude === undefined ||
      location.longitude === undefined
    ) {
      return res.status(400).json({
        message: "Name, type, latitude and longitude are required",
      });
    }

    const stop = await Stop.create({
      name,
      type,
      location,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Stop created successfully",
      stop,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create stop",
      error: error.message,
    });
  }
};

// Get all stops
const getStops = async (req, res) => {
  try {
    const stops = await Stop.find();

    res.json({
      success: true,
      count: stops.length,
      stops,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get stops",
      error: error.message,
    });
  }
};

// Get one stop
const getStopById = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      return res.status(404).json({
        message: "Stop not found",
      });
    }

    res.json({
      success: true,
      stop,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get stop",
      error: error.message,
    });
  }
};

// Update stop
const updateStop = async (req, res) => {
  try {
    const stop = await Stop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!stop) {
      return res.status(404).json({
        message: "Stop not found",
      });
    }

    res.json({
      success: true,
      message: "Stop updated successfully",
      stop,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update stop",
      error: error.message,
    });
  }
};

// Delete stop
const deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findByIdAndDelete(req.params.id);

    if (!stop) {
      return res.status(404).json({
        message: "Stop not found",
      });
    }

    res.json({
      success: true,
      message: "Stop deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete stop",
      error: error.message,
    });
  }
};

module.exports = {
  createStop,
  getStops,
  getStopById,
  updateStop,
  deleteStop,
};