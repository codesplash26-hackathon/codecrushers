import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigations/AppNavigator";

type RideProgressScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RideProgress"
>;

type RideProgressScreenRouteProp = RouteProp<
  RootStackParamList,
  "RideProgress"
>;

interface Props {
  navigation: RideProgressScreenNavigationProp;
  route: RideProgressScreenRouteProp;
}

// 5 Stages matching the 6 screenshots in sequence:
// 0: Finding your driver...
// 1: Driver accepted!
// 2: Driver is on the way (4 min)
// 3: Driver has arrived! (Here!)
// 4: Trip completed! (Done ✓ + Trip Summary + Rate Driver)
type RideStage = 0 | 1 | 2 | 3 | 4;

export default function RideProgressScreen({ navigation, route }: Props) {
  const driverName = route.params?.driverName || "Kasun Perera";
  const driverInitials = route.params?.driverInitials || "KP";
  const rating = route.params?.rating || 4.8;
  const vehicleModel = route.params?.vehicleModel || "Toyota Prius";
  const vehiclePlate = route.params?.plate || "WP CAB-1234";
  const fare = route.params?.fare || 850;
  const station = route.params?.station || "Colombo Fort";

  const [currentStage, setCurrentStage] = useState<RideStage>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Rating Modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStars, setSelectedStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Polite Driver",
    "Clean Car",
  ]);
  const [selectedTip, setSelectedTip] = useState<string>("Rs. 100");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Animated vehicle position along route
  const carAnim = useRef(new Animated.Value(0)).current;
  const radarAnim = useRef(new Animated.Value(0.4)).current;

  // Radar pulsing animation for Stage 0
  useEffect(() => {
    if (currentStage === 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(radarAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(radarAnim, {
            toValue: 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [currentStage, radarAnim]);

  // Car translation animation
  useEffect(() => {
    if (currentStage === 0) {
      carAnim.setValue(0);
    } else if (currentStage === 1) {
      Animated.timing(carAnim, {
        toValue: 0.25,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else if (currentStage === 2) {
      Animated.timing(carAnim, {
        toValue: 0.65,
        duration: 3500,
        useNativeDriver: true,
      }).start();
    } else if (currentStage === 3 || currentStage === 4) {
      Animated.timing(carAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStage, carAnim]);

  // Automatic real-time progression sequence
  useEffect(() => {
    if (!isAutoPlaying) return;

    let timer: any;
    if (currentStage === 0) {
      // Finding driver -> 3.5s
      timer = setTimeout(() => setCurrentStage(1), 3500);
    } else if (currentStage === 1) {
      // Driver accepted -> 3.5s
      timer = setTimeout(() => setCurrentStage(2), 3500);
    } else if (currentStage === 2) {
      // Driver on way -> 4.5s
      timer = setTimeout(() => setCurrentStage(3), 4500);
    } else if (currentStage === 3) {
      // Driver arrived -> 4.0s
      timer = setTimeout(() => setCurrentStage(4), 4000);
    }
    return () => clearTimeout(timer);
  }, [currentStage, isAutoPlaying]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitRating = () => {
    setRatingSubmitted(true);
    setTimeout(() => {
      setShowRatingModal(false);
      navigation.navigate("Home");
    }, 1800);
  };

  // Interpolate car horizontal and vertical position on the realistic road path
  const carTranslateX = carAnim.interpolate({
    inputRange: [0, 0.25, 0.65, 1],
    outputRange: [-60, -25, 10, 45],
  });

  const carTranslateY = carAnim.interpolate({
    inputRange: [0, 0.25, 0.65, 1],
    outputRange: [-18, -12, -4, 0],
  });

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      {/* TOP MAP CONTAINER */}
      <View style={styles.mapContainer}>
        {/* City Blocks Background Grid */}
        <View style={styles.cityGrid}>
          {/* Building block rows */}
          <View style={styles.buildingRow}>
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
          </View>
          <View style={styles.buildingRow}>
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
          </View>
          <View style={styles.buildingRow}>
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
            <View style={styles.buildingBlock} />
          </View>
        </View>

        {/* Dotted Route Track Line */}
        <View style={styles.routeTrackLine}>
          <View style={styles.dashedTrack} />
          <View style={[styles.routeNodeDot, { left: "10%" }]} />
          <View style={[styles.routeNodeDot, { left: "30%" }]} />
          <View style={[styles.routeNodeDot, { left: "70%" }]} />
          <View style={[styles.routeNodeDot, { left: "90%" }]} />
        </View>

        {/* Blue Navigation Route Highlight (Stage 2+) */}
        {currentStage >= 2 && (
          <View style={styles.activeRouteLineHighlight} />
        )}

        {/* Destination / Pickup Blue Marker with halo */}
        <View style={styles.destinationPinContainer}>
          <Animated.View
            style={[
              styles.destinationHalo,
              {
                opacity: currentStage === 0 ? radarAnim : 0.8,
                transform: [
                  {
                    scale:
                      currentStage === 0
                        ? radarAnim.interpolate({
                            inputRange: [0.4, 1],
                            outputRange: [1, 1.6],
                          })
                        : 1,
                  },
                ],
              },
            ]}
          />
          <View style={styles.destinationCoreDot} />
        </View>

        {/* Moving Yellow Vehicle Marker */}
        {currentStage > 0 && (
          <Animated.View
            style={[
              styles.carMarkerContainer,
              {
                transform: [
                  { translateX: carTranslateX },
                  { translateY: carTranslateY },
                ],
              },
            ]}
          >
            <View style={styles.carMarkerBubble}>
              <Text style={styles.carMarkerEmoji}>🚕</Text>
            </View>
          </Animated.View>
        )}

        {/* Floating Round Back Button */}
        <TouchableOpacity
          style={styles.floatingBackButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.floatingBackIcon}>‹</Text>
        </TouchableOpacity>

        {/* Watermark in bottom-right of map */}
        <View style={styles.mapWatermark}>
          <Text style={styles.watermarkText}>BestRoute Maps</Text>
        </View>

        {/* Quick Simulation Step Switcher (Pills to test each state easily) */}
        <View style={styles.simControlsOverlay}>
          {([0, 1, 2, 3, 4] as RideStage[]).map((st) => (
            <TouchableOpacity
              key={st}
              style={[
                styles.simStepPill,
                currentStage === st && styles.simStepPillActive,
              ]}
              onPress={() => {
                setIsAutoPlaying(false);
                setCurrentStage(st);
              }}
            >
              <Text
                style={[
                  styles.simStepText,
                  currentStage === st && styles.simStepTextActive,
                ]}
              >
                {st === 0
                  ? "Search"
                  : st === 1
                  ? "Accepted"
                  : st === 2
                  ? "On Way"
                  : st === 3
                  ? "Arrived"
                  : "Done"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* LOWER CONTENT AREA */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Multi-Segment Step Progress Indicator */}
        <View style={styles.progressBarRow}>
          {[0, 1, 2, 3, 4].map((stepIdx) => {
            const isCompleted = stepIdx <= currentStage;
            const isFinished = currentStage === 4;
            const isStageActive = stepIdx === currentStage;

            let barColor = "#E2E8F0"; // inactive
            if (isCompleted) {
              if (isFinished || currentStage === 1 || currentStage === 3) {
                barColor = "#16A34A"; // green for accepted/arrived/completed
              } else {
                barColor = "#1D64EC"; // blue for searching & on the way
              }
            }

            return (
              <View
                key={stepIdx}
                style={[
                  styles.progressSegment,
                  { backgroundColor: barColor },
                ]}
              />
            );
          })}
        </View>

        {/* STATUS CARD (Matching exact screenshots) */}
        {currentStage === 0 && (
          /* STAGE 0: FINDING YOUR DRIVER */
          <View style={[styles.statusCard, styles.statusCardBlue]}>
            <View style={[styles.statusIconBox, styles.statusIconBoxBlue]}>
              <Text style={styles.statusIconEmoji}>🔍</Text>
            </View>
            <View style={styles.statusTextCol}>
              <Text style={styles.statusTitle}>Finding your driver...</Text>
              <Text style={styles.statusSubtitle}>
                Connecting to nearby drivers
              </Text>
            </View>
          </View>
        )}

        {currentStage === 1 && (
          /* STAGE 1: DRIVER ACCEPTED */
          <View style={[styles.statusCard, styles.statusCardGreen]}>
            <View style={[styles.statusIconBox, styles.statusIconBoxGreen]}>
              <Text style={styles.statusIconEmoji}>✓</Text>
            </View>
            <View style={styles.statusTextCol}>
              <Text style={[styles.statusTitle, styles.statusTitleGreen]}>
                Driver accepted!
              </Text>
              <Text style={styles.statusSubtitle}>
                {driverName} has accepted your booking
              </Text>
            </View>
          </View>
        )}

        {currentStage === 2 && (
          /* STAGE 2: DRIVER IS ON THE WAY */
          <View style={[styles.statusCard, styles.statusCardBlue]}>
            <View style={[styles.statusIconBox, styles.statusIconBoxYellow]}>
              <Text style={styles.statusIconEmoji}>🚕</Text>
            </View>
            <View style={styles.statusTextCol}>
              <Text style={[styles.statusTitle, styles.statusTitleBlue]}>
                Driver is on the way
              </Text>
              <Text style={styles.statusSubtitle}>
                Your driver is 4 minutes away
              </Text>
            </View>
          </View>
        )}

        {currentStage === 3 && (
          /* STAGE 3: DRIVER HAS ARRIVED */
          <View style={[styles.statusCard, styles.statusCardGreen]}>
            <View style={[styles.statusIconBox, styles.statusIconBoxRed]}>
              <Text style={styles.statusIconEmoji}>📍</Text>
            </View>
            <View style={styles.statusTextCol}>
              <Text style={[styles.statusTitle, styles.statusTitleGreen]}>
                Driver has arrived!
              </Text>
              <Text style={styles.statusSubtitle}>
                Look for the Silver {vehicleModel} - {vehiclePlate}
              </Text>
            </View>
          </View>
        )}

        {currentStage === 4 && (
          /* STAGE 4: TRIP COMPLETED */
          <View style={[styles.statusCard, styles.statusCardGreen]}>
            <View style={[styles.statusIconBox, styles.statusIconBoxGreen]}>
              <Text style={styles.statusIconEmoji}>🏁</Text>
            </View>
            <View style={styles.statusTextCol}>
              <Text style={[styles.statusTitle, styles.statusTitleGreen]}>
                Trip completed!
              </Text>
              <Text style={styles.statusSubtitle}>
                You have arrived at your destination
              </Text>
            </View>
          </View>
        )}

        {/* DRIVER INFO CARD (Visible in Stages 1 to 4) */}
        {currentStage >= 1 && (
          <View style={styles.driverCard}>
            {/* Top row: Avatar, Name, Rating, ETA/Arrival Badge */}
            <View style={styles.driverMainRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{driverInitials}</Text>
              </View>

              <View style={styles.driverDetailsCol}>
                <Text style={styles.driverName}>{driverName}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingStars}>★★★★★</Text>
                  <Text style={styles.ratingNumber}>{rating}</Text>
                </View>
              </View>

              {/* Status on right: 4 min, Here!, Done ✓ */}
              <View style={styles.driverRightBadgeCol}>
                {currentStage === 2 && (
                  <Text style={styles.etaTextBlue}>4 min</Text>
                )}
                {currentStage === 3 && (
                  <Text style={styles.hereTextGreen}>Here!</Text>
                )}
                {currentStage === 4 && (
                  <Text style={styles.doneTextGreen}>Done ✓</Text>
                )}
              </View>
            </View>

            {/* 3 Column Boxes: Vehicle, Plate, Fare */}
            <View style={styles.specsRow}>
              <View style={styles.specBox}>
                <Text style={styles.specLabel}>Vehicle</Text>
                <Text style={styles.specValue}>{vehicleModel}</Text>
              </View>
              <View style={styles.specBox}>
                <Text style={styles.specLabel}>Plate</Text>
                <Text style={styles.specValue}>{vehiclePlate}</Text>
              </View>
              <View style={styles.specBox}>
                <Text style={styles.specLabel}>Fare</Text>
                <Text style={styles.specValue}>Rs. {fare}</Text>
              </View>
            </View>
          </View>
        )}

        {/* TRIP SUMMARY CARD (Visible when stage === 4) */}
        {currentStage === 4 && (
          <View style={styles.tripSummaryCard}>
            <Text style={styles.summaryHeading}>TRIP SUMMARY</Text>

            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>18 min</Text>
            </View>
            <View style={styles.summaryDivider} />

            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>7.2 km</Text>
            </View>
            <View style={styles.summaryDivider} />

            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryLabel}>Fare</Text>
              <Text style={styles.summaryValue}>Rs. {fare}</Text>
            </View>
            <View style={styles.summaryDivider} />

            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryLabel}>Driver</Text>
              <Text style={styles.summaryValue}>{driverName}</Text>
            </View>
            <View style={styles.summaryDivider} />

            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue}>{vehicleModel}</Text>
            </View>
          </View>
        )}

        {/* RATE YOUR DRIVER BUTTON (Step 6 / Stage 4) */}
        {currentStage === 4 && (
          <TouchableOpacity
            style={styles.rateDriverButton}
            activeOpacity={0.85}
            onPress={() => setShowRatingModal(true)}
          >
            <Text style={styles.rateDriverButtonText}>★ Rate Your Driver</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* INTERACTIVE DRIVER RATING MODAL */}
      <Modal
        visible={showRatingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ratingCard}>
            {!ratingSubmitted ? (
              <>
                <View style={styles.ratingModalHeader}>
                  <Text style={styles.ratingModalTitle}>How was your ride?</Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setShowRatingModal(false)}
                  >
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Driver avatar & info */}
                <View style={styles.ratingDriverSummary}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>{driverInitials}</Text>
                  </View>
                  <View>
                    <Text style={styles.ratingDriverName}>{driverName}</Text>
                    <Text style={styles.ratingDriverVehicle}>
                      {vehicleModel} · {vehiclePlate}
                    </Text>
                  </View>
                </View>

                {/* 5 Clickable Stars */}
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      activeOpacity={0.7}
                      onPress={() => setSelectedStars(star)}
                    >
                      <Text
                        style={[
                          styles.bigStar,
                          star <= selectedStars
                            ? styles.bigStarFilled
                            : styles.bigStarEmpty,
                        ]}
                      >
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.starsScoreText}>
                  {selectedStars === 5
                    ? "Excellent Ride! 🌟"
                    : selectedStars === 4
                    ? "Very Good! 👍"
                    : selectedStars === 3
                    ? "Good 👌"
                    : "Could be better"}
                </Text>

                {/* Feedback Tags */}
                <Text style={styles.ratingSectionLabel}>What went well?</Text>
                <View style={styles.tagsContainer}>
                  {[
                    "Polite Driver",
                    "Clean Car",
                    "Safe Driving",
                    "On Time",
                    "Great Route",
                  ].map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.tagChip,
                          isSelected && styles.tagChipActive,
                        ]}
                        onPress={() => toggleTag(tag)}
                      >
                        <Text
                          style={[
                            styles.tagText,
                            isSelected && styles.tagTextActive,
                          ]}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Optional Tip */}
                <Text style={styles.ratingSectionLabel}>Add a tip for {driverName}</Text>
                <View style={styles.tipsRow}>
                  {["None", "Rs. 50", "Rs. 100", "Rs. 200"].map((tip) => (
                    <TouchableOpacity
                      key={tip}
                      style={[
                        styles.tipChip,
                        selectedTip === tip && styles.tipChipActive,
                      ]}
                      onPress={() => setSelectedTip(tip)}
                    >
                      <Text
                        style={[
                          styles.tipText,
                          selectedTip === tip && styles.tipTextActive,
                        ]}
                      >
                        {tip}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitRatingBtn}
                  activeOpacity={0.85}
                  onPress={handleSubmitRating}
                >
                  <Text style={styles.submitRatingBtnText}>Submit Feedback</Text>
                </TouchableOpacity>
              </>
            ) : (
              /* RATING THANK YOU STATE */
              <View style={styles.thankYouContainer}>
                <View style={styles.thankYouCircle}>
                  <Text style={styles.thankYouIcon}>❤️</Text>
                </View>
                <Text style={styles.thankYouTitle}>Thank You!</Text>
                <Text style={styles.thankYouSubtitle}>
                  Your feedback helps keep Sri Lanka's transit community top notch.
                </Text>
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
    backgroundColor: "#FFFFFF",
  },

  /* TOP MAP SECTION */
  mapContainer: {
    height: 250,
    backgroundColor: "#F1F5F9",
    position: "relative",
    overflow: "hidden",
  },
  cityGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    justifyContent: "space-between",
  },
  buildingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginVertical: 4,
  },
  buildingBlock: {
    flex: 1,
    height: 52,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    opacity: 0.7,
  },

  /* Route Track */
  routeTrackLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "54%",
    height: 10,
    justifyContent: "center",
  },
  dashedTrack: {
    height: 2,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    borderStyle: "dashed",
  },
  routeNodeDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#475569",
    top: 1,
  },

  /* Active blue line highlight */
  activeRouteLineHighlight: {
    position: "absolute",
    left: "15%",
    right: "42%",
    top: "54%",
    height: 4,
    backgroundColor: "#2563EB",
    borderRadius: 2,
  },

  /* Destination dot / Halo */
  destinationPinContainer: {
    position: "absolute",
    top: "47%",
    right: "44%",
    alignItems: "center",
    justifyContent: "center",
  },
  destinationHalo: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(37, 99, 235, 0.25)",
  },
  destinationCoreDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#1D4ED8",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },

  /* Car Marker */
  carMarkerContainer: {
    position: "absolute",
    top: "43%",
    left: "32%",
    zIndex: 10,
  },
  carMarkerBubble: {
    backgroundColor: "#FEF08A",
    borderWidth: 1.5,
    borderColor: "#CA8A04",
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 3,
    ...Platform.select({
      web: { boxShadow: "0 2px 6px rgba(0,0,0,0.15)" },
      default: { elevation: 3 },
    }),
  },
  carMarkerEmoji: {
    fontSize: 14,
  },

  /* Back Button */
  floatingBackButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 36,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    ...Platform.select({
      web: { boxShadow: "0 2px 6px rgba(0,0,0,0.12)" },
      default: { elevation: 3 },
    }),
  },
  floatingBackIcon: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "700",
    color: "#334155",
  },

  /* Watermark */
  mapWatermark: {
    position: "absolute",
    right: 12,
    bottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  watermarkText: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "600",
  },

  /* Simulation testing controller pills */
  simControlsOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 48 : 36,
    right: 12,
    flexDirection: "row",
    gap: 4,
    zIndex: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  simStepPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  simStepPillActive: {
    backgroundColor: "#1D64EC",
  },
  simStepText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#64748B",
  },
  simStepTextActive: {
    color: "#FFFFFF",
  },

  /* SCROLL CONTENT */
  scrollArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  /* Progress Bar */
  progressBarRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 14,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },

  /* STATUS CARD */
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  statusCardBlue: {
    backgroundColor: "#F0F7FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  statusCardGreen: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  statusIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statusIconBoxBlue: {
    backgroundColor: "#DBEAFE",
  },
  statusIconBoxGreen: {
    backgroundColor: "#DCFCE7",
  },
  statusIconBoxYellow: {
    backgroundColor: "#FEF9C3",
  },
  statusIconBoxRed: {
    backgroundColor: "#FEE2E2",
  },
  statusIconEmoji: {
    fontSize: 18,
    fontWeight: "700",
  },
  statusTextCol: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },
  statusTitleGreen: {
    color: "#16A34A",
  },
  statusTitleBlue: {
    color: "#1D4ED8",
  },
  statusSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },

  /* DRIVER CARD */
  driverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 14,
    ...Platform.select({
      web: { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
      default: { elevation: 2 },
    }),
  },
  driverMainRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  driverDetailsCol: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingStars: {
    fontSize: 11,
    color: "#F59E0B",
    letterSpacing: 1,
  },
  ratingNumber: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#D97706",
  },
  driverRightBadgeCol: {
    alignItems: "flex-end",
  },
  etaTextBlue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1D64EC",
  },
  hereTextGreen: {
    fontSize: 14,
    fontWeight: "800",
    color: "#16A34A",
  },
  doneTextGreen: {
    fontSize: 14,
    fontWeight: "800",
    color: "#16A34A",
  },

  /* 3 Specs boxes */
  specsRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  specBox: {
    flex: 1,
    alignItems: "center",
  },
  specLabel: {
    fontSize: 10.5,
    color: "#94A3B8",
    marginBottom: 3,
    fontWeight: "600",
  },
  specValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
  },

  /* TRIP SUMMARY CARD */
  tripSummaryCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 14,
    marginBottom: 16,
  },
  summaryHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: "#16A34A",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  summaryItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#475569",
  },
  summaryValue: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#DCFCE7",
  },

  /* RATE YOUR DRIVER BUTTON */
  rateDriverButton: {
    backgroundColor: "#D97706",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)" },
      default: { elevation: 3 },
    }),
  },
  rateDriverButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* RATING MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  ratingCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  ratingModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "700",
  },
  ratingDriverSummary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  ratingDriverName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  ratingDriverVehicle: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },

  /* 5 Stars Row */
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 6,
  },
  bigStar: {
    fontSize: 34,
  },
  bigStarFilled: {
    color: "#F59E0B",
  },
  bigStarEmpty: {
    color: "#CBD5E1",
  },
  starsScoreText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#D97706",
    marginBottom: 16,
  },
  ratingSectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tagChipActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1D64EC",
  },
  tagText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },
  tagTextActive: {
    color: "#1D64EC",
    fontWeight: "700",
  },
  tipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  tipChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tipChipActive: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  tipText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#475569",
  },
  tipTextActive: {
    color: "#B45309",
    fontWeight: "700",
  },
  submitRatingBtn: {
    backgroundColor: "#1D64EC",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  submitRatingBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* Thank you state */
  thankYouContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  thankYouCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  thankYouIcon: {
    fontSize: 28,
  },
  thankYouTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  thankYouSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
