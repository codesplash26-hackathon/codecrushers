import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import authService, { AuthUser } from "../services/authService";
import api from "../services/api";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  // Modal states
  const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
  const [isLanguageVisible, setIsLanguageVisible] = useState(false);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isSupportVisible, setIsSupportVisible] = useState(false);
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);

  // Preference states
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Sinhala" | "Tamil">("English");

  // Travel Preferences states (matching modern preferences UI)
  const [defaultPref, setDefaultPref] = useState<"Fastest" | "Cheapest" | "Reliable" | "Less Walk">("Fastest");
  const [walkingTolerance, setWalkingTolerance] = useState<"Low" | "Medium" | "High">("Medium");
  const [maxTransfers, setMaxTransfers] = useState<"1" | "2" | "3+">("2");
  const [preferBus, setPreferBus] = useState(true);
  const [preferTrain, setPreferTrain] = useState(true);
  const [preferTaxi, setPreferTaxi] = useState(true);
  const [preferTuk, setPreferTuk] = useState(true);
  const [preferWalking, setPreferWalking] = useState(true);

  // Notification toggles in travel preferences
  const [notifyJourneyUpdates, setNotifyJourneyUpdates] = useState(true);
  const [notifyConnectionRisks, setNotifyConnectionRisks] = useState(true);
  const [notifyDisruptions, setNotifyDisruptions] = useState(true);
  const [notifyAltRoutes, setNotifyAltRoutes] = useState(true);

  const [locationTracking, setLocationTracking] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => {
      const cached = await authService.getCurrentUser();
      if (cached) {
        setCurrentUser(cached);
      }
      try {
        const res = await api.getProfile();
        if (res.success && res.data?.user) {
          setCurrentUser(res.data.user);
        }
      } catch {
        // Backend offline / using cached
      }
    })();
  }, []);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setIsLogoutModalVisible(false);
    await authService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleSavePreferences = async () => {
    setIsPreferencesVisible(false);
    let prefKey = "fastest";
    if (defaultPref === "Cheapest") prefKey = "cheapest";
    else if (defaultPref === "Reliable") prefKey = "most_reliable";
    else if (defaultPref === "Less Walk") prefKey = "minimum_walking";

    try {
      await api.updatePreference(prefKey);
      Alert.alert("Preferences Saved", "Your journey preferences have been saved to your account.");
    } catch {
      Alert.alert("Preferences Saved", "Preferences updated locally.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.screenBg }]}>
      <StatusBar style="light" />

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Profile Header Banner with Gradient */}
        <LinearGradient
          colors={
            isDarkMode
              ? ["#071630", "#0B2554", "#1541A0"]
              : ["#0B3E9E", "#1763D5", "#1D64EC"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={["top"]} style={styles.safeHeader}>
            <View style={styles.profileHeaderContent}>
              {/* Avatar container */}
              <View style={styles.avatarWrapper}>
                <View
                  style={[
                    styles.avatarContainer,
                    isDarkMode && { backgroundColor: "#1E293B" },
                  ]}
                >
                  <Text style={styles.avatarEmoji}>👨‍💼</Text>
                </View>
                <View style={styles.avatarBadgeDot} />
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {currentUser?.name || "Alex Perera"}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {currentUser?.email || "alex@example.com"}
                </Text>
                <View style={styles.memberTagRow}>
                  <View style={styles.activeGreenDot} />
                  <Text style={styles.memberTagText}>
                    {currentUser?.role === "driver" ? "Registered Driver · 2024" : "24 journeys · Member since 2024"}
                  </Text>
                </View>
              </View>

              {/* Dark Mode Change Button Displayed in Top Right Corner */}
              <ThemeToggle variant="glass" size={40} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Floating Quick Stats Card */}
        <View
          style={[
            styles.statsCard,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.statColumn}>
            <Text style={styles.statNumberBlue}>24</Text>
            <Text
              style={[
                styles.statLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              Journeys
            </Text>
          </View>

          <View
            style={[
              styles.statDivider,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          <View style={styles.statColumn}>
            <Text style={styles.statNumberGreen}>Rs.1.2k</Text>
            <Text
              style={[
                styles.statLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              Saved
            </Text>
          </View>

          <View
            style={[
              styles.statDivider,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          <View style={styles.statColumn}>
            <Text style={styles.statNumberAmber}>4.8★</Text>
            <Text
              style={[
                styles.statLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              Avg Rating
            </Text>
          </View>
        </View>

        {/* Section 1: Travel & Activity */}
        <View
          style={[
            styles.menuGroup,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* My Journeys */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Journeys")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🗺️</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                My Journeys
              </Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.itemSeparator,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          {/* Favourite Routes */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("Journeys", { initialTab: "saved" })
            }
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>💖</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Favourite Routes
              </Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.itemSeparator,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          {/* Travel Preferences */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsPreferencesVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Travel Preferences
              </Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.itemSeparator,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          {/* Become a Driver */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("DriverRegistration")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🚖</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Become a Driver
              </Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 2: Preferences & Security */}
        <View
          style={[
            styles.menuGroup,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Dark Mode Toggle */}
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>{isDarkMode ? "🌙" : "☀️"}</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[
              styles.itemSeparator,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          {/* Notifications */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Notifications")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Notifications
              </Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.itemSeparator,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          {/* Language */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsLanguageVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🌐</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Language
              </Text>
            </View>
            <View style={styles.menuRightInfo}>
              <Text
                style={[
                  styles.menuCurrentSetting,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                {selectedLanguage}
              </Text>
              <Text
                style={[
                  styles.menuChevron,
                  isDarkMode && { color: colors.textMuted },
                ]}
              >
                ›
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={[
              styles.itemSeparator,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          {/* Privacy */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsPrivacyVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🔒</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Privacy
              </Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Help & Log Out */}
        <View
          style={[
            styles.menuGroup,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Help & Support */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsSupportVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>❓</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Help & Support
              </Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.itemSeparator,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          {/* About BestRoute */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsAboutVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>ℹ️</Text>
              <Text
                style={[
                  styles.menuTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                About BestRoute
              </Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.itemSeparator,
              isDarkMode && { backgroundColor: colors.borderLight },
            ]}
          />

          {/* Log Out */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuTitle, styles.logoutText]}>Log Out</Text>
            </View>
            <Text
              style={[
                styles.menuChevron,
                isDarkMode && { color: colors.textMuted },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version Stamp */}
        <View style={styles.footerStamp}>
          <Text
            style={[
              styles.versionText,
              isDarkMode && { color: colors.textMuted },
            ]}
          >
            BestRoute Mobile v1.0.4
          </Text>
          <Text
            style={[
              styles.copyrightText,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            Multimodal Transit Network of Sri Lanka
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNav,
          isDarkMode && {
            backgroundColor: colors.bottomNavBg,
            borderTopColor: colors.bottomNavBorder,
          },
        ]}
      >
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, styles.navIconInactive]}>🏠</Text>
          <Text
            style={[
              styles.navLabel,
              styles.navLabelInactive,
              isDarkMode && { color: colors.textMuted },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Journeys Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Journeys")}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, styles.navIconInactive]}>🗺️</Text>
          <Text
            style={[
              styles.navLabel,
              styles.navLabelInactive,
              isDarkMode && { color: colors.textMuted },
            ]}
          >
            Journeys
          </Text>
        </TouchableOpacity>

        {/* Alerts Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Notifications")}
          activeOpacity={0.7}
        >
          <View style={styles.alertIconWrapper}>
            <Text style={[styles.navIcon, styles.navIconInactive]}>🔔</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
          <Text
            style={[
              styles.navLabel,
              styles.navLabelInactive,
              isDarkMode && { color: colors.textMuted },
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.8}
        >
          <Text style={[styles.navIcon, styles.navIconActive]}>👤</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
      </View>

      {/* ================= TRAVEL PREFERENCES MODAL ================= */}
      <Modal
        visible={isPreferencesVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsPreferencesVisible(false)}
      >
        <SafeAreaView style={styles.tpContainer} edges={["top", "bottom"]}>
          {/* Header with back button */}
          <View style={styles.tpHeader}>
            <TouchableOpacity
              style={styles.tpBackButton}
              onPress={() => setIsPreferencesVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.tpBackIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.tpHeaderTitle}>Travel Preferences</Text>
          </View>

          {/* Preferences Body */}
          <ScrollView
            style={styles.tpScrollView}
            contentContainerStyle={styles.tpScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Card 1: DEFAULT PREFERENCE */}
            <View style={styles.tpCard}>
              <Text style={styles.tpCardLabel}>DEFAULT PREFERENCE</Text>
              <View style={styles.tpGridRow}>
                <TouchableOpacity
                  style={[
                    styles.tpPrefButton,
                    defaultPref === "Fastest"
                      ? styles.tpPrefButtonActive
                      : styles.tpPrefButtonInactive,
                  ]}
                  onPress={() => setDefaultPref("Fastest")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tpPrefEmoji}>⚡</Text>
                  <Text
                    style={[
                      styles.tpPrefText,
                      defaultPref === "Fastest"
                        ? styles.tpPrefTextActive
                        : styles.tpPrefTextInactive,
                    ]}
                  >
                    Fastest
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tpPrefButton,
                    defaultPref === "Cheapest"
                      ? styles.tpPrefButtonActive
                      : styles.tpPrefButtonInactive,
                  ]}
                  onPress={() => setDefaultPref("Cheapest")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tpPrefEmoji}>💰</Text>
                  <Text
                    style={[
                      styles.tpPrefText,
                      defaultPref === "Cheapest"
                        ? styles.tpPrefTextActive
                        : styles.tpPrefTextInactive,
                    ]}
                  >
                    Cheapest
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tpGridRow}>
                <TouchableOpacity
                  style={[
                    styles.tpPrefButton,
                    defaultPref === "Reliable"
                      ? styles.tpPrefButtonActive
                      : styles.tpPrefButtonInactive,
                  ]}
                  onPress={() => setDefaultPref("Reliable")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tpPrefEmoji}>🛡️</Text>
                  <Text
                    style={[
                      styles.tpPrefText,
                      defaultPref === "Reliable"
                        ? styles.tpPrefTextActive
                        : styles.tpPrefTextInactive,
                    ]}
                  >
                    Reliable
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tpPrefButton,
                    defaultPref === "Less Walk"
                      ? styles.tpPrefButtonActive
                      : styles.tpPrefButtonInactive,
                  ]}
                  onPress={() => setDefaultPref("Less Walk")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tpPrefEmoji}>🚶</Text>
                  <Text
                    style={[
                      styles.tpPrefText,
                      defaultPref === "Less Walk"
                        ? styles.tpPrefTextActive
                        : styles.tpPrefTextInactive,
                    ]}
                  >
                    Less Walk
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Card 2: WALKING TOLERANCE */}
            <View style={styles.tpCard}>
              <Text style={styles.tpCardLabel}>WALKING TOLERANCE</Text>
              <View style={styles.tpPillsRow}>
                {(["Low", "Medium", "High"] as const).map((tier) => {
                  const isSelected = walkingTolerance === tier;
                  return (
                    <TouchableOpacity
                      key={tier}
                      style={[
                        styles.tpPillButton,
                        isSelected
                          ? styles.tpTolerancePillActive
                          : styles.tpPillInactive,
                      ]}
                      onPress={() => setWalkingTolerance(tier)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.tpPillText,
                          isSelected
                            ? styles.tpPillTextActive
                            : styles.tpPillTextInactive,
                        ]}
                      >
                        {tier}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Card 3: MAX TRANSFERS */}
            <View style={styles.tpCard}>
              <View style={styles.tpCardHeaderBetween}>
                <Text style={styles.tpCardLabelNoMargin}>MAX TRANSFERS</Text>
                <Text style={styles.tpTransfersBadge}>{maxTransfers}</Text>
              </View>
              <View style={styles.tpPillsRow}>
                {(["1", "2", "3+"] as const).map((count) => {
                  const isSelected = maxTransfers === count;
                  return (
                    <TouchableOpacity
                      key={count}
                      style={[
                        styles.tpPillButton,
                        isSelected
                          ? styles.tpTransfersPillActive
                          : styles.tpPillInactive,
                      ]}
                      onPress={() => setMaxTransfers(count)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.tpPillText,
                          isSelected
                            ? styles.tpPillTextActive
                            : styles.tpPillTextInactive,
                        ]}
                      >
                        {count}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Card 4: TRANSPORT MODES */}
            <View style={styles.tpCard}>
              <Text style={styles.tpCardLabel}>TRANSPORT MODES</Text>

              <View style={styles.tpToggleRow}>
                <View style={styles.tpModeLeft}>
                  <Text style={styles.tpModeEmoji}>🚌</Text>
                  <Text style={styles.tpModeLabel}>Bus</Text>
                </View>
                <Switch
                  value={preferBus}
                  onValueChange={setPreferBus}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>

              <View style={styles.tpToggleRow}>
                <View style={styles.tpModeLeft}>
                  <Text style={styles.tpModeEmoji}>🚆</Text>
                  <Text style={styles.tpModeLabel}>Train</Text>
                </View>
                <Switch
                  value={preferTrain}
                  onValueChange={setPreferTrain}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>

              <View style={styles.tpToggleRow}>
                <View style={styles.tpModeLeft}>
                  <Text style={styles.tpModeEmoji}>🚕</Text>
                  <Text style={styles.tpModeLabel}>Taxi</Text>
                </View>
                <Switch
                  value={preferTaxi}
                  onValueChange={setPreferTaxi}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>

              <View style={styles.tpToggleRow}>
                <View style={styles.tpModeLeft}>
                  <Text style={styles.tpModeEmoji}>🛺</Text>
                  <Text style={styles.tpModeLabel}>Tuk-tuk</Text>
                </View>
                <Switch
                  value={preferTuk}
                  onValueChange={setPreferTuk}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>

              <View style={[styles.tpToggleRow, { borderBottomWidth: 0 }]}>
                <View style={styles.tpModeLeft}>
                  <Text style={styles.tpModeEmoji}>🚶</Text>
                  <Text style={styles.tpModeLabel}>Walking</Text>
                </View>
                <Switch
                  value={preferWalking}
                  onValueChange={setPreferWalking}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>
            </View>

            {/* Card 5: NOTIFICATIONS */}
            <View style={styles.tpCard}>
              <Text style={styles.tpCardLabel}>NOTIFICATIONS</Text>

              <View style={styles.tpToggleRow}>
                <Text style={styles.tpNotifLabel}>Journey updates</Text>
                <Switch
                  value={notifyJourneyUpdates}
                  onValueChange={setNotifyJourneyUpdates}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>

              <View style={styles.tpToggleRow}>
                <Text style={styles.tpNotifLabel}>Connection risks</Text>
                <Switch
                  value={notifyConnectionRisks}
                  onValueChange={setNotifyConnectionRisks}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>

              <View style={styles.tpToggleRow}>
                <Text style={styles.tpNotifLabel}>Service disruptions</Text>
                <Switch
                  value={notifyDisruptions}
                  onValueChange={setNotifyDisruptions}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>

              <View style={[styles.tpToggleRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.tpNotifLabel}>Alternative routes</Text>
                <Switch
                  value={notifyAltRoutes}
                  onValueChange={setNotifyAltRoutes}
                  trackColor={{ false: "#E2E8F0", true: "#2563EB" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                />
              </View>
            </View>
          </ScrollView>

          {/* Sticky Bottom Save Preferences */}
          <View style={styles.tpBottomBar}>
            <TouchableOpacity
              style={styles.tpSaveButton}
              onPress={handleSavePreferences}
              activeOpacity={0.8}
            >
              <Text style={styles.tpSaveButtonText}>Save Preferences</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ================= LANGUAGE MODAL ================= */}
      <Modal
        visible={isLanguageVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsLanguageVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsLanguageVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Select Language</Text>
            <View style={{ width: 32 }} />
          </View>

          <View style={styles.languageModalBody}>
            {(["English", "Sinhala", "Tamil"] as const).map((lang) => {
              const nativeLabels = {
                English: "English (US)",
                Sinhala: "සිංහල (Sinhala)",
                Tamil: "தமிழ் (Tamil)",
              };
              const isSelected = selectedLanguage === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.langOptionCard,
                    isSelected && styles.langOptionCardActive,
                  ]}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setIsLanguageVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      isSelected && styles.langOptionTextActive,
                    ]}
                  >
                    {nativeLabels[lang]}
                  </Text>
                  {isSelected && <Text style={styles.langCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </Modal>

      {/* ================= BECOME A DRIVER MODAL ================= */}
      <Modal
        visible={isDriverModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsDriverModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsDriverModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Partner with BestRoute</Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.driverBannerBox}>
              <Text style={styles.driverBigEmoji}>🚖</Text>
              <Text style={styles.driverBannerTitle}>
                Drive with Sri Lanka's Smart Transit Network
              </Text>
              <Text style={styles.driverBannerSub}>
                Connect daily commuters with last-mile tuk and taxi rides at train
                stations and bus terminals.
              </Text>
            </View>

            <View style={styles.driverPerksBox}>
              <Text style={styles.driverPerkItem}>
                💰 Instant daily payouts with 0% commission introductory offer
              </Text>
              <Text style={styles.driverPerkItem}>
                📍 Guaranteed high-demand passenger pickups at railway hubs
              </Text>
              <Text style={styles.driverPerkItem}>
                🛡️ In-ride safety monitoring and GPS live tracking
              </Text>
            </View>

            <TouchableOpacity
              style={styles.driverRegisterBtn}
              onPress={() => {
                setIsDriverModalVisible(false);
                navigation.navigate("DriverRegistration");
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.driverRegisterBtnText}>
                Register as a Transit Partner
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= ABOUT MODAL ================= */}
      <Modal
        visible={isAboutVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAboutVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsAboutVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>About BestRoute</Text>
            <View style={{ width: 32 }} />
          </View>

          <View style={styles.aboutContent}>
            <Text style={styles.aboutLogoEmoji}>🌐</Text>
            <Text style={styles.aboutAppName}>BestRoute</Text>
            <Text style={styles.aboutTagline}>Your journey. Optimized.</Text>
            <Text style={styles.aboutDesc}>
              BestRoute is Sri Lanka's pioneering multimodal transit optimization
              platform, unifying buses, trains, three-wheelers, and walking into
              seamless, eco-conscious commutes.
            </Text>
            <View style={styles.aboutVersionBadge}>
              <Text style={styles.aboutVersionText}>Version 1.0.4 (Build 42)</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ================= HELP & SUPPORT MODAL ================= */}
      <Modal
        visible={isSupportVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsSupportVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsSupportVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Help & Support</Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView style={styles.modalBody}>
            <TouchableOpacity
              style={styles.supportContactCard}
              onPress={() =>
                Alert.alert(
                  "Call Support",
                  "Calling 24/7 Transit Hotline at 1919 (Sri Lanka Government Information Center)..."
                )
              }
              activeOpacity={0.8}
            >
              <Text style={styles.supportIcon}>📞</Text>
              <View>
                <Text style={styles.supportTitle}>24/7 Transit Helpline</Text>
                <Text style={styles.supportSub}>Call 1919 for live assistance</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportContactCard}
              onPress={() =>
                Alert.alert(
                  "Email Support",
                  "An email draft to support@bestroute.lk has been prepared."
                )
              }
              activeOpacity={0.8}
            >
              <Text style={styles.supportIcon}>✉️</Text>
              <View>
                <Text style={styles.supportTitle}>Email Our Team</Text>
                <Text style={styles.supportSub}>support@bestroute.lk</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= PRIVACY MODAL ================= */}
      <Modal
        visible={isPrivacyVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsPrivacyVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsPrivacyVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Privacy & Security</Text>
            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setIsPrivacyVisible(false)}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.prefSectionTitle}>Permissions & Data</Text>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Accurate GPS Location</Text>
                <Text style={styles.switchSub}>
                  Enables live station navigation & nearby bus tracking
                </Text>
              </View>
              <Switch
                value={locationTracking}
                onValueChange={setLocationTracking}
                trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                thumbColor={locationTracking ? "#1D64EC" : "#94A3B8"}
              />
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Push Delay Alerts</Text>
                <Text style={styles.switchSub}>
                  Instant notification when scheduled train/bus is delayed
                </Text>
              </View>
              <Switch
                value={pushAlerts}
                onValueChange={setPushAlerts}
                trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                thumbColor={pushAlerts ? "#1D64EC" : "#94A3B8"}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= LOGOUT CONFIRMATION MODAL ================= */}
      <Modal
        visible={isLogoutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalCard}>
            <View style={styles.logoutIconWrapper}>
              <Text style={styles.logoutModalIcon}>🚪</Text>
            </View>
            <Text style={styles.logoutModalTitle}>Log Out</Text>
            <Text style={styles.logoutModalMessage}>
              Are you sure you want to log out of your BestRoute account?
            </Text>
            <View style={styles.logoutButtonsRow}>
              <TouchableOpacity
                style={styles.logoutCancelBtn}
                onPress={() => setIsLogoutModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutConfirmBtn}
                onPress={confirmLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.logoutConfirmBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingBottom: 48,
  },
  safeHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  profileHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarBadgeDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#DBEAFE",
    fontWeight: "500",
    marginBottom: 6,
  },
  memberTagRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  memberTagText: {
    fontSize: 12,
    color: "#BFDBFE",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  // Floating Stats Card
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: -28,
    marginBottom: 16,
    zIndex: 10,
    position: "relative",
    ...Platform.select({
      web: {
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
      },
      default: {
        elevation: 4,
        shadowColor: "#1E293B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
  },
  statColumn: {
    alignItems: "center",
    flex: 1,
  },
  statNumberBlue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 3,
  },
  statNumberGreen: {
    fontSize: 22,
    fontWeight: "800",
    color: "#16A34A",
    marginBottom: 3,
  },
  statNumberAmber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D97706",
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#F1F5F9",
  },
  // Menu Groups
  menuGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#F8FAFC",
    marginLeft: 50,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 18,
    width: 28,
    textAlign: "center",
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  menuRightInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuCurrentSetting: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    marginRight: 6,
  },
  menuChevron: {
    fontSize: 18,
    color: "#CBD5E1",
    fontWeight: "700",
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "700",
  },
  footerStamp: {
    alignItems: "center",
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 2,
  },
  copyrightText: {
    fontSize: 11,
    color: "#CBD5E1",
  },
  // Bottom Navigation Bar
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 22 : 10,
    paddingHorizontal: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navIconActive: {
    color: "#1D64EC",
  },
  navIconInactive: {
    color: "#94A3B8",
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
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
    bottom: -4,
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
    minWidth: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  // Modals
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "700",
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalDoneBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalDoneText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
  },
  modalBody: {
    flex: 1,
    padding: 18,
  },
  prefSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  switchSub: {
    fontSize: 12,
    color: "#64748B",
  },
  // Language Modal
  languageModalBody: {
    padding: 18,
  },
  langOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  langOptionCardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
  },
  langOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  langOptionTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  langCheck: {
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "800",
  },
  // Driver Partner Box
  driverBannerBox: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  driverBigEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  driverBannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#92400E",
    textAlign: "center",
    marginBottom: 6,
  },
  driverBannerSub: {
    fontSize: 13,
    color: "#B45309",
    textAlign: "center",
    lineHeight: 18,
  },
  driverPerksBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 24,
  },
  driverPerkItem: {
    fontSize: 13.5,
    color: "#334155",
    lineHeight: 22,
    marginBottom: 8,
    fontWeight: "500",
  },
  driverRegisterBtn: {
    backgroundColor: "#D97706",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  driverRegisterBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  // About Content
  aboutContent: {
    alignItems: "center",
    padding: 28,
  },
  aboutLogoEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  aboutAppName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  aboutTagline: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginBottom: 14,
  },
  aboutDesc: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutVersionBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aboutVersionText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  // Support Cards
  supportContactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 12,
  },
  supportIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  supportSub: {
    fontSize: 13,
    color: "#64748B",
  },

  /* Logout Modal Styles */
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoutModalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
      default: { elevation: 6 },
    }),
  },
  logoutIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  logoutModalIcon: {
    fontSize: 28,
  },
  logoutModalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  logoutModalMessage: {
    fontSize: 13.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },
  logoutButtonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  logoutCancelBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutCancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
  logoutConfirmBtn: {
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)" },
      default: { elevation: 2 },
    }),
  },
  logoutConfirmBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Travel Preferences Modal Styles */
  tpContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  tpHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tpBackButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  tpBackIcon: {
    fontSize: 24,
    color: "#334155",
    fontWeight: "600",
    marginTop: -2,
  },
  tpHeaderTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginLeft: 14,
    letterSpacing: -0.3,
  },
  tpScrollView: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  tpScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  tpCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      web: { boxShadow: "0 2px 8px rgba(0,0,0,0.03)" },
      android: { elevation: 1 },
    }),
  },
  tpCardLabel: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.6,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  tpCardHeaderBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tpCardLabelNoMargin: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  tpTransfersBadge: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2563EB",
  },
  tpGridRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  tpPrefButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderRadius: 14,
    gap: 6,
  },
  tpPrefButtonActive: {
    backgroundColor: "#2563EB",
    borderWidth: 1,
    borderColor: "#2563EB",
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)" },
      android: { elevation: 2 },
    }),
  },
  tpPrefButtonInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tpPrefEmoji: {
    fontSize: 15,
  },
  tpPrefText: {
    fontSize: 14,
    fontWeight: "700",
  },
  tpPrefTextActive: {
    color: "#FFFFFF",
  },
  tpPrefTextInactive: {
    color: "#334155",
  },
  tpPillsRow: {
    flexDirection: "row",
    gap: 10,
  },
  tpPillButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
  },
  tpTolerancePillActive: {
    backgroundColor: "#0284C7", // Cyan/Teal blue
    borderWidth: 1,
    borderColor: "#0284C7",
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)" },
      android: { elevation: 2 },
    }),
  },
  tpTransfersPillActive: {
    backgroundColor: "#2563EB", // Vibrant Royal Blue
    borderWidth: 1,
    borderColor: "#2563EB",
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)" },
      android: { elevation: 2 },
    }),
  },
  tpPillInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tpPillText: {
    fontSize: 14,
    fontWeight: "700",
  },
  tpPillTextActive: {
    color: "#FFFFFF",
  },
  tpPillTextInactive: {
    color: "#334155",
  },
  tpToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
  },
  tpModeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tpModeEmoji: {
    fontSize: 17,
  },
  tpModeLabel: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  tpNotifLabel: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  tpBottomBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  tpSaveButton: {
    backgroundColor: "#1D64EC",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: { boxShadow: "0 6px 16px rgba(29, 100, 236, 0.3)" },
      android: { elevation: 3 },
    }),
  },
  tpSaveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
