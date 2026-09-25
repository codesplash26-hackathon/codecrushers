import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export type NavTab = "home" | "journeys" | "alerts" | "profile";

interface BottomNavigationBarProps {
  activeTab: NavTab;
  navigation: any;
  unreadAlertsCount?: number;
}

export default function BottomNavigationBar({
  activeTab,
  navigation,
  unreadAlertsCount = 2,
}: BottomNavigationBarProps) {
  const { isDarkMode, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleTabPress = (tab: NavTab) => {
    if (tab === activeTab) return;
    switch (tab) {
      case "home":
        navigation.navigate("Home");
        break;
      case "journeys":
        navigation.navigate("Journeys");
        break;
      case "alerts":
        navigation.navigate("Notifications");
        break;
      case "profile":
        navigation.navigate("Profile");
        break;
    }
  };

  const bottomPadding = Platform.OS === "ios" ? Math.max(insets.bottom, 16) : 10;
  const barHeight = 58 + bottomPadding;

  return (
    <View
      style={[
        styles.fixedBar,
        {
          height: barHeight,
          paddingBottom: bottomPadding,
          backgroundColor: isDarkMode ? colors.bottomNavBg : "#FFFFFF",
          borderTopColor: isDarkMode ? colors.bottomNavBorder : "#F1F5F9",
        },
      ]}
    >
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress("home")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.navIcon,
            activeTab === "home" ? styles.navIconActive : styles.navIconInactive,
          ]}
        >
          🏠
        </Text>
        <Text
          style={[
            styles.navLabel,
            activeTab === "home" ? styles.navLabelActive : styles.navLabelInactive,
            isDarkMode && activeTab !== "home" && { color: colors.textMuted },
          ]}
        >
          Home
        </Text>
        {activeTab === "home" && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>

      {/* Journeys Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress("journeys")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.navIcon,
            activeTab === "journeys"
              ? styles.navIconActive
              : styles.navIconInactive,
          ]}
        >
          🗺️
        </Text>
        <Text
          style={[
            styles.navLabel,
            activeTab === "journeys"
              ? styles.navLabelActive
              : styles.navLabelInactive,
            isDarkMode && activeTab !== "journeys" && { color: colors.textMuted },
          ]}
        >
          Journeys
        </Text>
        {activeTab === "journeys" && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>

      {/* Alerts Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress("alerts")}
        activeOpacity={0.7}
      >
        <View style={styles.alertIconWrapper}>
          <Text
            style={[
              styles.navIcon,
              activeTab === "alerts"
                ? styles.navIconActive
                : styles.navIconInactive,
            ]}
          >
            🔔
          </Text>
          {unreadAlertsCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {unreadAlertsCount > 9 ? "9+" : unreadAlertsCount}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.navLabel,
            activeTab === "alerts"
              ? styles.navLabelActive
              : styles.navLabelInactive,
            isDarkMode && activeTab !== "alerts" && { color: colors.textMuted },
          ]}
        >
          Alerts
        </Text>
        {activeTab === "alerts" && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress("profile")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.navIcon,
            activeTab === "profile"
              ? styles.navIconActive
              : styles.navIconInactive,
          ]}
        >
          👤
        </Text>
        <Text
          style={[
            styles.navLabel,
            activeTab === "profile"
              ? styles.navLabelActive
              : styles.navLabelInactive,
            isDarkMode && activeTab !== "profile" && { color: colors.textMuted },
          ]}
        >
          Profile
        </Text>
        {activeTab === "profile" && <View style={styles.activeTabIndicator} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fixedBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 12,
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
      },
    }),
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 3,
  },
  navIconActive: {
    opacity: 1,
  },
  navIconInactive: {
    opacity: 0.6,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  navLabelActive: {
    color: "#1D64EC",
    fontWeight: "700",
  },
  navLabelInactive: {
    color: "#94A3B8",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -3,
    width: 26,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "#1D64EC",
  },
  alertIconWrapper: {
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
});
