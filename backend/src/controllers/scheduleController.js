const Schedule = require("../models/Schedule");

// Create a schedule
const createSchedule = async (req, res) => {
  try {
    const {
      route,
      departureStop,
      arrivalStop,
      departureTime,
      arrivalTime,
      fare,
      travelTime,
    } = req.body;

    if (
      !route ||
      !departureStop ||
      !arrivalStop ||
      !departureTime ||
      !arrivalTime ||
      fare === undefined ||
      travelTime === undefined
    ) {
      return res.status(400).json({
        message: "All schedule fields are required",
      });
    }

    const schedule = await Schedule.create({
      route,
      departureStop,
      arrivalStop,
      departureTime,
      arrivalTime,
      fare,
      travelTime,
    });

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create schedule",
      error: error.message,
    });
  }
};

// Get all schedules
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("route")
      .populate("departureStop")
      .populate("arrivalStop");

    res.json({
      success: true,
      count: schedules.length,
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get schedules",
      error: error.message,
    });
  }
};

// Get one schedule
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate("route")
      .populate("departureStop")
      .populate("arrivalStop");

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }

    res.json({
      success: true,
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get schedule",
      error: error.message,
    });
  }
};

// Update schedule
const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("route")
      .populate("departureStop")
      .populate("arrivalStop");

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }

    res.json({
      success: true,
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update schedule",
      error: error.message,
    });
  }
};

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }

    res.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete schedule",
      error: error.message,
    });
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};