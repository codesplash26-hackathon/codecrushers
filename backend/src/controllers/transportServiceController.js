const TransportService = require("../models/TransportService");

// Create a transportation service
const createTransportService = async (req, res) => {
  try {
    const { name, type, operator, status } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Name and type are required",
      });
    }

    const service = await TransportService.create({
      name,
      type,
      operator,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Transportation service created successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create transportation service",
      error: error.message,
    });
  }
};

// Get all transportation services
const getTransportServices = async (req, res) => {
  try {
    const services = await TransportService.find();

    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get transportation services",
      error: error.message,
    });
  }
};

// Get one transportation service
const getTransportServiceById = async (req, res) => {
  try {
    const service = await TransportService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Transportation service not found",
      });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get transportation service",
      error: error.message,
    });
  }
};

// Update transportation service
const updateTransportService = async (req, res) => {
  try {
    const service = await TransportService.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({
        message: "Transportation service not found",
      });
    }

    res.json({
      success: true,
      message: "Transportation service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update transportation service",
      error: error.message,
    });
  }
};

// Delete transportation service
const deleteTransportService = async (req, res) => {
  try {
    const service = await TransportService.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Transportation service not found",
      });
    }

    res.json({
      success: true,
      message: "Transportation service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete transportation service",
      error: error.message,
    });
  }
};

module.exports = {
  createTransportService,
  getTransportServices,
  getTransportServiceById,
  updateTransportService,
  deleteTransportService,
};