import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
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

interface Props {
  navigation: RouteDetailScreenNavigationProp;
  route: RouteDetailScreenRouteProp;
}

export default function RouteDetailScreen({ navigation, route }: Props) {
  const fromCity = route.params?.from || "Kandy City";
  const toCity = route.params?.to || "Colombo Fort";
  const routeType = route.params?.routeType || "BEST MATCH";
  const fare = route.params?.fare || "Rs. 320";
  const duration = route.params?.duration || "1h 35m";
  const departureTime = route.params?.departureTime || "8:30 AM";
  const arrivalTime = route.params?.arrivalTime || "10:05 AM";

  // Animated vehicle progress along the map
  const vehicleProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(vehicleProgress, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.delay(800),
        Animated.timing(vehicleProgress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [vehicleProgress]);

  const vehicleLeft = vehicleProgress.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: ["10%", "35%", "65%", "88%"],
  });

  const vehicleTop = vehicleProgress.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: ["68%", "45%", "42%", "30%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>{fromCity} ➔ {toCity}</Text>
          <Text style={styles.headerSubtitle}>
            {departureTime} - {arrivalTime} · {duration} · {fare}
          </Text>
        </View>

        <TouchableOpacity style={styles.shareIconButton} activeOpacity={0.7}>
          <Text style={styles.shareIconText}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Map Section */}
        <View style={styles.mapCard}>
          <View style={styles.mapCanvas}>
            {/* Map Grid Background */}
            <View style={styles.mapRow}>
              <View style={styles.mapBlock} />
              <View style={[styles.mapBlock, styles.mapPark]} />
              <View style={styles.mapBlock} />
            </View>
            <View style={styles.mapRow}>
              <View style={styles.mapBlock} />
              <View style={styles.mapBlock} />
              <View style={[styles.mapBlock, styles.mapWater]} />
            </View>
            <View style={styles.mapRow}>
              <View style={styles.mapBlock} />
              <View style={styles.mapBlock} />
              <View style={styles.mapBlock} />
            </View>

            {/* Base Dashed Railway Track */}
            <View style={styles.railTrackDashed} />

            {/* Solid Active Blue Route Line */}
            <View style={styles.activeRouteLineDiagonal} />
            <View style={styles.activeRouteLineHorizontal} />

            {/* Station Rings */}
            <View style={[styles.stationNode, { left: "10%", top: "66%" }]}>
              <View style={styles.stationCoreBlue} />
            </View>
            <View style={[styles.stationNode, { left: "35%", top: "45%" }]}>
              <View style={styles.stationCoreDark} />
            </View>
            <View style={[styles.stationNode, { left: "65%", top: "43%" }]}>
              <View style={styles.stationCoreDark} />
            </View>
            <View style={[styles.destinationPin, { left: "88%", top: "22%" }]}>
              <Text style={styles.pinIconText}>📍</Text>
            </View>

            {/* Animated Vehicle Dot */}
            <Animated.View
              style={[
                styles.movingVehiclePill,
                {
                  left: vehicleLeft,
                  top: vehicleTop,
                },
              ]}
            >
              <View style={styles.vehiclePulsingHalo} />
              <View style={styles.vehicleCoreDot}>
                <Text style={styles.vehicleEmojiText}>🚆</Text>
              </View>
            </Animated.View>

            {/* Live Indicator Pill on Map */}
            <View style={styles.mapLiveBadge}>
              <View style={styles.livePulseDot} />
              <Text style={styles.mapLiveText}>Live Route Tracking</Text>
            </View>

            {/* Watermark */}
            <View style={styles.watermarkContainer}>
              <Text style={styles.watermarkText}>BestRoute Maps</Text>
            </View>
          </View>
        </View>

        {/* Route Summary Overview Card */}
        <View style={styles.summaryOverviewCard}>
          <View style={styles.summaryTopRow}>
            <View style={styles.badgeWrapper}>
              <Text style={styles.badgeLabelText}>{routeType}</Text>
            </View>
            <View style={styles.lowRiskBadge}>
              <View style={styles.greenRiskDot} />
              <Text style={styles.greenRiskText}>Low Connection Risk</Text>
            </View>
          </View>

          <View style={styles.overviewStatsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>DEPART</Text>
              <Text style={styles.statBoxValue}>{departureTime}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>ARRIVE</Text>
              <Text style={styles.statBoxValue}>{arrivalTime}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>TOTAL FARE</Text>
              <Text style={styles.statBoxFareValue}>{fare}</Text>
            </View>
          </View>
        </View>

        {/* Step-by-Step Multimodal Timeline */}
        <Text style={styles.timelineSectionHeading}>JOURNEY TIMELINE</Text>

        <View style={styles.timelineCard}>
          {/* Step 1: Start Walk */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineLeftColumn}>
              <View style={[styles.timelineNodeCircle, styles.nodeWalk]}>
                <Text style={styles.stepEmoji}>🚶</Text>
              </View>
              <View style={styles.timelineVerticalLine} />
            </View>
            <View style={styles.timelineContentColumn}>
              <View style={styles.timelineStepHeader}>
                <Text style={styles.stepTitleText}>Walk to Kandy Clock Tower Bus Stand</Text>
                <Text style={styles.stepTimeText}>8:30 AM</Text>
              </View>
              <Text style={styles.stepDetailSubtext}>450m · 6 min walk · Flat terrain</Text>
            </View>
          </View>

          {/* Step 2: Bus */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineLeftColumn}>
              <View style={[styles.timelineNodeCircle, styles.nodeBus]}>
                <Text style={styles.stepEmoji}>🚌</Text>
              </View>
              <View style={styles.timelineVerticalLine} />
            </View>
            <View style={styles.timelineContentColumn}>
              <View style={styles.timelineStepHeader}>
                <Text style={styles.stepTitleText}>Local Bus #654 (Kandy Station Link)</Text>
                <Text style={styles.stepTimeText}>8:38 AM</Text>
              </View>
              <Text style={styles.stepDetailSubtext}>Board at Stand 3 · 3 stops · Rs. 40</Text>
              <View style={styles.statusPillOnTime}>
                <Text style={styles.statusPillOnTimeText}>On time · Every 5 mins</Text>
              </View>
            </View>
          </View>

          {/* Step 3: Train Transfer */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineLeftColumn}>
              <View style={[styles.timelineNodeCircle, styles.nodeTrain]}>
                <Text style={styles.stepEmoji}>🚆</Text>
              </View>
              <View style={styles.timelineVerticalLine} />
            </View>
            <View style={styles.timelineContentColumn}>
              <View style={styles.timelineStepHeader}>
                <Text style={styles.stepTitleText}>Intercity Express #1008 to Colombo Fort</Text>
                <Text style={styles.stepTimeText}>8:55 AM</Text>
              </View>
              <Text style={styles.stepDetailSubtext}>Platform 1 · 2nd Class Reserved · Rs. 240</Text>
              <View style={styles.statusPillHighReliability}>
                <Text style={styles.statusPillHighReliabilityText}>98% On-time reliability</Text>
              </View>
            </View>
          </View>

          {/* Step 4: Tuk / Last Mile */}
          <View style={styles.timelineStep}>
            <View style={styles.timelineLeftColumn}>
              <View style={[styles.timelineNodeCircle, styles.nodeTuk]}>
                <Text style={styles.stepEmoji}>🛺</Text>
              </View>
            </View>
            <View style={styles.timelineContentColumn}>
              <View style={styles.timelineStepHeader}>
                <Text style={styles.stepTitleText}>Arrive at Colombo Fort Station</Text>
                <Text style={styles.stepTimeText}>10:05 AM</Text>
              </View>
              <Text style={styles.stepDetailSubtext}>Exit via Main Concourse · Tuk stands available</Text>
            </View>
          </View>
        </View>

        {/* Start Navigation CTA */}
        <TouchableOpacity
          style={styles.startNavigationButton}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.startNavButtonText}>Start Navigation ➔</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 52 : 36,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 22,
    color: "#1E293B",
    marginTop: -2,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  shareIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  shareIconText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "700",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Map Card */
  mapCard: {
    height: 190,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
      },
      default: {
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
    }),
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    position: "relative",
    overflow: "hidden",
  },
  mapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  mapBlock: {
    width: "30%",
    height: 40,
    backgroundColor: "#EFF4F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  mapPark: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },
  mapWater: {
    backgroundColor: "#E0F2FE",
    borderColor: "#BAE6FD",
  },
  railTrackDashed: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "47%",
    height: 3,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    borderStyle: "dashed",
  },
  activeRouteLineDiagonal: {
    position: "absolute",
    left: "12%",
    top: "47%",
    width: "28%",
    height: 4,
    backgroundColor: "#1D64EC",
    transform: [{ rotate: "-22deg" }],
    borderRadius: 2,
    zIndex: 2,
  },
  activeRouteLineHorizontal: {
    position: "absolute",
    left: "35%",
    right: "12%",
    top: "46%",
    height: 4,
    backgroundColor: "#1D64EC",
    borderRadius: 2,
    zIndex: 2,
  },
  stationNode: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 2.5,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  stationCoreBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1D64EC",
  },
  stationCoreDark: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#475569",
  },
  destinationPin: {
    position: "absolute",
    zIndex: 6,
  },
  pinIconText: {
    fontSize: 22,
  },
  movingVehiclePill: {
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  vehiclePulsingHalo: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(29, 100, 236, 0.25)",
  },
  vehicleCoreDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#1D64EC",
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleEmojiText: {
    fontSize: 13,
  },
  mapLiveBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(15, 23, 42, 0.88)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#10B981",
  },
  mapLiveText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  watermarkContainer: {
    position: "absolute",
    right: 8,
    bottom: 6,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  watermarkText: {
    fontSize: 8,
    color: "#64748B",
    fontWeight: "600",
  },

  /* Overview Card */
  summaryOverviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  badgeWrapper: {
    backgroundColor: "#1D64EC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeLabelText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  lowRiskBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  greenRiskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  greenRiskText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  overviewStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statBoxLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  statBoxValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },
  statBoxFareValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1D64EC",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
  },

  /* Timeline */
  timelineSectionHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  timelineStep: {
    flexDirection: "row",
  },
  timelineLeftColumn: {
    alignItems: "center",
    width: 36,
    marginRight: 10,
  },
  timelineNodeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  nodeWalk: {
    backgroundColor: "#F1F5F9",
  },
  nodeBus: {
    backgroundColor: "#EFF6FF",
  },
  nodeTrain: {
    backgroundColor: "#DCFCE7",
  },
  nodeTuk: {
    backgroundColor: "#FCE7F3",
  },
  stepEmoji: {
    fontSize: 15,
  },
  timelineVerticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  timelineContentColumn: {
    flex: 1,
    paddingBottom: 22,
  },
  timelineStepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stepTitleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    paddingRight: 8,
  },
  stepTimeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D64EC",
  },
  stepDetailSubtext: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 3,
  },
  statusPillOnTime: {
    backgroundColor: "#EFF6FF",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  statusPillOnTimeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563EB",
  },
  statusPillHighReliability: {
    backgroundColor: "#DCFCE7",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  statusPillHighReliabilityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16A34A",
  },

  /* Start Navigation CTA */
  startNavigationButton: {
    backgroundColor: "#165FE9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
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
  startNavButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
