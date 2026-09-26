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
  CompareRoutes:
    | {
        from?: string;
        to?: string;
      }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={MainTabsScreen} />
        <Stack.Screen name="Journeys">
          {(props) => <MainTabsScreen {...props} initialTab="journeys" />}
        </Stack.Screen>
        <Stack.Screen name="Notifications">
          {(props) => <MainTabsScreen {...props} initialTab="alerts" />}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {(props) => <MainTabsScreen {...props} initialTab="profile" />}
        </Stack.Screen>
        <Stack.Screen name="RouteResults" component={RouteResultsScreen} />
        <Stack.Screen name="RouteDetail" component={RouteDetailScreen} />
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
        <Stack.Screen
          name="AvailableVehicles"
          component={AvailableVehiclesScreen}
        />
        <Stack.Screen name="RideProgress" component={RideProgressScreen} />
        <Stack.Screen
          name="DriverRegistration"
          component={DriverRegistrationScreen}
        />
        <Stack.Screen name="CompareRoutes" component={CompareRoutesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
