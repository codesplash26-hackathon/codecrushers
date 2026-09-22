import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface QuickAccessItem {
  id: string;
  title: string;
  subtitle: string;
  type?: "current" | "train" | "bus" | "location";
  badge?: string;
  badgeType?: "train" | "bus";
}

interface NearbyStopItem {
  id: string;
  title: string;
  distance: string;
  badge: string;
  type: "bus" | "train";
}

export default function HomeScreen({ navigation }: Props) {
  // Main screen states
  const [fromLocation, setFromLocation] = useState("Kandy City");
  const [toLocation, setToLocation] = useState("");
  const [departMode, setDepartMode] = useState<"depart" | "arrive">("depart");
  const [selectedDate, setSelectedDate] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("8:30 AM");
  const [selectedOptimization, setSelectedOptimization] = useState<
    "fastest" | "cheapest" | "walking" | "transfers" | "reliable"
  >("fastest");
  const [isFavorited1, setIsFavorited1] = useState(true);
  const [isFavorited2, setIsFavorited2] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "home" | "journeys" | "alerts" | "profile"
  >("home");

  // Search modal state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTarget, setSearchTarget] = useState<"from" | "to">("to");
  const [searchQuery, setSearchQuery] = useState("");

  // Customize Journey ("More options") modal state
  const [isCustomizeVisible, setIsCustomizeVisible] = useState(false);
  const [primaryPreference, setPrimaryPreference] = useState<
    "fastest" | "cheapest" | "walking" | "transfers" | "reliable"
  >("fastest");
  const [avoidWalking, setAvoidWalking] = useState(false);
  const [maxTransfers, setMaxTransfers] = useState<"1" | "2" | "3+">("2");
  const [maxWalkingDistance, setMaxWalkingDistance] = useState(10); // in minutes

  const quickAccessList: QuickAccessItem[] = [
    {
      id: "1",
      title: "Current Location",
      subtitle: "Kandy City Centre",
      type: "current",
    },
    {
      id: "2",
      title: "Colombo Fort Railway Station",
      subtitle: "Train · 1.2 km from Fort",
      type: "train",
      badge: "Train",
      badgeType: "train",
    },
    {
      id: "3",
      title: "Kandy Railway Station",
      subtitle: "Train · 850 m from centre",
      type: "train",
      badge: "Train",
      badgeType: "train",
    },
    {
      id: "4",
      title: "University of Sri Jayewardenepura",
      subtitle: "Nugegoda, Colombo",
      type: "location",
    },
    {
      id: "5",
      title: "Peradeniya Bus Stand",
      subtitle: "Bus · 3.4 km",
      type: "bus",
      badge: "Bus",
      badgeType: "bus",
    },
    {
      id: "6",
      title: "Peradeniya Junction",
      subtitle: "Kandy Road",
      type: "location",
    },
  ];

  const nearbyStopsList: NearbyStopItem[] = [
    {
      id: "n1",
      title: "Kandy Bus Stand",
      distance: "0.3 km",
      badge: "Bus",
      type: "bus",
    },
    {
      id: "n2",
      title: "Kandy Railway Station",
      distance: "0.8 km",
      badge: "Train",
      type: "train",
    },
    {
      id: "n3",
      title: "Peradeniya Junction",
      distance: "3.2 km",
      badge: "Bus",
      type: "bus",
    },
  ];

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation || "Colombo Fort");
    setToLocation(temp);
  };

  const openSearchModal = (target: "from" | "to") => {
    setSearchTarget(target);
    setSearchQuery("");
    setIsSearchVisible(true);
  };

  const handleSelectLocation = (locationName: string) => {
    if (searchTarget === "from") {
      setFromLocation(locationName);
    } else {
      setToLocation(locationName);
    }
    setIsSearchVisible(false);
  };

  const handleApplyCustomize = () => {
    setSelectedOptimization(primaryPreference);
    setIsCustomizeVisible(false);
  };

  // Filtered lists based on search input
  const filteredQuickAccess = quickAccessList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNearby = nearbyStopsList.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Hero Gradient Area */}
        <LinearGradient
          colors={["#1655E8", "#1E68F8", "#088DE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={styles.heroGradient}
        >
          {/* Top Bar Header */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greetingText}>Good morning 👋</Text>
              <Text style={styles.heroTitle}>Where are you going?</Text>
            </View>

            <View style={styles.topBarActions}>
              <TouchableOpacity
                style={styles.themeIconButton}
                activeOpacity={0.8}
              >
                <Text style={styles.themeIcon}>🌙</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatarCircle}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Login")}
              >
                <View style={styles.avatarInner} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Card Container Floating in Header */}
          <View style={styles.searchCard}>
            {/* FROM Input Box */}
            <TouchableOpacity
              style={styles.locationInputBox}
              activeOpacity={0.9}
              onPress={() => openSearchModal("from")}
            >
              <View style={styles.bluePinOuter}>
                <View style={styles.bluePinInner} />
              </View>
              <View style={styles.locationTextWrapper}>
                <Text style={styles.fieldLabel}>FROM</Text>
                <Text
                  style={[
                    styles.locationInputText,
                    !fromLocation && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {fromLocation || "Starting point"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Connecting Track & Swap Button */}
            <View style={styles.dividerRow}>
              <View style={styles.verticalLine} />
              <TouchableOpacity
                style={styles.swapButton}
                activeOpacity={0.7}
                onPress={handleSwapLocations}
              >
                <Text style={styles.swapIcon}>⇅</Text>
              </TouchableOpacity>
            </View>

            {/* TO Input Box */}
            <TouchableOpacity
              style={styles.locationInputBox}
              activeOpacity={0.9}
              onPress={() => openSearchModal("to")}
            >
              <View style={styles.redPinOuter}>
                <Text style={styles.pinSymbol}>📍</Text>
              </View>
              <View style={styles.locationTextWrapper}>
                <Text style={styles.fieldLabel}>TO</Text>
                <Text
                  style={[
                    styles.locationInputText,
                    !toLocation && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {toLocation || "Where to?"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Depart At / Arrive By Segmented Toggle */}
            <View style={styles.segmentedContainer}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  departMode === "depart" && styles.segmentButtonActive,
                ]}
                onPress={() => setDepartMode("depart")}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentText,
                    departMode === "depart" && styles.segmentTextActive,
                  ]}
                >
                  Depart at
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  departMode === "arrive" && styles.segmentButtonActive,
                ]}
                onPress={() => setDepartMode("arrive")}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentText,
                    departMode === "arrive" && styles.segmentTextActive,
                  ]}
                >
                  Arrive by
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Time Selectors */}
            <View style={styles.quickTimeRow}>
              <TouchableOpacity
                style={styles.leaveNowButton}
                activeOpacity={0.8}
              >
                <Text style={styles.leaveNowIcon}>🕒</Text>
                <Text style={styles.leaveNowText}>Leave now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.todayDropdownButton}
                activeOpacity={0.8}
              >
                <Text style={styles.todayDropdownText}>Today · Now ▾</Text>
              </TouchableOpacity>
            </View>

            {/* Date & Time Picker Box */}
            <View style={styles.pickerBox}>
              <Text style={styles.pickerLabel}>DATE</Text>
              <View style={styles.pillsRow}>
                {["Today", "Tomorrow", "Wed 17", "Thu 18"].map((date) => {
                  const isSelected = selectedDate === date;
                  return (
                    <TouchableOpacity
                      key={date}
                      style={[
                        styles.datePill,
                        isSelected && styles.datePillActive,
                      ]}
                      onPress={() => setSelectedDate(date)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.datePillText,
                          isSelected && styles.datePillTextActive,
                        ]}
                      >
                        {date}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.pickerLabel, { marginTop: 12 }]}>TIME</Text>
              <View style={styles.pillsRow}>
                {["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM"].map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timePill,
                        isSelected && styles.timePillActive,
                      ]}
                      onPress={() => setSelectedTime(time)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.timePillText,
                          isSelected && styles.timePillTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={styles.confirmButton}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Optimize Your Journey Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Optimize your journey</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setPrimaryPreference(selectedOptimization);
                setIsCustomizeVisible(true);
              }}
            >
              <Text style={styles.sectionLink}>More options</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedOptimization === "fastest" && styles.filterPillActive,
              ]}
              onPress={() => setSelectedOptimization("fastest")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedOptimization === "fastest" &&
                    styles.filterPillTextActive,
                ]}
              >
                ⚡ Fastest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedOptimization === "cheapest" && styles.filterPillActive,
              ]}
              onPress={() => setSelectedOptimization("cheapest")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedOptimization === "cheapest" &&
                    styles.filterPillTextActive,
                ]}
              >
                💰 Cheapest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedOptimization === "walking" && styles.filterPillActive,
              ]}
              onPress={() => setSelectedOptimization("walking")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedOptimization === "walking" &&
                    styles.filterPillTextActive,
                ]}
              >
                🚶 Less Walking
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterIconPill}
              activeOpacity={0.8}
              onPress={() => {
                setPrimaryPreference(selectedOptimization);
                setIsCustomizeVisible(true);
              }}
            >
              <Text style={styles.filterExtraIcon}>⚙️</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Big CTA Button */}
          <TouchableOpacity
            style={styles.findRoutesButton}
            activeOpacity={0.85}
          >
            <Text style={styles.findRoutesText}>Find Best Routes ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Journeys Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Recent Journeys</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.sectionLink}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Card 1 */}
          <View style={styles.recentCard}>
            <View style={styles.recentPinBox}>
              <Text style={styles.recentPinIcon}>📍</Text>
            </View>

            <View style={styles.recentDetails}>
              <Text style={styles.recentRoute}>
                Kandy City <Text style={styles.arrowText}>➔</Text> Colombo Fort
              </Text>
              <Text style={styles.recentSubtext}>Today, 8:30 AM · Rs. 320</Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsFavorited1(!isFavorited1)}
              activeOpacity={0.7}
              style={styles.heartWrapper}
            >
              <Text style={[styles.heartIcon, isFavorited1 && styles.heartFilled]}>
                {isFavorited1 ? "❤️" : "♡"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Card 2 */}
          <View style={styles.recentCard}>
            <View style={styles.recentPinBox}>
              <Text style={styles.recentPinIcon}>📍</Text>
            </View>

            <View style={styles.recentDetails}>
              <Text style={styles.recentRoute}>
                University of Sri Jay. <Text style={styles.arrowText}>➔</Text> Kandy
              </Text>
              <Text style={styles.recentSubtext}>Yesterday · Rs. 180</Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsFavorited2(!isFavorited2)}
              activeOpacity={0.7}
              style={styles.heartWrapper}
            >
              <Text style={[styles.heartIcon, isFavorited2 && styles.heartFilled]}>
                {isFavorited2 ? "❤️" : "♡"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Travel Summary Section */}
        <View style={[styles.section, { marginBottom: 36 }]}>
          <Text style={styles.sectionHeading}>Your travel summary</Text>

          <View style={styles.summaryRow}>
            {/* Stat 1 */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumberBlue}>24</Text>
              <Text style={styles.summaryLabel}>Journeys</Text>
            </View>

            {/* Stat 2 */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumberGreen}>Rs.1.2k</Text>
              <Text style={styles.summaryLabel}>Saved</Text>
            </View>

            {/* Stat 3 */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumberTeal}>3.5h</Text>
              <Text style={styles.summaryLabel}>Hours saved</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("home")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "home" ? styles.navIconActive : styles.navIconInactive,
            ]}
          >
            🏠
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "home" ? styles.navLabelActive : styles.navLabelInactive,
            ]}
          >
            Home
          </Text>
          {activeTab === "home" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        {/* Journeys Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("journeys")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "journeys"
                ? styles.navIconActive
                : styles.navIconInactive,
            ]}
          >
            🗺️
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "journeys"
                ? styles.navLabelActive
                : styles.navLabelInactive,
            ]}
          >
            Journeys
          </Text>
        </TouchableOpacity>

        {/* Alerts Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("alerts")}
          activeOpacity={0.7}
        >
          <View style={styles.alertIconWrapper}>
            <Text
              style={[
                styles.navIcon,
                activeTab === "alerts"
                  ? styles.navIconActive
                  : styles.navIconInactive,
              ]}
            >
              🔔
            </Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
          <Text
            style={[
              styles.navLabel,
              activeTab === "alerts"
                ? styles.navLabelActive
                : styles.navLabelInactive,
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("profile")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.navIcon,
              activeTab === "profile"
                ? styles.navIconActive
                : styles.navIconInactive,
            ]}
          >
            👤
          </Text>
          <Text
            style={[
              styles.navLabel,
              activeTab === "profile"
                ? styles.navLabelActive
                : styles.navLabelInactive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= LOCATION SEARCH MODAL ================= */}
      <Modal
        visible={isSearchVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <View style={styles.searchModalContainer}>
          <StatusBar style="dark" />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              activeOpacity={0.7}
              onPress={() => setIsSearchVisible(false)}
            >
              <Text style={styles.modalBackIcon}>‹</Text>
            </TouchableOpacity>

            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>
                {searchTarget === "from"
                  ? "Where are you starting?"
                  : "Where are you going?"}
              </Text>
              <Text style={styles.modalSubtitle}>
                Search for a location, station or stop
              </Text>
            </View>
          </View>

          {/* Search Input Box */}
          <View style={styles.modalSearchBox}>
            <Text style={styles.modalSearchIcon}>🔍</Text>
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search location, station or stop"
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              onSubmitEditing={() => {
                if (searchQuery.trim()) {
                  handleSelectLocation(searchQuery.trim());
                }
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
              >
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Quick Access Section */}
            <Text style={styles.modalSectionHeading}>QUICK ACCESS</Text>
            {filteredQuickAccess.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickAccessCard}
                activeOpacity={0.75}
                onPress={() => handleSelectLocation(item.title)}
              >
                {/* Left Icon Container */}
                <View
                  style={[
                    styles.quickAccessIconBox,
                    item.type === "current" && styles.iconBoxCurrent,
                    item.type === "train" && styles.iconBoxTrain,
                    item.type === "bus" && styles.iconBoxBus,
                    item.type === "location" && styles.iconBoxLocation,
                  ]}
                >
                  {item.type === "current" && (
                    <Text style={styles.quickAccessSymbol}>🎯</Text>
                  )}
                  {item.type === "train" && (
                    <Text style={styles.quickAccessSymbol}>🚆</Text>
                  )}
                  {item.type === "bus" && (
                    <Text style={styles.quickAccessSymbol}>🚌</Text>
                  )}
                  {item.type === "location" && (
                    <Text style={styles.quickAccessSymbol}>📍</Text>
                  )}
                </View>

                {/* Texts */}
                <View style={styles.quickAccessTextContainer}>
                  <Text style={styles.quickAccessTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.quickAccessSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>

                {/* Right Badge if any */}
                {item.badge && (
                  <View
                    style={[
                      styles.quickBadge,
                      item.badgeType === "train" && styles.badgeTrain,
                      item.badgeType === "bus" && styles.badgeBus,
                    ]}
                  >
                    <Text
                      style={[
                        styles.quickBadgeText,
                        item.badgeType === "train" && styles.badgeTextTrain,
                        item.badgeType === "bus" && styles.badgeTextBus,
                      ]}
                    >
                      {item.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Nearby Stops Section */}
            <Text style={[styles.modalSectionHeading, { marginTop: 22 }]}>
              NEARBY STOPS
            </Text>
            <View style={styles.nearbyCardContainer}>
              {filteredNearby.map((stop, index) => (
                <TouchableOpacity
                  key={stop.id}
                  style={[
                    styles.nearbyRow,
                    index !== filteredNearby.length - 1 && styles.nearbyDivider,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => handleSelectLocation(stop.title)}
                >
                  {/* Color Dot */}
                  <View
                    style={[
                      styles.nearbyDot,
                      stop.type === "train"
                        ? styles.nearbyDotGreen
                        : styles.nearbyDotBlue,
                    ]}
                  />

                  {/* Stop Name */}
                  <Text style={styles.nearbyTitle}>{stop.title}</Text>

                  {/* Distance */}
                  <Text style={styles.nearbyDistance}>{stop.distance}</Text>

                  {/* Badge */}
                  <View
                    style={[
                      styles.nearbyBadge,
                      stop.type === "train"
                        ? styles.nearbyBadgeTrain
                        : styles.nearbyBadgeBus,
                    ]}
                  >
                    <Text
                      style={[
                        styles.nearbyBadgeText,
                        stop.type === "train"
                          ? styles.nearbyBadgeTextTrain
                          : styles.nearbyBadgeTextBus,
                      ]}
                    >
                      {stop.badge}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* ================= CUSTOMIZE YOUR JOURNEY MODAL ================= */}
      <Modal
        visible={isCustomizeVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsCustomizeVisible(false)}
      >
        <View style={styles.customizeModalContainer}>
          <StatusBar style="dark" />

          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBackButton}
              activeOpacity={0.7}
              onPress={() => setIsCustomizeVisible(false)}
            >
              <Text style={styles.modalBackIcon}>‹</Text>
            </TouchableOpacity>

            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>Customize your journey</Text>
              <Text style={styles.modalSubtitle}>Tell us what matters most</Text>
            </View>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.customizeScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* PRIMARY PREFERENCE Section */}
            <Text style={styles.modalSectionHeading}>PRIMARY PREFERENCE</Text>

            {/* Option 1: Fastest */}
            <TouchableOpacity
              style={[
                styles.preferenceCard,
                primaryPreference === "fastest" && styles.preferenceCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setPrimaryPreference("fastest")}
            >
              <View style={[styles.prefIconBox, styles.prefIconFastest]}>
                <Text style={styles.prefIconSymbol}>⚡</Text>
              </View>
              <View style={styles.prefTextContainer}>
                <Text style={styles.prefTitle}>Fastest</Text>
                <Text style={styles.prefSubtitle}>
                  Minimize total travel time
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  primaryPreference === "fastest" && styles.radioButtonActive,
                ]}
              >
                {primaryPreference === "fastest" && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>

            {/* Option 2: Cheapest */}
            <TouchableOpacity
              style={[
                styles.preferenceCard,
                primaryPreference === "cheapest" && styles.preferenceCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setPrimaryPreference("cheapest")}
            >
              <View style={[styles.prefIconBox, styles.prefIconCheapest]}>
                <Text style={styles.prefIconSymbol}>💰</Text>
              </View>
              <View style={styles.prefTextContainer}>
                <Text style={styles.prefTitle}>Cheapest</Text>
                <Text style={styles.prefSubtitle}>
                  Minimize total journey cost
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  primaryPreference === "cheapest" && styles.radioButtonActive,
                ]}
              >
                {primaryPreference === "cheapest" && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>

            {/* Option 3: Less Walking */}
            <TouchableOpacity
              style={[
                styles.preferenceCard,
                primaryPreference === "walking" && styles.preferenceCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setPrimaryPreference("walking")}
            >
              <View style={[styles.prefIconBox, styles.prefIconWalking]}>
                <Text style={styles.prefIconSymbol}>🚶</Text>
              </View>
              <View style={styles.prefTextContainer}>
                <Text style={styles.prefTitle}>Less Walking</Text>
                <Text style={styles.prefSubtitle}>
                  Minimize walking distance
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  primaryPreference === "walking" && styles.radioButtonActive,
                ]}
              >
                {primaryPreference === "walking" && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>

            {/* Option 4: Fewer Transfers */}
            <TouchableOpacity
              style={[
                styles.preferenceCard,
                primaryPreference === "transfers" &&
                  styles.preferenceCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setPrimaryPreference("transfers")}
            >
              <View style={[styles.prefIconBox, styles.prefIconTransfers]}>
                <Text style={styles.prefIconSymbol}>🔄</Text>
              </View>
              <View style={styles.prefTextContainer}>
                <Text style={styles.prefTitle}>Fewer Transfers</Text>
                <Text style={styles.prefSubtitle}>
                  Reduce transportation changes
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  primaryPreference === "transfers" && styles.radioButtonActive,
                ]}
              >
                {primaryPreference === "transfers" && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>

            {/* Option 5: Most Reliable */}
            <TouchableOpacity
              style={[
                styles.preferenceCard,
                primaryPreference === "reliable" && styles.preferenceCardActive,
              ]}
              activeOpacity={0.8}
              onPress={() => setPrimaryPreference("reliable")}
            >
              <View style={[styles.prefIconBox, styles.prefIconReliable]}>
                <Text style={styles.prefIconSymbol}>🛡️</Text>
              </View>
              <View style={styles.prefTextContainer}>
                <Text style={styles.prefTitle}>Most Reliable</Text>
                <Text style={styles.prefSubtitle}>
                  Prioritize reliable connections
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  primaryPreference === "reliable" && styles.radioButtonActive,
                ]}
              >
                {primaryPreference === "reliable" && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>

            {/* ADVANCED OPTIONS Section */}
            <Text style={[styles.modalSectionHeading, { marginTop: 22 }]}>
              ADVANCED OPTIONS
            </Text>

            <View style={styles.advancedOptionsCard}>
              {/* Avoid Walking Row */}
              <View style={styles.advancedRow}>
                <View style={styles.advancedTextWrapper}>
                  <Text style={styles.advancedRowTitle}>Avoid walking</Text>
                  <Text style={styles.advancedRowSubtitle}>
                    Prefer transport over walking
                  </Text>
                </View>
                <Switch
                  value={avoidWalking}
                  onValueChange={setAvoidWalking}
                  trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
                  thumbColor={avoidWalking ? "#2563EB" : "#FFFFFF"}
                />
              </View>

              <View style={styles.advancedDivider} />

              {/* Maximum Transfers Row */}
              <View style={styles.transfersHeaderRow}>
                <View style={styles.advancedTextWrapper}>
                  <Text style={styles.advancedRowTitle}>Maximum transfers</Text>
                  <Text style={styles.advancedRowSubtitle}>
                    Route connection changes
                  </Text>
                </View>
                <Text style={styles.transfersCurrentValue}>{maxTransfers}</Text>
              </View>

              {/* Transfers Segment Buttons */}
              <View style={styles.transfersButtonGroup}>
                {(["1", "2", "3+"] as const).map((count) => {
                  const isSelected = maxTransfers === count;
                  return (
                    <TouchableOpacity
                      key={count}
                      style={[
                        styles.transferOptionButton,
                        isSelected && styles.transferOptionButtonActive,
                      ]}
                      onPress={() => setMaxTransfers(count)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.transferOptionText,
                          isSelected && styles.transferOptionTextActive,
                        ]}
                      >
                        {count}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.advancedDivider} />

              {/* Max Walking Distance Row */}
              <View style={styles.distanceHeaderRow}>
                <Text style={styles.advancedRowTitle}>
                  Max walking distance
                </Text>
                <Text style={styles.distanceValueText}>
                  {maxWalkingDistance} min
                </Text>
              </View>

              {/* Distance Steps Selector */}
              <View style={styles.distanceSliderRow}>
                {[5, 10, 15, 20, 30].map((mins) => {
                  const isSelected = maxWalkingDistance === mins;
                  return (
                    <TouchableOpacity
                      key={mins}
                      style={[
                        styles.distanceStepPill,
                        isSelected && styles.distanceStepPillActive,
                      ]}
                      onPress={() => setMaxWalkingDistance(mins)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.distanceStepText,
                          isSelected && styles.distanceStepTextActive,
                        ]}
                      >
                        {mins}m
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.distanceMinMaxRow}>
                <Text style={styles.minMaxLabel}>5 min</Text>
                <Text style={styles.minMaxLabel}>30 min</Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Show Routes Button */}
          <View style={styles.customizeBottomBar}>
            <TouchableOpacity
              style={styles.showRoutesButton}
              activeOpacity={0.85}
              onPress={handleApplyCustomize}
            >
              <Text style={styles.showRoutesButtonText}>Show Routes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 24,
  },

  /* Hero Gradient */
  heroGradient: {
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greetingText: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 13,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.3,
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    justifyContent: "center",
    alignItems: "center",
  },
  themeIcon: {
    fontSize: 16,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E2E8F0",
  },

  /* Search Card */
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
      },
      default: {
        elevation: 6,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
    }),
  },
  locationInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bluePinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(29, 100, 236, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bluePinInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1D64EC",
  },
  redPinOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pinSymbol: {
    fontSize: 14,
  },
  locationTextWrapper: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  locationInputText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  placeholderText: {
    color: "#94A3B8",
    fontWeight: "500",
  },

  /* Divider & Swap Button */
  dividerRow: {
    height: 22,
    position: "relative",
    justifyContent: "center",
  },
  verticalLine: {
    position: "absolute",
    left: 27,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: "#E2E8F0",
  },
  swapButton: {
    position: "absolute",
    right: 18,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
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
  swapIcon: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "bold",
  },

  /* Segmented Control */
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 3,
    marginTop: 14,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: "#1D64EC",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  segmentTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* Quick Time Row */
  quickTimeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  leaveNowButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  leaveNowIcon: {
    fontSize: 13,
  },
  leaveNowText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  todayDropdownButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    paddingVertical: 8,
  },
  todayDropdownText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D64EC",
  },

  /* Date & Time Picker Box */
  pickerBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  pickerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "space-between",
  },
  datePill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: "center",
  },
  datePillActive: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  datePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  datePillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  timePill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: "center",
  },
  timePillActive: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  timePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  timePillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: "#1D64EC",
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 14,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Section Styles */
  section: {
    paddingHorizontal: 16,
    marginTop: 22,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D64EC",
  },

  /* Filter Pills */
  filterPillsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  filterPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterPillActive: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  filterIconPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  filterExtraIcon: {
    fontSize: 14,
    color: "#64748B",
  },

  /* Big CTA Button */
  findRoutesButton: {
    backgroundColor: "#165FE9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 14,
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
  findRoutesText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  /* Recent Journeys Cards */
  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
      default: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
    }),
  },
  recentPinBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentPinIcon: {
    fontSize: 16,
  },
  recentDetails: {
    flex: 1,
  },
  recentRoute: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  arrowText: {
    color: "#64748B",
    fontSize: 13,
  },
  recentSubtext: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },
  heartWrapper: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 16,
    color: "#CBD5E1",
  },
  heartFilled: {
    color: "#EF4444",
  },

  /* Travel Summary */
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      },
      default: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
    }),
  },
  summaryNumberBlue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1D64EC",
  },
  summaryNumberGreen: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10B981",
  },
  summaryNumberTeal: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0891B2",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 4,
  },

  /* Bottom Navigation Bar */
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
    bottom: -6,
    width: 24,
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

  /* ================= LOCATION SEARCH MODAL ================= */
  searchModalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "ios" ? 52 : 36,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  modalBackButton: {
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
  modalBackIcon: {
    fontSize: 22,
    color: "#334155",
    fontWeight: "600",
    marginTop: -2,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  modalSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 11 : 9,
    marginBottom: 12,
  },
  modalSearchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: "#94A3B8",
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 13,
    color: "#94A3B8",
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  modalSectionHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 6,
  },

  /* Quick Access Item */
  quickAccessCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 12,
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
  quickAccessIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconBoxCurrent: {
    backgroundColor: "#EFF6FF",
  },
  iconBoxTrain: {
    backgroundColor: "#DCFCE7",
  },
  iconBoxBus: {
    backgroundColor: "#FFEDD5",
  },
  iconBoxLocation: {
    backgroundColor: "#F1F5F9",
  },
  quickAccessSymbol: {
    fontSize: 17,
  },
  quickAccessTextContainer: {
    flex: 1,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  quickBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeTrain: {
    backgroundColor: "#DCFCE7",
  },
  badgeBus: {
    backgroundColor: "#FFEDD5",
  },
  quickBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTextTrain: {
    color: "#16A34A",
  },
  badgeTextBus: {
    color: "#EA580C",
  },

  /* Nearby Stops Container */
  nearbyCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    paddingHorizontal: 14,
  },
  nearbyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  nearbyDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  nearbyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 10,
  },
  nearbyDotBlue: {
    backgroundColor: "#2563EB",
  },
  nearbyDotGreen: {
    backgroundColor: "#16A34A",
  },
  nearbyTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  nearbyDistance: {
    fontSize: 12,
    color: "#94A3B8",
    marginRight: 10,
  },
  nearbyBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  nearbyBadgeBus: {
    backgroundColor: "#DBEAFE",
  },
  nearbyBadgeTrain: {
    backgroundColor: "#DCFCE7",
  },
  nearbyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  nearbyBadgeTextBus: {
    color: "#2563EB",
  },
  nearbyBadgeTextTrain: {
    color: "#16A34A",
  },

  /* ================= CUSTOMIZE JOURNEY MODAL ================= */
  customizeModalContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "ios" ? 52 : 36,
  },
  customizeScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  preferenceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
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
  preferenceCardActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
  },
  prefIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  prefIconFastest: {
    backgroundColor: "#2563EB",
  },
  prefIconCheapest: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  prefIconWalking: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  prefIconTransfers: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  prefIconReliable: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  prefIconSymbol: {
    fontSize: 18,
  },
  prefTextContainer: {
    flex: 1,
  },
  prefTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  prefSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonActive: {
    borderColor: "#2563EB",
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2563EB",
  },

  /* Advanced Options Card */
  advancedOptionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      },
      default: {
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
      },
    }),
  },
  advancedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  advancedTextWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  advancedRowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  advancedRowSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  advancedDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  transfersHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  transfersCurrentValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },
  transfersButtonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  transferOptionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: "center",
  },
  transferOptionButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  transferOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  transferOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  distanceHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  distanceValueText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  distanceSliderRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  distanceStepPill: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  distanceStepPillActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  distanceStepText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  distanceStepTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  distanceMinMaxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  minMaxLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },

  /* Customize Bottom Bar */
  customizeBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  showRoutesButton: {
    backgroundColor: "#165FE9",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 6px 16px rgba(22, 95, 233, 0.35)",
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
  showRoutesButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
