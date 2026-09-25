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
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

type CompareRoutesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompareRoutes"
>;

type CompareRoutesScreenRouteProp = RouteProp<
  RootStackParamList,
  "CompareRoutes"
>;

interface Props {
  navigation: CompareRoutesScreenNavigationProp;
  route: CompareRoutesScreenRouteProp;
}

type RouteOptionKey = "recommended" | "fastest" | "cheapest";

export default function CompareRoutesScreen({ navigation, route }: Props) {
  const { isDarkMode, colors } = useTheme();
  const fromCity = route.params?.from || "Kandy";
  const toCity = route.params?.to || "Colombo Fort";

  const [selectedRoute, setSelectedRoute] =
    useState<RouteOptionKey>("recommended");

  const handleSelectRoute = () => {
    if (selectedRoute === "fastest") {
      navigation.navigate("RouteDetail", {
        from: fromCity,
        to: toCity,
        routeType: "FASTEST",
        fare: "Rs. 450",
        duration: "1h 20m",
        departureTime: "8:30 AM",
        arrivalTime: "9:50 AM",
      });
    } else if (selectedRoute === "cheapest") {
      navigation.navigate("RouteDetail", {
        from: fromCity,
        to: toCity,
        routeType: "CHEAPEST",
        fare: "Rs. 220",
        duration: "2h 05m",
        departureTime: "8:30 AM",
        arrivalTime: "10:35 AM",
      });
    } else {
      // Recommended Route
      navigation.navigate("RouteDetail", {
        from: fromCity,
        to: toCity,
        routeType: "RECOMMENDED",
        fare: "Rs. 320",
        duration: "1h 35m",
        departureTime: "8:30 AM",
        arrivalTime: "10:05 AM",
      });
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.screenBg }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* TOP HEADER */}
      <View
        style={[
          styles.header,
          isDarkMode && {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backButton,
            isDarkMode && {
              backgroundColor: colors.cardSecondaryBg,
            },
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.backArrow,
              isDarkMode && { color: colors.primaryLight },
            ]}
          >
            ‹
          </Text>
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text
            style={[
              styles.headerTitle,
              isDarkMode && { color: colors.textPrimary },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Compare Routes
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              isDarkMode && { color: colors.textSecondary },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {fromCity} ➔ {toCity}
          </Text>
        </View>

        {/* Dark Mode Change Button Displayed in Top Right Corner */}
        <ThemeToggle variant="solid" size={38} />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP 3 ROUTE OPTION CARDS */}
        <View style={styles.topCardsRow}>
          {/* Card 1: Recommended */}
          <TouchableOpacity
            style={[
              styles.routeCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
              selectedRoute === "recommended" && styles.routeCardSelected,
            ]}
            onPress={() => setSelectedRoute("recommended")}
            activeOpacity={0.8}
          >
            <Text
              style={styles.cardHeaderRecommended}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Recommended
            </Text>
            <View style={styles.cardLegsCol}>
              <View style={styles.legBadgeBlue}>
                <Text style={styles.legBadgeBlueText}>🚌 Bus</Text>
                <Text style={styles.legArrow}>➔</Text>
              </View>
              <View style={styles.legBadgeGreen}>
                <Text style={styles.legBadgeGreenText}>🚆 Train</Text>
                <Text style={styles.legArrow}>➔</Text>
              </View>
              <View style={styles.legBadgePink}>
                <Text style={styles.legBadgePinkText}>🛺 Tuk</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 2: Fastest */}
          <TouchableOpacity
            style={[
              styles.routeCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
              selectedRoute === "fastest" && styles.routeCardSelected,
            ]}
            onPress={() => setSelectedRoute("fastest")}
            activeOpacity={0.8}
          >
            <Text
              style={styles.cardHeaderFastest}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Fastest
            </Text>
            <View style={styles.cardLegsCol}>
              <View style={styles.legBadgeBlue}>
                <Text style={styles.legBadgeBlueText}>🚌 Bus</Text>
                <Text style={styles.legArrow}>➔</Text>
              </View>
              <View style={styles.legBadgeGreen}>
                <Text style={styles.legBadgeGreenText}>🚆 Train</Text>
                <Text style={styles.legArrow}>➔</Text>
              </View>
              <View style={styles.legBadgeYellow}>
                <Text style={styles.legBadgeYellowText}>🚕 Taxi</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 3: Cheapest */}
          <TouchableOpacity
            style={[
              styles.routeCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
              selectedRoute === "cheapest" && styles.routeCardSelected,
            ]}
            onPress={() => setSelectedRoute("cheapest")}
            activeOpacity={0.8}
          >
            <Text
              style={styles.cardHeaderCheapest}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Cheapest
            </Text>
            <View style={styles.cardLegsCol}>
              <View style={styles.legBadgeBlue}>
                <Text style={styles.legBadgeBlueText}>🚌 Bus</Text>
                <Text style={styles.legArrow}>➔</Text>
              </View>
              <View style={styles.legBadgeGreen}>
                <Text style={styles.legBadgeGreenText}>🚆 Train</Text>
                <Text style={styles.legArrow}>➔</Text>
              </View>
              <View style={styles.legBadgeBlue}>
                <Text style={styles.legBadgeBlueText}>🚌 Bus</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* COMPARISON METRICS TABLE */}
        <View
          style={[
            styles.tableCard,
            isDarkMode && {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Table Column Headers */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.metricCol}>
              <Text style={styles.tableColHeaderBlue}>RECOMMENDED</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.tableColHeaderCyan}>FASTEST</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.tableColHeaderGreen}>CHEAPEST</Text>
            </View>
          </View>
          {/* Row 1: TOTAL TIME */}
          <View style={styles.tableSection}>
            <Text
              style={[
                styles.metricLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              ⏱ TOTAL TIME
            </Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueBold,
                    isDarkMode && { color: colors.textPrimary },
                  ]}
                >
                  1h 35m
                </Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueCyan}>1h 20m✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueRegular,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  2h 05m
                </Text>
              </View>
            </View>
          </View>

          {/* Row 2: TOTAL COST */}
          <View style={styles.tableSection}>
            <Text
              style={[
                styles.metricLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              💰 TOTAL COST
            </Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueBold,
                    isDarkMode && { color: colors.textPrimary },
                  ]}
                >
                  Rs. 320
                </Text>
              </View>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueRegular,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  Rs. 450
                </Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueGreen}>Rs. 220✓</Text>
              </View>
            </View>
          </View>

          {/* Row 3: WAITING */}
          <View style={styles.tableSection}>
            <Text
              style={[
                styles.metricLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              ⏳ WAITING
            </Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueBlue}>5 min✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueRegular,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  3 min
                </Text>
              </View>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueRegular,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  15 min
                </Text>
              </View>
            </View>
          </View>

          {/* Row 4: TRANSFERS */}
          <View style={styles.tableSection}>
            <Text
              style={[
                styles.metricLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              🔄 TRANSFERS
            </Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueBlue}>2✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueCyan}>2✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueRegular,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  3
                </Text>
              </View>
            </View>
          </View>

          {/* Row 5: WALKING */}
          <View style={styles.tableSection}>
            <Text
              style={[
                styles.metricLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              🚶 WALKING
            </Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueBlue}>8 min✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueRegular,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  12 min
                </Text>
              </View>
              <View style={styles.metricCol}>
                <Text
                  style={[
                    styles.metricValueRegular,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  10 min
                </Text>
              </View>
            </View>
          </View>

          {/* Row 6: RELIABILITY */}
          <View style={styles.tableSection}>
            <Text
              style={[
                styles.metricLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              🛡️ RELIABILITY
            </Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <View style={styles.progressTrack}>
                  <View style={styles.progressBarBlue} />
                </View>
                <Text style={styles.reliabilityTextBlue}>High</Text>
              </View>
              <View style={styles.metricCol}>
                <View style={styles.progressTrack}>
                  <View style={styles.progressBarCyan} />
                </View>
                <Text style={styles.reliabilityTextCyan}>Medium</Text>
              </View>
              <View style={styles.metricCol}>
                <View style={styles.progressTrack}>
                  <View style={styles.progressBarGreen} />
                </View>
                <Text style={styles.reliabilityTextGreen}>Medium</Text>
              </View>
            </View>
          </View>

          {/* Row 7: RISK */}
          <View style={[styles.tableSection, { borderBottomWidth: 0, paddingBottom: 6 }]}>
            <Text
              style={[
                styles.metricLabel,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              ▲ RISK
            </Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <View style={styles.riskPillGreen}>
                  <Text style={styles.riskPillGreenText}>Low</Text>
                </View>
              </View>
              <View style={styles.metricCol}>
                <View style={styles.riskPillAmber}>
                  <Text style={styles.riskPillAmberText}>Medium</Text>
                </View>
              </View>
              <View style={styles.metricCol}>
                <View style={styles.riskPillGreen}>
                  <Text style={styles.riskPillGreenText}>Low</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* BESTROUTE RECOMMENDATION CALLOUT */}
        <View
          style={[
            styles.recommendationCard,
            isDarkMode && {
              backgroundColor: colors.cardSecondaryBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.recTitle,
              isDarkMode && { color: "#FBBF24" },
            ]}
          >
            💡 BestRoute Recommendation
          </Text>
          <Text
            style={[
              styles.recBody,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            The <Text style={[styles.recBold, isDarkMode && { color: colors.textPrimary }]}>Recommended route</Text> offers the
            best balance of cost, reliability, and journey time with low
            connection risk.
          </Text>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View
        style={[
          styles.bottomBar,
          isDarkMode && {
            backgroundColor: colors.headerBg,
            borderTopColor: colors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.selectButton}
          onPress={handleSelectRoute}
          activeOpacity={0.85}
        >
          <Text style={styles.selectButtonText}>
            {selectedRoute === "recommended"
              ? "Select Recommended Route"
              : selectedRoute === "fastest"
              ? "Select Fastest Route"
              : "Select Cheapest Route"}
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

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 52 : 38,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  headerTitleCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },

  /* SCROLL CONTENT */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },

  /* TOP 3 ROUTE CARDS */
  topCardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  routeCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    ...Platform.select({
      web: { boxShadow: "0 2px 6px rgba(0,0,0,0.04)" },
      default: { elevation: 1 },
    }),
  },
  routeCardSelected: {
    borderColor: "#2563EB",
    borderWidth: 1.5,
    backgroundColor: "#EFF6FF",
  },
  cardHeaderRecommended: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#1D4ED8",
    marginBottom: 8,
    textAlign: "center",
  },
  cardHeaderFastest: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#0284C7",
    marginBottom: 8,
    textAlign: "center",
  },
  cardHeaderCheapest: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#16A34A",
    marginBottom: 8,
    textAlign: "center",
  },
  cardLegsCol: {
    width: "100%",
    gap: 4,
    alignItems: "center",
  },
  legBadgeBlue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
    width: "100%",
    justifyContent: "space-between",
  },
  legBadgeBlueText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1E40AF",
    textAlign: "center",
  },
  legBadgeGreen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
    width: "100%",
    justifyContent: "space-between",
  },
  legBadgeGreenText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#166534",
    textAlign: "center",
  },
  legBadgePink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
    width: "100%",
    justifyContent: "center",
  },
  legBadgePinkText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9D174D",
    textAlign: "center",
  },
  legBadgeYellow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
    width: "100%",
    justifyContent: "center",
  },
  legBadgeYellowText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#92400E",
    textAlign: "center",
  },
  legArrow: {
    fontSize: 9,
    color: "#64748B",
  },

  /* TABLE CARD */
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    ...Platform.select({
      web: { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
      default: { elevation: 2 },
    }),
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: "#E2E8F0",
    marginBottom: 4,
  },
  tableColHeaderBlue: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#1D4ED8",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  tableColHeaderCyan: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#0284C7",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  tableColHeaderGreen: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#16A34A",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  tableSection: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  metricValuesRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValueBold: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  metricValueRegular: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
  },
  metricValueCyan: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#0284C7",
    textAlign: "center",
  },
  metricValueGreen: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#16A34A",
    textAlign: "center",
  },
  metricValueBlue: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#1D64EC",
    textAlign: "center",
  },

  /* Reliability Bars */
  progressTrack: {
    width: 50,
    maxWidth: "80%",
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F1F5F9",
    marginBottom: 4,
    overflow: "hidden",
  },
  progressBarBlue: {
    width: "90%",
    height: "100%",
    backgroundColor: "#1D64EC",
    borderRadius: 2,
  },
  progressBarCyan: {
    width: "60%",
    height: "100%",
    backgroundColor: "#0284C7",
    borderRadius: 2,
  },
  progressBarGreen: {
    width: "60%",
    height: "100%",
    backgroundColor: "#16A34A",
    borderRadius: 2,
  },
  reliabilityTextBlue: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#1D64EC",
    textAlign: "center",
  },
  reliabilityTextCyan: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#0284C7",
    textAlign: "center",
  },
  reliabilityTextGreen: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#16A34A",
    textAlign: "center",
  },

  /* Risk Pills */
  riskPillGreen: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  riskPillGreenText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
    textAlign: "center",
  },
  riskPillAmber: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  riskPillAmberText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
    textAlign: "center",
  },

  /* RECOMMENDATION CARD */
  recommendationCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1D4ED8",
    marginBottom: 4,
  },
  recBody: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 18,
  },
  recBold: {
    fontWeight: "700",
    color: "#1D4ED8",
  },

  /* BOTTOM ACTION BAR */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  selectButton: {
    backgroundColor: "#1D64EC",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      web: { boxShadow: "0 4px 14px rgba(29, 100, 236, 0.35)" },
      default: {
        elevation: 3,
        shadowColor: "#1D64EC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
