const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "passenger",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = (email || "").trim();

    if (!query || !password) {
      return res.status(400).json({
        message: "Email/username and password are required",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: query.toLowerCase() },
        { name: query },
        ...(query.toLowerCase() === "admin" ? [{ role: "admin" }] : []),
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

const otpStore = new Map();

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    });

    res.json({
      message: `Verification code sent to ${email}`,
      // For development/demo purposes, returning test OTP if configured
      devOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP code are required" });
    }

    const stored = otpStore.get(email.toLowerCase());
    if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP code" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }

    otpStore.delete(email.toLowerCase());

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Password reset failed", error: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};