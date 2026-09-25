const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportService",
      required: true,
    },

    routeNumber: {
      type: String,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    stops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stop",
      },
    ],

    type: {
      type: String,
      default: "bus",
    },

    baseFare: {
      type: Number,
      default: 150,
    },

    estimatedDurationMinutes: {
      type: Number,
      default: 120,
    },

    departure: {
      type: String,
    },

    arrival: {
      type: String,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Route", routeSchema);