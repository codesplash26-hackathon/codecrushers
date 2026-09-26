import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";

import SplashScreen from "../screens/SplashScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/loginscreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import MainTabsScreen from "../screens/MainTabsScreen";
import RouteResultsScreen from "../screens/RouteResultsScreen";
import RouteDetailScreen from "../screens/RouteDetailScreen";
import LiveTrackingScreen from "../screens/LiveTrackingScreen";
import AvailableVehiclesScreen from "../screens/AvailableVehiclesScreen";
import RideProgressScreen from "../screens/RideProgressScreen";
import DriverRegistrationScreen from "../screens/DriverRegistrationScreen";
import DriverDashboardScreen from "../screens/DriverDashboardScreen";
import CompareRoutesScreen from "../screens/CompareRoutesScreen";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home:
    | {
        tab?: "home" | "journeys" | "alerts" | "profile";
        initialTab?: "upcoming" | "completed" | "saved";
      }
    | undefined;
  Journeys:
    | { initialTab?: "upcoming" | "completed" | "saved" }
    | undefined;
  Notifications: undefined;
  Profile: undefined;
  RouteResults:
    | {
        from?: string;
        to?: string;
        skipLoading?: boolean;
        initialFilter?: "recommended" | "fastest" | "cheapest" | "reliable";
      }
    | undefined;
  RouteDetail:
    | {
        from?: string;
        to?: string;
        routeType?: string;
        fare?: string;
        duration?: string;
        departureTime?: string;
        arrivalTime?: string;
      }
    | undefined;
  LiveTracking:
    | {
        from?: string;
        to?: string;
      }
    | undefined;
  AvailableVehicles:
    | {
        station?: string;
        arrivalTime?: string;
      }
    | undefined;
  RideProgress:
    | {
        driverName?: string;
        driverInitials?: string;
        rating?: number;
        vehicleModel?: string;
        plate?: string;
        fare?: number;
        station?: string;
      }
    | undefined;
  DriverRegistration: undefined;
  DriverDashboard: undefined;
  CompareRoutes:
    | {
        from?: string;
        to?: string;
      }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

import ResponsiveContainer from "../components/ResponsiveContainer";

const routeTitleMap: Record<string, string> = {
  Splash: "Welcome",
  Onboarding: "Onboarding",
  Login: "Login",
  Register: "Create Account",
  ForgotPassword: "Forgot Password",
  Home: "Dashboard",
  Journeys: "My Journeys",
  Notifications: "Alerts & Notifications",
  Profile: "My Profile",
  RouteResults: "Search Results",
  RouteDetail: "Route Details",
  LiveTracking: "Live Tracking",
  AvailableVehicles: "Available Vehicles",
  RideProgress: "Ride Progress",
  DriverRegistration: "Driver Registration",
  DriverDashboard: "Driver Console",
  CompareRoutes: "Compare Routes",
};

export default function AppNavigator() {
  const { isDarkMode, colors } = useTheme();

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.screenBg,
      card: colors.cardBg,
      text: colors.textPrimary,
      border: colors.cardBorder,
      primary: colors.primary,
    },
  };

  return (
    <ResponsiveContainer>
      <NavigationContainer
        theme={navigationTheme}
        documentTitle={{
          enabled: true,
          formatter: (options, route) => {
            const pageName =
              options?.title ||
              (route?.name ? routeTitleMap[route.name] || route.name : "Home");
            return `BestRoute | ${pageName}`;
          },
        }}
      >
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} options={{ title: "Welcome" }} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ title: "Onboarding" }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Create Account" }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: "Forgot Password" }} />
          <Stack.Screen name="Home" component={MainTabsScreen} options={{ title: "Dashboard" }} />
          <Stack.Screen name="Journeys" options={{ title: "My Journeys" }}>
            {(props) => <MainTabsScreen {...props} initialTab="journeys" />}
          </Stack.Screen>
          <Stack.Screen name="Notifications" options={{ title: "Alerts & Notifications" }}>
            {(props) => <MainTabsScreen {...props} initialTab="alerts" />}
          </Stack.Screen>
          <Stack.Screen name="Profile" options={{ title: "My Profile" }}>
            {(props) => <MainTabsScreen {...props} initialTab="profile" />}
          </Stack.Screen>
          <Stack.Screen name="RouteResults" component={RouteResultsScreen} options={{ title: "Search Results" }} />
          <Stack.Screen name="RouteDetail" component={RouteDetailScreen} options={{ title: "Route Details" }} />
          <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} options={{ title: "Live Tracking" }} />
          <Stack.Screen
            name="AvailableVehicles"
            component={AvailableVehiclesScreen}
            options={{ title: "Available Vehicles" }}
          />
          <Stack.Screen name="RideProgress" component={RideProgressScreen} options={{ title: "Ride Progress" }} />
          <Stack.Screen
            name="DriverRegistration"
            component={DriverRegistrationScreen}
            options={{ title: "Driver Registration" }}
          />
          <Stack.Screen
            name="DriverDashboard"
            component={DriverDashboardScreen}
            options={{ title: "Driver Console" }}
          />
          <Stack.Screen name="CompareRoutes" component={CompareRoutesScreen} options={{ title: "Compare Routes" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ResponsiveContainer>
  );
}
