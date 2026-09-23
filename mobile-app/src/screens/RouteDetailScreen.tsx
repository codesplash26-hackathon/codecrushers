import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/AppNavigator";

type RouteDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RouteDetail"
>;

type RouteDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "RouteDetail"
>;

import RealisticRouteMap from "../components/RealisticRouteMap";

interface Props {
  navigation: RouteDetailScreenNavigationProp;
  route: RouteDetailScreenRouteProp;
}

export default function RouteDetailScreen({ navigation, route }: Props) {
  const fromCity = route.params?.from || "Kandy";
  const toCity = route.params?.to || "Colombo Fort";
  const fare = route.params?.fare || "Rs. 320";

  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Map Section with Floating Badges */}
        <View style={styles.mapArea}>
          <RealisticRouteMap
            height={165}
            showLiveVehicle={true}
            vehicleType="train"
            from={fromCity}
            to={toCity}
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            style={styles.floatingBackButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.floatingBackIcon}>‹</Text>
          </TouchableOpacity>

          {/* Floating "Recommended Route" Badge */}
          <View style={styles.recommendedRouteBadge}>
            <Text style={styles.recommendedRouteText}>Recommended Route</Text>
          </View>

          {/* Floating Zoom Control */}
          <TouchableOpacity style={styles.mapZoomButton}>
            <Text style={styles.zoomButtonText}>−</Text>
          </TouchableOpacity>

          {/* Watermark */}
          <View style={styles.mapWatermark}>
            <Text style={styles.watermarkText}>BestRoute Maps</Text>
          </View>
        </View>

        {/* Floating "Your Journey" Summary Card */}
        <View style={styles.journeySummaryCard}>
          {/* Title & Fare Row */}
          <View style={styles.summaryTitleRow}>
            <View>
              <Text style={styles.summaryTitle}>Your Journey</Text>
              <Text style={styles.summarySubtitle}>
                {fromCity} ➔ {toCity}
              </Text>
            </View>

            <View style={styles.priceColumn}>
              <Text style={styles.priceAmount}>{fare}</Text>
              <Text style={styles.priceLabel}>Estimated total</Text>
            </View>
          </View>

          {/* 4 Stat Boxes Row */}
          <View style={styles.statBoxesRow}>
            {/* Stat 1: Duration */}
            <View style={[styles.statBox, styles.statBoxBlue]}>
              <Text style={styles.statBoxIcon}>⏱️</Text>
              <Text style={styles.statValueBlue}>1h 35m</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>

            {/* Stat 2: Walking */}
            <View style={[styles.statBox, styles.statBoxCyan]}>
              <Text style={styles.statBoxIcon}>🚶</Text>
              <Text style={styles.statValueCyan}>8 min</Text>
              <Text style={styles.statLabel}>Walking</Text>
            </View>

            {/* Stat 3: Transfers */}
            <View style={[styles.statBox, styles.statBoxPurple]}>
              <Text style={styles.statBoxIcon}>🔄</Text>
              <Text style={styles.statValuePurple}>2</Text>
              <Text style={styles.statLabel}>Transfers</Text>
            </View>

            {/* Stat 4: Reliability */}
            <View style={[styles.statBox, styles.statBoxGreen]}>
              <Text style={styles.statBoxIcon}>🛡️</Text>
              <Text style={styles.statValueGreen}>High</Text>
              <Text style={styles.statLabel}>Reliability</Text>
            </View>
          </View>

          {/* Connection Risk Banner */}
          <View style={styles.connectionRiskBanner}>
            <View style={styles.riskLeftCol}>
              <View style={styles.greenRiskDot} />
              <Text style={styles.greenRiskText}>Connection Risk: Low</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.riskDetailsLink}>Details ➔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* JOURNEY TIMELINE SECTION */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineHeading}>JOURNEY TIMELINE</Text>

          <View style={styles.timelineContainer}>
            {/* Step 1: Bus 654 */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeftTrack}>
                <Text style={styles.timelineTimeText}>8:30 AM</Text>
                <View style={[styles.timelineNode, styles.nodeBus]}>
                  <Text style={styles.nodeIcon}>🚌</Text>
                </View>
                <View style={styles.verticalTrackLine} />
              </View>

              <View style={styles.timelineContentCard}>
                <Text style={styles.cardStepTitle}>
                  Board Bus 654 — Colombo Fort
                </Text>
                <Text style={styles.cardStepLocation}>
                  Kandy Bus Stand, Platform 3
                </Text>

                <View style={styles.cardFooterRow}>
                  <Text style={styles.cardFooterInfo}>
                    Departs 8:30 AM · Rs. 120
                  </Text>
                  <View style={styles.pillDurationBlue}>
                    <Text style={styles.pillDurationTextBlue}>20 min</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Step 2: Walk */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeftTrack}>
                <Text style={styles.timelineTimeText}>8:50 AM</Text>
                <View style={[styles.timelineNode, styles.nodeWalk]}>
                  <Text style={styles.nodeIcon}>🚶</Text>
                </View>
                <View style={styles.verticalTrackLine} />
              </View>

              <View style={styles.timelineContentCard}>
                <Text style={styles.cardStepTitle}>
                  Walk to Fort Railway Station
                </Text>
                <Text style={styles.cardStepLocation}>
                  Via Colombo Street
                </Text>

                <View style={styles.cardFooterRow}>
                  <Text style={styles.cardFooterInfo}>~380 m</Text>
                  <View style={styles.pillDurationGray}>
                    <Text style={styles.pillDurationTextGray}>5 min</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Step 3: Train */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeftTrack}>
                <Text style={styles.timelineTimeText}>8:55 AM</Text>
                <View style={[styles.timelineNode, styles.nodeTrain]}>
                  <Text style={styles.nodeIcon}>🚆</Text>
                </View>
                <View style={styles.verticalTrackLine} />
              </View>

              <View style={styles.timelineContentCard}>
                <Text style={styles.cardStepTitle}>
                  Intercity Express — Colombo Fort
                </Text>
                <Text style={styles.cardStepLocation}>
                  Platform 1, Coach C
                </Text>

                <View style={styles.cardFooterRow}>
                  <Text style={styles.cardFooterInfo}>
                    Departs 8:55 AM · Rs. 160 · Platform 1
                  </Text>
                  <View style={styles.pillDurationGreen}>
                    <Text style={styles.pillDurationTextGreen}>55 min</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Step 4: Tuk-tuk */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeftTrack}>
                <Text style={styles.timelineTimeText}>9:50 AM</Text>
                <View style={[styles.timelineNode, styles.nodeTuk]}>
                  <Text style={styles.nodeIcon}>🛺</Text>
                </View>
                <View style={styles.verticalTrackLine} />
              </View>

              <View style={styles.timelineContentCard}>
                <Text style={styles.cardStepTitle}>
                  Tuk-tuk to Destination
                </Text>
                <Text style={styles.cardStepLocation}>
                  Colombo Fort Station Exit
                </Text>

                <View style={styles.cardFooterRow}>
                  <Text style={styles.cardFooterInfo}>Estimate Rs. 40</Text>
                  <View style={styles.pillDurationPink}>
                    <Text style={styles.pillDurationTextPink}>10 min</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Step 5: Arrived at Colombo Fort */}
            <View style={styles.timelineRow}>
              <View style={styles.timelineLeftTrack}>
                <Text style={styles.timelineTimeText}>10:05 AM</Text>
                <View style={[styles.timelineNode, styles.nodeDestination]}>
                  <Text style={styles.nodeIconWhite}>📍</Text>
                </View>
              </View>

              <View style={[styles.timelineContentCard, styles.cardArrived]}>
                <Text style={styles.cardArrivedTitle}>Colombo Fort</Text>
                <Text style={styles.cardArrivedSubtitle}>
                  Arrived · Journey complete
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* LAST-MILE VEHICLES SECTION */}
        <View style={styles.lastMileContainer}>
          {/* Top Info Header */}
          <View style={styles.lastMileHeaderRow}>
            <View style={styles.lastMileTitleWrapper}>
              <Text style={styles.lastMileTitle}>🛺 LAST-MILE VEHICLES</Text>
            </View>
            <View style={styles.arrivalLocationBadge}>
              <Text style={styles.arrivalLocationBadgeText}>
                Colombo Fort arrival
              </Text>
            </View>
          </View>

          <Text style={styles.lastMileDescription}>
            Expected vehicles available when your train arrives at 10:05 AM
          </Text>

          {/* Two Vehicle Option Cards */}
          <View style={styles.vehiclesTwoColRow}>
            {/* Taxi Box */}
            <View style={styles.vehicleColBox}>
              <Text style={styles.vehicleBoxHeading}>🚕 Taxi</Text>
              <Text style={styles.vehicleCountText}>8+</Text>
              <Text style={styles.vehicleFareInfo}>~2 min · Rs. 350-500</Text>
            </View>

            {/* Tuk-tuk Box */}
            <View style={styles.vehicleColBox}>
              <Text style={styles.vehicleBoxHeading}>🛺 Tuk-tuk</Text>
              <Text style={styles.vehicleCountText}>12+</Text>
              <Text style={styles.vehicleFareInfo}>~1 min · Rs. 150-250</Text>
            </View>
          </View>

          {/* View Available Vehicles Button */}
          <TouchableOpacity
            style={styles.viewVehiclesButton}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("AvailableVehicles", {
                station: toCity,
                arrivalTime: "5:40 PM",
              })
            }
          >
            <Text style={styles.viewVehiclesButtonText}>
              View Available Vehicles ➔
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          activeOpacity={0.7}
          onPress={() => setIsFavorited(!isFavorited)}
        >
          <Text
            style={[
              styles.heartIconText,
              isFavorited && styles.heartIconActive,
            ]}
          >
            {isFavorited ? "❤️" : "♡"}
          </Text>
        </TouchableOpacity>

        {/* Start Journey Button */}
        <TouchableOpacity
          style={styles.startJourneyButton}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("LiveTracking", {
              from: fromCity,
              to: toCity,
            })
          }
        >
          <Text style={styles.startJourneyButtonText}>Start Journey ➔</Text>
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
    paddingBottom: 110,
  },

  /* Top Map Area */
  mapArea: {
    height: 155,
    backgroundColor: "#E2E8F0",
    position: "relative",
    overflow: "hidden",
  },
  mapGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  mapBlock: {
    width: "30%",
    height: 48,
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
  mapActiveRouteSegment1: {
    position: "absolute",
    left: "14%",
    top: "56%",
    width: "26%",
    height: 4,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    transform: [{ rotate: "-22deg" }],
  },
  mapActiveRouteSegment2: {
    position: "absolute",
    left: "38%",
    right: "16%",
    top: "47%",
    height: 4,
    backgroundColor: "#2563EB",
    borderRadius: 2,
  },
  mapNodeDot: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  mapNodeCoreBlue: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
  },
  mapNodeCoreDark: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#475569",
  },
  mapDestinationPin: {
    position: "absolute",
    zIndex: 6,
  },
  pinSymbol: {
    fontSize: 18,
  },
  floatingBackButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 36,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
  floatingBackIcon: {
    fontSize: 24,
    color: "#334155",
    marginTop: -2,
    fontWeight: "600",
  },
  recommendedRouteBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 38,
    right: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    zIndex: 10,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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
  recommendedRouteText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "700",
  },
  mapZoomButton: {
    position: "absolute",
    right: 16,
    top: Platform.OS === "ios" ? 96 : 80,
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  zoomButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#475569",
  },
  mapWatermark: {
    position: "absolute",
    right: 8,
    bottom: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  watermarkText: {
    fontSize: 8,
    color: "#64748B",
  },

  /* Floating "Your Journey" Summary Card */
  journeySummaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    zIndex: 15,
    ...Platform.select({
      web: {
        boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
      },
      default: {
        elevation: 4,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
  },
  summaryTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  summarySubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  priceColumn: {
    alignItems: "flex-end",
  },
  priceAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1D64EC",
  },
  priceLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 1,
  },
  statBoxesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  statBoxBlue: {
    backgroundColor: "#EFF6FF",
  },
  statBoxCyan: {
    backgroundColor: "#ECFEFF",
  },
  statBoxPurple: {
    backgroundColor: "#F5F3FF",
  },
  statBoxGreen: {
    backgroundColor: "#F0FDF4",
  },
  statBoxIcon: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValueBlue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1D64EC",
  },
  statValueCyan: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0891B2",
  },
  statValuePurple: {
    fontSize: 12,
    fontWeight: "800",
    color: "#7C3AED",
  },
  statValueGreen: {
    fontSize: 12,
    fontWeight: "800",
    color: "#16A34A",
  },
  statLabel: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
  },
  connectionRiskBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  riskLeftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  greenRiskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  greenRiskText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  riskDetailsLink: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },

  /* Journey Timeline Section */
  timelineSection: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  timelineHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  timelineContainer: {
    gap: 6,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineLeftTrack: {
    width: 68,
    alignItems: "center",
    position: "relative",
    paddingTop: 4,
  },
  timelineTimeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 6,
  },
  timelineNode: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  nodeBus: {
    backgroundColor: "#DBEAFE",
  },
  nodeWalk: {
    backgroundColor: "#F1F5F9",
  },
  nodeTrain: {
    backgroundColor: "#DCFCE7",
  },
  nodeTuk: {
    backgroundColor: "#FCE7F3",
  },
  nodeDestination: {
    backgroundColor: "#EF4444",
  },
  nodeIcon: {
    fontSize: 13,
  },
  nodeIconWhite: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  verticalTrackLine: {
    position: "absolute",
    top: 48,
    bottom: -8,
    width: 1.5,
    backgroundColor: "#E2E8F0",
    zIndex: 1,
  },

  /* Timeline Card Content */
  timelineContentCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      web: {
        boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
      },
      default: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
    }),
  },
  cardStepTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  cardStepLocation: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cardFooterInfo: {
    fontSize: 11,
    color: "#64748B",
  },
  pillDurationBlue: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillDurationTextBlue: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
  },
  pillDurationGray: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillDurationTextGray: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
  },
  pillDurationGreen: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillDurationTextGreen: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },
  pillDurationPink: {
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillDurationTextPink: {
    fontSize: 10,
    fontWeight: "700",
    color: "#DB2777",
  },

  /* Arrived Card */
  cardArrived: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
  cardArrivedTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#DC2626",
  },
  cardArrivedSubtitle: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 2,
  },

  /* Last-Mile Vehicles Section */
  lastMileContainer: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 14,
  },
  lastMileHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  lastMileTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMileTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#92400E",
    letterSpacing: 0.5,
  },
  arrivalLocationBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  arrivalLocationBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B45309",
  },
  lastMileDescription: {
    fontSize: 11,
    color: "#B45309",
    marginBottom: 12,
    lineHeight: 16,
  },
  vehiclesTwoColRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  vehicleColBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    padding: 12,
  },
  vehicleBoxHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  vehicleCountText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#D97706",
    marginBottom: 2,
  },
  vehicleFareInfo: {
    fontSize: 10,
    color: "#64748B",
  },
  viewVehiclesButton: {
    backgroundColor: "#C25E00",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  viewVehiclesButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  /* Fixed Bottom Action Bar */
  bottomActionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 28 : 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  heartIconText: {
    fontSize: 20,
    color: "#94A3B8",
  },
  heartIconActive: {
    color: "#EF4444",
  },
  startJourneyButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#1D64EC",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 4px 14px rgba(29, 100, 236, 0.35)",
      },
      default: {
        elevation: 4,
        shadowColor: "#1D64EC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  startJourneyButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
