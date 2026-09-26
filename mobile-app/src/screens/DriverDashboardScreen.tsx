import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  SafeAreaView,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import api from "../services/api";
import authService, { AuthUser } from "../services/authService";

type DriverDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  any
>;

interface Props {
  navigation: DriverDashboardNavigationProp;
}

interface RideRequest {
  id: string;
  passengerName: string;
  passengerRating: number;
  pickup: string;
  destination: string;
  fare: number;
  distance: string;
  eta: string;
}

export default function DriverDashboardScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"dispatch" | "earnings" | "history">("dispatch");
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [rideStep, setRideStep] = useState<"accepted" | "picked_up" | "completed">("accepted");
  const [todayEarnings, setTodayEarnings] = useState<number>(5420);
  const [todayTrips, setTodayTrips] = useState<number>(6);

  // Sample incoming ride request
  const [incomingRequest, setIncomingRequest] = useState<RideRequest | null>({
    id: "req_101",
    passengerName: "Chaminda Silva",
    passengerRating: 4.8,
    pickup: "Fort Railway Station, Colombo",
    destination: "Bambalapitiya Junction, Galle Rd",
    fare: 650,
    distance: "5.2 km",
    eta: "4 mins away",
  });

  // Trip history
  const [tripHistory, setTripHistory] = useState([
    {
      id: "th_1",
      passenger: "Amali De Silva",
      route: "Colombo Fort → Pettah Market",
      fare: 350,
      time: "20 mins ago",
      type: "Taxi",
    },
    {
      id: "th_2",
      passenger: "Nuwan Jayasuriya",
      route: "Kollupitiya → Cinnamon Gardens",
      fare: 520,
      time: "1 hour ago",
      type: "Taxi",
    },
    {
      id: "th_3",
      passenger: "Sarah Jenkins",
      route: "Town Hall → Gangaramaya Temple",
      fare: 420,
      time: "2.5 hours ago",
      type: "Taxi",
    },
    {
      id: "th_4",
      passenger: "Mohamed Rameez",
      route: "Maradana Station → Odel Alexandra",
      fare: 480,
      time: "4 hours ago",
      type: "Taxi",
    },
  ]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      // Fetch latest driver status from backend
      const res = await api.getMyDriverApplicationStatus({
        phone: user?.driverDetails?.phone,
        email: user?.email,
        userId: user?.id,
      });
      if (res && res.success && res.data) {
        const app = (res.data as any)?.data || res.data;
        const status = app?.status || (res.data as any)?.driverStatus;
        setIsOnline(
          status === "Approved" ||
          status === "approved" ||
          (res.data as any)?.userRole === "driver" ||
          user?.role === "driver"
        );
      }
    } catch {
      // offline fallback
    }
  };

  const handleToggleOnline = async (val: boolean) => {
    setIsOnline(val);
    try {
      await api.toggleDriverOnline(val);
    } catch {
      // ignore
    }
    if (!val) {
      setIncomingRequest(null);
    } else {
      // restore demo request after 2 seconds
      setTimeout(() => {
        setIncomingRequest({
          id: "req_102",
          passengerName: "Rohan Fernando",
          passengerRating: 4.9,
          pickup: "Union Place, Colombo 02",
          destination: "Independence Square, Colombo 07",
          fare: 580,
          distance: "3.8 km",
          eta: "3 mins away",
        });
      }, 2000);
    }
  };

  const handleAcceptRide = () => {
    if (!incomingRequest) return;
    setActiveRide(incomingRequest);
    setIncomingRequest(null);
    setRideStep("accepted");
  };

  const handleDeclineRide = () => {
    setIncomingRequest(null);
    Alert.alert("Request Declined", "Searching for next incoming ride request...");
  };

  const handleAdvanceRide = () => {
    if (rideStep === "accepted") {
      setRideStep("picked_up");
    } else if (rideStep === "picked_up") {
      // Complete Ride
      if (activeRide) {
        setTodayEarnings((prev) => prev + activeRide.fare);
        setTodayTrips((prev) => prev + 1);
        setTripHistory((prev) => [
          {
            id: `th_${Date.now()}`,
            passenger: activeRide.passengerName,
            route: `${activeRide.pickup.split(",")[0]} → ${activeRide.destination.split(",")[0]}`,
            fare: activeRide.fare,
            time: "Just now",
            type: currentUser?.driverDetails?.vehicleType || "Taxi",
          },
          ...prev,
        ]);
      }
      setRideStep("completed");
      setTimeout(() => {
        setActiveRide(null);
        Alert.alert("Trip Completed! 🎉", `Collected LKR ${activeRide?.fare}. Earnings updated.`);
      }, 1500);
    }
  };

  const vehicleNo = currentUser?.driverDetails?.vehicleNo || "WP CAB-1234";
  const vehicleType = currentUser?.driverDetails?.vehicleType || "Taxi";
  const vehicleModel = currentUser?.driverDetails?.vehicleModel || "Toyota Prius";

  return (
    <SafeAreaView
      style={[
        styles.safeContainer,
        { backgroundColor: isDarkMode ? "#0B1120" : "#F8FAFC" },
      ]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* TOP DRIVER HEADER */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
            borderBottomColor: isDarkMode ? "#334155" : "#E2E8F0",
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={styles.driverAvatar}>
            <Text style={styles.avatarEmoji}>🚖</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text
                style={[
                  styles.driverName,
                  { color: isDarkMode ? "#FFFFFF" : "#0F172A" },
                ]}
              >
                {currentUser?.name || "Kasun Perera"}
              </Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
              </View>
            </View>
            <Text
              style={[
                styles.vehicleSubtext,
                { color: isDarkMode ? "#94A3B8" : "#64748B" },
              ]}
            >
              {vehicleNo} · {vehicleModel}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <ThemeToggle variant="solid" size={36} />
          <TouchableOpacity
            style={[
              styles.switchPassengerBtn,
              { backgroundColor: isDarkMode ? "#334155" : "#EEF2FF" },
            ]}
            onPress={() => navigation.navigate("Home")}
            activeOpacity={0.8}
          >
            <Text style={styles.switchPassengerBtnText}>Passenger App ➔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* STATUS BANNER & ONLINE TOGGLE */}
      <View
        style={[
          styles.statusBanner,
          {
            backgroundColor: isOnline
              ? isDarkMode
                ? "rgba(16, 185, 129, 0.15)"
                : "#ECFDF5"
              : isDarkMode
              ? "rgba(100, 116, 139, 0.15)"
              : "#F1F5F9",
            borderColor: isOnline
              ? isDarkMode
                ? "rgba(16, 185, 129, 0.4)"
                : "#A7F3D0"
              : isDarkMode
              ? "#334155"
              : "#CBD5E1",
          },
        ]}
      >
        <View style={styles.statusBannerLeft}>
          <View
            style={[
              styles.statusPulseDot,
              { backgroundColor: isOnline ? "#10B981" : "#94A3B8" },
            ]}
          />
          <View>
            <Text
              style={[
                styles.statusBannerTitle,
                { color: isOnline ? "#059669" : "#64748B" },
              ]}
            >
              {isOnline ? "YOU ARE ONLINE" : "YOU ARE OFFLINE"}
            </Text>
            <Text
              style={[
                styles.statusBannerDesc,
                { color: isDarkMode ? "#94A3B8" : "#64748B" },
              ]}
            >
              {isOnline
                ? "Accepting passenger ride requests nearby"
                : "Go online to receive trips and earn fares"}
            </Text>
          </View>
        </View>

        <Switch
          value={isOnline}
          onValueChange={handleToggleOnline}
          trackColor={{ false: "#CBD5E1", true: "#10B981" }}
          thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
        />
      </View>

      {/* PERFORMANCE METRICS BAR */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
              borderColor: isDarkMode ? "#334155" : "#E2E8F0",
            },
          ]}
        >
          <Text style={[styles.statLabel, { color: isDarkMode ? "#94A3B8" : "#64748B" }]}>
            TODAY'S FARES
          </Text>
          <Text style={[styles.statValue, { color: "#10B981" }]}>
            LKR {todayEarnings.toLocaleString()}
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
              borderColor: isDarkMode ? "#334155" : "#E2E8F0",
            },
          ]}
        >
          <Text style={[styles.statLabel, { color: isDarkMode ? "#94A3B8" : "#64748B" }]}>
            TRIPS
          </Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? "#FFFFFF" : "#0F172A" },
            ]}
          >
            {todayTrips} completed
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
              borderColor: isDarkMode ? "#334155" : "#E2E8F0",
            },
          ]}
        >
          <Text style={[styles.statLabel, { color: isDarkMode ? "#94A3B8" : "#64748B" }]}>
            RATING
          </Text>
          <Text style={[styles.statValue, { color: "#F59E0B" }]}>
            4.9 ★
          </Text>
        </View>
      </View>

      {/* DRIVER NAVIGATION BAR / TABS */}
      <View
        style={[
          styles.driverNavTabBar,
          {
            backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
            borderBottomColor: isDarkMode ? "#334155" : "#E2E8F0",
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.driverNavTabItem,
            activeTab === "dispatch" && styles.driverNavTabItemActive,
          ]}
          onPress={() => setActiveTab("dispatch")}
        >
          <Text
            style={[
              styles.driverNavTabText,
              {
                color:
                  activeTab === "dispatch"
                    ? "#2563EB"
                    : isDarkMode
                    ? "#94A3B8"
                    : "#64748B",
              },
            ]}
          >
            🚖 Ride Dispatch
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.driverNavTabItem,
            activeTab === "earnings" && styles.driverNavTabItemActive,
          ]}
          onPress={() => setActiveTab("earnings")}
        >
          <Text
            style={[
              styles.driverNavTabText,
              {
                color:
                  activeTab === "earnings"
                    ? "#2563EB"
                    : isDarkMode
                    ? "#94A3B8"
                    : "#64748B",
              },
            ]}
          >
            💰 Earnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.driverNavTabItem,
            activeTab === "history" && styles.driverNavTabItemActive,
          ]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.driverNavTabText,
              {
                color:
                  activeTab === "history"
                    ? "#2563EB"
                    : isDarkMode
                    ? "#94A3B8"
                    : "#64748B",
              },
            ]}
          >
            📋 Trip Log
          </Text>
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT AREA */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "dispatch" && (
          <View>
            {/* Active Ride In Progress */}
            {activeRide ? (
              <View
                style={[
                  styles.activeRideCard,
                  {
                    backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                    borderColor: "#2563EB",
                  },
                ]}
              >
                <View style={styles.activeRideBadge}>
                  <Text style={styles.activeRideBadgeText}>
                    {rideStep === "accepted"
                      ? "DRIVING TO PICKUP"
                      : rideStep === "picked_up"
                      ? "ON TRIP TO DESTINATION"
                      : "TRIP COMPLETED"}
                  </Text>
                </View>

                <View style={styles.passengerHeaderRow}>
                  <View>
                    <Text
                      style={[
                        styles.passengerNameText,
                        { color: isDarkMode ? "#FFFFFF" : "#0F172A" },
                      ]}
                    >
                      {activeRide.passengerName}
                    </Text>
                    <Text
                      style={[
                        styles.passengerRatingText,
                        { color: isDarkMode ? "#94A3B8" : "#64748B" },
                      ]}
                    >
                      {activeRide.passengerRating} ★ · Verified Passenger
                    </Text>
                  </View>
                  <Text style={styles.rideFareBig}>LKR {activeRide.fare}</Text>
                </View>

                <View style={styles.tripRouteContainer}>
                  <View style={styles.tripRouteStep}>
                    <Text style={styles.dotGreen}>🟢</Text>
                    <View style={styles.routeCol}>
                      <Text style={styles.routeRoleLabel}>PICKUP</Text>
                      <Text
                        style={[
                          styles.routeLocationText,
                          { color: isDarkMode ? "#E2E8F0" : "#1E293B" },
                        ]}
                      >
                        {activeRide.pickup}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.routeLine} />

                  <View style={styles.tripRouteStep}>
                    <Text style={styles.dotRed}>📍</Text>
                    <View style={styles.routeCol}>
                      <Text style={styles.routeRoleLabel}>DROP-OFF</Text>
                      <Text
                        style={[
                          styles.routeLocationText,
                          { color: isDarkMode ? "#E2E8F0" : "#1E293B" },
                        ]}
                      >
                        {activeRide.destination}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity
                  style={styles.advanceRideBtn}
                  onPress={handleAdvanceRide}
                  activeOpacity={0.8}
                >
                  <Text style={styles.advanceRideBtnText}>
                    {rideStep === "accepted"
                      ? "Confirm Passenger Picked Up ➔"
                      : "Complete Trip & Collect Fare ➔"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : incomingRequest && isOnline ? (
              /* Incoming Ride Request Alert */
              <View
                style={[
                  styles.incomingRequestCard,
                  {
                    backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                    borderColor: "#10B981",
                  },
                ]}
              >
                <View style={styles.requestPillHeader}>
                  <Text style={styles.requestPillText}>⚡ NEW RIDE REQUEST</Text>
                  <Text style={styles.etaText}>{incomingRequest.eta}</Text>
                </View>

                <View style={styles.passengerHeaderRow}>
                  <View>
                    <Text
                      style={[
                        styles.passengerNameText,
                        { color: isDarkMode ? "#FFFFFF" : "#0F172A" },
                      ]}
                    >
                      {incomingRequest.passengerName}
                    </Text>
                    <Text
                      style={[
                        styles.passengerRatingText,
                        { color: isDarkMode ? "#94A3B8" : "#64748B" },
                      ]}
                    >
                      {incomingRequest.passengerRating} ★ · {incomingRequest.distance}
                    </Text>
                  </View>
                  <View style={styles.fareContainer}>
                    <Text style={styles.fareSmallLabel}>EST. FARE</Text>
                    <Text style={styles.rideFareBig}>
                      LKR {incomingRequest.fare}
                    </Text>
                  </View>
                </View>

                <View style={styles.tripRouteContainer}>
                  <View style={styles.tripRouteStep}>
                    <Text style={styles.dotGreen}>🟢</Text>
                    <View style={styles.routeCol}>
                      <Text style={styles.routeRoleLabel}>PICKUP</Text>
                      <Text
                        style={[
                          styles.routeLocationText,
                          { color: isDarkMode ? "#E2E8F0" : "#1E293B" },
                        ]}
                      >
                        {incomingRequest.pickup}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.routeLine} />

                  <View style={styles.tripRouteStep}>
                    <Text style={styles.dotRed}>📍</Text>
                    <View style={styles.routeCol}>
                      <Text style={styles.routeRoleLabel}>DESTINATION</Text>
                      <Text
                        style={[
                          styles.routeLocationText,
                          { color: isDarkMode ? "#E2E8F0" : "#1E293B" },
                        ]}
                      >
                        {incomingRequest.destination}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.requestActionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.declineBtn,
                      {
                        backgroundColor: isDarkMode ? "#334155" : "#F1F5F9",
                      },
                    ]}
                    onPress={handleDeclineRide}
                  >
                    <Text
                      style={[
                        styles.declineBtnText,
                        { color: isDarkMode ? "#94A3B8" : "#64748B" },
                      ]}
                    >
                      Decline
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={handleAcceptRide}
                  >
                    <Text style={styles.acceptBtnText}>Accept Ride (LKR {incomingRequest.fare})</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Idle / Waiting Card */
              <View
                style={[
                  styles.idleCard,
                  {
                    backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                    borderColor: isDarkMode ? "#334155" : "#E2E8F0",
                  },
                ]}
              >
                <Text style={styles.radarEmoji}>📡</Text>
                <Text
                  style={[
                    styles.idleTitle,
                    { color: isDarkMode ? "#FFFFFF" : "#0F172A" },
                  ]}
                >
                  {isOnline
                    ? "Searching for nearby passengers..."
                    : "You are currently offline"}
                </Text>
                <Text
                  style={[
                    styles.idleSubtitle,
                    { color: isDarkMode ? "#94A3B8" : "#64748B" },
                  ]}
                >
                  {isOnline
                    ? "Stay in Colombo city center for faster trip dispatches."
                    : "Toggle Online switch above to begin receiving passenger requests."}
                </Text>
              </View>
            )}

            {/* Vehicle Card */}
            <View
              style={[
                styles.vehicleCard,
                {
                  backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                  borderColor: isDarkMode ? "#334155" : "#E2E8F0",
                },
              ]}
            >
              <View style={styles.vehicleHeaderRow}>
                <View style={styles.vehicleIconWrapper}>
                  <Text style={styles.vehicleEmoji}>
                    {vehicleType === "Tuk-tuk" ? "🛺" : "🚕"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.vehicleCardTitle,
                      { color: isDarkMode ? "#FFFFFF" : "#0F172A" },
                    ]}
                  >
                    {vehicleType} · {vehicleNo}
                  </Text>
                  <Text
                    style={[
                      styles.vehicleCardSub,
                      { color: isDarkMode ? "#94A3B8" : "#64748B" },
                    ]}
                  >
                    {vehicleModel} · Active Transit Partner License
                  </Text>
                </View>
                <View style={styles.liveGpsBadge}>
                  <View style={styles.greenDotSmall} />
                  <Text style={styles.liveGpsText}>GPS LIVE</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "earnings" && (
          <View>
            <View
              style={[
                styles.earningsSummaryCard,
                {
                  backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                  borderColor: isDarkMode ? "#334155" : "#E2E8F0",
                },
              ]}
            >
              <Text
                style={[
                  styles.earningsHeaderLabel,
                  { color: isDarkMode ? "#94A3B8" : "#64748B" },
                ]}
              >
                THIS WEEK'S TOTAL PAYOUT
              </Text>
              <Text style={styles.earningsBigAmount}>LKR 38,450.00</Text>
              <Text style={styles.earningsSubtext}>
                Payout scheduled for Monday · Direct Bank Deposit
              </Text>
            </View>

            <View style={styles.breakdownList}>
              <View
                style={[
                  styles.breakdownRow,
                  {
                    backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                    borderColor: isDarkMode ? "#334155" : "#E2E8F0",
                  },
                ]}
              >
                <Text style={{ color: isDarkMode ? "#E2E8F0" : "#1E293B" }}>
                  Today's Completed Trips ({todayTrips})
                </Text>
                <Text style={{ fontWeight: "700", color: "#10B981" }}>
                  + LKR {todayEarnings.toLocaleString()}
                </Text>
              </View>

              <View
                style={[
                  styles.breakdownRow,
                  {
                    backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                    borderColor: isDarkMode ? "#334155" : "#E2E8F0",
                  },
                ]}
              >
                <Text style={{ color: isDarkMode ? "#E2E8F0" : "#1E293B" }}>
                  Fuel Incentive Bonus
                </Text>
                <Text style={{ fontWeight: "700", color: "#10B981" }}>
                  + LKR 1,500
                </Text>
              </View>

              <View
                style={[
                  styles.breakdownRow,
                  {
                    backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                    borderColor: isDarkMode ? "#334155" : "#E2E8F0",
                  },
                ]}
              >
                <Text style={{ color: isDarkMode ? "#E2E8F0" : "#1E293B" }}>
                  Platform Commission (10%)
                </Text>
                <Text style={{ fontWeight: "700", color: "#EF4444" }}>
                  - LKR {(todayEarnings * 0.1).toFixed(0)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "history" && (
          <View>
            <Text
              style={[
                styles.historySectionTitle,
                { color: isDarkMode ? "#94A3B8" : "#64748B" },
              ]}
            >
              RECENT COMPLETED TRIPS
            </Text>

            {tripHistory.map((trip) => (
              <View
                key={trip.id}
                style={[
                  styles.historyItemCard,
                  {
                    backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                    borderColor: isDarkMode ? "#334155" : "#E2E8F0",
                  },
                ]}
              >
                <View style={styles.historyLeft}>
                  <Text style={styles.historyPassenger}>
                    {trip.passenger}
                  </Text>
                  <Text
                    style={[
                      styles.historyRoute,
                      { color: isDarkMode ? "#94A3B8" : "#64748B" },
                    ]}
                  >
                    {trip.route}
                  </Text>
                  <Text style={styles.historyTime}>{trip.time}</Text>
                </View>

                <View style={styles.historyRight}>
                  <Text style={styles.historyFare}>+ LKR {trip.fare}</Text>
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>COMPLETED</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 22,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "700",
  },
  verifiedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#16A34A",
  },
  vehicleSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  switchPassengerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  switchPassengerBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  statusPulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusBannerTitle: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statusBannerDesc: {
    fontSize: 12,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  driverNavTabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  driverNavTabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  driverNavTabItemActive: {
    borderBottomColor: "#2563EB",
  },
  driverNavTabText: {
    fontSize: 13,
    fontWeight: "700",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  activeRideCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 16,
  },
  activeRideBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  activeRideBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  passengerHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  passengerNameText: {
    fontSize: 18,
    fontWeight: "700",
  },
  passengerRatingText: {
    fontSize: 12,
    marginTop: 2,
  },
  fareContainer: {
    alignItems: "flex-end",
  },
  fareSmallLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
  rideFareBig: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10B981",
  },
  tripRouteContainer: {
    marginBottom: 16,
  },
  tripRouteStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  dotGreen: {
    fontSize: 14,
    marginTop: 2,
  },
  dotRed: {
    fontSize: 14,
    marginTop: 2,
  },
  routeCol: {
    flex: 1,
  },
  routeRoleLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  routeLocationText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: "#CBD5E1",
    marginLeft: 6,
    marginVertical: 4,
  },
  advanceRideBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  advanceRideBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  incomingRequestCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#10B981",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  requestPillHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  requestPillText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.5,
  },
  etaText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F59E0B",
  },
  requestActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  declineBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  idleCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  radarEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  idleTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  idleSubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  vehicleCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  vehicleHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vehicleIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleEmoji: {
    fontSize: 22,
  },
  vehicleCardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  vehicleCardSub: {
    fontSize: 12,
    marginTop: 2,
  },
  liveGpsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  greenDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  liveGpsText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
  },
  earningsSummaryCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: "center",
  },
  earningsHeaderLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  earningsBigAmount: {
    fontSize: 30,
    fontWeight: "900",
    color: "#10B981",
    marginVertical: 6,
  },
  earningsSubtext: {
    fontSize: 12,
    color: "#64748B",
  },
  breakdownList: {
    gap: 10,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  historySectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  historyItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  historyLeft: {
    flex: 1,
  },
  historyPassenger: {
    fontSize: 15,
    fontWeight: "700",
  },
  historyRoute: {
    fontSize: 13,
    marginTop: 2,
  },
  historyTime: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyFare: {
    fontSize: 15,
    fontWeight: "800",
    color: "#10B981",
  },
  completedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  completedBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#16A34A",
  },
});
