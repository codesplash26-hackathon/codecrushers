const Stop = require("../models/Stop");

// Create a stop
const createStop = async (req, res) => {
  try {
    const { name, type, location, address, lat, lng, latitude, longitude, routes, status } = req.body;

    const stopName = name || req.body.stopName;
    if (!stopName) {
      return res.status(400).json({
        message: "Stop name is required",
      });
    }

    // Determine latitude and longitude flexibly
    let latVal = 7.2905;
    let lngVal = 80.6337;

    if (location && location.latitude !== undefined && location.longitude !== undefined) {
      latVal = Number(location.latitude);
      lngVal = Number(location.longitude);
    } else if (location && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
      lngVal = Number(location.coordinates[0]);
      latVal = Number(location.coordinates[1]);
    } else if (lat !== undefined && lng !== undefined) {
      latVal = Number(lat);
      lngVal = Number(lng);
    } else if (latitude !== undefined && longitude !== undefined) {
      latVal = Number(latitude);
      lngVal = Number(longitude);
    } else if (typeof req.body.latlng === "string") {
      const parts = req.body.latlng.split(",");
      if (parts.length >= 2) {
        latVal = Number(parts[0].trim());
        lngVal = Number(parts[1].trim());
      }
    }

    // Map type to valid Stop enum
    let stopType = "bus_stop";
    const rawType = (type || "").toLowerCase();
    if (rawType.includes("train") || rawType.includes("railway")) {
      stopType = "railway_station";
    } else if (rawType.includes("both") || rawType.includes("terminal")) {
      stopType = "terminal";
    } else if (rawType.includes("bus")) {
      stopType = "bus_stop";
    }

    const stop = await Stop.create({
      name: stopName,
      type: stopType,
      location: {
        latitude: latVal,
        longitude: lngVal,
      },
      coordinates: [lngVal, latVal],
      address: address || `${stopName}, Sri Lanka`,
      routesCount: Number(routes) || 8,
      status: status || "Active",
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