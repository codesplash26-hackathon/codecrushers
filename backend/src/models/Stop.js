const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "bus_stop",
        "railway_station",
        "terminal",
        "both",
        "bus",
        "train",
        "bus terminal",
        "train station",
        "other",
      ],
      required: true,
      lowercase: true,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    coordinates: {
      type: [Number], // [lng, lat]
    },

    routesCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Active",
    },

    address: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stop", stopSchema);