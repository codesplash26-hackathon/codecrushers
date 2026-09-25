const mongoose = require("mongoose");
const Route = require("../models/Route");
const TransportService = require("../models/TransportService");

// Create a route
const createRoute = async (req, res) => {
  try {
    const {
      service,
      routeNumber,
      name,
      stops,
      active,
      type,
      mode,
      baseFare,
      fare,
      estimatedDurationMinutes,
      departure,
      arrival,
    } = req.body;

    const routeTitle = name || req.body.routeName;
    if (!routeTitle) {
      return res.status(400).json({
        message: "Route name is required",
      });
    }

    const routeType = (type || mode || "bus").toLowerCase();

    // Link or auto-assign a TransportService
    let serviceId = service;
    if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
      let matchedService = await TransportService.findOne({
        type: routeType.includes("train") ? "train" : "bus",
      });
      if (!matchedService) {
        matchedService = await TransportService.findOne();
      }
      if (!matchedService) {
        matchedService = await TransportService.create({
          name: routeType.includes("train") ? "Sri Lanka Railways" : "SLTB Main Service",
          type: routeType.includes("train") ? "train" : "bus",
          operator: "National Transport",
          status: "active",
        });
      }
      serviceId = matchedService._id;
    }

    // Process stops if provided as array of IDs
    const validStops = Array.isArray(stops)
      ? stops.filter((s) => mongoose.Types.ObjectId.isValid(s))
      : [];

    const numFare = Number(baseFare || (typeof fare === 'string' ? fare.replace(/[^0-9.]/g, '') : fare)) || 150;

    const newRoute = await Route.create({
      service: serviceId,
      routeNumber: routeNumber || `R-${Math.floor(100 + Math.random() * 900)}`,
      name: routeTitle,
      stops: validStops,
      active: active !== undefined ? active : true,
      type: routeType.includes("train") ? "train" : "bus",
      baseFare: numFare,
      estimatedDurationMinutes: Number(estimatedDurationMinutes) || 120,
      departure: departure || "6:00 AM",
      arrival: arrival || "8:30 AM",
    });

    const populatedRoute = await Route.findById(newRoute._id)
      .populate("service")
      .populate("stops");

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      route: populatedRoute,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create route",
      error: error.message,
    });
  }
};

// Get all routes
const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("service")
      .populate("stops");

    res.json({
      success: true,
      count: routes.length,
      routes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get routes",
      error: error.message,
    });
  }
};

// Get one route
const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate("service")
      .populate("stops");

    if (!route) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      route,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get route",
      error: error.message,
    });
  }
};

// Update route
const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("service")
      .populate("stops");

    if (!route) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      message: "Route updated successfully",
      route,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update route",
      error: error.message,
    });
  }
};

// Delete route
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        message: "Route not found",
      });
    }

    res.json({
      success: true,
      message: "Route deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete route",
      error: error.message,
    });
  }
};

module.exports = {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
};