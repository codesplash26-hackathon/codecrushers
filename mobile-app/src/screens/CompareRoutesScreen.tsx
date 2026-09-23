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
    <View style={styles.screen}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitle}>Compare Routes</Text>
          <Text style={styles.headerSubtitle}>
            {fromCity} ➔ {toCity}
          </Text>
        </View>
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
              selectedRoute === "recommended" && styles.routeCardSelected,
            ]}
            onPress={() => setSelectedRoute("recommended")}
            activeOpacity={0.8}
          >
            <Text style={styles.cardHeaderRecommended}>Recommended</Text>
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
              selectedRoute === "fastest" && styles.routeCardSelected,
            ]}
            onPress={() => setSelectedRoute("fastest")}
            activeOpacity={0.8}
          >
            <Text style={styles.cardHeaderFastest}>Fastest</Text>
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
              selectedRoute === "cheapest" && styles.routeCardSelected,
            ]}
            onPress={() => setSelectedRoute("cheapest")}
            activeOpacity={0.8}
          >
            <Text style={styles.cardHeaderCheapest}>Cheapest</Text>
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
        <View style={styles.tableCard}>
          {/* Row 1: TOTAL TIME */}
          <View style={styles.tableSection}>
            <Text style={styles.metricLabel}>⏱ TOTAL TIME</Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueBold}>1h 35m</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueCyan}>1h 20m✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueRegular}>2h 05m</Text>
              </View>
            </View>
          </View>

          {/* Row 2: TOTAL COST */}
          <View style={styles.tableSection}>
            <Text style={styles.metricLabel}>💰 TOTAL COST</Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueBold}>Rs. 320</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueRegular}>Rs. 450</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueGreen}>Rs. 220✓</Text>
              </View>
            </View>
          </View>

          {/* Row 3: WAITING */}
          <View style={styles.tableSection}>
            <Text style={styles.metricLabel}>⏳ WAITING</Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueBlue}>5 min✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueRegular}>3 min</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueRegular}>15 min</Text>
              </View>
            </View>
          </View>

          {/* Row 4: TRANSFERS */}
          <View style={styles.tableSection}>
            <Text style={styles.metricLabel}>🔄 TRANSFERS</Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueBlue}>2✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueCyan}>2✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueRegular}>3</Text>
              </View>
            </View>
          </View>

          {/* Row 5: WALKING */}
          <View style={styles.tableSection}>
            <Text style={styles.metricLabel}>🚶 WALKING</Text>
            <View style={styles.metricValuesRow}>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueBlue}>8 min✓</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueRegular}>12 min</Text>
              </View>
              <View style={styles.metricCol}>
                <Text style={styles.metricValueRegular}>10 min</Text>
              </View>
            </View>
          </View>

          {/* Row 6: RELIABILITY */}
          <View style={styles.tableSection}>
            <Text style={styles.metricLabel}>🛡️ RELIABILITY</Text>
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
            <Text style={styles.metricLabel}>▲ RISK</Text>
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
        <View style={styles.recommendationCard}>
          <Text style={styles.recTitle}>💡 BestRoute Recommendation</Text>
          <Text style={styles.recBody}>
            The <Text style={styles.recBold}>Recommended route</Text> offers the
            best balance of cost, reliability, and journey time with low
            connection risk.
          </Text>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM ACTION BAR */}
      <View style={styles.bottomBar}>
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
    marginLeft: 12,
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
    padding: 10,
    alignItems: "center",
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
    fontSize: 12,
    fontWeight: "800",
    color: "#1D4ED8",
    marginBottom: 8,
  },
  cardHeaderFastest: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0284C7",
    marginBottom: 8,
  },
  cardHeaderCheapest: {
    fontSize: 12,
    fontWeight: "800",
    color: "#16A34A",
    marginBottom: 8,
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
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    width: "100%",
    justifyContent: "space-between",
  },
  legBadgeBlueText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#1E40AF",
  },
  legBadgeGreen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    width: "100%",
    justifyContent: "space-between",
  },
  legBadgeGreenText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#166534",
  },
  legBadgePink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    width: "100%",
    justifyContent: "center",
  },
  legBadgePinkText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#9D174D",
  },
  legBadgeYellow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    width: "100%",
    justifyContent: "center",
  },
  legBadgeYellowText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#92400E",
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
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  metricValueRegular: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  metricValueCyan: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0284C7",
  },
  metricValueGreen: {
    fontSize: 14,
    fontWeight: "800",
    color: "#16A34A",
  },
  metricValueBlue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1D64EC",
  },

  /* Reliability Bars */
  progressTrack: {
    width: 60,
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
    fontSize: 12,
    fontWeight: "800",
    color: "#1D64EC",
  },
  reliabilityTextCyan: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0284C7",
  },
  reliabilityTextGreen: {
    fontSize: 12,
    fontWeight: "800",
    color: "#16A34A",
  },

  /* Risk Pills */
  riskPillGreen: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 10,
  },
  riskPillGreenText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
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
  },
});
