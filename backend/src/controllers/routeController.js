const Route = require("../models/Route");

// Create a route
const createRoute = async (req, res) => {
  try {
    const { service, routeNumber, name, stops, active } = req.body;

    if (!service || !name) {
      return res.status(400).json({
        message: "Service and route name are required",
      });
    }

    const route = await Route.create({
      service,
      routeNumber,
      name,
      stops,
      active,
    });

    res.status(201).json({
      success: true,
      message: "Route created successfully",
      route,
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