const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },

    departureStop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stop",
      required: true,
    },

    arrivalStop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stop",
      required: true,
    },

    departureTime: {
      type: String,
      required: true,
    },

    arrivalTime: {
      type: String,
      required: true,
    },

    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    travelTime: {
      type: Number,
      required: true,
      min: 0,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportService",
    },

    operatingDays: [
      {
        type: String,
      },
    ],

    days: {
      type: String,
      default: "Mon-Sun",
    },

    stopsCount: {
      type: Number,
      default: 10,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Schedule", scheduleSchema);