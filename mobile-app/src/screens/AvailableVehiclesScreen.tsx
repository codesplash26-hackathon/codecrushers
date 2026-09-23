import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/AppNavigator";

type AvailableVehiclesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AvailableVehicles"
>;

type AvailableVehiclesScreenRouteProp = RouteProp<
  RootStackParamList,
  "AvailableVehicles"
>;

interface Props {
  navigation: AvailableVehiclesScreenNavigationProp;
  route: AvailableVehiclesScreenRouteProp;
}

interface VehicleItem {
  id: string;
  initials: string;
  name: string;
  type: "Taxi" | "Tuk-tuk";
  typeIcon: string;
  rating: number;
  model: string;
  plate: string;
  etaMinutes: number;
  fare: number;
  status: "Available" | "Reserved";
  distanceKm: number;
  trips: number;
}

const VEHICLES_DATA: VehicleItem[] = [
  {
    id: "1",
    initials: "KP",
    name: "Kasun Perera",
    type: "Taxi",
    typeIcon: "🚕",
    rating: 4.8,
    model: "Toyota Prius",
    plate: "WP CAB-1234",
    etaMinutes: 4,
    fare: 850,
    status: "Available",
    distanceKm: 1.2,
    trips: 312,
  },
  {
    id: "2",
    initials: "RS",
    name: "Roshan Silva",
    type: "Taxi",
    typeIcon: "🚕",
    rating: 4.6,
    model: "Honda Fit",
    plate: "CP CAR-5678",
    etaMinutes: 6,
    fare: 920,
    status: "Available",
    distanceKm: 2.1,
    trips: 198,
  },
  {
    id: "3",
    initials: "AF",
    name: "Amal Fernando",
    type: "Tuk-tuk",
    typeIcon: "🛺",
    rating: 4.7,
    model: "Bajaj RE",
    plate: "WP TUK-3321",
    etaMinutes: 2,
    fare: 480,
    status: "Available",
    distanceKm: 0.6,
    trips: 445,
  },
  {
    id: "4",
    initials: "NR",
    name: "Nuwan Rathnayake",
    type: "Tuk-tuk",
    typeIcon: "🛺",
    rating: 4.5,
    model: "TVS King",
    plate: "SP TUK-7712",
    etaMinutes: 5,
    fare: 550,
    status: "Available",
    distanceKm: 1.8,
    trips: 267,
  },
  {
    id: "5",
    initials: "CJ",
    name: "Chaminda Jayasinghe",
    type: "Tuk-tuk",
    typeIcon: "🛺",
    rating: 4.9,
    model: "Bajaj RE",
    plate: "WP TUK-0091",
    etaMinutes: 7,
    fare: 510,
    status: "Available",
    distanceKm: 2.4,
    trips: 621,
  },
];

