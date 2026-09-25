import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import { COLORS } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

const SLIDES: SlideData[] = [
  {
    id: "slide-1",
    title: "Plan Your Entire Journey",
    subtitle:
      "Combine buses, trains, taxis, three-wheelers and walking into one simple journey.",
    buttonText: "Next →",
  },
  {
    id: "slide-2",
    title: "Choose What Matters",
    subtitle:
      "Find routes based on speed, cost, walking, transfers, or reliability.",
    buttonText: "Next →",
  },
  {
    id: "slide-3",
    title: "Stay Ahead of Disruptions",
    subtitle:
      "Get alerts and alternative routes when your journey changes.",
    buttonText: "Get Started",
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    navigation.replace("Login");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.screenBg }]}
      edges={["top", "bottom"]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Top Header with Skip Button & ThemeToggle on Top Right Corner */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={handleFinish}
          activeOpacity={0.7}
          style={styles.skipButton}
        >
          <Text
            style={[
              styles.skipText,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            Skip
          </Text>
        </TouchableOpacity>
        {/* Dark Mode Change Button Displayed in Top Right Corner like Login */}
        <ThemeToggle variant="solid" size={38} />
      </View>

      {/* Horizontal Paging Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.id} style={styles.slideContainer}>
            {/* Top Graphic Card */}
            <View style={styles.cardWrapper}>
              {index === 0 && <PlanJourneyIllustration />}
              {index === 1 && <ChooseMattersIllustration />}
              {index === 2 && <StayAheadIllustration />}
            </View>

            {/* Bottom Content Area */}
            <View style={styles.contentArea}>
              <Text
                style={[
                  styles.title,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                {slide.title}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                {slide.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Persistent Bottom Action Area */}
      <View style={[styles.bottomBar, { backgroundColor: colors.screenBg }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.actionButtonText}>
            {SLIDES[currentIndex].buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/**
 * Slide 1: Multimodal Journey Visualization
 * Bus -> Train -> Tuk -> Pin
 */
function PlanJourneyIllustration() {
  const { isDarkMode, colors } = useTheme();

  return (
    <View
      style={[
        styles.illustrationCard,
        styles.journeyBg,
        isDarkMode && {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
          borderWidth: 1,
        },
      ]}
    >
      {/* Soft floating background pastel orbs */}
      <View style={[styles.orbTopLeftBlue, isDarkMode && { opacity: 0.15 }]} />
      <View style={[styles.orbBottomRightBlue, isDarkMode && { opacity: 0.15 }]} />

      {/* S-curved journey route visualization */}
      <View style={styles.routeCanvas}>
        {/* Origin Node */}
        <View style={styles.originNodeWrapper}>
          <View
            style={[
              styles.originOuterRing,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.primary,
              },
            ]}
          >
            <View
              style={[
                styles.originInnerDot,
                isDarkMode && { backgroundColor: colors.primary },
              ]}
            />
          </View>
        </View>

        {/* Diagonal trajectory line connector */}
        <View
          style={[
            styles.trackLineSegment1,
            isDarkMode && { borderColor: colors.primary },
          ]}
        />
        <View
          style={[
            styles.trackLineSegment2,
            isDarkMode && { borderColor: colors.primary },
          ]}
        />
        <View
          style={[
            styles.trackLineSegment3,
            isDarkMode && { borderTopColor: colors.primary },
          ]}
        />

        {/* Bus Stop Node */}
        <View style={styles.busNodeWrapper}>
          <View
            style={[
              styles.transitNodeBadgeBlue,
              isDarkMode && {
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(59, 130, 246, 0.4)",
              },
            ]}
          >
            <View style={styles.innerDotBlue} />
          </View>
          <View
            style={[
              styles.transitTagBlue,
              isDarkMode && { backgroundColor: "rgba(59, 130, 246, 0.25)" },
            ]}
          >
            <Text
              style={[
                styles.transitTagTextBlue,
                isDarkMode && { color: "#93C5FD" },
              ]}
            >
              Bus
            </Text>
          </View>
        </View>

        {/* Train Stop Node */}
        <View style={styles.trainNodeWrapper}>
          <View
            style={[
              styles.transitNodeBadgeGreen,
              isDarkMode && {
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                borderColor: "rgba(34, 197, 94, 0.4)",
              },
            ]}
          >
            <View style={styles.innerDotGreen} />
          </View>
          <View
            style={[
              styles.transitTagGreen,
              isDarkMode && { backgroundColor: "rgba(34, 197, 94, 0.25)" },
            ]}
          >
            <Text
              style={[
                styles.transitTagTextGreen,
                isDarkMode && { color: "#86EFAC" },
              ]}
            >
              Train
            </Text>
          </View>
        </View>

        {/* Tuk-Tuk Stop Node */}
        <View style={styles.tukNodeWrapper}>
          <View
            style={[
              styles.transitNodeBadgePink,
              isDarkMode && {
                backgroundColor: "rgba(244, 63, 94, 0.2)",
                borderColor: "rgba(244, 63, 94, 0.4)",
              },
            ]}
          >
            <View style={styles.innerDotPink} />
          </View>
          <View
            style={[
              styles.transitTagPink,
              isDarkMode && { backgroundColor: "rgba(244, 63, 94, 0.25)" },
            ]}
          >
            <Text
              style={[
                styles.transitTagTextPink,
                isDarkMode && { color: "#FDA4AF" },
              ]}
            >
              Tuk
            </Text>
          </View>
        </View>

        {/* Destination Pin */}
        <View style={styles.pinWrapper}>
          <View style={styles.pinCircle}>
            <View style={styles.pinCore} />
          </View>
          <View style={styles.pinTail} />
        </View>
      </View>
    </View>
  );
}

/**
 * Slide 2: Route Comparison Options
 * ⚡ Fastest | 🔥 Cheapest | 🤍 Reliable
 */
function ChooseMattersIllustration() {
  const { isDarkMode, colors } = useTheme();

  return (
    <View
      style={[
        styles.illustrationCard,
        styles.mattersBg,
        isDarkMode && {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
          borderWidth: 1,
        },
      ]}
    >
      {/* Soft floating background pastel orbs */}
      <View style={[styles.orbTopLeftMint, isDarkMode && { opacity: 0.15 }]} />
      <View style={[styles.orbBottomRightMint, isDarkMode && { opacity: 0.15 }]} />

      {/* 3 Comparison Cards */}
      <View style={styles.cardsRow}>
        {/* Card 1: Fastest */}
        <View
          style={[
            styles.optionCard,
            styles.fastestCard,
            isDarkMode && {
              backgroundColor: colors.cardSecondaryBg,
              borderColor: colors.primary,
            },
          ]}
        >
          <View style={styles.fastestBadge}>
            <Text style={styles.badgeTextWhite}>⚡ Fastest</Text>
          </View>
          <View style={styles.optionBody}>
            <Text style={[styles.timeText, { color: COLORS.fastest }]}>1h 20m</Text>
            <Text
              style={[
                styles.priceText,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              Rs.450
            </Text>
            <View
              style={[
                styles.progressTrack,
                isDarkMode && { backgroundColor: "rgba(255,255,255,0.08)" },
              ]}
            >
              <View style={[styles.progressBar, { backgroundColor: COLORS.fastest, width: "75%" }]} />
            </View>
          </View>
        </View>

        {/* Card 2: Cheapest */}
        <View
          style={[
            styles.optionCard,
            styles.cheapestCard,
            isDarkMode && {
              backgroundColor: colors.cardSecondaryBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.cheapestBadge}>
            <Text style={styles.badgeTextOrange}>🔥 Cheapest</Text>
          </View>
          <View style={styles.optionBody}>
            <Text style={[styles.timeText, { color: COLORS.cheapest }]}>2h 05m</Text>
            <Text
              style={[
                styles.priceText,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              Rs.220
            </Text>
            <View
              style={[
                styles.progressTrack,
                isDarkMode && { backgroundColor: "rgba(255,255,255,0.08)" },
              ]}
            >
              <View style={[styles.progressBar, { backgroundColor: COLORS.cheapest, width: "45%" }]} />
            </View>
          </View>
        </View>

        {/* Card 3: Reliable */}
        <View
          style={[
            styles.optionCard,
            styles.reliableCard,
            isDarkMode && {
              backgroundColor: colors.cardSecondaryBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.reliableBadge}>
            <Text style={styles.badgeTextPurple}>♡ Reliable</Text>
          </View>
          <View style={styles.optionBody}>
            <Text style={[styles.timeText, { color: COLORS.reliable }]}>1h 35m</Text>
            <Text
              style={[
                styles.priceText,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              Rs.320
            </Text>
            <View
              style={[
                styles.progressTrack,
                isDarkMode && { backgroundColor: "rgba(255,255,255,0.08)" },
              ]}
            >
              <View style={[styles.progressBar, { backgroundColor: COLORS.reliable, width: "85%" }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

/**
 * Slide 3: Disruption & Dynamic Re-routing Flow
 * ⚠️ Train delayed 15 min -> Alternative found
 */
function StayAheadIllustration() {
  const { isDarkMode, colors } = useTheme();

  return (
    <View
      style={[
        styles.illustrationCard,
        styles.disruptionsBg,
        isDarkMode && {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
          borderWidth: 1,
        },
      ]}
    >
      {/* Soft floating background pastel orbs */}
      <View style={[styles.orbTopLeftPeach, isDarkMode && { opacity: 0.15 }]} />
      <View style={[styles.orbBottomRightPeach, isDarkMode && { opacity: 0.15 }]} />

      <View style={styles.disruptionsFlow}>
        {/* Top Card: Disruption Warning */}
        <View
          style={[
            styles.warningCard,
            isDarkMode && {
              backgroundColor: colors.alertBg,
              borderColor: colors.alertBorder,
            },
          ]}
        >
          <View
            style={[
              styles.warningIconBadge,
              isDarkMode && { backgroundColor: "rgba(245, 158, 11, 0.25)" },
            ]}
          >
            <View style={styles.warningDot} />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertTitleRow}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <Text
                style={[
                  styles.warningTitle,
                  isDarkMode && { color: colors.alertText },
                ]}
              >
                Train delayed 15 min
              </Text>
            </View>
            <Text
              style={[
                styles.warningSubtext,
                isDarkMode && { color: colors.alertSubtext },
              ]}
            >
              Connection at risk
            </Text>
          </View>
        </View>

        {/* Dashed Connecting Arrow */}
        <View style={styles.connectorContainer}>
          <View
            style={[
              styles.dashedVerticalLine,
              isDarkMode && { borderColor: colors.textMuted },
            ]}
          />
          <Text
            style={[
              styles.downArrow,
              isDarkMode && { color: colors.textMuted },
            ]}
          >
            ▼
          </Text>
        </View>

        {/* Bottom Card: Alternative Found */}
        <View
          style={[
            styles.successCard,
            isDarkMode && {
              backgroundColor: colors.successBg,
              borderColor: colors.successBorder,
            },
          ]}
        >
          <View
            style={[
              styles.successIconBadge,
              isDarkMode && { backgroundColor: "rgba(16, 185, 129, 0.25)" },
            ]}
          >
            <View style={styles.successDot} />
          </View>
          <View style={styles.alertContent}>
            <View style={styles.alertTitleRow}>
              <Text style={styles.alertCheck}>✓</Text>
              <Text
                style={[
                  styles.successTitle,
                  isDarkMode && { color: colors.successText },
                ]}
              >
                Alternative found
              </Text>
            </View>
            <Text
              style={[
                styles.successSubtext,
                isDarkMode && { color: colors.successSubtext },
              ]}
            >
              Bus → Train → Bus — Low risk
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
    zIndex: 20,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: {
    color: "#60A5FA",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  cardWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  illustrationCard: {
    width: "100%",
    height: 330,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  journeyBg: {
    backgroundColor: "#F0F6FF",
  },
  mattersBg: {
    backgroundColor: "#EDFAF3",
  },
  disruptionsBg: {
    backgroundColor: "#FFF8F1",
  },

  /* Ambient Orbs */
  orbTopLeftBlue: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#BFDBFE",
    opacity: 0.8,
  },
  orbBottomRightBlue: {
    position: "absolute",
    bottom: 40,
    right: 30,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DBEAFE",
    opacity: 0.9,
  },
  orbTopLeftMint: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#BCE9D7",
    opacity: 0.8,
  },
  orbBottomRightMint: {
    position: "absolute",
    bottom: 40,
    right: 30,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1F2E4",
    opacity: 0.9,
  },
  orbTopLeftPeach: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#FBCFE8",
    opacity: 0.6,
  },
  orbBottomRightPeach: {
    position: "absolute",
    bottom: 36,
    right: 30,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FEE2E2",
    opacity: 0.8,
  },

  /* Route Graphic Styles */
  routeCanvas: {
    width: "86%",
    height: 230,
    position: "relative",
  },
  originNodeWrapper: {
    position: "absolute",
    bottom: 25,
    left: 10,
    zIndex: 10,
  },
  originOuterRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3.5,
    borderColor: "#1D64EC",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  originInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1D64EC",
  },
  trackLineSegment1: {
    position: "absolute",
    bottom: 35,
    left: 28,
    width: 65,
    height: 50,
    borderLeftWidth: 3.5,
    borderTopWidth: 3.5,
    borderTopLeftRadius: 36,
    borderColor: "#1D64EC",
  },
  trackLineSegment2: {
    position: "absolute",
    bottom: 85,
    left: 90,
    width: 80,
    height: 55,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 40,
    borderColor: "#1D64EC",
  },
  trackLineSegment3: {
    position: "absolute",
    top: 40,
    left: 170,
    width: 65,
    height: 40,
    borderTopWidth: 3,
    borderTopColor: "#1D64EC",
    borderStyle: "dashed",
  },
  busNodeWrapper: {
    position: "absolute",
    bottom: 60,
    left: 55,
    alignItems: "center",
    zIndex: 10,
  },
  transitNodeBadgeBlue: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    borderWidth: 3,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  innerDotBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2563EB",
  },
  transitTagBlue: {
    marginTop: 4,
    backgroundColor: "#E0EDFE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  transitTagTextBlue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
  },
  trainNodeWrapper: {
    position: "absolute",
    top: 70,
    left: 115,
    alignItems: "center",
    zIndex: 10,
  },
  transitNodeBadgeGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    borderWidth: 3,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
  },
  innerDotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#16A34A",
  },
  transitTagGreen: {
    marginTop: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  transitTagTextGreen: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  tukNodeWrapper: {
    position: "absolute",
    top: 32,
    left: 168,
    alignItems: "center",
    zIndex: 10,
  },
  transitNodeBadgePink: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FDF2F8",
    borderWidth: 3,
    borderColor: "#FBCFE8",
    alignItems: "center",
    justifyContent: "center",
  },
  innerDotPink: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DB2777",
  },
  transitTagPink: {
    marginTop: 4,
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  transitTagTextPink: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DB2777",
  },
  pinWrapper: {
    position: "absolute",
    top: 42,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  pinCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  pinCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  pinTail: {
    width: 3,
    height: 6,
    backgroundColor: "#EF4444",
    borderRadius: 1.5,
    marginTop: -1,
  },

  /* Choose What Matters Styles */
  cardsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "94%",
    gap: 8,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingBottom: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
      },
    }),
  },
  fastestCard: {
    borderColor: "#2563EB",
    paddingTop: 0,
    overflow: "hidden",
    zIndex: 5,
  },
  cheapestCard: {
    borderColor: "#E2E8F0",
    paddingTop: 10,
    zIndex: 10,
    transform: [{ translateY: 12 }],
  },
  reliableCard: {
    borderColor: "#E2E8F0",
    paddingTop: 10,
    zIndex: 4,
  },
  fastestBadge: {
    backgroundColor: "#1D64EC",
    width: "120%",
    paddingVertical: 6,
    alignItems: "center",
    marginBottom: 8,
  },
  cheapestBadge: {
    marginBottom: 6,
  },
  reliableBadge: {
    marginBottom: 6,
  },
  badgeTextWhite: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  badgeTextOrange: {
    color: "#EA580C",
    fontSize: 10.5,
    fontWeight: "700",
  },
  badgeTextPurple: {
    color: "#7C3AED",
    fontSize: 10.5,
    fontWeight: "700",
  },
  optionBody: {
    alignItems: "center",
    width: 74,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  priceText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },
  progressTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },

  /* Disruption Flow Styles */
  disruptionsFlow: {
    width: "86%",
    alignItems: "center",
  },
  warningCard: {
    width: "100%",
    backgroundColor: "#FEF9C3",
    borderColor: "#F59E0B",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  warningIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FDE68A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  warningDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D97706",
  },
  alertContent: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  warningTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#92400E",
  },
  warningSubtext: {
    fontSize: 11,
    color: "#B45309",
    marginTop: 2,
    fontWeight: "500",
  },
  connectorContainer: {
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  dashedVerticalLine: {
    width: 0,
    height: 20,
    borderWidth: 1,
    borderColor: "#94A3B8",
    borderStyle: "dashed",
  },
  downArrow: {
    fontSize: 8,
    color: "#64748B",
    marginTop: -2,
  },
  successCard: {
    width: "100%",
    backgroundColor: "#DCFCE7",
    borderColor: "#10B981",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  successIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  successDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#059669",
  },
  alertCheck: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "900",
    marginRight: 4,
  },
  successTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#065F46",
  },
  successSubtext: {
    fontSize: 11,
    color: "#047857",
    marginTop: 2,
    fontWeight: "500",
  },

  /* Typography */
  contentArea: {
    width: "100%",
    paddingHorizontal: 6,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 23,
    letterSpacing: -0.1,
  },

  /* Bottom Actions */
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: "transparent",
  },
  actionButton: {
    backgroundColor: "#1D64EC",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#1D64EC",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 6px 16px rgba(29, 100, 236, 0.35)",
      },
    }),
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
