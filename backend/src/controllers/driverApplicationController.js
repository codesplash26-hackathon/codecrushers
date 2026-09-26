const DriverApplication = require("../models/DriverApplication");
const User = require("../models/User");
const TransportService = require("../models/TransportService");
const Notification = require("../models/Notification");
const {
  NOTIFICATION_TYPES,
  NOTIFICATION_PRIORITY,
} = require("../config/constants");

const defaultApplications = [
  {
    applicationId: "DAR01",
    fullName: "Kasun Perera",
    phone: "+94 77 123 4567",
    nic: "982345678V",
    licenseNumber: "B 1234567",
    vehicleType: "Taxi",
    vehicleNo: "WP CAB-1234",
    vehicleModel: "Toyota Prius",
    color: "Silver",
    status: "Pending",
    submitted: "2024-01-15",
  },
  {
    applicationId: "DAR02",
    fullName: "Nimal Silva",
    phone: "+94 71 234 5678",
    nic: "871234567V",
    licenseNumber: "B 7654321",
    vehicleType: "Tuk-tuk",
    vehicleNo: "WP TUK-3321",
    vehicleModel: "Bajaj RE 4S",
    color: "Red",
    status: "Approved",
    submitted: "2024-01-14",
  },
  {
    applicationId: "DAR03",
    fullName: "Priya Fernando",
    phone: "+94 76 345 6789",
    nic: "951234567V",
    licenseNumber: "B 5432167",
    vehicleType: "Taxi",
    vehicleNo: "WP CAB-5512",
    vehicleModel: "Suzuki Alto",
    color: "White",
    status: "Rejected",
    submitted: "2024-01-13",
  },
  {
    applicationId: "DAR04",
    fullName: "Roshan Jayawardena",
    phone: "+94 77 456 7890",
    nic: "921234567V",
    licenseNumber: "B 9876543",
    vehicleType: "Tuk-tuk",
    vehicleNo: "CP TUK-0098",
    vehicleModel: "TVS King",
    color: "Blue",
    status: "Pending",
    submitted: "2024-01-12",
  },
];

/**
 * Submit a new driver application from mobile app
 * POST /api/driver-applications
 */
const createApplication = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      nic,
      licenseNumber,
      vehicleType,
      vehicleNo,
      vehicleModel,
      color,
      email,
      userId,
    } = req.body;

    if (!fullName || !phone || !vehicleNo) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone, and vehicle number are required.",
      });
    }

    // Identify user
    let user = null;
    if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    } else if (userId) {
      user = await User.findById(userId).catch(() => null);
    }

    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      user = await User.findOne({
        $or: [{ name: fullName }, { phone: phone }],
      });
    }

    // Check if an existing application exists for this user, vehicle, or name
    let existingApp = null;
    if (user) {
      existingApp = await DriverApplication.findOne({ user: user._id });
    }
    if (!existingApp && vehicleNo) {
      existingApp = await DriverApplication.findOne({ vehicleNo: vehicleNo.trim() });
    }

    let application;
    if (existingApp) {
      existingApp.fullName = fullName;
      existingApp.phone = phone;
      existingApp.nic = nic || existingApp.nic;
      existingApp.licenseNumber = licenseNumber || existingApp.licenseNumber;
      existingApp.vehicleType = vehicleType || existingApp.vehicleType;
      existingApp.vehicleNo = vehicleNo;
      existingApp.vehicleModel = vehicleModel || existingApp.vehicleModel;
      existingApp.color = color || existingApp.color;
      existingApp.status = "Pending";
      existingApp.submitted = new Date().toISOString().split("T")[0];
      if (user) existingApp.user = user._id;
      application = await existingApp.save();
    } else {
      // Generate next applicationId explicitly
      let nextAppId = "DAR01";
      try {
        const lastApp = await DriverApplication.findOne().sort({ createdAt: -1 });
        if (lastApp && lastApp.applicationId && lastApp.applicationId.startsWith("DAR")) {
          const parsed = parseInt(lastApp.applicationId.replace("DAR", ""), 10);
          if (!isNaN(parsed)) nextAppId = `DAR${String(parsed + 1).padStart(2, "0")}`;
        } else {
          const c = await DriverApplication.countDocuments();
          nextAppId = `DAR${String(c + 1).padStart(2, "0")}`;
        }
      } catch {
        nextAppId = `DAR${Date.now().toString().slice(-4)}`;
      }

      application = await DriverApplication.create({
        applicationId: nextAppId,
        user: user ? user._id : undefined,
        fullName,
        phone,
        nic,
        licenseNumber,
        vehicleType: vehicleType || "Taxi",
        vehicleNo,
        vehicleModel,
        color,
        status: "Pending",
        submitted: new Date().toISOString().split("T")[0],
      });
    }

    // Update user's driverStatus to pending
    if (user) {
      user.driverStatus = "pending";
      user.driverDetails = {
        vehicleType: application.vehicleType,
        vehicleNo: application.vehicleNo,
        vehicleModel: application.vehicleModel,
        phone: application.phone,
        isOnline: false,
      };
      await user.save();
    }

    // Create an Admin Notification so the Admin Dashboard bell reflects the new application
    try {
      let adminUser = await User.findOne({ role: { $in: ["admin", "super_admin"] } });
      if (!adminUser) {
        adminUser = user || (await User.findOne());
      }
      if (adminUser) {
        await Notification.create({
          user: adminUser._id,
          type: NOTIFICATION_TYPES.JOURNEY_CHANGE,
          title: `New Driver Application (${application.applicationId})`,
          message: `${application.fullName} applied for ${application.vehicleType} (${application.vehicleNo}). Review pending.`,
          priority: NOTIFICATION_PRIORITY.HIGH,
          isRead: false,
        });
      }
    } catch (notifErr) {
      console.warn("Notification creation error:", notifErr?.message);
    }

    return res.status(201).json({
      success: true,
      message: "Driver application submitted successfully.",
      data: application,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit driver application",
      error: error.message,
    });
  }
};

