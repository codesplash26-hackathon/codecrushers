const mongoose = require("mongoose");

const driverApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      unique: true,
      sparse: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    nic: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ["Taxi", "Tuk-tuk", "Bus"],
      default: "Taxi",
    },
    vehicleNo: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleModel: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    submitted: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-assign sequential applicationId (e.g. DAR01, DAR02, ...)
driverApplicationSchema.pre("save", async function (next) {
  if (!this.applicationId) {
    try {
      const last = await this.constructor.findOne().sort({ createdAt: -1 });
      let nextNum = 1;
      if (last && last.applicationId && last.applicationId.startsWith("DAR")) {
        const parsed = parseInt(last.applicationId.replace("DAR", ""), 10);
        if (!isNaN(parsed)) nextNum = parsed + 1;
      }
      this.applicationId = `DAR${String(nextNum).padStart(2, "0")}`;
    } catch {
      this.applicationId = `DAR${Date.now().toString().slice(-4)}`;
    }
  }
  if (typeof next === "function") next();
});

module.exports = mongoose.model("DriverApplication", driverApplicationSchema);
