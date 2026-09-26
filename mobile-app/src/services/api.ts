import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * BestRoute Mobile API Configuration & HTTP Client
 * Automatically resolves the backend server IP for Expo Go, Emulators, and Web.
 */

// Keys for local persistence
export const STORAGE_KEYS = {
  TOKEN: "@bestroute_token",
  USER: "@bestroute_user",
  CUSTOM_BASE_URL: "@bestroute_custom_base_url",
  SAVED_PREFERENCES: "@bestroute_preferences",
};

/**
 * Determine the optimal API Base URL:
 * 1. Custom URL set by developer/tester in AsyncStorage (if any)
 * 2. Expo Metro host URI (gets the computer's LAN IP e.g. 192.168.1.100:5000)
 * 3. Android emulator loopback 10.0.2.2:5000
 * 4. Localhost:5000 for iOS simulator and Web
 */
const getAutoDetectedHost = (): string => {
  try {
    const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest2?.extra?.expoGo?.packagerOpts?.host;
    if (hostUri) {
      const rawHost = hostUri.split(":")[0];
      // Only use as IP if it's a valid IPv4 address (e.g. 192.168.1.100) and not a tunnel hostname or localhost
      const isIPv4 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(rawHost);
      if (isIPv4 && rawHost !== "127.0.0.1") {
        return `http://${rawHost}:5000/api`;
      }
    }
  } catch {
    // fallback
  }

  if (Platform.OS === "web" && typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname || "localhost";
    return `http://${host}:5000/api`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }

  return "http://localhost:5000/api";
};

let currentBaseUrl: string = getAutoDetectedHost();

// Initialize custom base URL if saved
(async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_BASE_URL);
    if (saved) {
      currentBaseUrl = saved;
    }
  } catch {
    // ignore
  }
})();

export const setApiBaseUrl = async (url: string) => {
  currentBaseUrl = url.replace(/\/+$/, "");
  await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_BASE_URL, currentBaseUrl);
};

export const getApiBaseUrl = (): string => currentBaseUrl;

/**
 * Standard API request wrapper with auth header injection,
 * JSON serialization, and timeout handling.
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
    timeoutMs?: number;
  } = {}
): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
  const { method = "GET", body, headers = {}, timeoutMs = 7000 } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${currentBaseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    let json: any = null;
    const text = await response.text();
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { message: text };
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: json.message || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      status: response.status,
      data: json,
      message: json.message,
    };
  } catch (error: any) {
    clearTimeout(timer);
    const isTimeout = error.name === "AbortError";
    return {
      success: false,
      message: isTimeout
        ? "Network connection timed out. Please check if your backend server is running."
        : error.message || "Network request failed.",
    };
  }
}

/**
 * Centralized API service object covering all backend routes
 */
export const api = {
  getBaseUrl: getApiBaseUrl,
  setBaseUrl: setApiBaseUrl,

  // Health check
  async checkHealth() {
    return apiRequest<{ success: boolean; message: string }>("/health");
  },

  // Auth Endpoints
  async register(name: string, email: string, password: string) {
    return apiRequest<{
      message: string;
      token: string;
      user: { id: string; name: string; email: string; role?: string };
    }>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
  },

  async login(emailOrUsername: string, password: string) {
    return apiRequest<{
      message: string;
      token: string;
      user: { id: string; name: string; email: string; role?: string };
    }>("/auth/login", {
      method: "POST",
      body: { email: emailOrUsername, password },
    });
  },

  async forgotPassword(email: string) {
    return apiRequest<{ message: string; devOtp?: string }>(
      "/auth/forgot-password",
      {
        method: "POST",
        body: { email },
      }
    );
  },

  async verifyOtp(email: string, otp: string) {
    return apiRequest<{ message: string }>("/auth/verify-otp", {
      method: "POST",
      body: { email, otp },
    });
  },

  async resetPassword(email: string, password: string) {
    return apiRequest<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: { email, password },
    });
  },

  // User Profile Endpoints
  async getProfile() {
    return apiRequest<{
      success: boolean;
      user: {
        id: string;
        name: string;
        email: string;
        role?: string;
        preferences?: string;
      };
    }>("/users/profile");
  },

  async updatePreference(preferences: string) {
    return apiRequest<{
      success: boolean;
      message: string;
      preferences: string;
    }>("/users/preference", {
      method: "PUT",
      body: { preferences },
    });
  },

  // Routes & Stops
  async getRoutes() {
    return apiRequest<{ success: boolean; count: number; routes: any[] }>(
      "/routes"
    );
  },

  async getRouteById(id: string) {
    return apiRequest<{ success: boolean; route: any }>(`/routes/${id}`);
  },

  async getStops() {
    return apiRequest<{ success: boolean; count: number; stops: any[] }>(
      "/stops"
    );
  },

  async getSchedules() {
    return apiRequest<{ success: boolean; count: number; schedules: any[] }>(
      "/schedules"
    );
  },

  async getTransportServices() {
    return apiRequest<{ success: boolean; services: any[] }>("/services");
  },

  // Disruptions
  async getActiveDisruptions() {
    return apiRequest<{ success: boolean; disruptions: any[] }>(
      "/disruptions/active"
    );
  },

  // Notifications
  async getNotifications() {
    return apiRequest<{ success: boolean; notifications: any[] }>(
      "/notifications"
    );
  },

  async markAllNotificationsRead() {
    return apiRequest<{ success: boolean }>("/notifications/read-all", {
      method: "PATCH",
    });
  },

  async markNotificationRead(id: string) {
    return apiRequest<{ success: boolean }>(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  // Journeys
  async searchJourneys(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    preference?: string
  ) {
    return apiRequest<{
      success: boolean;
      data: {
        origin: any;
        destination: any;
        preference: string;
        candidates: any[];
      };
    }>("/journeys/search", {
      method: "POST",
      body: { origin, destination, preference },
    });
  },

  async createActiveJourney(journeyData: any) {
    return apiRequest<{ success: boolean; data: any }>("/journeys/active", {
      method: "POST",
      body: journeyData,
    });
  },

  async rerouteJourney(journeyId: string) {
    return apiRequest<{ success: boolean; data: any }>(
      `/journeys/${journeyId}/reroute`,
      {
        method: "POST",
      }
    );
  },
};

export default api;
