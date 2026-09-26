import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/AppNavigator";

type LiveTrackingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LiveTracking"
>;

type LiveTrackingScreenRouteProp = RouteProp<
  RootStackParamList,
  "LiveTracking"
>;

interface Props {
  navigation: LiveTrackingScreenNavigationProp;
  route: LiveTrackingScreenRouteProp;
}

import RealisticRouteMap from "../components/RealisticRouteMap";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

export default function LiveTrackingScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();
  // Delay simulation toggle
  const [isDelayed, setIsDelayed] = useState(false);

  const handleSimulateDelay = () => {
    setIsDelayed(!isDelayed);
  };

  const handleReportProblem = () => {
    Alert.alert(
      "Report Disruption",
      "Would you like to report a delay or issue on Intercity Express?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report Issue",
          onPress: () =>
            Alert.alert("Report Sent", "Thank you for helping other commuters!"),
        },
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.screenBg }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Floating Back Button in Top Left Corner */}
      <TouchableOpacity
        style={[
          styles.floatingBackButton,
          isDarkMode && {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          },
        ]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        accessibilityLabel="Go back"
      >
        <Text
          style={[
            styles.floatingBackArrow,
            isDarkMode && { color: colors.textPrimary },
          ]}
        >
          ‹
        </Text>
      </TouchableOpacity>

      {/* Floating Dark Mode Button in Top Right Corner */}
      <ThemeToggle floating={true} size={38} />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Map Section with Realistic Navigation Map */}
        <View style={styles.mapArea}>
          <RealisticRouteMap
            height={250}
            showLiveVehicle={true}
            vehicleType="train"
            statusText={isDelayed ? "Delayed" : "On Time"}
            speedText={isDelayed ? "45 km/h" : "76 km/h"}
          />

          {/* Top Left: Live Tracking Floating Card */}
          <View
            style={[
              styles.liveTrackingCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.liveStatusTitleRow}>
              <View
                style={[
                  styles.liveGreenDot,
                  isDelayed && styles.liveAmberDot,
                ]}
              />
              <Text
                style={[
                  styles.liveTitleText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Live Tracking
              </Text>
            </View>
            <Text
              style={[
                styles.liveSubtitleText,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              {isDelayed ? "Delayed by +8 min" : "Your Journey is On Time"}
            </Text>
          </View>

          {/* Top Right: Simulate Delay Pill Button */}
          <TouchableOpacity
            style={[
              styles.simulateDelayButton,
              isDelayed && styles.simulateDelayButtonActive,
            ]}
            activeOpacity={0.8}
            onPress={handleSimulateDelay}
          >
            <Text
              style={[
                styles.simulateDelayText,
                isDelayed && styles.simulateDelayTextActive,
              ]}
            >
              {isDelayed ? "Reset Delay ↺" : "Simulate Delay ➔"}
            </Text>
          </TouchableOpacity>

          {/* Map Watermark */}
          <View style={styles.mapWatermark}>
            <Text style={styles.watermarkText}>BestRoute Maps</Text>
          </View>

          {/* Floating Horizontal Mode Progress Card */}
          <View
            style={[
              styles.floatingProgressCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            {/* Step 1: Bus 654 (Completed) */}
            <View style={styles.progressStepCol}>
              <View style={styles.stepCircleCompleted}>
                <Text style={styles.stepCheckmark}>✓</Text>
              </View>
              <Text
                style={[
                  styles.stepLabelCompleted,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Bus 654
              </Text>
            </View>

            {/* Connector Line 1 */}
            <View style={styles.stepConnectorActive} />

            {/* Step 2: Intercity (Current) */}
            <View style={styles.progressStepCol}>
              <View style={styles.stepCircleCurrent}>
                <View style={styles.currentInnerDot} />
              </View>
              <Text style={styles.stepLabelCurrent}>Intercity</Text>
            </View>

            {/* Connector Line 2 */}
            <View style={styles.stepConnectorPending} />

            {/* Step 3: Tuk-tuk (Upcoming) */}
            <View style={styles.progressStepCol}>
              <View style={styles.stepCirclePending}>
                <View style={styles.pendingInnerDot} />
              </View>
              <Text
                style={[
                  styles.stepLabelPending,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Tuk-tuk
              </Text>
            </View>

            {/* Connector Line 3 */}
            <View style={styles.stepConnectorPending} />

            {/* Step 4: Fort (Destination) */}
            <View style={styles.progressStepCol}>
              <View style={styles.stepCirclePending}>
                <Text style={styles.pinIconSmall}>📍</Text>
              </View>
              <Text
                style={[
                  styles.stepLabelPending,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Fort
              </Text>
            </View>
          </View>
        </View>

        {/* Content Section Below Map */}
        <View style={styles.mainContent}>
          {/* SECTION 1: CURRENTLY ON */}
          <Text
            style={[
              styles.sectionHeading,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            CURRENTLY ON
          </Text>

          <View
            style={[
              styles.currentlyOnCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.transportIconBox}>
              <Text style={styles.transportEmoji}>🚆</Text>
            </View>

            <View style={styles.currentlyOnTextContainer}>
              <Text
                style={[
                  styles.serviceNameText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Intercity Express
              </Text>
              <Text
                style={[
                  styles.serviceRouteText,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Fort ➔ Colombo Fort Station
              </Text>

              <View style={styles.arrivalStatusRow}>
                <Text
                  style={[
                    styles.arrivesInLabel,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  Arrives in
                </Text>
                <Text
                  style={[
                    styles.arrivesInValue,
                    isDarkMode && { color: colors.textPrimary },
                  ]}
                >
                  {isDelayed ? "40 min" : "32 min"}
                </Text>

                <View
                  style={[
                    styles.onTimeBadge,
                    isDelayed && styles.delayedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.onTimeBadgeText,
                      isDelayed && styles.delayedBadgeText,
                    ]}
                  >
                    {isDelayed ? "Delayed" : "On Time"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* SECTION 2: TRANSFER AT COLOMBO FORT */}
          <Text
            style={[
              styles.sectionHeading,
              { marginTop: 18 },
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            TRANSFER AT COLOMBO FORT
          </Text>

          <View
            style={[
              styles.transferCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.transferHeaderRow}>
              <View style={styles.transferTitleWrapper}>
                <Text
                  style={[
                    styles.transferStepTitle,
                    isDarkMode && { color: colors.textPrimary },
                  ]}
                >
                  🚶 Walk to Platform 4
                </Text>
                <Text
                  style={[
                    styles.transferStepSubtitle,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  ~3 min walk · IC Night Mail
                </Text>
              </View>

              <View style={styles.bufferColumn}>
                <Text
                  style={[
                    styles.bufferTimeText,
                    isDarkMode && { color: colors.textPrimary },
                  ]}
                >
                  {isDelayed ? "3:45" : "7:55"}
                </Text>
                <Text
                  style={[
                    styles.bufferLabelText,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  buffer
                </Text>
              </View>
            </View>

            {/* Transfer Buffer Progress Bar */}
            <View
              style={[
                styles.transferBarTrack,
                isDarkMode && { backgroundColor: colors.subtleBg },
              ]}
            >
              <View
                style={[
                  styles.transferBarFill,
                  isDelayed && styles.transferBarFillWarning,
                ]}
              />
            </View>
          </View>

          {/* SECTION 3: AFTER TRANSFER */}
          <Text
            style={[
              styles.sectionHeading,
              { marginTop: 18 },
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            AFTER TRANSFER
          </Text>

          <View
            style={[
              styles.afterTransferCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.tukIconCircle}>
              <Text style={styles.tukEmoji}>🛺</Text>
            </View>

            <View style={styles.afterTransferTextCol}>
              <Text
                style={[
                  styles.afterTransferTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Tuk-tuk to Destination
              </Text>
              <Text
                style={[
                  styles.afterTransferSubtitle,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                ~10 min · Rs. 40
              </Text>
            </View>

            <Text
              style={[
                styles.afterTransferTimeText,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              {isDelayed ? "10:13 AM" : "10:05 AM"}
            </Text>
          </View>

          {/* SECTION 4: ESTIMATED ARRIVAL & DURATION */}
          <View
            style={[
              styles.summaryCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.summaryLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Estimated arrival
              </Text>
              <Text
                style={[
                  styles.summaryTimeBig,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                {isDelayed ? "10:13 AM" : "10:05 AM"}
              </Text>
            </View>

            <View style={styles.summaryRightCol}>
              <Text
                style={[
                  styles.summaryLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Journey time
              </Text>
              <Text
                style={[
                  styles.summaryDurationBig,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                {isDelayed ? "1h 43m" : "1h 35m"}
              </Text>
            </View>
          </View>

          {/* SECTION 5: ACTION BUTTONS */}
          <View style={styles.dualButtonsRow}>
            {/* Full Journey Button */}
            <TouchableOpacity
              style={[
                styles.fullJourneyButton,
                isDarkMode && {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={[
                  styles.fullJourneyButtonText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Full Journey
              </Text>
            </TouchableOpacity>

            {/* Report Problem Button */}
            <TouchableOpacity
              style={styles.reportProblemButton}
              activeOpacity={0.8}
              onPress={handleReportProblem}
            >
              <Text style={styles.reportProblemButtonText}>Report Problem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 36,
  },

  /* Top Map Area */
  mapArea: {
    height: 250,
    backgroundColor: "#E2E8F0",
    position: "relative",
    overflow: "hidden",
  },
  mapGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  mapBlock: {
    width: "30%",
    height: 52,
    backgroundColor: "#EFF4F9",
    borderRadius: 10,
  },
  mapBlockPark: {
    backgroundColor: "#DCFCE7",
  },
  mapBlockWater: {
    backgroundColor: "#E0F2FE",
  },
  mapDashedTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "48%",
    height: 2,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    borderStyle: "dashed",
  },
  mapRouteSegment1: {
    position: "absolute",
    left: "14%",
    top: "56%",
    width: "25%",
    height: 4,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    transform: [{ rotate: "-22deg" }],
  },
  mapRouteSegment2: {
    position: "absolute",
    left: "38%",
    right: "14%",
    top: "47%",
    height: 4,
    backgroundColor: "#2563EB",
    borderRadius: 2,
  },
  stationRing: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  stationCoreDone: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  stationCoreActive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#2563EB",
  },
  stationCoreDark: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#64748B",
  },
  destinationPin: {
    position: "absolute",
    zIndex: 6,
  },
  pinIconSymbol: {
    fontSize: 18,
  },

  /* Animated Vehicle */
  animatedVehicle: {
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleHalo: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(37, 99, 235, 0.3)",
  },
  vehicleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  /* Floating Top Left Back Button */
  floatingBackButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 14,
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 60,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      },
      default: {
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
    }),
  },
  floatingBackArrow: {
    fontSize: 26,
    fontWeight: "500",
    color: "#0F172A",
    marginTop: -3,
  },

  /* Top HUD: Live Tracking Card */
  liveTrackingCard: {
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 14,
    left: 60,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 15,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      },
      default: {
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    }),
  },
  liveStatusTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#10B981",
  },
  liveAmberDot: {
    backgroundColor: "#F59E0B",
  },
  liveTitleText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  liveSubtitleText: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },

  /* Top HUD: Simulate Delay Pill */
  simulateDelayButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 14,
    right: 60,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    zIndex: 15,
  },
  simulateDelayButtonActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  simulateDelayText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B45309",
    textAlign: "center",
  },
  simulateDelayTextActive: {
    color: "#DC2626",
    textAlign: "center",
  },

  /* Watermark */
  mapWatermark: {
    position: "absolute",
    right: 8,
    bottom: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  watermarkText: {
    fontSize: 8,
    color: "#64748B",
  },

  /* Floating Horizontal Mode Progress Card */
  floatingProgressCard: {
    position: "absolute",
    bottom: 6,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    zIndex: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
      },
      default: {
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
      },
    }),
  },
  progressStepCol: {
    alignItems: "center",
  },
  stepCircleCompleted: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
    borderWidth: 1.5,
    borderColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepCheckmark: {
    color: "#10B981",
    fontSize: 13,
    fontWeight: "bold",
  },
  stepLabelCompleted: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
    textAlign: "center",
  },
  stepConnectorActive: {
    flex: 1,
    height: 2,
    backgroundColor: "#10B981",
    marginHorizontal: 4,
    marginBottom: 14,
  },
  stepCircleCurrent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  currentInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  stepLabelCurrent: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2563EB",
    textAlign: "center",
  },
  stepConnectorPending: {
    flex: 1,
    height: 2,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 4,
    marginBottom: 14,
  },
  stepCirclePending: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  pendingInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
  },
  pinIconSmall: {
    fontSize: 12,
  },
  stepLabelPending: {
    fontSize: 10,
    color: "#94A3B8",
    textAlign: "center",
  },

  /* Content Below Map */
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  /* SECTION 1: CURRENTLY ON */
  currentlyOnCard: {
    backgroundColor: "#F0F7FF",
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  transportIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  transportEmoji: {
    fontSize: 22,
  },
  currentlyOnTextContainer: {
    flex: 1,
  },
  serviceNameText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  serviceRouteText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  arrivalStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  arrivesInLabel: {
    fontSize: 12,
    color: "#64748B",
    marginRight: 5,
  },
  arrivesInValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1D64EC",
    marginRight: 8,
  },
  onTimeBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  onTimeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  delayedBadge: {
    backgroundColor: "#FEE2E2",
  },
  delayedBadgeText: {
    color: "#DC2626",
  },

  /* SECTION 2: TRANSFER AT COLOMBO FORT */
  transferCard: {
    backgroundColor: "#F8FBFF",
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    borderRadius: 16,
    padding: 14,
  },
  transferHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  transferTitleWrapper: {
    flex: 1,
  },
  transferStepTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1D64EC",
  },
  transferStepSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  bufferColumn: {
    alignItems: "flex-end",
  },
  bufferTimeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  bufferLabelText: {
    fontSize: 10,
    color: "#64748B",
  },
  transferBarTrack: {
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    marginTop: 10,
    overflow: "hidden",
  },
  transferBarFill: {
    width: "75%",
    height: "100%",
    backgroundColor: "#1D64EC",
    borderRadius: 3,
  },
  transferBarFillWarning: {
    width: "35%",
    backgroundColor: "#F59E0B",
  },

  /* SECTION 3: AFTER TRANSFER */
  afterTransferCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  tukIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FCE7F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tukEmoji: {
    fontSize: 18,
  },
  afterTransferTextCol: {
    flex: 1,
  },
  afterTransferTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  afterTransferSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  afterTransferTimeText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },

  /* SECTION 4: ESTIMATED ARRIVAL & DURATION */
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },
  summaryTimeBig: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  summaryRightCol: {
    alignItems: "flex-end",
  },
  summaryDurationBig: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1D64EC",
    marginTop: 2,
  },

  /* SECTION 5: ACTION BUTTONS */
  dualButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  fullJourneyButton: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  fullJourneyButtonText: {
    color: "#1D64EC",
    fontSize: 14,
    fontWeight: "700",
  },
  reportProblemButton: {
    flex: 1,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  reportProblemButtonText: {
    color: "#B45309",
    fontSize: 14,
    fontWeight: "700",
  },
});