export default function AvailableVehiclesScreen({ navigation, route }: Props) {
  const stationName = route.params?.station || "Colombo Fort";
  const arrivalTime = route.params?.arrivalTime || "5:40 PM";

  const [activeTab, setActiveTab] = useState<"List" | "Map">("List");
  const [filterType, setFilterType] = useState<"All" | "Taxi" | "Tuk-tuk">("All");
  const [sortNearest, setSortNearest] = useState(true);

  // Booking Modal States
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "Wallet">("Cash");

  // Filtering & Sorting
  const displayedVehicles = useMemo(() => {
    let list = VEHICLES_DATA.filter((v) => {
      if (filterType === "All") return true;
      return v.type === filterType;
    });

    if (sortNearest) {
      list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      list = [...list].sort((a, b) => a.fare - b.fare);
    }
    return list;
  }, [filterType, sortNearest]);

  const taxisCount = VEHICLES_DATA.filter((v) => v.type === "Taxi").length;
  const tuktuksCount = VEHICLES_DATA.filter((v) => v.type === "Tuk-tuk").length;

  const handleSelect = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
    setBookingConfirmed(false);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {/* HEADER SECTION (Deep Blue) */}
      <View style={styles.header}>
        {/* Top Bar Row */}
        <View style={styles.topBarRow}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <View style={styles.titleColumn}>
            <Text style={styles.subtitleText}>Last-mile vehicles</Text>
            <Text style={styles.titleText}>Available Vehicles</Text>
          </View>

          {/* List | Map Toggle Switch */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                activeTab === "List" && styles.toggleButtonActive,
              ]}
              onPress={() => setActiveTab("List")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  activeTab === "List" && styles.toggleTextActive,
                ]}
              >
                List
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                activeTab === "Map" && styles.toggleButtonActive,
              ]}
              onPress={() => setActiveTab("Map")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.toggleText,
                  activeTab === "Map" && styles.toggleTextActive,
                ]}
              >
                Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Train Arrival Card */}
        <View style={styles.trainCard}>
          <View style={styles.trainCardHeaderRow}>
            <Text style={styles.trainIcon}>🚆</Text>
            <Text style={styles.trainArrivalTitle}>
              Train arrives at {stationName} — {arrivalTime}
            </Text>
          </View>
          <Text style={styles.trainArrivalSubtitle}>
            Vehicles shown for your arrival time
          </Text>

          {/* 3 Stat Boxes Row */}
          <View style={styles.statCardsRow}>
            {/* Box 1: Taxis */}
            <View style={styles.statCard}>
              <View style={styles.statCardTypeRow}>
                <Text style={styles.statTypeIcon}>🚕</Text>
                <Text style={styles.statTypeLabel}>Taxis</Text>
              </View>
              <Text style={styles.statNumber}>{taxisCount}</Text>
              <Text style={styles.statStatus}>expected</Text>
            </View>

            {/* Box 2: Tuk-tuks */}
            <View style={styles.statCard}>
              <View style={styles.statCardTypeRow}>
                <Text style={styles.statTypeIcon}>🛺</Text>
                <Text style={styles.statTypeLabel}>Tuk-tuks</Text>
              </View>
              <Text style={styles.statNumber}>{tuktuksCount}</Text>
              <Text style={styles.statStatus}>expected</Text>
            </View>

            {/* Box 3: Wait */}
            <View style={styles.statCard}>
              <View style={styles.statCardTypeRow}>
                <Text style={styles.statTypeIcon}>⏱</Text>
                <Text style={styles.statTypeLabel}>Wait</Text>
              </View>
              <Text style={styles.statWaitTime}>3–6 min</Text>
            </View>
          </View>
        </View>
      </View>

      {/* BODY CONTENT */}
      {activeTab === "List" ? (
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Filters Row */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                filterType === "All" && styles.filterPillActive,
              ]}
              onPress={() => setFilterType("All")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterType === "All" && styles.filterPillTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filterType === "Taxi" && styles.filterPillActive,
              ]}
              onPress={() => setFilterType("Taxi")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterType === "Taxi" && styles.filterPillTextActive,
                ]}
              >
                Taxi 🚕
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filterType === "Tuk-tuk" && styles.filterPillActive,
              ]}
              onPress={() => setFilterType("Tuk-tuk")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterType === "Tuk-tuk" && styles.filterPillTextActive,
                ]}
              >
                Tuk-tuk 🛺
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => setSortNearest(!sortNearest)}
              activeOpacity={0.7}
            >
              <Text style={styles.sortIcon}>▲</Text>
              <Text style={styles.sortLabel}>
                {sortNearest ? "Nearest" : "Lowest Fare"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notice Banner */}
          <View style={styles.noticeBanner}>
            <Text style={styles.noticeIcon}>⏱</Text>
            <Text style={styles.noticeText}>
              Showing vehicles expected around {arrivalTime} arrival — not all are
              available right now
            </Text>
          </View>

          {/* Vehicle Cards */}
          {displayedVehicles.map((vehicle) => {
            const isTaxi = vehicle.type === "Taxi";
            return (
              <View key={vehicle.id} style={styles.vehicleCard}>
                {/* Main Card Top Info */}
                <View style={styles.vehicleMainRow}>
                  {/* Avatar */}
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>{vehicle.initials}</Text>
                  </View>

                  {/* Driver & Car Info */}
                  <View style={styles.driverInfoCol}>
                    <View style={styles.nameBadgeRow}>
                      <Text style={styles.driverName}>{vehicle.name}</Text>
                      <View
                        style={[
                          styles.typeBadge,
                          isTaxi ? styles.badgeTaxi : styles.badgeTuktuk,
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeBadgeText,
                            isTaxi
                              ? styles.badgeTaxiText
                              : styles.badgeTuktukText,
                          ]}
                        >
                          {vehicle.typeIcon} {vehicle.type}
                        </Text>
                      </View>
                    </View>

                    {/* Star Rating */}
                    <View style={styles.ratingRow}>
                      <Text style={styles.starSymbols}>★★★★★</Text>
                      <Text style={styles.ratingScore}>{vehicle.rating}</Text>
                    </View>

                    {/* Model & Plate */}
                    <Text style={styles.vehicleModelPlate}>
                      {vehicle.model} · {vehicle.plate}
                    </Text>
                  </View>

                  {/* Right Column: Time & Fare & Status */}
                  <View style={styles.fareTimeCol}>
                    <Text style={styles.etaText}>{vehicle.etaMinutes} min</Text>
                    <Text style={styles.fareText}>Rs. {vehicle.fare}</Text>
                    <View style={styles.statusRow}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusLabel}>{vehicle.status}</Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Row: Distance / Trips & Select Button */}
                <View style={styles.cardBottomRow}>
                  <Text style={styles.distanceTripText}>
                    {vehicle.distanceKm} km away · {vehicle.trips} trips
                  </Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelect(vehicle)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.selectButtonText}>Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        /* MAP VIEW MODE */
        <View style={styles.mapContainer}>
          {/* Map canvas representation with roads and pins */}
          <View style={styles.mapCanvas}>
            <View style={styles.mapGridLineH1} />
            <View style={styles.mapGridLineH2} />
            <View style={styles.mapGridLineV1} />
            <View style={styles.mapGridLineV2} />

            {/* Station Central Hub Marker */}
            <View style={styles.stationMarker}>
              <Text style={styles.stationMarkerIcon}>🚉</Text>
              <View style={styles.stationMarkerCallout}>
                <Text style={styles.stationMarkerTitle}>{stationName}</Text>
                <Text style={styles.stationMarkerTime}>{arrivalTime} Arrival</Text>
              </View>
            </View>

            {/* Vehicle Pins Scattered */}
            {displayedVehicles.map((v, idx) => {
              const offsets = [
                { top: "25%", left: "18%" },
                { top: "32%", right: "20%" },
                { bottom: "35%", left: "22%" },
                { bottom: "42%", right: "18%" },
                { top: "60%", left: "46%" },
              ];
              const pos = offsets[idx % offsets.length];
              return (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.mapVehiclePin, pos as any]}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(v)}
                >
                  <View style={styles.pinBubble}>
                    <Text style={styles.pinIcon}>{v.typeIcon}</Text>
                    <Text style={styles.pinEta}>{v.etaMinutes}m</Text>
                  </View>
                  <View style={styles.pinPointer} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom quick card on map */}
          <View style={styles.mapBottomCard}>
            <Text style={styles.mapBottomNotice}>
              📍 5 drivers ready near {stationName}
            </Text>
            <TouchableOpacity
              style={styles.returnListBtn}
              onPress={() => setActiveTab("List")}
            >
              <Text style={styles.returnListBtnText}>Switch to List View</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* BOOKING MODAL */}
      <Modal
        visible={!!selectedVehicle}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {!bookingConfirmed ? (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalHeading}>Confirm Pre-Booking</Text>
                    <Text style={styles.modalSubheading}>
                      Pickup reserved at {stationName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={handleCloseModal}
                  >
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Selected Driver Summary */}
                {selectedVehicle && (
                  <View style={styles.modalDriverSummary}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarInitials}>
                        {selectedVehicle.initials}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalDriverName}>
                        {selectedVehicle.name}
                      </Text>
                      <Text style={styles.modalVehicleDetail}>
                        {selectedVehicle.typeIcon} {selectedVehicle.model} ·{" "}
                        {selectedVehicle.plate}
                      </Text>
                      <Text style={styles.modalRatingText}>
                        ★ {selectedVehicle.rating} ({selectedVehicle.trips} trips)
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.modalFareAmount}>
                        Rs. {selectedVehicle.fare}
                      </Text>
                      <Text style={styles.modalEta}>
                        ~{selectedVehicle.etaMinutes} min away
                      </Text>
                    </View>
                  </View>
                )}

                {/* Scheduled Pickup Details */}
                <View style={styles.bookingDetailsBox}>
                  <View style={styles.bookingDetailRow}>
                    <Text style={styles.detailLabel}>📍 Pickup Point:</Text>
                    <Text style={styles.detailValue}>
                      {stationName} Exit 2 (Taxi Stand)
                    </Text>
                  </View>
                  <View style={styles.bookingDetailRow}>
                    <Text style={styles.detailLabel}>⏱ Meeting Time:</Text>
                    <Text style={styles.detailValue}>{arrivalTime}</Text>
                  </View>
                  <View style={styles.bookingDetailRow}>
                    <Text style={styles.detailLabel}>⚡ Status:</Text>
                    <Text style={styles.detailValueGreen}>Guaranteed Ride</Text>
                  </View>
                </View>

                {/* Payment Selection */}
                <Text style={styles.paymentSectionTitle}>Select Payment Method</Text>
                <View style={styles.paymentRow}>
                  {(["Cash", "Card", "Wallet"] as const).map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentChip,
                        paymentMethod === method && styles.paymentChipActive,
                      ]}
                      onPress={() => setPaymentMethod(method)}
                    >
                      <Text
                        style={[
                          styles.paymentChipText,
                          paymentMethod === method && styles.paymentChipTextActive,
                        ]}
                      >
                        {method === "Cash"
                          ? "💵 Cash"
                          : method === "Card"
                          ? "💳 Card"
                          : "📱 Wallet"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Confirm Action Button */}
                <TouchableOpacity
                  style={styles.confirmActionButton}
                  activeOpacity={0.85}
                  onPress={handleConfirmBooking}
                >
                  <Text style={styles.confirmActionText}>
                    Confirm Reservation · Rs. {selectedVehicle?.fare}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              /* BOOKING CONFIRMED SUCCESS STATE */
              <View style={styles.successStateContainer}>
                <View style={styles.successIconCircle}>
                  <Text style={styles.successCheckIcon}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successMessage}>
                  {selectedVehicle?.name} will be waiting at {stationName} at{" "}
                  {arrivalTime}.
                </Text>

                <View style={styles.confirmationTicket}>
                  <Text style={styles.ticketLabel}>BOOKING PASS</Text>
                  <Text style={styles.ticketCode}>#CR-84920</Text>
                  <Text style={styles.ticketDetail}>
                    Vehicle: {selectedVehicle?.model} ({selectedVehicle?.plate})
                  </Text>
                  <Text style={styles.ticketDetail}>
                    Total Fare: Rs. {selectedVehicle?.fare} ({paymentMethod})
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
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

  /* HEADER */
  header: {
    backgroundColor: "#1D4ED8",
    paddingTop: Platform.OS === "ios" ? 52 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  topBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 2px 6px rgba(0,0,0,0.12)" },
      default: { elevation: 3 },
    }),
  },
  backIcon: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "700",
    color: "#1E293B",
  },
  titleColumn: {
    flex: 1,
    marginLeft: 12,
  },
  subtitleText: {
    fontSize: 11.5,
    color: "#BFDBFE",
    fontWeight: "500",
    marginBottom: 1,
  },
  titleText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  /* List | Map Toggle Switch */
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  toggleButtonActive: {
    backgroundColor: "#FFFFFF",
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  toggleTextActive: {
    color: "#1D4ED8",
    fontWeight: "700",
  },

  /* Train Arrival Card in Header */
  trainCard: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  trainCardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trainIcon: {
    fontSize: 15,
  },
  trainArrivalTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    flex: 1,
  },
  trainArrivalSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.75)",
    marginTop: 3,
    marginLeft: 23,
  },

  /* 3 Stat Boxes Row */
  statCardsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statCardTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statTypeIcon: {
    fontSize: 11,
  },
  statTypeLabel: {
    fontSize: 10.5,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 3,
    lineHeight: 22,
  },
  statStatus: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    marginTop: 1,
  },
  statWaitTime: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 6,
  },

  /* LIST CONTENT */
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },

  /* FILTERS ROW */
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    alignItems: "center",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterPillActive: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sortIcon: {
    fontSize: 10,
    color: "#F59E0B",
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },

  /* NOTICE BANNER */
  noticeBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  noticeIcon: {
    fontSize: 14,
  },
  noticeText: {
    flex: 1,
    fontSize: 11.5,
    color: "#2563EB",
    fontWeight: "500",
    lineHeight: 16,
  },

  /* VEHICLE CARD */
  vehicleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    ...Platform.select({
      web: { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
    }),
  },
  vehicleMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1D64EC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  driverInfoCol: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  driverName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeTaxi: {
    backgroundColor: "#FEF3C7",
  },
  badgeTaxiText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#B45309",
  },
  badgeTuktuk: {
    backgroundColor: "#FCE7F3",
  },
  badgeTuktukText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#BE185D",
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  starSymbols: {
    fontSize: 11,
    color: "#F59E0B",
    letterSpacing: 1,
  },
  ratingScore: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#D97706",
  },
  vehicleModelPlate: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },

  /* Right Side Fare & Time */
  fareTimeCol: {
    alignItems: "flex-end",
  },
  etaText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1D64EC",
  },
  fareText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  statusLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#16A34A",
  },

  /* Card Bottom */
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  distanceTripText: {
    fontSize: 11.5,
    color: "#64748B",
  },
  selectButton: {
    backgroundColor: "#1D64EC",
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 14,
    ...Platform.select({
      web: { boxShadow: "0 2px 6px rgba(29, 100, 236, 0.25)" },
      default: { elevation: 2 },
    }),
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "700",
  },

  /* MAP VIEW STYLES */
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    position: "relative",
  },
  mapGridLineH1: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "35%",
    height: 12,
    backgroundColor: "#CBD5E1",
  },
  mapGridLineH2: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "70%",
    height: 8,
    backgroundColor: "#CBD5E1",
  },
  mapGridLineV1: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "40%",
    width: 14,
    backgroundColor: "#CBD5E1",
  },
  mapGridLineV2: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: "25%",
    width: 8,
    backgroundColor: "#CBD5E1",
  },
  stationMarker: {
    position: "absolute",
    top: "45%",
    left: "35%",
    alignItems: "center",
  },
  stationMarkerIcon: {
    fontSize: 28,
  },
  stationMarkerCallout: {
    backgroundColor: "#1D4ED8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 2,
    alignItems: "center",
  },
  stationMarkerTitle: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  stationMarkerTime: {
    color: "#BFDBFE",
    fontSize: 9,
  },
  mapVehiclePin: {
    position: "absolute",
    alignItems: "center",
  },
  pinBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#1D4ED8",
    ...Platform.select({
      web: { boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
      default: { elevation: 3 },
    }),
  },
  pinIcon: {
    fontSize: 11,
  },
  pinEta: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  pinPointer: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 0,
    borderTopWidth: 5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#1D4ED8",
  },
  mapBottomCard: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
      default: { elevation: 3 },
    }),
  },
  mapBottomNotice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  returnListBtn: {
    backgroundColor: "#1D64EC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  returnListBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubheading: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "700",
  },
  modalDriverSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  modalDriverName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalVehicleDetail: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  modalRatingText: {
    fontSize: 11,
    color: "#D97706",
    fontWeight: "600",
    marginTop: 2,
  },
  modalFareAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1D64EC",
  },
  modalEta: {
    fontSize: 10.5,
    color: "#64748B",
    marginTop: 2,
  },
  bookingDetailsBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 14,
    gap: 6,
  },
  bookingDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },
  detailValueGreen: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },
  paymentSectionTitle: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  paymentChip: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  paymentChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D64EC",
  },
  paymentChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  paymentChipTextActive: {
    color: "#1D64EC",
    fontWeight: "700",
  },
  confirmActionButton: {
    backgroundColor: "#1D64EC",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(29, 100, 236, 0.3)" },
      default: { elevation: 3 },
    }),
  },
  confirmActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* SUCCESS CONFIRMATION MODAL STATE */
  successStateContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#DCFCE7",
    borderWidth: 2,
    borderColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  successCheckIcon: {
    fontSize: 30,
    color: "#16A34A",
    fontWeight: "800",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  successMessage: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  confirmationTicket: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: "center",
    gap: 4,
  },
  ticketLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "700",
    letterSpacing: 1,
  },
  ticketCode: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1D64EC",
  },
  ticketDetail: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "500",
  },
  doneButton: {
    backgroundColor: "#1D64EC",
    width: "100%",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
