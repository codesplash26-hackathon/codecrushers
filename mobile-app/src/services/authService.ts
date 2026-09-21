/**
 * BestRoute Authentication & Password Recovery Service
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

// In-memory mock OTP store for local development/simulation
let simulatedOtpCode: string = "123456";
let simulatedEmail: string = "";

export const authService = {
  /**
   * User Login
   */
  async login(usernameOrEmail: string, password: string):Promise<AuthResponse> {
    // Basic validation
    if (!usernameOrEmail.trim() || !password.trim()) {
      return { success: false, message: "Please enter both username and password." };
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      message: "Login successful",
      token: "mock-jwt-token-" + Date.now(),
      user: {
        id: "usr_101",
        name: usernameOrEmail.includes("@") ? usernameOrEmail.split("@")[0] : usernameOrEmail,
        email: usernameOrEmail.includes("@") ? usernameOrEmail : `${usernameOrEmail}@bestroute.lk`,
      },
    };
  },

  /**
   * User Registration
   */
  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      return { success: false, message: "All fields are required." };
    }

    if (password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters." };
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      success: true,
      message: "Account created successfully",
      token: "mock-jwt-token-" + Date.now(),
      user: {
        id: "usr_" + Math.floor(Math.random() * 1000),
        name: fullName,
        email: email,
      },
    };
  },

  /**
   * Request OTP code for password recovery
   */
  async requestPasswordResetOtp(email: string): Promise<OtpResponse> {
    if (!email.trim() || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address." };
    }

    simulatedEmail = email;
    simulatedOtpCode = "123456"; // Default testing OTP

    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      message: `Verification code sent to ${email}. (Use 123456 for testing)`,
    };
  },

  /**
   * Verify entered OTP code
   */
  async verifyOtp(code: string): Promise<OtpResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Allow 123456 or current simulated code
    if (code === simulatedOtpCode || code === "123456") {
      return { success: true, message: "Code verified successfully." };
    }

    return { success: false, message: "Invalid verification code. Please try again." };
  },

  /**
   * Reset Password
   */
  async resetPassword(newPassword: string): Promise<OtpResponse> {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: "Password must be at least 6 characters long." };
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      success: true,
      message: "Password has been successfully reset.",
    };
  },
};

export default authService;
