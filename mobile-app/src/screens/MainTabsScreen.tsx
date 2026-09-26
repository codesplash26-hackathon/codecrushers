import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, BackHandler, Platform, TouchableOpacity, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
import BottomNavigationBar, { NavTab } from "../components/BottomNavigationBar";
import HomeScreen from "./HomeScreen";
import JourneysScreen from "./JourneysScreen";
import NotificationsScreen from "./NotificationsScreen";
import ProfileScreen from "./ProfileScreen";
import api from "../services/api";

// Safely typed components for tab rendering to prevent JSX prop errors
const HomeScreenComponent = HomeScreen as React.ComponentType<any>;
const JourneysScreenComponent = JourneysScreen as React.ComponentType<any>;
const NotificationsScreenComponent = NotificationsScreen as React.ComponentType<any>;
const ProfileScreenComponent = ProfileScreen as React.ComponentType<any>;
const BottomNavigationBarComponent = BottomNavigationBar as React.ComponentType<any>;

export interface MainTabsScreenProps {
  navigation: any;
  route?: {
    key?: string;
    name?: string;
    params?: {
      tab?: NavTab;
      initialTab?: "upcoming" | "completed" | "saved";
    };
  };
  initialTab?: NavTab;
}

export default function MainTabsScreen({ navigation, route, initialTab }: MainTabsScreenProps) {
  const { colors } = useTheme();

  const initialTabFromParams = initialTab || route?.params?.tab || "home";
  const [activeTab, setActiveTab] = useState<NavTab>(initialTabFromParams);

  const [visitedTabs, setVisitedTabs] = useState<Record<NavTab, boolean>>({
    home: true,
    journeys: initialTabFromParams === "journeys",
    alerts: initialTabFromParams === "alerts",
    profile: initialTabFromParams === "profile",
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [journeysParams, setJourneysParams] = useState<
    { initialTab?: "upcoming" | "completed" | "saved" } | undefined
  >(
    route?.params?.initialTab
      ? { initialTab: route?.params?.initialTab }
      : undefined
  );

  const [liveAlertsCount, setLiveAlertsCount] = useState<number>(0);
  const [isDriverUser, setIsDriverUser] = useState<boolean>(false);

  useEffect(() => {
    const checkDriverRole = async () => {
      try {
        const u = await (await import("../services/authService")).default.getCurrentUser();
        if (u && u.role === "driver") {
          setIsDriverUser(true);
        }
      } catch {
        // ignore
      }
    };
    checkDriverRole();
  }, [activeTab]);

  // Sync route params when navigated to with new params
  useEffect(() => {
    if (route?.params?.tab) {
      setActiveTab(route.params.tab);
    }
    if (route?.params?.initialTab) {
      setJourneysParams({ initialTab: route.params.initialTab });
    }
  }, [route?.params?.tab, route?.params?.initialTab]);

  // Ensure visited tabs are tracked for lazy loading
  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev[activeTab]) return prev;
      return { ...prev, [activeTab]: true };
    });
  }, [activeTab]);

  // Fetch live disruptions for badge count
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const disruptionsRes: any = await api.getActiveDisruptions();
        const list: any[] =
          Array.isArray(disruptionsRes?.data?.disruptions)
            ? disruptionsRes.data.disruptions
            : Array.isArray(disruptionsRes?.data)
              ? disruptionsRes.data
              : Array.isArray(disruptionsRes?.disruptions)
                ? disruptionsRes.disruptions
                : [];
        if (isMounted && list.length > 0) {
          setLiveAlertsCount(list.length);
        }
      } catch {
        // Fallback
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle hardware back button on Android: go to Home tab before exiting
  useEffect(() => {
    const onBackPress = () => {
      if (activeTab !== "home") {
        setActiveTab("home");
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [activeTab]);

  const handleSelectTab = useCallback((tab: NavTab) => {
    setActiveTab(tab);
  }, []);

  // Intercept navigation calls inside screens so tab switches remain static
  const tabNavigation = useMemo(() => {
    return {
      ...navigation,
      navigate: (screenOrOptions: any, params?: any) => {
        const screen = typeof screenOrOptions === "string" ? screenOrOptions : screenOrOptions?.name;
        const screenParams = typeof screenOrOptions === "object" ? screenOrOptions?.params : params;

        if (screen === "Home") {
          setActiveTab("home");
          return;
        }
        if (screen === "Journeys") {
          if (screenParams?.initialTab) {
            setJourneysParams({ initialTab: screenParams.initialTab });
          }
          setActiveTab("journeys");
          return;
        }
        if (screen === "Notifications") {
          setActiveTab("alerts");
          return;
        }
        if (screen === "Profile") {
          setActiveTab("profile");
          return;
        }

        // For non-tab screens (RouteResults, LiveTracking, DriverRegistration, etc.), delegate to stack navigation
        return (navigation?.navigate as any)?.(screenOrOptions, params);
      },
    };
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.screenBg }]}>
      <View style={styles.pageArea}>
        {visitedTabs.home && (
          <View
            style={[
              styles.page,
              activeTab !== "home" && styles.hiddenPage,
            ]}
          >
            <HomeScreenComponent
              navigation={tabNavigation}
              hideBottomBar
            />
          </View>
        )}
        {visitedTabs.journeys && (
          <View
            style={[
              styles.page,
              activeTab !== "journeys" && styles.hiddenPage,
            ]}
          >
            <JourneysScreenComponent
              navigation={tabNavigation}
              route={
                journeysParams
                  ? {
                      key: "journeys-tab",
                      name: "Journeys",
                      params: journeysParams,
                    }
                  : undefined
              }
              hideBottomBar
            />
          </View>
        )}
        {visitedTabs.alerts && (
          <View
            style={[
              styles.page,
              activeTab !== "alerts" && styles.hiddenPage,
            ]}
          >
            <NotificationsScreenComponent
              navigation={tabNavigation}
              hideBottomBar
            />
          </View>
        )}
        {visitedTabs.profile && (
          <View
            style={[
              styles.page,
              activeTab !== "profile" && styles.hiddenPage,
            ]}
          >
            <ProfileScreenComponent
              navigation={tabNavigation}
              hideBottomBar
            />
          </View>
        )}
      </View>

      {/* Floating Driver Console Quick-Switch Pill for Approved Drivers */}
      {isDriverUser && (
        <TouchableOpacity
          style={styles.floatingDriverBadge}
          onPress={() => (navigation?.navigate as any)("DriverDashboard")}
          activeOpacity={0.85}
        >
          <View style={styles.floatingDriverPulse} />
          <Text style={styles.floatingDriverText}>
            🚖 Driver Console Active · Switch Mode ➔
          </Text>
        </TouchableOpacity>
      )}

      {/* Static Bottom Navigation Bar */}
      <BottomNavigationBarComponent
        activeTab={activeTab}
        navigation={tabNavigation}
        onTabPress={handleSelectTab}
        unreadAlertsCount={liveAlertsCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  pageArea: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  hiddenPage: {
    display: "none",
  },
  floatingDriverBadge: {
    position: "absolute",
    bottom: 74,
    alignSelf: "center",
    backgroundColor: "#1E293B",
    borderColor: "#3B82F6",
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 99,
    ...Platform.select({
      web: { boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)" },
      default: { elevation: 6 },
    }),
  },
  floatingDriverPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  floatingDriverText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
