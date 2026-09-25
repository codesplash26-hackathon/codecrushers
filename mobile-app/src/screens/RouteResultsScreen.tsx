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
import RealisticRouteMap from "../components/RealisticRouteMap";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

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

const CHECKLIST_STEPS = [
  { id: 1, label: "Checking nearby services" },
  { id: 2, label: "Comparing schedules" },
  { id: 3, label: "Evaluating connections" },
  { id: 4, label: "Calculating total cost" },
  { id: 5, label: "Ranking routes" },
];

export default function RouteResultsScreen({ navigation, route }: Props) {
  const { isDarkMode, colors } = useTheme();
  const fromCity = route.params?.from || "Kandy";
  const toCity = route.params?.to || "Colombo Fort";
  const skipLoading = route.params?.skipLoading ?? false;

  // Step 1: Loading / Optimizing state
  const [isLoading, setIsLoading] = useState(!skipLoading);
  const [loadingStep, setLoadingStep] = useState(1);
  const [evalCombinations, setEvalCombinations] = useState(24);
  const [restartKey, setRestartKey] = useState(0);

  const [activeFilter, setActiveFilter] = useState<
    "recommended" | "fastest" | "cheapest" | "reliable"
  >("recommended");

  // Smooth animated progress bar (0 to 1)
  const progressAnim = useRef(new Animated.Value(0.14)).current;

  // Pulsing animation for the active step bullseye
  const pulseTargetAnim = useRef(new Animated.Value(1)).current;

  // Animated particle moving along the cyan route curve on the map
  const mapBeamAnim = useRef(new Animated.Value(0)).current;

  // Radar expanding pulse on map stop dots
  const radarStopAnim = useRef(new Animated.Value(1)).current;

  // Fade animation for transition
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Continuous smooth looping beam along the cyan route curve
    const beamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(mapBeamAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(mapBeamAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );
    beamLoop.start();

    // 2. Continuous smooth breathing pulse for active target bullseye
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseTargetAnim, {
          toValue: 1.25,
          duration: 650,
          useNativeDriver: false,
        }),
        Animated.timing(pulseTargetAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: false,
        }),
      ])
    );
    pulseLoop.start();

    // 3. Expanding radar rings around map stops
    const radarLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(radarStopAnim, {
          toValue: 2.2,
          duration: 1600,
          useNativeDriver: false,
        }),
        Animated.timing(radarStopAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );
    radarLoop.start();

    if (skipLoading) {
      setIsLoading(false);
      return;
    }

    // Smooth continuous progress animation from ~14% to 100%
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4400,
      useNativeDriver: false,
    }).start();

    // Natural step progression
    const timerStep2 = setTimeout(() => {
      setLoadingStep(2);
      setEvalCombinations(54);
    }, 850);

    const timerStep3 = setTimeout(() => {
      setLoadingStep(3);
      setEvalCombinations(86);
    }, 1700);

    const timerStep4 = setTimeout(() => {
      setLoadingStep(4);
      setEvalCombinations(108);
    }, 2550);

    const timerStep5 = setTimeout(() => {
      setLoadingStep(5);
      setEvalCombinations(116);
    }, 3450);

    const timerComplete = setTimeout(() => {
      setLoadingStep(6); // All completed
    }, 4150);

    const finishTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 380,
        useNativeDriver: false,
      }).start(() => {
        setIsLoading(false);
      });
    }, 4750);

    return () => {
      beamLoop.stop();
      pulseLoop.stop();
      radarLoop.stop();
      clearTimeout(timerStep2);
      clearTimeout(timerStep3);
      clearTimeout(timerStep4);
      clearTimeout(timerStep5);
      clearTimeout(timerComplete);
      clearTimeout(finishTimer);
    };
  }, [skipLoading, restartKey]);

  const handleSkipLoading = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setIsLoading(false);
    });
  };

  const handleRestartOptimization = () => {
    fadeAnim.setValue(1);
    progressAnim.setValue(0.14);
    setLoadingStep(1);
    setEvalCombinations(24);
    setIsLoading(true);
    setRestartKey((k) => k + 1);
  };

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["10%", "100%"],
  });

  // Precise interpolation along the cyan route curve
  const beamLeft = mapBeamAnim.interpolate({
    inputRange: [0, 0.12, 0.28, 0.44, 0.6, 0.74, 0.88, 1],
    outputRange: ["4%", "14%", "28%", "42%", "58%", "72%", "86%", "96%"],
  });

  const beamTop = mapBeamAnim.interpolate({
    inputRange: [0, 0.12, 0.28, 0.44, 0.6, 0.74, 0.88, 1],
    outputRange: ["64%", "60%", "53%", "47%", "42%", "35%", "27%", "19%"],
  });

  // Ghost trailing beam for comet trail effect
  const ghostLeft = mapBeamAnim.interpolate({
    inputRange: [0, 0.14, 0.3, 0.46, 0.62, 0.76, 0.9, 1],
    outputRange: ["2%", "10%", "24%", "38%", "54%", "68%", "82%", "92%"],
  });

  const ghostTop = mapBeamAnim.interpolate({
    inputRange: [0, 0.14, 0.3, 0.46, 0.62, 0.76, 0.9, 1],
    outputRange: ["66%", "62%", "55%", "49%", "44%", "37%", "29%", "21%"],
  });

  const stopRadarScale = radarStopAnim.interpolate({
    inputRange: [1, 2.2],
    outputRange: [1, 2.3],
  });

  const stopRadarOpacity = radarStopAnim.interpolate({
    inputRange: [1, 2.2],
    outputRange: [0.65, 0],
  });

  // ================= 1. OPTIMIZATION LOADING SCREEN (Matches Provided Photo) =================
  if (isLoading) {
    return (
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <StatusBar style="light" />

        {/* Top Stylized Map Canvas */}
        <View style={styles.optMapArea}>
          {/* Street Grid Blocks Texture (4 Rows matching photo) */}
          <View style={styles.optGridRow}>
            <View style={styles.optBlockSquare} />
            <View style={styles.optBlockSquare} />
            <View style={[styles.optBlockSquare, styles.optBlockPark]} />
          </View>

          <View style={styles.optGridRow}>
            <View style={styles.optBlockSquare} />
            <View style={styles.optBlockSquare} />
            <View style={[styles.optBlockSquare, styles.optBlockPark]} />
          </View>

          <View style={styles.optGridRow}>
            <View style={styles.optBlockSquare} />
            <View style={styles.optBlockSquare} />
            <View style={styles.optBlockSquare} />
          </View>

          <View style={styles.optGridRow}>
            <View style={styles.optBlockSquare} />
            <View style={styles.optBlockSquare} />
            <View style={styles.optBlockWaterCorner} />
          </View>

          {/* Dashed Transit Track Base */}
          <View style={styles.optDashedTrack} />

          {/* Concentric Station Rings on Dashed Line (left: 37.5%, top: 48%) */}
          <View style={styles.optStationRing}>
            <View style={styles.optStationInnerDot} />
          </View>

          {/* Luminous Glowing Cyan Route Curves (Exact to Photo) */}
          <View style={styles.optCyanCurveGlow} />
          <View style={styles.optCyanCurveMain} />
          <View style={styles.optCyanBranch1} />
          <View style={styles.optCyanBranch2} />

          {/* Cyan Transit Stop Dots Along the Curve with Radar Halo */}
          <Animated.View
            style={[
              styles.optStopRadarRing,
              {
                left: "14%",
                top: "62%",
                transform: [{ scale: stopRadarScale }],
                opacity: stopRadarOpacity,
              },
            ]}
          />
          <View style={[styles.optCyanStopDot, { left: "14%", top: "62%" }]} />

          <Animated.View
            style={[
              styles.optStopRadarRing,
              {
                left: "34%",
                top: "49%",
                transform: [{ scale: stopRadarScale }],
                opacity: stopRadarOpacity,
              },
            ]}
          />
          <View style={[styles.optCyanStopDot, { left: "34%", top: "49%" }]} />

          <Animated.View
            style={[
              styles.optStopRadarRing,
              {
                left: "52%",
                top: "43%",
                transform: [{ scale: stopRadarScale }],
                opacity: stopRadarOpacity,
              },
            ]}
          />
          <View style={[styles.optCyanStopDot, { left: "52%", top: "43%" }]} />

          <Animated.View
            style={[
              styles.optStopRadarRing,
              {
                left: "74%",
                top: "30%",
                transform: [{ scale: stopRadarScale }],
                opacity: stopRadarOpacity,
              },
            ]}
          />
          <View style={[styles.optCyanStopDot, { left: "74%", top: "30%" }]} />

          {/* Ghost Comet Tail Particle */}
          <Animated.View
            style={[
              styles.optGhostPulse,
              {
                left: ghostLeft as any,
                top: ghostTop as any,
              },
            ]}
          />

          {/* Animated Light Pulse Traveling on the Curve */}
          <Animated.View
            style={[
              styles.optMovingCyanPulse,
              {
                left: beamLeft as any,
                top: beamTop as any,
              },
            ]}
          >
            <View style={styles.optPulseAura} />
            <View style={styles.optPulseCore} />
          </Animated.View>

          {/* Watermark Badge */}
          <View style={styles.optWatermarkBadge}>
            <Text style={styles.optWatermarkText}>BestRoute Maps</Text>
          </View>

          {/* Floating Dark Status Pill at Top */}
          <View style={styles.optFloatingStatusPill}>
            <Text style={styles.optFloatingTitle}>
              Finding the best routes...
            </Text>
            <Text style={styles.optFloatingSubtitle}>
              <Text style={styles.optCyanBullet}>• </Text>
              {fromCity} ➔ {toCity}
            </Text>
          </View>
        </View>

        {/* Dark Navy Band Above Bottom Sheet */}
        <View style={styles.darkNavyBand} />

        {/* Bottom Progress & Checklist Sheet */}
        <TouchableOpacity
          style={[
            styles.bottomSheetCard,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderTopColor: colors.cardBorder,
              borderTopWidth: 1,
            },
          ]}
          activeOpacity={0.95}
          onPress={handleSkipLoading}
        >
          {/* Smooth Animated Progress Bar */}
          <View
            style={[
              styles.progressTrack,
              isDarkMode && { backgroundColor: colors.cardSecondaryBg },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressBarWidth as any },
              ]}
            />
          </View>

          {/* 5 Checklist Items with Smooth Transitions */}
          <View style={styles.checklistList}>
            {CHECKLIST_STEPS.map((step) => {
              const isDone = loadingStep > step.id;
              const isActive = loadingStep === step.id;

              return (
                <View key={step.id} style={styles.checklistRow}>
                  {isDone ? (
                    <View style={styles.iconCircleSuccess}>
                      <Text style={styles.checkmarkIcon}>✔</Text>
                    </View>
                  ) : isActive ? (
                    <View style={styles.targetIconContainer}>
                      <Animated.View
                        style={[
                          styles.iconCircleActiveBullseye,
                          { transform: [{ scale: pulseTargetAnim }] },
                        ]}
                      >
                        <View style={styles.targetInnerWhiteRing}>
                          <View style={styles.targetInnerBlueCore} />
                        </View>
                      </Animated.View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.iconCirclePending,
                        isDarkMode && { backgroundColor: colors.cardSecondaryBg },
                      ]}
                    >
                      <View style={styles.pendingDotGhost} />
                    </View>
                  )}

                  <Text
                    style={[
                      styles.stepTextBase,
                      isDone && styles.stepTextSuccess,
                      isActive && [
                        styles.stepTextActive,
                        isDarkMode && { color: colors.textPrimary },
                      ],
                      !isDone &&
                        !isActive && [
                          styles.stepTextPending,
                          isDarkMode && { color: colors.textMuted },
                        ],
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Footer Note */}
          <View style={styles.sheetFooter}>
            <Text
              style={[
                styles.footerMainText,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              Optimizing your journey...
            </Text>
            <Text
              style={[
                styles.footerSubText,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              Evaluating {evalCombinations}+ route combinations
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // ================= 2. ROUTE RESULTS VIEW (Second Interface in Photo) =================
  return (
    <View style={[styles.resultsContainer, { backgroundColor: colors.screenBg }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header with Back, Replay and Theme Toggle in Top Right Corner */}
      <View
        style={[
          styles.resultsHeader,
          isDarkMode && { backgroundColor: colors.headerBg },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            isDarkMode && {
              backgroundColor: colors.cardSecondaryBg,
              borderColor: colors.cardBorder,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={[
              styles.backButtonText,
              isDarkMode && { color: colors.textPrimary },
            ]}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text
            style={[
              styles.headerMainTitle,
              isDarkMode && { color: colors.textPrimary },
            ]}
          >
            Routes to {toCity}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            Today · Departing 8:30 AM · 3 routes found
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            style={[
              styles.replayButton,
              isDarkMode && {
                backgroundColor: colors.cardSecondaryBg,
                borderColor: colors.cardBorder,
              },
            ]}
            activeOpacity={0.7}
            onPress={handleRestartOptimization}
          >
            <Text
              style={[
                styles.replayButtonText,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              ↻
            </Text>
          </TouchableOpacity>
          {/* Dark Mode Change Button Displayed in Top Right Corner */}
          <ThemeToggle variant="solid" size={36} />
        </View>
      </View>

      <ScrollView
        style={styles.resultsScroll}
        contentContainerStyle={styles.resultsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Mini Map Preview with Animated Route */}
        <View style={styles.miniMapCard}>
          <RealisticRouteMap
            height={105}
            showLiveVehicle={true}
            from={fromCity}
            to={toCity}
          />
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
                  isDarkMode && {
                    backgroundColor: colors.cardSecondaryBg,
                    borderColor: colors.cardBorder,
                  },
                  isSelected && styles.resultsFilterPillActive,
                ]}
                onPress={() => setActiveFilter(item.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.resultsFilterPillText,
                    isDarkMode && { color: colors.textPrimary },
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
        <View
          style={[
            styles.routeCard,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
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
              <Text
                style={[
                  styles.timeRangeText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
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
        <View
          style={[
            styles.routeCard,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
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
              <Text
                style={[
                  styles.timeRangeText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
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
            style={[
              styles.viewRouteButtonSecondary,
              isDarkMode && {
                backgroundColor: colors.cardSecondaryBg,
                borderColor: colors.cardBorder,
              },
            ]}
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
            <Text
              style={[
                styles.viewRouteButtonTextSecondary,
                isDarkMode && { color: colors.primaryLight },
              ]}
            >
              View Route
            </Text>
          </TouchableOpacity>
        </View>

        {/* ============ ROUTE CARD 3: CHEAPEST ============ */}
        <View
          style={[
            styles.routeCard,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
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
              <Text
                style={[
                  styles.timeRangeText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
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
            style={[
              styles.viewRouteButtonSecondary,
              isDarkMode && {
                backgroundColor: colors.cardSecondaryBg,
                borderColor: colors.cardBorder,
              },
            ]}
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
            <Text
              style={[
                styles.viewRouteButtonTextSecondary,
                isDarkMode && { color: colors.primaryLight },
              ]}
            >
              View Route
            </Text>
          </TouchableOpacity>
        </View>

        {/* Compare All Routes Button */}
        <TouchableOpacity
          style={[
            styles.compareAllButton,
            isDarkMode && {
              backgroundColor: colors.cardSecondaryBg,
              borderColor: colors.primaryLight,
            },
          ]}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("CompareRoutes", {
              from: fromCity,
              to: toCity,
            })
          }
        >
          <Text
            style={[
              styles.compareAllButtonText,
              isDarkMode && { color: colors.primaryLight },
            ]}
          >
            Compare All Routes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ================= 1. LOADING SCREEN STYLES (EXACT TO USER PHOTO) ================= */
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0A1120",
  },
  optMapArea: {
    flex: 1,
    backgroundColor: "#EEF5EE",
    position: "relative",
    overflow: "hidden",
  },
  optGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  optBlockSquare: {
    width: "30%",
    height: 50,
    backgroundColor: "#EFF4F9",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#D6E0EA",
  },
  optBlockPark: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },
  optBlockWaterCorner: {
    width: "30%",
    height: 50,
    backgroundColor: "#DCEEFE",
    borderTopLeftRadius: 36,
    borderBottomRightRadius: 8,
    borderWidth: 1.5,
    borderColor: "#BAE6FD",
  },
  optDashedTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "48%",
    height: 3,
    borderBottomWidth: 3,
    borderColor: "#64748B",
    borderStyle: "dashed",
  },
  optStationRing: {
    position: "absolute",
    left: "37.5%",
    top: "48%",
    marginTop: -11,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#475569",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 6,
  },
  optStationInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#334155",
  },
  optCyanCurveGlow: {
    position: "absolute",
    left: "-8%",
    top: "16%",
    width: "116%",
    height: "82%",
    borderWidth: 14,
    borderColor: "rgba(56, 189, 248, 0.32)",
    borderRadius: 200,
    transform: [{ rotate: "22deg" }],
    zIndex: 3,
  },
  optCyanCurveMain: {
    position: "absolute",
    left: "-8%",
    top: "16%",
    width: "116%",
    height: "82%",
    borderWidth: 5,
    borderColor: "#38BDF8",
    borderRadius: 200,
    transform: [{ rotate: "22deg" }],
    zIndex: 4,
  },
  optCyanBranch1: {
    position: "absolute",
    left: "28%",
    top: "45%",
    width: 70,
    height: 5,
    backgroundColor: "#38BDF8",
    borderRadius: 2.5,
    transform: [{ rotate: "-18deg" }],
    zIndex: 5,
  },
  optCyanBranch2: {
    position: "absolute",
    right: "8%",
    top: "42%",
    width: 95,
    height: 5,
    backgroundColor: "#38BDF8",
    borderRadius: 2.5,
    transform: [{ rotate: "-4deg" }],
    zIndex: 5,
  },
  optStopRadarRing: {
    position: "absolute",
    width: 26,
    height: 26,
    marginLeft: -6,
    marginTop: -6,
    borderRadius: 13,
    backgroundColor: "rgba(56, 189, 248, 0.4)",
    zIndex: 6,
  },
  optCyanStopDot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#38BDF8",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    zIndex: 7,
  },
  optGhostPulse: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(56, 189, 248, 0.45)",
    zIndex: 9,
  },
  optMovingCyanPulse: {
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  optPulseAura: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(56, 189, 248, 0.45)",
  },
  optPulseCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0284C7",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  optWatermarkBadge: {
    position: "absolute",
    right: 14,
    bottom: 14,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    zIndex: 8,
  },
  optWatermarkText: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "600",
  },
  optFloatingStatusPill: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 36,
    alignSelf: "center",
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 18,
    alignItems: "center",
    zIndex: 20,
    ...Platform.select({
      web: {
        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
      },
      default: {
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
    }),
  },
  optFloatingTitle: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "800",
  },
  optFloatingSubtitle: {
    color: "#38BDF8",
    fontSize: 11.5,
    fontWeight: "700",
    marginTop: 2,
  },
  optCyanBullet: {
    color: "#00E5FF",
    fontSize: 13,
    fontWeight: "900",
  },
  darkNavyBand: {
    height: 34,
    backgroundColor: "#0A1120",
  },

  /* Bottom White Sheet */
  bottomSheetCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 18,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingHorizontal: 22,
    ...Platform.select({
      web: {
        boxShadow: "0 -8px 24px rgba(15, 23, 42, 0.15)",
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
  progressTrack: {
    height: 5,
    backgroundColor: "#EBF1F6",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1D64EC",
    borderRadius: 3,
  },
  checklistList: {
    gap: 13,
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircleSuccess: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkmarkIcon: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "bold",
  },
  targetIconContainer: {
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconCircleActiveBullseye: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1D64EC",
    justifyContent: "center",
    alignItems: "center",
  },
  targetInnerWhiteRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  targetInnerBlueCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1D64EC",
  },
  iconCirclePending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EFF4F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pendingDotGhost: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
  },
  stepTextBase: {
    fontSize: 13.5,
    fontWeight: "500",
  },
  stepTextSuccess: {
    fontWeight: "700",
    color: "#059669",
  },
  stepTextActive: {
    fontWeight: "800",
    color: "#1D64EC",
  },
  stepTextPending: {
    color: "#94A3B8",
  },
  sheetFooter: {
    alignItems: "center",
    marginTop: 22,
  },
  footerMainText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  footerSubText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
  },
  replayButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  replayButtonText: {
    fontSize: 18,
    color: "#1D64EC",
    fontWeight: "bold",
  },

  /* ================= 2. RESULTS SCREEN STYLES ================= */
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
  miniMapCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 12,
  },
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
