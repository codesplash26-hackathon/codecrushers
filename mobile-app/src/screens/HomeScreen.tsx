import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  // State
  const [fromLocation, setFromLocation] = useState("Kandy City");
  const [toLocation, setToLocation] = useState("");
  const [departMode, setDepartMode] = useState<"depart" | "arrive">("depart");
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("8:30 AM");
  const [selectedOptimization, setSelectedOptimization] = useState<
    "fastest" | "cheapest" | "walking"
  >("fastest");
  const [isFavorited1, setIsFavorited1] = useState(true);
  const [isFavorited2, setIsFavorited2] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "home" | "journeys" | "alerts" | "profile"
  >("home");

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation || "Colombo Fort");
    setToLocation(temp);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Gradient Area */}
        <LinearGradient
          colors={["#1655E8", "#1E68F8", "#088DE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.heroGradient}
        >
          {/* Top Bar Header */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greetingText}>Good morning 👋</Text>
              <Text style={styles.heroTitle}>Where are you going?</Text>
            </View>

            <View style={styles.topBarActions}>
              <TouchableOpacity
                style={styles.themeIconButton}
                activeOpacity={0.8}
              >
                <Text style={styles.themeIcon}>🌙</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatarCircle}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Login")}
              >
                <View style={styles.avatarInner} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Card Container Floating in Header */}
          <View style={styles.searchCard}>
            {/* FROM Input Box */}
            <View style={styles.locationInputBox}>
              <View style={styles.bluePinOuter}>
                <View style={styles.bluePinInner} />
              </View>
              <View style={styles.locationTextWrapper}>
                <Text style={styles.fieldLabel}>FROM</Text>
                <TextInput
                  style={styles.locationInput}
                  value={fromLocation}
                  onChangeText={setFromLocation}
                  placeholder="Starting point"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Connecting Track & Swap Button */}
            <View style={styles.dividerRow}>
              <View style={styles.verticalLine} />
              <TouchableOpacity
                style={styles.swapButton}
                activeOpacity={0.7}
                onPress={handleSwapLocations}
              >
                <Text style={styles.swapIcon}>⇅</Text>
              </TouchableOpacity>
            </View>

            {/* TO Input Box */}
            <View style={styles.locationInputBox}>
              <View style={styles.redPinOuter}>
                <Text style={styles.pinSymbol}>📍</Text>
              </View>
              <View style={styles.locationTextWrapper}>
                <Text style={styles.fieldLabel}>TO</Text>
                <TextInput
                  style={styles.locationInput}
                  value={toLocation}
                  onChangeText={setToLocation}
                  placeholder="Where to?"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Depart At / Arrive By Segmented Toggle */}
            <View style={styles.segmentedContainer}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  departMode === "depart" && styles.segmentButtonActive,
                ]}
                onPress={() => setDepartMode("depart")}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentText,
                    departMode === "depart" && styles.segmentTextActive,
                  ]}
                >
                  Depart at
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  departMode === "arrive" && styles.segmentButtonActive,
                ]}
                onPress={() => setDepartMode("arrive")}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentText,
                    departMode === "arrive" && styles.segmentTextActive,
                  ]}
                >
                  Arrive by
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Time Selectors */}
            <View style={styles.quickTimeRow}>
              <TouchableOpacity
                style={styles.leaveNowButton}
                activeOpacity={0.8}
              >
                <Text style={styles.leaveNowIcon}>🕒</Text>
                <Text style={styles.leaveNowText}>Leave now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.todayDropdownButton}
                activeOpacity={0.8}
              >
                <Text style={styles.todayDropdownText}>Today · Now ▾</Text>
              </TouchableOpacity>
            </View>

            {/* Date & Time Picker Box */}
            <View style={styles.pickerBox}>
              <Text style={styles.pickerLabel}>DATE</Text>
              <View style={styles.pillsRow}>
                {["Today", "Tomorrow", "Wed 17", "Thu 18"].map((date) => {
                  const isSelected = selectedDate === date;
                  return (
                    <TouchableOpacity
                      key={date}
                      style={[
                        styles.datePill,
                        isSelected && styles.datePillActive,
                      ]}
                      onPress={() => setSelectedDate(date)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.datePillText,
                          isSelected && styles.datePillTextActive,
                        ]}
                      >
                        {date}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.pickerLabel, { marginTop: 12 }]}>TIME</Text>
              <View style={styles.pillsRow}>
                {["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM"].map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timePill,
                        isSelected && styles.timePillActive,
                      ]}
                      onPress={() => setSelectedTime(time)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.timePillText,
                          isSelected && styles.timePillTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={styles.confirmButton}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Optimize Your Journey Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Optimize your journey</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.sectionLink}>More options</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedOptimization === "fastest" && styles.filterPillActive,
              ]}
              onPress={() => setSelectedOptimization("fastest")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedOptimization === "fastest" &&
                    styles.filterPillTextActive,
                ]}
              >
                ⚡ Fastest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedOptimization === "cheapest" && styles.filterPillActive,
              ]}
              onPress={() => setSelectedOptimization("cheapest")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedOptimization === "cheapest" &&
                    styles.filterPillTextActive,
                ]}
              >
                💰 Cheapest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedOptimization === "walking" && styles.filterPillActive,
              ]}
              onPress={() => setSelectedOptimization("walking")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedOptimization === "walking" &&
                    styles.filterPillTextActive,
                ]}
              >
                🚶 Less Walking
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterIconPill}
              activeOpacity={0.8}
            >
              <Text style={styles.filterExtraIcon}>☑</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Big CTA Button */}
          <TouchableOpacity
            style={styles.findRoutesButton}
            activeOpacity={0.85}
          >
            <Text style={styles.findRoutesText}>Find Best Routes ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Journeys Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Recent Journeys</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.sectionLink}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Card 1 */}
          <View style={styles.recentCard}>
            <View style={styles.recentPinBox}>
              <Text style={styles.recentPinIcon}>📍</Text>
            </View>

            <View style={styles.recentDetails}>
              <Text style={styles.recentRoute}>
                Kandy City <Text style={styles.arrowText}>➔</Text> Colombo Fort
              </Text>
              <Text style={styles.recentSubtext}>Today, 8:30 AM · Rs. 320</Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsFavorited1(!isFavorited1)}
              activeOpacity={0.7}
              style={styles.heartWrapper}
            >
              <Text style={[styles.heartIcon, isFavorited1 && styles.heartFilled]}>
                {isFavorited1 ? "❤️" : "♡"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Card 2 */}
          <View style={styles.recentCard}>
            <View style={styles.recentPinBox}>
              <Text style={styles.recentPinIcon}>📍</Text>
            </View>

            <View style={styles.recentDetails}>
              <Text style={styles.recentRoute}>
                University of Sri Jay. <Text style={styles.arrowText}>➔</Text> Kandy
              </Text>
              <Text style={styles.recentSubtext}>Yesterday · Rs. 180</Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsFavorited2(!isFavorited2)}
              activeOpacity={0.7}
              style={styles.heartWrapper}
            >
              <Text style={[styles.heartIcon, isFavorited2 && styles.heartFilled]}>
                {isFavorited2 ? "❤️" : "♡"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Travel Summary Section */}
        <View style={[styles.section, { marginBottom: 36 }]}>
          <Text style={styles.sectionHeading}>Your travel summary</Text>

          <View style={styles.summaryRow}>
            {/* Stat 1 */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumberBlue}>24</Text>
              <Text style={styles.summaryLabel}>Journeys</Text>
            </View>

            {/* Stat 2 */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumberGreen}>Rs.1.2k</Text>
              <Text style={styles.summaryLabel}>Saved</Text>
            </View>

            {/* Stat 3 */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumberTeal}>3.5h</Text>
              <Text style={styles.summaryLabel}>Hours saved</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("home")}
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
            ]}
          >
            Home
          </Text>
          {activeTab === "home" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        {/* Journeys Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("journeys")}
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
            ]}
          >
            Journeys
          </Text>
        </TouchableOpacity>

        {/* Alerts Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("alerts")}
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
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === "alerts"
                ? styles.navLabelActive
                : styles.navLabelInactive,
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("profile")}
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
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  /* Hero Gradient */
  heroGradient: {
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greetingText: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 13,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.3,
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    justifyContent: "center",
    alignItems: "center",
  },
  themeIcon: {
    fontSize: 16,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E2E8F0",
  },

  /* Search Card */
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
      },
      default: {
        elevation: 6,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
    }),
  },
  locationInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bluePinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(29, 100, 236, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bluePinInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1D64EC",
  },
  redPinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pinSymbol: {
    fontSize: 14,
  },
  locationTextWrapper: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  locationInput: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    padding: 0,
  },

  /* Divider & Swap Button */
  dividerRow: {
    height: 22,
    position: "relative",
    justifyContent: "center",
  },
  verticalLine: {
    position: "absolute",
    left: 27,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: "#E2E8F0",
  },
  swapButton: {
    position: "absolute",
    right: 18,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
    }),
  },
  swapIcon: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "bold",
  },

  /* Segmented Control */
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 3,
    marginTop: 14,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: "#1D64EC",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  segmentTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Quick Time Row */
  quickTimeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  leaveNowButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  leaveNowIcon: {
    fontSize: 13,
  },
  leaveNowText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  todayDropdownButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    paddingVertical: 8,
  },
  todayDropdownText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D64EC",
  },

  /* Date & Time Picker Box */
  pickerBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  pickerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "space-between",
  },
  datePill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: "center",
  },
  datePillActive: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  datePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  datePillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  timePill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: "center",
  },
  timePillActive: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  timePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  timePillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: "#1D64EC",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 14,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Section Styles */
  section: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D64EC",
  },

  /* Filter Pills */
  filterPillsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  filterPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterPillActive: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  filterIconPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  filterExtraIcon: {
    fontSize: 14,
    color: "#64748B",
  },

  /* Big CTA Button */
  findRoutesButton: {
    backgroundColor: "#165FE9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
    ...Platform.select({
      web: {
        boxShadow: "0 6px 18px rgba(22, 95, 233, 0.35)",
      },
      default: {
        elevation: 4,
        shadowColor: "#165FE9",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
    }),
  },
  findRoutesText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  /* Recent Journeys Cards */
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
      default: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
    }),
  },
  recentPinBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentPinIcon: {
    fontSize: 16,
  },
  recentDetails: {
    flex: 1,
  },
  recentRoute: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  arrowText: {
    color: "#64748B",
    fontSize: 13,
  },
  recentSubtext: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },
  heartWrapper: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 16,
    color: "#CBD5E1",
  },
  heartFilled: {
    color: "#EF4444",
  },

  /* Travel Summary */
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
      default: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
    }),
  },
  summaryNumberBlue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1D64EC",
  },
  summaryNumberGreen: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10B981",
  },
  summaryNumberTeal: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0891B2",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 4,
  },

  /* Bottom Navigation Bar */
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
    bottom: -6,
    width: 24,
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
});
