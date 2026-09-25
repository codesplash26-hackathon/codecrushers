const mongoose = require("mongoose");
const Schedule = require("../models/Schedule");
const Route = require("../models/Route");
const Stop = require("../models/Stop");
const TransportService = require("../models/TransportService");

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
      service,
      operatingDays,
      days,
      stops,
      stopsCount,
      isActive,
      status,
    } = req.body;

    const depTime = departureTime || "06:00 AM";
    const arrTime = arrivalTime || "08:30 AM";

    // 1. Resolve Route
    let routeId = route;
    if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) {
      const searchName = typeof route === "string" && route.trim() ? route.trim() : "Main Transit Route";
      let foundRoute = await Route.findOne({ name: searchName });
      if (!foundRoute) {
        foundRoute = await Route.findOne({ name: { $regex: new RegExp(searchName.split(" ")[0] || "Route", "i") } });
      }
      if (!foundRoute) {
        foundRoute = await Route.findOne();
      }
      if (!foundRoute) {
        let defaultService = await TransportService.findOne();
        if (!defaultService) {
          defaultService = await TransportService.create({
            name: "SLTB City Transit",
            type: "bus",
            operator: "SLTB",
            status: "active",
          });
        }
        foundRoute = await Route.create({
          name: searchName,
          service: defaultService._id,
          routeNumber: `R-${Math.floor(100 + Math.random() * 900)}`,
        });
      }
      routeId = foundRoute._id;
    }

    // 2. Resolve Departure and Arrival Stops
    let depStopId = departureStop;
    let arrStopId = arrivalStop;

    if (!depStopId || !mongoose.Types.ObjectId.isValid(depStopId) || !arrStopId || !mongoose.Types.ObjectId.isValid(arrStopId)) {
      const allStops = await Stop.find().limit(2);
      if (allStops.length >= 2) {
        if (!depStopId || !mongoose.Types.ObjectId.isValid(depStopId)) depStopId = allStops[0]._id;
        if (!arrStopId || !mongoose.Types.ObjectId.isValid(arrStopId)) arrStopId = allStops[1]._id;
      } else if (allStops.length === 1) {
        if (!depStopId || !mongoose.Types.ObjectId.isValid(depStopId)) depStopId = allStops[0]._id;
        if (!arrStopId || !mongoose.Types.ObjectId.isValid(arrStopId)) {
          const newStop = await Stop.create({
            name: "Colombo Terminal",
            type: "terminal",
            location: { latitude: 6.9344, longitude: 79.8428 },
          });
          arrStopId = newStop._id;
        }
      } else {
        const s1 = await Stop.create({
          name: "Kandy Central Station",
          type: "terminal",
          location: { latitude: 7.2905, longitude: 80.6337 },
        });
        const s2 = await Stop.create({
          name: "Colombo Fort Station",
          type: "terminal",
          location: { latitude: 6.9344, longitude: 79.8428 },
        });
        depStopId = s1._id;
        arrStopId = s2._id;
      }
    }

    // 3. Resolve Service
    let serviceId = service;
    if (serviceId && !mongoose.Types.ObjectId.isValid(serviceId)) {
      const foundServ = await TransportService.findOne({ name: { $regex: new RegExp(service.trim(), "i") } });
      serviceId = foundServ ? foundServ._id : undefined;
    }

    // 4. Resolve Fare and TravelTime
    const numFare = Number(typeof fare === "string" ? fare.replace(/[^0-9.]/g, "") : fare) || 150;
    const numTravelTime = Number(travelTime) || 120;

    const activeStatus = isActive !== undefined ? Boolean(isActive) : (status !== "Inactive");

    const schedule = await Schedule.create({
      route: routeId,
      departureStop: depStopId,
      arrivalStop: arrStopId,
      departureTime: depTime,
      arrivalTime: arrTime,
      fare: numFare,
      travelTime: numTravelTime,
      service: serviceId,
      operatingDays: Array.isArray(operatingDays) ? operatingDays : (days ? days.split(/[-,\s]+/) : ["Mon", "Sun"]),
      days: days || "Mon-Sun",
      stopsCount: Number(stopsCount || stops) || 10,
      isActive: activeStatus,
      status: activeStatus ? "Active" : "Inactive",
    });

    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate("route")
      .populate("departureStop")
      .populate("arrivalStop")
      .populate("service");

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      schedule: populatedSchedule,
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
      .populate("arrivalStop")
      .populate("service");

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