import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Share,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import BottomNavigationBar from "../components/BottomNavigationBar";
import api from "../services/api";

type JourneysScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Journeys"
>;

type JourneysScreenRouteProp = RouteProp<
  RootStackParamList,
  "Journeys"
>;

interface Props {
  navigation: JourneysScreenNavigationProp;
  route?: JourneysScreenRouteProp;
}

export type JourneyTab = "upcoming" | "completed" | "saved";

export interface TransitModeSegment {
  type: "bus" | "train" | "tuk" | "taxi" | "walk";
  label: string;
  icon: string;
}

export interface JourneyItem {
  id: string;
  origin: string;
  destination: string;
  subtitle: string;
  status: "Completed" | "Scheduled" | "Confirmed" | "Saved";
  modes: TransitModeSegment[];
  duration: string;
  cost: string;
  date?: string;
  details?: {
    departureTime: string;
    arrivalTime: string;
    transfers: number;
    distance: string;
    co2Saved: string;
    legs: Array<{
      mode: string;
      icon: string;
      lineOrType: string;
      from: string;
      to: string;
      time: string;
      fare: string;
    }>;
  };
}

export default function JourneysScreen({ navigation, route }: Props) {
  const { isDarkMode, colors } = useTheme();
  const initialTab = route?.params?.initialTab || "completed";
  const [activeTab, setActiveTab] = useState<JourneyTab>(initialTab);
  const [selectedJourney, setSelectedJourney] = useState<JourneyItem | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [savedJourneys, setSavedJourneys] = useState<JourneyItem[]>([
    {
      id: "saved-1",
      origin: "Home (Kandy)",
      destination: "Peradeniya University",
      subtitle: "Daily Commute · Fastest",
      status: "Saved",
      modes: [{ type: "bus", label: "Bus", icon: "🚌" }],
      duration: "25 min",
      cost: "Rs. 80",
      details: {
        departureTime: "Flexible",
        arrivalTime: "+25m",
        transfers: 0,
        distance: "6.8 km",
        co2Saved: "1.2 kg",
        legs: [
          {
            mode: "Bus",
            icon: "🚌",
            lineOrType: "Route 654 Kandy-Peradeniya",
            from: "Kandy Clock Tower",
            to: "University Junction",
            time: "25 min",
            fare: "Rs. 80",
          },
        ],
      },
    },
    {
      id: "saved-2",
      origin: "Colombo Fort",
      destination: "Bandaranaike Airport",
      subtitle: "Express Highway Service",
      status: "Saved",
      modes: [
        { type: "bus", label: "Bus", icon: "🚌" },
        { type: "tuk", label: "Tuk", icon: "🛺" },
      ],
      duration: "45 min",
      cost: "Rs. 450",
      details: {
        departureTime: "Every 30 mins",
        arrivalTime: "+45m",
        transfers: 1,
        distance: "32 km",
        co2Saved: "3.5 kg",
        legs: [
          {
            mode: "Bus",
            icon: "🚌",
            lineOrType: "EX 01 Expressway Luxury",
            from: "Colombo Fort Station",
            to: "Katunayake Junction",
            time: "35 min",
            fare: "Rs. 350",
          },
          {
            mode: "Tuk",
            icon: "🛺",
            lineOrType: "Metered Three-Wheeler",
            from: "Katunayake Junction",
            to: "Terminal 1 Departures",
            time: "10 min",
            fare: "Rs. 100",
          },
        ],
      },
    },
  ]);

  // Completed journeys matching mockup exactly
  const completedJourneys: JourneyItem[] = [
    {
      id: "comp-1",
      origin: "Kandy",
      destination: "Colombo Fort",
      subtitle: "Today · 8:30 AM",
      status: "Completed",
      modes: [
        { type: "bus", label: "Bus", icon: "🚌" },
        { type: "train", label: "Train", icon: "🚆" },
        { type: "tuk", label: "Tuk", icon: "🛺" },
      ],
      duration: "1h 35m",
      cost: "Rs. 320",
      details: {
        departureTime: "08:30 AM",
        arrivalTime: "10:05 AM",
        transfers: 2,
        distance: "115 km",
        co2Saved: "4.8 kg",
        legs: [
          {
            mode: "Bus",
            icon: "🚌",
            lineOrType: "Feeder Bus 654",
            from: "Kandy City Center",
            to: "Kandy Railway Station",
            time: "10 min",
            fare: "Rs. 50",
          },
          {
            mode: "Train",
            icon: "🚆",
            lineOrType: "Intercity Express #1008",
            from: "Kandy Railway Station",
            to: "Colombo Fort Station",
            time: "1h 15m",
            fare: "Rs. 220",
          },
          {
            mode: "Tuk",
            icon: "🛺",
            lineOrType: "Local Three-Wheeler",
            from: "Fort Station North Exit",
            to: "Pettah Market Square",
            time: "10 min",
            fare: "Rs. 50",
          },
        ],
      },
    },
    {
      id: "comp-2",
      origin: "University of Sri Jay.",
      destination: "Kandy",
      subtitle: "Yesterday · 2:15 PM",
      status: "Completed",
      modes: [
        { type: "bus", label: "Bus", icon: "🚌" },
        { type: "bus", label: "Bus", icon: "🚌" },
      ],
      duration: "1h 10m",
      cost: "Rs. 180",
      details: {
        departureTime: "02:15 PM",
        arrivalTime: "03:25 PM",
        transfers: 1,
        distance: "82 km",
        co2Saved: "2.9 kg",
        legs: [
          {
            mode: "Bus",
            icon: "🚌",
            lineOrType: "Route 138 Homagama-Pettah",
            from: "University Gate",
            to: "Colombo Central Bus Stand",
            time: "25 min",
            fare: "Rs. 60",
          },
          {
            mode: "Bus",
            icon: "🚌",
            lineOrType: "Route 01 Colombo-Kandy AC",
            from: "Central Bus Stand",
            to: "Kandy Goodshed Bus Stand",
            time: "45 min",
            fare: "Rs. 120",
          },
        ],
      },
    },
    {
      id: "comp-3",
      origin: "Kandy",
      destination: "Peradeniya",
      subtitle: "Mon · 9:00 AM",
      status: "Completed",
      modes: [{ type: "bus", label: "Bus", icon: "🚌" }],
      duration: "25 min",
      cost: "Rs. 80",
      details: {
        departureTime: "09:00 AM",
        arrivalTime: "09:25 AM",
        transfers: 0,
        distance: "6.5 km",
        co2Saved: "0.9 kg",
        legs: [
          {
            mode: "Bus",
            icon: "🚌",
            lineOrType: "Route 654 Kandy-Peradeniya",
            from: "Kandy Clock Tower",
            to: "Peradeniya Rest House",
            time: "25 min",
            fare: "Rs. 80",
          },
        ],
      },
    },
    {
      id: "comp-4",
      origin: "Colombo Fort",
      destination: "Galle",
      subtitle: "Last week · 6:45 AM",
      status: "Completed",
      modes: [
        { type: "train", label: "Train", icon: "🚆" },
        { type: "tuk", label: "Tuk", icon: "🛺" },
      ],
      duration: "2h 10m",
      cost: "Rs. 450",
      details: {
        departureTime: "06:45 AM",
        arrivalTime: "08:55 AM",
        transfers: 1,
        distance: "119 km",
        co2Saved: "5.4 kg",
        legs: [
          {
            mode: "Train",
            icon: "🚆",
            lineOrType: "Coastal Line Samudra Devi",
            from: "Colombo Fort Station",
            to: "Galle Central Station",
            time: "1h 55m",
            fare: "Rs. 350",
          },
          {
            mode: "Tuk",
            icon: "🛺",
            lineOrType: "Local Three-Wheeler",
            from: "Galle Station",
            to: "Galle Dutch Fort",
            time: "15 min",
            fare: "Rs. 100",
          },
        ],
      },
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const routesRes = await api.getRoutes();
        if (routesRes.success && Array.isArray(routesRes.data?.routes) && routesRes.data.routes.length > 0) {
          const apiJourneys: JourneyItem[] = routesRes.data.routes.map((r: any, idx: number) => ({
            id: r._id || `api-route-${idx}`,
            origin: r.startLocation?.name || r.name || "Kandy",
            destination: r.endLocation?.name || "Colombo Fort",
            subtitle: `${r.type || "Transit"} Route · ${r.distance || "115 km"}`,
            status: "Saved" as const,
            modes: [
              {
                type: (r.type?.toLowerCase().includes("train") ? "train" : "bus") as "train" | "bus",
                label: r.type || "Express",
                icon: r.type?.toLowerCase().includes("train") ? "🚆" : "🚌",
              },
            ],
            duration: `${r.estimatedDurationMinutes || 180} min`,
            cost: `Rs. ${r.baseFare || 450}`,
          }));
          setSavedJourneys((prev) => [...apiJourneys, ...prev]);
        }
      } catch {
        // Fallback
      }
    })();
  }, []);

  // Upcoming journeys
  const upcomingJourneys: JourneyItem[] = [
    {
      id: "up-1",
      origin: "Colombo Fort",
      destination: "Kandy",
      subtitle: "Today · 4:30 PM (Departs in 45m)",
      status: "Scheduled",
      modes: [
        { type: "train", label: "Train", icon: "🚆" },
        { type: "bus", label: "Bus", icon: "🚌" },
      ],
      duration: "2h 30m",
      cost: "Rs. 380",
      details: {
        departureTime: "04:30 PM",
        arrivalTime: "07:00 PM",
        transfers: 1,
        distance: "115 km",
        co2Saved: "4.5 kg",
        legs: [
          {
            mode: "Train",
            icon: "🚆",
            lineOrType: "Podi Menike Express #1005",
            from: "Colombo Fort Station",
            to: "Peradeniya Junction",
            time: "2h 10m",
            fare: "Rs. 300",
          },
          {
            mode: "Bus",
            icon: "🚌",
            lineOrType: "Feeder Bus 654",
            from: "Peradeniya Junction",
            to: "Kandy City Center",
            time: "20 min",
            fare: "Rs. 80",
          },
        ],
      },
    },
    {
      id: "up-2",
      origin: "Bambalapitiya",
      destination: "Nugegoda",
      subtitle: "Tomorrow · 8:15 AM",
      status: "Confirmed",
      modes: [
        { type: "bus", label: "Bus", icon: "🚌" },
        { type: "tuk", label: "Tuk", icon: "🛺" },
      ],
      duration: "35 min",
      cost: "Rs. 160",
      details: {
        departureTime: "08:15 AM",
        arrivalTime: "08:50 AM",
        transfers: 1,
        distance: "8.2 km",
        co2Saved: "1.4 kg",
        legs: [
          {
            mode: "Bus",
            icon: "🚌",
            lineOrType: "Route 138",
            from: "Bambalapitiya Junction",
            to: "Nugegoda Supermarket",
            time: "25 min",
            fare: "Rs. 70",
          },
          {
            mode: "Tuk",
            icon: "🛺",
            lineOrType: "Metered Tuk",
            from: "Nugegoda Supermarket",
            to: "Destination Hub",
            time: "10 min",
            fare: "Rs. 90",
          },
        ],
      },
    },
  ];

  const handleRepeat = (journey: JourneyItem) => {
    // Navigate to RouteResults immediately with the selected points
    navigation.navigate("RouteResults", {
      from: journey.origin,
      to: journey.destination,
      skipLoading: false,
    });
  };

  const handleDetails = (journey: JourneyItem) => {
    setSelectedJourney(journey);
    setIsDetailModalVisible(true);
  };

  const handleTrackLive = (journey: JourneyItem) => {
    navigation.navigate("LiveTracking", {
      from: journey.origin,
      to: journey.destination,
    });
  };

  const handleRemoveSaved = (id: string) => {
    Alert.alert(
      "Remove Route",
      "Are you sure you want to remove this journey from your saved list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setSavedJourneys((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const handleShareJourney = async (journey: JourneyItem) => {
    try {
      await Share.share({
        message: `BestRoute Journey: ${journey.origin} → ${journey.destination} (${journey.duration}, ${journey.cost}). Planned via BestRoute Multimodal App!`,
      });
    } catch {
      // ignore
    }
  };

  const currentList =
    activeTab === "completed"
      ? completedJourneys
      : activeTab === "upcoming"
      ? upcomingJourneys
      : savedJourneys;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.screenBg }]}
      edges={["top"]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Screen Header - Safe distance below dynamic island / notch */}
      <View
        style={[
          styles.header,
          isDarkMode && { backgroundColor: colors.headerBg },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            isDarkMode && { color: colors.textPrimary },
          ]}
        >
          My Journeys
        </Text>
        {/* Dark Mode Change Button in Top Right Corner */}
        <ThemeToggle variant="solid" size={38} />
      </View>

      {/* Segmented Tab Pill Control */}
      <View
        style={[
          styles.tabContainer,
          isDarkMode && { backgroundColor: colors.subtleBg },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "upcoming" && [
              styles.tabButtonActive,
              isDarkMode && { backgroundColor: colors.cardBg },
            ],
          ]}
          onPress={() => setActiveTab("upcoming")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.tabTextActive,
              isDarkMode && activeTab !== "upcoming" && { color: colors.textSecondary },
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "completed" && [
              styles.tabButtonActive,
              isDarkMode && { backgroundColor: colors.cardBg },
            ],
          ]}
          onPress={() => setActiveTab("completed")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.tabTextActive,
              isDarkMode && activeTab !== "completed" && { color: colors.textSecondary },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "saved" && [
              styles.tabButtonActive,
              isDarkMode && { backgroundColor: colors.cardBg },
            ],
          ]}
          onPress={() => setActiveTab("saved")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "saved" && styles.tabTextActive,
              isDarkMode && activeTab !== "saved" && { color: colors.textSecondary },
            ]}
          >
            Saved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Journey Cards Scroll View */}
      <ScrollView
        style={[styles.scrollList, isDarkMode && { backgroundColor: colors.screenBg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🗺️</Text>
            <Text
              style={[
                styles.emptyTitle,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              {activeTab === "upcoming"
                ? "No Upcoming Journeys"
                : activeTab === "completed"
                ? "No Completed Journeys"
                : "No Saved Journeys"}
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              {activeTab === "upcoming"
                ? "Your booked or scheduled journeys will show up here."
                : activeTab === "completed"
                ? "Once you complete a journey, your trip history will appear here."
                : "Save your frequent routes for one-tap navigation."}
            </Text>
            <TouchableOpacity
              style={styles.planJourneyCTA}
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.8}
            >
              <Text style={styles.planJourneyCTAText}>Plan a Journey</Text>
            </TouchableOpacity>
          </View>
        ) : (
          currentList.map((journey) => (
            <View
              key={journey.id}
              style={[
                styles.card,
                isDarkMode && {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              {/* Card Header: Route & Status Badge */}
              <View style={styles.cardHeader}>
                <View style={styles.routeTitleRow}>
                  <Text
                    style={[
                      styles.routeOrigin,
                      isDarkMode && { color: colors.textPrimary },
                    ]}
                    numberOfLines={1}
                  >
                    {journey.origin}
                  </Text>
                  <Text style={styles.routeArrow}> → </Text>
                  <Text
                    style={[
                      styles.routeDestination,
                      isDarkMode && { color: colors.textPrimary },
                    ]}
                    numberOfLines={1}
                  >
                    {journey.destination}
                  </Text>
                </View>

                {/* Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    journey.status === "Completed"
                      ? styles.statusBadgeCompleted
                      : journey.status === "Scheduled" || journey.status === "Confirmed"
                      ? styles.statusBadgeUpcoming
                      : styles.statusBadgeSaved,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      journey.status === "Completed"
                        ? styles.statusBadgeTextCompleted
                        : journey.status === "Scheduled" || journey.status === "Confirmed"
                        ? styles.statusBadgeTextUpcoming
                        : styles.statusBadgeTextSaved,
                    ]}
                  >
                    {journey.status}
                  </Text>
                </View>
              </View>

              {/* Subtitle / Timestamp */}
              <Text
                style={[
                  styles.cardSubtitle,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                {journey.subtitle}
              </Text>

              {/* Transit Mode Flow Row */}
              <View style={styles.modesRow}>
                {journey.modes.map((mode, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <Text style={styles.modeArrow}>→</Text>}
                    <View
                      style={[
                        styles.modePill,
                        mode.type === "bus"
                          ? styles.modePillBus
                          : mode.type === "train"
                          ? styles.modePillTrain
                          : mode.type === "tuk"
                          ? styles.modePillTuk
                          : mode.type === "taxi"
                          ? styles.modePillTaxi
                          : styles.modePillWalk,
                      ]}
                    >
                      <Text style={styles.modeIcon}>{mode.icon}</Text>
                      <Text
                        style={[
                          styles.modeText,
                          mode.type === "bus"
                            ? styles.modeTextBus
                            : mode.type === "train"
                            ? styles.modeTextTrain
                            : mode.type === "tuk"
                            ? styles.modeTextTuk
                            : mode.type === "taxi"
                            ? styles.modeTextTaxi
                            : styles.modeTextWalk,
                        ]}
                      >
                        {mode.label}
                      </Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>

              {/* Card Footer: Metrics & Action Buttons */}
              <View
                style={[
                  styles.cardFooter,
                  isDarkMode && { borderTopColor: colors.cardBorder },
                ]}
              >
                <View style={styles.metricsGroup}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricIcon}>⏱</Text>
                    <Text
                      style={[
                        styles.metricValue,
                        isDarkMode && { color: colors.textPrimary },
                      ]}
                    >
                      {journey.duration}
                    </Text>
                  </View>
                  <View style={[styles.metricItem, styles.metricCostItem]}>
                    <Text style={styles.metricIcon}>💰</Text>
                    <Text
                      style={[
                        styles.metricValue,
                        isDarkMode && { color: colors.textPrimary },
                      ]}
                    >
                      {journey.cost}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsGroup}>
                  {activeTab === "completed" && (
                    <>
                      <TouchableOpacity
                        style={styles.repeatButton}
                        onPress={() => handleRepeat(journey)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.repeatButtonText}>Repeat</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => handleDetails(journey)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.detailsButtonText}>Details</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {activeTab === "upcoming" && (
                    <>
                      <TouchableOpacity
                        style={styles.trackLiveButton}
                        onPress={() => handleTrackLive(journey)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.liveIndicatorDot} />
                        <Text style={styles.trackLiveButtonText}>Track Live</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => handleDetails(journey)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.detailsButtonText}>Details</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {activeTab === "saved" && (
                    <>
                      <TouchableOpacity
                        style={styles.repeatButton}
                        onPress={() => handleRepeat(journey)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.repeatButtonText}>Plan Now</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeSavedButton}
                        onPress={() => handleRemoveSaved(journey.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.removeSavedButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Unified Fixed-Position Bottom Navigation Bar */}
      <BottomNavigationBar activeTab="journeys" navigation={navigation} />

      {/* ================= JOURNEY DETAIL MODAL ================= */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <SafeAreaView
          style={[
            styles.modalSafeArea,
            isDarkMode && { backgroundColor: colors.screenBg },
          ]}
          edges={["top", "bottom"]}
        >
          <View
            style={[
              styles.modalHeader,
              isDarkMode && {
                backgroundColor: colors.headerBg,
                borderBottomColor: colors.cardBorder,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                isDarkMode && { backgroundColor: colors.subtleBg },
              ]}
              onPress={() => setIsDetailModalVisible(false)}
            >
              <Text
                style={[
                  styles.modalCloseText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.modalTitle,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              Journey Details
            </Text>
            <TouchableOpacity
              style={styles.modalShareButton}
              onPress={() => selectedJourney && handleShareJourney(selectedJourney)}
            >
              <Text style={styles.modalShareText}>Share</Text>
            </TouchableOpacity>
          </View>

          {selectedJourney && (
            <ScrollView
              style={[
                styles.modalScroll,
                isDarkMode && { backgroundColor: colors.screenBg },
              ]}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Route Summary Box */}
              <View
                style={[
                  styles.modalSummaryBox,
                  isDarkMode && {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.modalRouteRow}>
                  <Text
                    style={[
                      styles.modalRouteOrigin,
                      isDarkMode && { color: colors.textPrimary },
                    ]}
                  >
                    {selectedJourney.origin}
                  </Text>
                  <Text style={styles.modalRouteArrow}> → </Text>
                  <Text
                    style={[
                      styles.modalRouteDest,
                      isDarkMode && { color: colors.textPrimary },
                    ]}
                  >
                    {selectedJourney.destination}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.modalSubtitle,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  {selectedJourney.subtitle}
                </Text>

                {/* Key stats row */}
                <View style={styles.modalStatsRow}>
                  <View style={styles.modalStatCol}>
                    <Text
                      style={[
                        styles.modalStatLabel,
                        isDarkMode && { color: colors.textSecondary },
                      ]}
                    >
                      Total Duration
                    </Text>
                    <Text
                      style={[
                        styles.modalStatVal,
                        isDarkMode && { color: colors.textPrimary },
                      ]}
                    >
                      {selectedJourney.duration}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modalStatDivider,
                      isDarkMode && { backgroundColor: colors.cardBorder },
                    ]}
                  />
                  <View style={styles.modalStatCol}>
                    <Text
                      style={[
                        styles.modalStatLabel,
                        isDarkMode && { color: colors.textSecondary },
                      ]}
                    >
                      Total Fare
                    </Text>
                    <Text
                      style={[
                        styles.modalStatVal,
                        isDarkMode && { color: colors.textPrimary },
                      ]}
                    >
                      {selectedJourney.cost}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modalStatDivider,
                      isDarkMode && { backgroundColor: colors.cardBorder },
                    ]}
                  />
                  <View style={styles.modalStatCol}>
                    <Text
                      style={[
                        styles.modalStatLabel,
                        isDarkMode && { color: colors.textSecondary },
                      ]}
                    >
                      Transfers
                    </Text>
                    <Text
                      style={[
                        styles.modalStatVal,
                        isDarkMode && { color: colors.textPrimary },
                      ]}
                    >
                      {selectedJourney.details?.transfers ?? 1}
                    </Text>
                  </View>
                </View>
              </View>

              {/* CO2 Savings highlight */}
              <View
                style={[
                  styles.ecoHighlight,
                  isDarkMode && {
                    backgroundColor: "rgba(22, 163, 74, 0.15)",
                    borderColor: "rgba(22, 163, 74, 0.3)",
                  },
                ]}
              >
                <Text style={styles.ecoIcon}>🌱</Text>
                <View style={styles.ecoTextWrap}>
                  <Text
                    style={[
                      styles.ecoTitle,
                      isDarkMode && { color: "#4ADE80" },
                    ]}
                  >
                    {selectedJourney.details?.co2Saved ?? "2.8 kg"} CO₂ Emissions Saved
                  </Text>
                  <Text
                    style={[
                      styles.ecoSub,
                      isDarkMode && { color: "#86EFAC" },
                    ]}
                  >
                    By taking multimodal public transit over solo private transport.
                  </Text>
                </View>
              </View>

              {/* Step-by-Step Leg Breakdown */}
              <Text
                style={[
                  styles.sectionTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Route Breakdown
              </Text>
              {selectedJourney.details?.legs.map((leg, index) => (
                <View
                  key={index}
                  style={[
                    styles.legCard,
                    isDarkMode && {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.legHeader}>
                    <View
                      style={[
                        styles.legIconWrapper,
                        isDarkMode && { backgroundColor: colors.subtleBg },
                      ]}
                    >
                      <Text style={styles.legEmoji}>{leg.icon}</Text>
                    </View>
                    <View style={styles.legTitleWrap}>
                      <Text
                        style={[
                          styles.legModeTitle,
                          isDarkMode && { color: colors.textPrimary },
                        ]}
                      >
                        {leg.mode}
                      </Text>
                      <Text
                        style={[
                          styles.legLineName,
                          isDarkMode && { color: colors.textSecondary },
                        ]}
                      >
                        {leg.lineOrType}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.legFare,
                        isDarkMode && { color: colors.textPrimary },
                      ]}
                    >
                      {leg.fare}
                    </Text>
                  </View>

                  <View style={styles.legTimeline}>
                    <View style={styles.legStationRow}>
                      <View style={styles.timelineDot} />
                      <Text
                        style={[
                          styles.stationLabel,
                          isDarkMode && { color: colors.textSecondary },
                        ]}
                      >
                        {leg.from}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.timelineVerticalLine,
                        isDarkMode && { backgroundColor: colors.cardBorder },
                      ]}
                    />
                    <View style={styles.legStationRow}>
                      <View style={[styles.timelineDot, styles.timelineDotDest]} />
                      <Text
                        style={[
                          styles.stationLabel,
                          isDarkMode && { color: colors.textSecondary },
                        ]}
                      >
                        {leg.to}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* Modal CTA Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalRepeatBtn}
                  onPress={() => {
                    setIsDetailModalVisible(false);
                    handleRepeat(selectedJourney);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalRepeatBtnText}>
                    Repeat This Journey
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  // Segmented Pill Tab Bar
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  // Scroll list
  scrollList: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 95,
  },
  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  routeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  routeOrigin: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    flexShrink: 1,
  },
  routeArrow: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
    marginHorizontal: 2,
  },
  routeDestination: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    flexShrink: 1,
  },
  // Status Badge
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeCompleted: {
    backgroundColor: "#DCFCE7",
  },
  statusBadgeUpcoming: {
    backgroundColor: "#DBEAFE",
  },
  statusBadgeSaved: {
    backgroundColor: "#FEF3C7",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadgeTextCompleted: {
    color: "#16A34A",
  },
  statusBadgeTextUpcoming: {
    color: "#2563EB",
  },
  statusBadgeTextSaved: {
    color: "#D97706",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 12,
  },
  // Transit Modes Row
  modesRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  modeArrow: {
    fontSize: 12,
    color: "#94A3B8",
    marginHorizontal: 5,
  },
  modePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4.5,
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
  modePillWalk: {
    backgroundColor: "#F1F5F9",
  },
  modeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  modeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  modeTextBus: {
    color: "#2563EB",
  },
  modeTextTrain: {
    color: "#16A34A",
  },
  modeTextTuk: {
    color: "#DB2777",
  },
  modeTextTaxi: {
    color: "#D97706",
  },
  modeTextWalk: {
    color: "#64748B",
  },
  // Card Footer
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  metricsGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricCostItem: {
    marginLeft: 12,
  },
  metricIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  // Actions
  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  repeatButton: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 15,
    paddingVertical: 6.5,
    borderRadius: 9,
  },
  repeatButtonText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  detailsButton: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 13,
    paddingVertical: 6.5,
    borderRadius: 9,
    marginLeft: 8,
  },
  detailsButtonText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  trackLiveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 9,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  trackLiveButtonText: {
    color: "#059669",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  removeSavedButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 9,
    marginLeft: 8,
  },
  removeSavedButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  planJourneyCTA: {
    backgroundColor: "#1D64EC",
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
  },
  planJourneyCTAText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  // Bottom Navigation Bar
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
    bottom: -4,
    width: 26,
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
  // Modal Styles
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "700",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalShareButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalShareText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "700",
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
    paddingBottom: 36,
  },
  modalSummaryBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 14,
  },
  modalRouteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  modalRouteOrigin: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalRouteArrow: {
    fontSize: 16,
    color: "#64748B",
  },
  modalRouteDest: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 14,
  },
  modalStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  modalStatCol: {
    alignItems: "center",
  },
  modalStatLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 3,
  },
  modalStatVal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1D64EC",
  },
  modalStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
  },
  ecoHighlight: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  ecoIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  ecoTextWrap: {
    flex: 1,
  },
  ecoTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16A34A",
    marginBottom: 2,
  },
  ecoSub: {
    fontSize: 12,
    color: "#475569",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },
  legCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 12,
  },
  legHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  legEmoji: {
    fontSize: 16,
  },
  legTitleWrap: {
    flex: 1,
  },
  legModeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  legLineName: {
    fontSize: 12,
    color: "#64748B",
  },
  legFare: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D64EC",
  },
  legTimeline: {
    paddingLeft: 6,
    marginTop: 4,
  },
  legStationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1D64EC",
    marginRight: 10,
  },
  timelineDotDest: {
    backgroundColor: "#10B981",
  },
  timelineVerticalLine: {
    width: 2,
    height: 16,
    backgroundColor: "#E2E8F0",
    marginLeft: 3,
    marginVertical: 2,
  },
  stationLabel: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  modalActions: {
    marginTop: 12,
  },
  modalRepeatBtn: {
    backgroundColor: "#1D64EC",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalRepeatBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
