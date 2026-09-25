const Disruption = require("../models/Disruption");
const { processDisruptionTrigger } = require("../services/reroutingService");

/**
 * Create a new disruption
 * POST /api/disruptions
 */
const createDisruption = async (req, res, next) => {
  try {
    const {
      affectedService,
      affectedRoute,
      affectedTrip,
      disruptionType,
      title,
      description,
      delayMinutes,
      startTime,
      expectedEndTime,
      severity,
      affectedStops,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Helper function to map UI types to Mongoose Enums
    const mapType = (type) => {
      if (!type) return "DELAY";
      const u = type.toString().toUpperCase();
      if (u.includes("CANCEL")) return "CANCELLATION";
      if (u.includes("ROAD") || u.includes("DIVERT")) return "ROAD_CLOSURE";
      if (u.includes("TRAFFIC")) return "TRAFFIC";
      if (u.includes("DELAY")) return "DELAY";
      return "ROUTE_INTERRUPTION";
    };

    const mapSeverity = (sev) => {
      if (!sev) return "HIGH";
      const u = sev.toString().toUpperCase();
      if (u === "LOW") return "LOW";
      if (u === "MEDIUM") return "MEDIUM";
      if (u === "CRITICAL") return "CRITICAL";
      return "HIGH";
    };

    const disruption = await Disruption.create({
      affectedService,
      affectedRoute,
      affectedTrip,
      disruptionType: mapType(disruptionType),
      title,
      description,
      delayMinutes: delayMinutes || 0,
      startTime: startTime || new Date(),
      expectedEndTime,
      severity: mapSeverity(severity),
      affectedStops: affectedStops || [],
      createdBy: req.user ? req.user._id : null,
    });

    // Populate references for full details
    const populatedDisruption = await Disruption.findById(disruption._id)
      .populate("affectedService")
      .populate("affectedRoute")
      .populate("affectedStops");

    // Async trigger of disruption handling (re-routing & notifications)
    processDisruptionTrigger(populatedDisruption).catch((err) =>
      console.error("Disruption trigger processing error:", err)
    );

    return res.status(201).json({
      success: true,
      message: "Disruption created successfully",
      data: populatedDisruption,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create disruption",
      error: error.message,
    });
  }
};

/**
 * Get all disruptions
 * GET /api/disruptions
 */
const getDisruptions = async (req, res, next) => {
  try {
    const disruptions = await Disruption.find()
      .populate("affectedService")
      .populate("affectedRoute")
      .populate("affectedStops")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: disruptions.length,
      data: disruptions,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch disruptions",
      error: error.message,
    });
  }
};

/**
 * Get active disruptions
 * GET /api/disruptions/active
 */
const getActiveDisruptions = async (req, res, next) => {
  try {
    const disruptions = await Disruption.find({ status: "ACTIVE" })
      .populate("affectedService")
      .populate("affectedRoute")
      .populate("affectedStops")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: disruptions.length,
      data: disruptions,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active disruptions",
      error: error.message,
    });
  }
};

/**
 * Get single disruption by ID
 * GET /api/disruptions/:id
 */
const getDisruptionById = async (req, res, next) => {
  try {
    const disruption = await Disruption.findById(req.params.id)
      .populate("affectedService")
      .populate("affectedRoute")
      .populate("affectedStops");

    if (!disruption) {
      return res.status(404).json({
        success: false,
        message: "Disruption not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: disruption,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch disruption",
      error: error.message,
    });
  }
};

/**
 * Update disruption details
 * PUT /api/disruptions/:id
 */
const updateDisruption = async (req, res, next) => {
  try {
    const disruption = await Disruption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("affectedService")
      .populate("affectedRoute")
      .populate("affectedStops");

    if (!disruption) {
      return res.status(404).json({
        success: false,
        message: "Disruption not found",
      });
    }

    // Trigger re-check if disruption details changed
    processDisruptionTrigger(disruption).catch((err) =>
      console.error("Disruption trigger processing error:", err)
    );

    return res.status(200).json({
      success: true,
      message: "Disruption updated successfully",
      data: disruption,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update disruption",
      error: error.message,
    });
  }
};

/**
 * Resolve a disruption
 * PATCH /api/disruptions/:id/resolve
 */
const resolveDisruption = async (req, res, next) => {
  try {
    const disruption = await Disruption.findByIdAndUpdate(
      req.params.id,
      { status: "RESOLVED", expectedEndTime: new Date() },
      { new: true }
    )
      .populate("affectedService")
      .populate("affectedRoute")
      .populate("affectedStops");

    if (!disruption) {
      return res.status(404).json({
        success: false,
        message: "Disruption not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Disruption marked as resolved",
      data: disruption,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to resolve disruption",
      error: error.message,
    });
  }
};

/**
 * Delete a disruption
 * DELETE /api/disruptions/:id
 */
const deleteDisruption = async (req, res, next) => {
  try {
    const disruption = await Disruption.findByIdAndDelete(req.params.id);

    if (!disruption) {
      return res.status(404).json({
        success: false,
        message: "Disruption not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Disruption deleted successfully",
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete disruption",
      error: error.message,
    });
  }
};

module.exports = {
  createDisruption,
  getDisruptions,
  getActiveDisruptions,
  getDisruptionById,
  updateDisruption,
  resolveDisruption,
  deleteDisruption,
};