/**
 * Get all driver applications for Admin console
 * GET /api/driver-applications
 */
const getApplications = async (req, res, next) => {
  try {
    const totalCount = await DriverApplication.countDocuments();
    if (totalCount === 0) {
      // Auto-populate default applications from Photo 1 if empty
      try {
        await DriverApplication.insertMany(defaultApplications);
      } catch {
        // ignore duplicate
      }
    }

    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const applications = await DriverApplication.find(filter)
      .populate("user", "name email role driverStatus")
      .sort({ createdAt: -1 });

    const pendingCount = await DriverApplication.countDocuments({ status: "Pending" });
    const approvedCount = await DriverApplication.countDocuments({ status: "Approved" });
    const rejectedCount = await DriverApplication.countDocuments({ status: "Rejected" });

    return res.status(200).json({
      success: true,
      count: applications.length,
      pendingCount,
      approvedCount,
      rejectedCount,
      data: applications,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch driver applications",
      error: error.message,
    });
  }
};

/**
 * Get status of driver application for the current user
 * GET /api/driver-applications/my-status
 */
const getMyApplicationStatus = async (req, res, next) => {
  try {
    const { phone, email, userId } = req.query;
    let user = null;

    if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    } else if (userId) {
      user = await User.findById(userId).catch(() => null);
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    let application = null;
    if (user) {
      application = await DriverApplication.findOne({ user: user._id }).sort({ createdAt: -1 });
    }
    if (!application && email) {
      const u = await User.findOne({ email: email.toLowerCase() });
      if (u) {
        application = await DriverApplication.findOne({ user: u._id }).sort({ createdAt: -1 });
      }
    }
    if (!application && phone && phone !== "+94 77 123 4567") {
      application = await DriverApplication.findOne({ phone }).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      data: application,
      userRole: user ? user.role : (application && application.status === "Approved" ? "driver" : "passenger"),
      driverStatus: user ? user.driverStatus : (application ? application.status.toLowerCase() : "none"),
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application status",
      error: error.message,
    });
  }
};

/**
 * Update driver application status (Approve, Reject, Suspend)
 * PUT /api/driver-applications/:id/status
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Approved, Rejected, or Pending.",
      });
    }

    // Support both MongoDB _id and custom applicationId (DAR01, etc.)
    const filter = id.startsWith("DAR") ? { applicationId: id } : { _id: id };
    const application = await DriverApplication.findOne(filter);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: `Driver application "${id}" not found.`,
      });
    }

    application.status = status;
    if (rejectionReason) application.rejectionReason = rejectionReason;
    await application.save();

    // Find applicant user
    let user = null;
    if (application.user) {
      user = await User.findById(application.user);
    }
    if (!user) {
      user = await User.findOne({
        $or: [{ phone: application.phone }, { name: application.fullName }],
      });
    }

    if (user) {
      if (status === "Approved") {
        user.role = "driver";
        user.driverStatus = "approved";
        user.driverDetails = {
          vehicleType: application.vehicleType,
          vehicleNo: application.vehicleNo,
          vehicleModel: application.vehicleModel,
          phone: application.phone,
          isOnline: true,
        };
      } else if (status === "Rejected") {
        user.role = "passenger";
        user.driverStatus = "rejected";
      } else {
        // Suspended / Reset to Pending
        user.role = "passenger";
        user.driverStatus = "pending";
      }
      await user.save();
    }

    // If approved, create or activate a TransportService entry for multimodal transit queries
    if (status === "Approved") {
      try {
        await TransportService.findOneAndUpdate(
          { name: `${application.fullName} (${application.vehicleType})` },
          {
            name: `${application.fullName} (${application.vehicleType})`,
            type: application.vehicleType === "Tuk-tuk" ? "three_wheeler" : "taxi",
            operator: application.fullName,
            vehicles: 1,
            status: "active",
          },
          { upsert: true, new: true }
        );
      } catch (svcErr) {
        console.warn("TransportService sync notice:", svcErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Driver application ${status} successfully. User role updated.`,
      data: application,
      userRole: user ? user.role : (status === "Approved" ? "driver" : "passenger"),
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update driver application status",
      error: error.message,
    });
  }
};

/**
 * Toggle driver online / offline status
 * PUT /api/driver/toggle-online
 */
const toggleDriverOnline = async (req, res, next) => {
  try {
    const { userId, email, isOnline } = req.body;
    let user = null;

    if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    } else if (userId) {
      user = await User.findById(userId).catch(() => null);
    } else if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Driver user not found",
      });
    }

    const newStatus = isOnline !== undefined ? Boolean(isOnline) : !(user.driverDetails?.isOnline);
    if (!user.driverDetails) {
      user.driverDetails = {};
    }
    user.driverDetails.isOnline = newStatus;
    await user.save();

    return res.status(200).json({
      success: true,
      isOnline: newStatus,
      message: `Driver is now ${newStatus ? "ONLINE (Broadcasting GPS)" : "OFFLINE"}`,
    });
  } catch (error) {
    if (next) return next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle driver status",
      error: error.message,
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getMyApplicationStatus,
  updateApplicationStatus,
  toggleDriverOnline,
};
