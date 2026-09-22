import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/AppNavigator";

type RouteResultsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RouteResults"
>;

type RouteResultsScreenRouteProp = RouteProp<
  RootStackParamList,
  "RouteResults"
>;

interface Props {
  navigation: RouteResultsScreenNavigationProp;
  route: RouteResultsScreenRouteProp;
}

export default function RouteResultsScreen({ navigation, route }: Props) {
  const fromCity = route.params?.from || "Kandy City";
  const toCity = route.params?.to || "Colombo Fort";
  const skipLoading = route.params?.skipLoading ?? false;

  // Step 1: Loading / Optimizing state
  const [isLoading, setIsLoading] = useState(!skipLoading);
  const [loadingStep, setLoadingStep] = useState(1);
  const [progressWidth, setProgressWidth] = useState(25);
  const [activeFilter, setActiveFilter] = useState<
    "recommended" | "fastest" | "cheapest" | "reliable"
  >("recommended");

  // Animated vehicle progress on mini-map
  const mapVehicleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(mapVehicleAnim, {
          toValue: 1,
          duration: 3200,
          useNativeDriver: false,
        }),
        Animated.delay(600),
        Animated.timing(mapVehicleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [mapVehicleAnim]);

  const vehicleLeft = mapVehicleAnim.interpolate({
    inputRange: [0, 0.32, 0.68, 1],
    outputRange: ["12%", "36%", "66%", "86%"],
  });

  const vehicleTop = mapVehicleAnim.interpolate({
    inputRange: [0, 0.32, 0.68, 1],
    outputRange: ["64%", "44%", "44%", "28%"],
  });

  useEffect(() => {
    if (skipLoading) {
      setIsLoading(false);
      return;
    }

    // Animate the checking steps
    const timer1 = setTimeout(() => {
      setLoadingStep(2);
      setProgressWidth(50);
    }, 600);

    const timer2 = setTimeout(() => {
      setLoadingStep(3);
      setProgressWidth(75);
    }, 1300);

    const timer3 = setTimeout(() => {
      setLoadingStep(4);
      setProgressWidth(90);
    }, 2000);

    const timer4 = setTimeout(() => {
      setLoadingStep(5);
      setProgressWidth(100);
    }, 2600);

    // Transition to results
    const finalTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(finalTimer);
    };
  }, [skipLoading]);

  // If in loading/optimization phase (First Interface in Photo)
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />

        {/* Top Stylized Map Background */}
        <View style={styles.mapArea}>
          {/* Map Grid Building Blocks */}
          <View style={styles.mapGridRow}>
            <View style={styles.mapBlock} />
            <View style={styles.mapBlock} />
            <View style={[styles.mapBlock, styles.mapBlockPark]} />
          </View>
          <View style={styles.mapGridRow}>
            <View style={styles.mapBlock} />
            <View style={styles.mapBlock} />
            <View style={styles.mapBlock} />
          </View>
          <View style={styles.mapGridRow}>
            <View style={styles.mapBlock} />
            <View style={styles.mapBlock} />
            <View style={styles.mapBlockWater} />
          </View>

          {/* SVG/Styled Transit Route Curves */}
          <View style={styles.routeCurveCyan1} />
          <View style={styles.routeCurveCyan2} />
          <View style={styles.routeDashedLine}>
            <View style={styles.stationRing}>
              <View style={styles.stationInnerDot} />
            </View>
          </View>

          {/* Floating Dark Status Pill */}
          <View style={styles.floatingStatusPill}>
            <Text style={styles.floatingStatusTitle}>
              Finding the best routes...
            </Text>
            <Text style={styles.floatingStatusSubtitle}>
              • {fromCity} ➔ {toCity}
            </Text>
          </View>

          {/* Map Watermark */}
          <View style={styles.mapWatermark}>
            <Text style={styles.mapWatermarkText}>BestRoute Maps</Text>
          </View>
        </View>

        {/* Bottom Progress & Checklist Sheet */}
        <View style={styles.bottomLoadingCard}>
          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressWidth}%` },
              ]}
            />
          </View>

          {/* Checklist Items */}
          <View style={styles.checklistContainer}>
            {/* Step 1 */}
            <View style={styles.checklistItem}>
              <View style={styles.checkIconSuccess}>
                <Text style={styles.checkMarkSymbol}>✓</Text>
              </View>
              <Text style={styles.checklistTextSuccess}>
                Checking nearby services
              </Text>
            </View>

            {/* Step 2 */}
            <View style={styles.checklistItem}>
              <View
                style={
                  loadingStep >= 2
                    ? styles.checkIconSuccess
                    : styles.checkIconPending
                }
              >
                <Text
                  style={
                    loadingStep >= 2
                      ? styles.checkMarkSymbol
                      : styles.pendingSymbol
                  }
                >
                  {loadingStep >= 2 ? "✓" : "○"}
                </Text>
              </View>
              <Text
                style={
                  loadingStep >= 2
                    ? styles.checklistTextSuccess
                    : styles.checklistTextPending
                }
              >
                Comparing schedules
              </Text>
            </View>

            {/* Step 3 */}
            <View style={styles.checklistItem}>
              <View
                style={
                  loadingStep >= 3
                    ? styles.checkIconSuccess
                    : styles.checkIconPending
                }
              >
                <Text
                  style={
                    loadingStep >= 3
                      ? styles.checkMarkSymbol
                      : styles.pendingSymbol
                  }
                >
                  {loadingStep >= 3 ? "✓" : "○"}
                </Text>
              </View>
              <Text
                style={
                  loadingStep >= 3
                    ? styles.checklistTextSuccess
                    : styles.checklistTextPending
                }
              >
                Evaluating connections
              </Text>
            </View>

            {/* Step 4 */}
            <View style={styles.checklistItem}>
              <View
                style={
                  loadingStep >= 4
                    ? styles.checkIconSuccess
                    : loadingStep === 3
                    ? styles.checkIconActive
                    : styles.checkIconPending
                }
              >
                <Text
                  style={
                    loadingStep >= 4
                      ? styles.checkMarkSymbol
                      : loadingStep === 3
                      ? styles.activeSymbol
                      : styles.pendingSymbol
                  }
                >
                  {loadingStep >= 4 ? "✓" : loadingStep === 3 ? "◉" : "○"}
                </Text>
              </View>
              <Text
                style={
                  loadingStep >= 4
                    ? styles.checklistTextSuccess
                    : loadingStep === 3
                    ? styles.checklistTextActive
                    : styles.checklistTextPending
                }
              >
                Calculating total cost
              </Text>
            </View>

            {/* Step 5 */}
            <View style={styles.checklistItem}>
              <View
                style={
                  loadingStep >= 5
                    ? styles.checkIconSuccess
                    : styles.checkIconPending
                }
              >
                <Text
                  style={
                    loadingStep >= 5
                      ? styles.checkMarkSymbol
                      : styles.pendingSymbol
                  }
                >
                  {loadingStep >= 5 ? "✓" : "○"}
                </Text>
              </View>
              <Text
                style={
                  loadingStep >= 5
                    ? styles.checklistTextSuccess
                    : styles.checklistTextPending
                }
              >
                Ranking routes
              </Text>
            </View>
          </View>

          {/* Footer note & skip tap */}
          <TouchableOpacity
            style={styles.loadingFooter}
            activeOpacity={0.7}
            onPress={() => setIsLoading(false)}
          >
            <Text style={styles.optimizingTitle}>Optimizing your journey...</Text>
            <Text style={styles.optimizingSubtitle}>
              Evaluating 116+ route combinations (tap to skip)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Step 2: Route Results View (Second Interface in Photo)
  return (
    <View style={styles.resultsContainer}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.resultsHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.headerMainTitle}>Routes to {toCity}</Text>
          <Text style={styles.headerSubtitle}>
            Today · Departing 8:30 AM · 3 routes found
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.resultsScroll}
        contentContainerStyle={styles.resultsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Mini Map Preview with Animated Route (Matches Photo 2) */}
        <View style={styles.miniMapCard}>
          <View style={styles.miniMapBg}>
            {/* Background Grid Blocks */}
            <View style={styles.miniMapRow}>
              <View style={styles.miniBlock} />
              <View style={[styles.miniBlock, styles.miniBlockPark]} />
              <View style={styles.miniBlock} />
            </View>
            <View style={styles.miniMapRow}>
              <View style={styles.miniBlock} />
              <View style={styles.miniBlock} />
              <View style={[styles.miniBlock, styles.miniBlockWater]} />
            </View>

            {/* Dashed Base Line Across Map */}
            <View style={styles.miniDashedBaseLine} />

            {/* Continuous Blue Route Line Segments */}
            <View style={styles.miniRouteDiagonalLine} />
            <View style={styles.miniRouteHorizontalLine} />
            <View style={styles.miniRouteCurveEndLine} />

            {/* Origin Blue Node Circle */}
            <View style={[styles.miniStationNode, { left: "12%", top: "62%" }]}>
              <View style={styles.miniNodeCoreBlue} />
            </View>

            {/* Station Rings */}
            <View style={[styles.miniStationNode, { left: "36%", top: "42%" }]}>
              <View style={styles.miniNodeCoreDark} />
            </View>
            <View style={[styles.miniStationNode, { left: "66%", top: "42%" }]}>
              <View style={styles.miniNodeCoreDark} />
            </View>

            {/* Destination Red Pin */}
            <View style={[styles.miniDestinationPin, { left: "86%", top: "14%" }]}>
              <Text style={styles.miniPinSymbol}>📍</Text>
            </View>

            {/* Animated Transit Marker Moving Along the Path */}
            <Animated.View
              style={[
                styles.miniAnimatedVehicle,
                {
                  left: vehicleLeft,
                  top: vehicleTop,
                },
              ]}
            >
              <View style={styles.miniVehicleHalo} />
              <View style={styles.miniVehicleDot} />
            </Animated.View>

            {/* Zoom Controls (+ / −) */}
            <View style={styles.mapZoomControls}>
              <TouchableOpacity style={styles.zoomButton}>
                <Text style={styles.zoomText}>+</Text>
              </TouchableOpacity>
              <View style={styles.zoomDivider} />
              <TouchableOpacity style={styles.zoomButton}>
                <Text style={styles.zoomText}>−</Text>
              </TouchableOpacity>
            </View>

            {/* Map Watermark */}
            <View style={styles.miniMapWatermark}>
              <Text style={styles.miniWatermarkText}>BestRoute Maps</Text>
            </View>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsRow}>
          {(
            [
              { id: "recommended", label: "Recommended" },
              { id: "fastest", label: "Fastest" },
              { id: "cheapest", label: "Cheapest" },
              { id: "reliable", label: "Reliable" },
            ] as const
          ).map((item) => {
            const isSelected = activeFilter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.resultsFilterPill,
                  isSelected && styles.resultsFilterPillActive,
                ]}
                onPress={() => setActiveFilter(item.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.resultsFilterPillText,
                    isSelected && styles.resultsFilterPillTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ============ ROUTE CARD 1: BEST MATCH ============ */}
        <View style={styles.routeCard}>
          {/* Card Top Row: Badge & Risk */}
          <View style={styles.cardHeaderRow}>
            <View style={styles.bestMatchBadge}>
              <Text style={styles.badgeTextWhite}>BEST MATCH</Text>
            </View>

            <View style={styles.riskIndicator}>
              <View style={[styles.riskDot, styles.riskDotGreen]} />
              <Text style={styles.riskTextGreen}>Low Risk</Text>
            </View>
          </View>

          {/* Time & Price Row */}
          <View style={styles.timePriceRow}>
            <View>
              <Text style={styles.timeRangeText}>
                8:30 AM <Text style={styles.arrowLight}>➔</Text> 10:05 AM
              </Text>
              <Text style={styles.durationText}>⏱ 1h 35m</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceTextBlue}>Rs. 320</Text>
              <Text style={styles.priceSubtext}>Estimated</Text>
            </View>
          </View>

          {/* Transit Mode Flow Pills */}
          <View style={styles.transitModeFlowRow}>
            <View style={[styles.modePill, styles.modePillBus]}>
              <Text style={styles.modePillTextBus}>🚌 Bus</Text>
            </View>
            <Text style={styles.modeFlowArrow}>➔</Text>
            <View style={[styles.modePill, styles.modePillTrain]}>
              <Text style={styles.modePillTextTrain}>🚆 Train</Text>
            </View>
            <Text style={styles.modeFlowArrow}>➔</Text>
            <View style={[styles.modePill, styles.modePillTuk]}>
              <Text style={styles.modePillTextTuk}>🛺 Tuk</Text>
            </View>
          </View>

          {/* Transfer and Walking Stats */}
          <View style={styles.metricsRow}>
            <Text style={styles.metricText}>🔀 2 transfers</Text>
            <Text style={styles.metricDivider}>·</Text>
            <Text style={styles.metricText}>🚶 8 min</Text>
            <Text style={styles.metricDivider}>·</Text>
            <Text style={styles.metricText}>⏱ 5 min wait</Text>
          </View>

          {/* Reliability Bar */}
          <View style={styles.reliabilityRow}>
            <Text style={styles.reliabilityLabel}>Reliability</Text>
            <View style={styles.reliabilityTrack}>
              <View
                style={[styles.reliabilityFill, { width: "85%", backgroundColor: "#10B981" }]}
              />
            </View>
            <Text style={[styles.reliabilityStatus, { color: "#10B981" }]}>
              High
            </Text>
          </View>

          {/* Primary View Route Button */}
          <TouchableOpacity
            style={styles.viewRouteButtonPrimary}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("RouteDetail", {
                from: fromCity,
                to: toCity,
                routeType: "BEST MATCH",
                fare: "Rs. 320",
                duration: "1h 35m",
                departureTime: "8:30 AM",
                arrivalTime: "10:05 AM",
              })
            }
          >
            <Text style={styles.viewRouteButtonTextPrimary}>View Route</Text>
          </TouchableOpacity>
        </View>

        {/* ============ ROUTE CARD 2: FASTEST ============ */}
        <View style={styles.routeCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.bestMatchBadge, styles.fastestBadge]}>
              <Text style={styles.badgeTextWhite}>FASTEST</Text>
            </View>

            <View style={styles.riskIndicator}>
              <View style={[styles.riskDot, styles.riskDotOrange]} />
              <Text style={styles.riskTextOrange}>Med Risk</Text>
            </View>
          </View>

          <View style={styles.timePriceRow}>
            <View>
              <Text style={styles.timeRangeText}>
                8:45 AM <Text style={styles.arrowLight}>➔</Text> 10:05 AM
              </Text>
              <Text style={styles.durationText}>⏱ 1h 20m</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceTextTeal}>Rs. 450</Text>
              <Text style={styles.priceSubtext}>Estimated</Text>
            </View>
          </View>

          <View style={styles.transitModeFlowRow}>
            <View style={[styles.modePill, styles.modePillBus]}>
              <Text style={styles.modePillTextBus}>🚌 Bus</Text>
            </View>
            <Text style={styles.modeFlowArrow}>➔</Text>
            <View style={[styles.modePill, styles.modePillTrain]}>
              <Text style={styles.modePillTextTrain}>🚆 Train</Text>
            </View>
            <Text style={styles.modeFlowArrow}>➔</Text>
            <View style={[styles.modePill, styles.modePillTaxi]}>
              <Text style={styles.modePillTextTaxi}>🚕 Taxi</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <Text style={styles.metricText}>🔀 2 transfers</Text>
            <Text style={styles.metricDivider}>·</Text>
            <Text style={styles.metricText}>🚶 12 min</Text>
            <Text style={styles.metricDivider}>·</Text>
            <Text style={styles.metricText}>⏱ 3 min wait</Text>
          </View>

          <View style={styles.reliabilityRow}>
            <Text style={styles.reliabilityLabel}>Reliability</Text>
            <View style={styles.reliabilityTrack}>
              <View
                style={[styles.reliabilityFill, { width: "65%", backgroundColor: "#F59E0B" }]}
              />
            </View>
            <Text style={[styles.reliabilityStatus, { color: "#D97706" }]}>
              Medium
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewRouteButtonSecondary}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("RouteDetail", {
                from: fromCity,
                to: toCity,
                routeType: "FASTEST",
                fare: "Rs. 450",
                duration: "1h 20m",
                departureTime: "8:45 AM",
                arrivalTime: "10:05 AM",
              })
            }
          >
            <Text style={styles.viewRouteButtonTextSecondary}>View Route</Text>
          </TouchableOpacity>
        </View>

        {/* ============ ROUTE CARD 3: CHEAPEST ============ */}
        <View style={styles.routeCard}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.bestMatchBadge, styles.cheapestBadge]}>
              <Text style={styles.badgeTextWhite}>CHEAPEST</Text>
            </View>

            <View style={styles.riskIndicator}>
              <View style={[styles.riskDot, styles.riskDotGreen]} />
              <Text style={styles.riskTextGreen}>Low Risk</Text>
            </View>
          </View>

          <View style={styles.timePriceRow}>
            <View>
              <Text style={styles.timeRangeText}>
                8:30 AM <Text style={styles.arrowLight}>➔</Text> 10:35 AM
              </Text>
              <Text style={styles.durationText}>⏱ 2h 05m</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceTextGreen}>Rs. 220</Text>
              <Text style={styles.priceSubtext}>Estimated</Text>
            </View>
          </View>

          <View style={styles.transitModeFlowRow}>
            <View style={[styles.modePill, styles.modePillBus]}>
              <Text style={styles.modePillTextBus}>🚌 Bus</Text>
            </View>
            <Text style={styles.modeFlowArrow}>➔</Text>
            <View style={[styles.modePill, styles.modePillTrain]}>
              <Text style={styles.modePillTextTrain}>🚆 Train</Text>
            </View>
            <Text style={styles.modeFlowArrow}>➔</Text>
            <View style={[styles.modePill, styles.modePillBus]}>
              <Text style={styles.modePillTextBus}>🚌 Bus</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <Text style={styles.metricText}>🔀 3 transfers</Text>
            <Text style={styles.metricDivider}>·</Text>
            <Text style={styles.metricText}>🚶 10 min</Text>
            <Text style={styles.metricDivider}>·</Text>
            <Text style={styles.metricText}>⏱ 15 min wait</Text>
          </View>

          <View style={styles.reliabilityRow}>
            <Text style={styles.reliabilityLabel}>Reliability</Text>
            <View style={styles.reliabilityTrack}>
              <View
                style={[styles.reliabilityFill, { width: "65%", backgroundColor: "#F59E0B" }]}
              />
            </View>
            <Text style={[styles.reliabilityStatus, { color: "#D97706" }]}>
              Medium
            </Text>
          </View>

          <TouchableOpacity
            style={styles.viewRouteButtonSecondary}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("RouteDetail", {
                from: fromCity,
                to: toCity,
                routeType: "CHEAPEST",
                fare: "Rs. 220",
                duration: "2h 05m",
                departureTime: "8:30 AM",
                arrivalTime: "10:35 AM",
              })
            }
          >
            <Text style={styles.viewRouteButtonTextSecondary}>View Route</Text>
          </TouchableOpacity>
        </View>

        {/* Compare All Routes Button */}
        <TouchableOpacity
          style={styles.compareAllButton}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("RouteDetail", {
              from: fromCity,
              to: toCity,
              routeType: "BEST MATCH",
              fare: "Rs. 320",
              duration: "1h 35m",
              departureTime: "8:30 AM",
              arrivalTime: "10:05 AM",
            })
          }
        >
          <Text style={styles.compareAllButtonText}>Compare All Routes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ================= LOADING SCREEN STYLES ================= */
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  mapArea: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    position: "relative",
    overflow: "hidden",
  },
  mapGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 12,
  },
  mapBlock: {
    width: "30%",
    height: 70,
    backgroundColor: "#EFF4F9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  mapBlockPark: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },
  mapBlockWater: {
    backgroundColor: "#E0F2FE",
    borderColor: "#BAE6FD",
    width: "40%",
  },
  routeCurveCyan1: {
    position: "absolute",
    left: -20,
    top: "30%",
    width: 320,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: "#38BDF8",
    opacity: 0.75,
    transform: [{ rotate: "25deg" }],
  },
  routeCurveCyan2: {
    position: "absolute",
    right: -40,
    top: "20%",
    width: 300,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: "#0284C7",
    opacity: 0.8,
    transform: [{ rotate: "-15deg" }],
  },
  routeDashedLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "52%",
    height: 3,
    borderWidth: 1.5,
    borderColor: "#64748B",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  stationRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#475569",
    justifyContent: "center",
    alignItems: "center",
  },
  stationInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0284C7",
  },
  floatingStatusPill: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 36,
    alignSelf: "center",
    backgroundColor: "rgba(15, 23, 42, 0.94)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
      },
      default: {
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  floatingStatusTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  floatingStatusSubtitle: {
    color: "#38BDF8",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  mapWatermark: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mapWatermarkText: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "600",
  },

  /* Bottom Loading Card */
  bottomLoadingCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 38 : 24,
    paddingHorizontal: 22,
    ...Platform.select({
      web: {
        boxShadow: "0 -8px 24px rgba(15, 23, 42, 0.12)",
      },
      default: {
        elevation: 10,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
    }),
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#1D64EC",
    borderRadius: 3,
  },
  checklistContainer: {
    gap: 14,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIconSuccess: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkMarkSymbol: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  checklistTextSuccess: {
    fontSize: 13,
    fontWeight: "600",
    color: "#059669",
  },
  checkIconActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#1D64EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activeSymbol: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  checklistTextActive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D64EC",
  },
  checkIconPending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pendingSymbol: {
    color: "#94A3B8",
    fontSize: 11,
  },
  checklistTextPending: {
    fontSize: 13,
    color: "#94A3B8",
  },
  loadingFooter: {
    alignItems: "center",
    marginTop: 24,
  },
  optimizingTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  optimizingSubtitle: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },

  /* ================= RESULTS SCREEN STYLES ================= */
  resultsContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 52 : 36,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
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
  headerMainTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  resultsScroll: {
    flex: 1,
  },
  resultsScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* Mini Map Preview */
  miniMapCard: {
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
    }),
  },
  miniMapBg: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    position: "relative",
    overflow: "hidden",
  },
  miniMapRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 6,
  },
  miniBlock: {
    width: "30%",
    height: 34,
    backgroundColor: "#EFF4F9",
    borderRadius: 8,
  },
  miniBlockPark: {
    backgroundColor: "#DCFCE7",
  },
  miniBlockWater: {
    backgroundColor: "#E0F2FE",
  },

  /* Route tracks */
  miniDashedBaseLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "47%",
    height: 2,
    borderWidth: 1,
    borderColor: "#64748B",
    borderStyle: "dashed",
  },
  miniRouteDiagonalLine: {
    position: "absolute",
    left: "14%",
    top: "54%",
    width: "25%",
    height: 3.5,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    transform: [{ rotate: "-22deg" }],
    zIndex: 2,
  },
  miniRouteHorizontalLine: {
    position: "absolute",
    left: "36%",
    right: "16%",
    top: "46%",
    height: 3.5,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    zIndex: 2,
  },
  miniRouteCurveEndLine: {
    position: "absolute",
    right: "12%",
    top: "32%",
    width: 22,
    height: 3.5,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    transform: [{ rotate: "-35deg" }],
    zIndex: 2,
  },
  miniStationNode: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  miniNodeCoreBlue: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#2563EB",
  },
  miniNodeCoreDark: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#475569",
  },
  miniDestinationPin: {
    position: "absolute",
    zIndex: 6,
  },
  miniPinSymbol: {
    fontSize: 16,
  },
  miniAnimatedVehicle: {
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  miniVehicleHalo: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(37, 99, 235, 0.35)",
  },
  miniVehicleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  /* Zoom */
  mapZoomControls: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 12,
  },
  zoomButton: {
    width: 22,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  zoomText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
  },
  miniMapWatermark: {
    position: "absolute",
    right: 8,
    bottom: 4,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  miniWatermarkText: {
    fontSize: 8,
    color: "#64748B",
  },

  /* Filter Pills */
  filterPillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  resultsFilterPill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  resultsFilterPillActive: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  resultsFilterPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  resultsFilterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Route Cards */
  routeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
    }),
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  bestMatchBadge: {
    backgroundColor: "#1D64EC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fastestBadge: {
    backgroundColor: "#0284C7",
  },
  cheapestBadge: {
    backgroundColor: "#10B981",
  },
  badgeTextWhite: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  riskIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  riskDotGreen: {
    backgroundColor: "#10B981",
  },
  riskDotOrange: {
    backgroundColor: "#F59E0B",
  },
  riskTextGreen: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  riskTextOrange: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },

  /* Time & Price */
  timePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  timeRangeText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  arrowLight: {
    color: "#94A3B8",
    fontSize: 14,
  },
  durationText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceTextBlue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1D64EC",
  },
  priceTextTeal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0284C7",
  },
  priceTextGreen: {
    fontSize: 18,
    fontWeight: "800",
    color: "#10B981",
  },
  priceSubtext: {
    fontSize: 10,
    color: "#94A3B8",
  },

  /* Transit Flow Pills */
  transitModeFlowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  modePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  modePillBus: {
    backgroundColor: "#EFF6FF",
  },
  modePillTrain: {
    backgroundColor: "#DCFCE7",
  },
  modePillTuk: {
    backgroundColor: "#FCE7F3",
  },
  modePillTaxi: {
    backgroundColor: "#FEF3C7",
  },
  modePillTextBus: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  modePillTextTrain: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  modePillTextTuk: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DB2777",
  },
  modePillTextTaxi: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
  },
  modeFlowArrow: {
    fontSize: 11,
    color: "#94A3B8",
  },

  /* Metrics */
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  metricText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  metricDivider: {
    fontSize: 12,
    color: "#CBD5E1",
    marginHorizontal: 6,
  },

  /* Reliability */
  reliabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  reliabilityLabel: {
    fontSize: 11,
    color: "#64748B",
    marginRight: 8,
  },
  reliabilityTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 2,
    overflow: "hidden",
    marginRight: 8,
  },
  reliabilityFill: {
    height: "100%",
    borderRadius: 2,
  },
  reliabilityStatus: {
    fontSize: 11,
    fontWeight: "700",
  },

  /* Buttons */
  viewRouteButtonPrimary: {
    backgroundColor: "#1D64EC",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  viewRouteButtonTextPrimary: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  viewRouteButtonSecondary: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  viewRouteButtonTextSecondary: {
    color: "#1D64EC",
    fontSize: 14,
    fontWeight: "700",
  },
  compareAllButton: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 6,
  },
  compareAllButtonText: {
    color: "#1D64EC",
    fontSize: 14,
    fontWeight: "700",
  },
});
