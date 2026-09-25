import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";

interface Props {
  height?: number;
  showLiveVehicle?: boolean;
  vehicleType?: "train" | "bus";
  statusText?: string;
  speedText?: string;
  from?: string;
  to?: string;
}

export default function RealisticRouteMap({
  height = 200,
  showLiveVehicle = true,
  vehicleType = "train",
  statusText = "On Time",
  speedText = "76 km/h",
  from = "Kandy",
  to = "Colombo Fort",
}: Props) {
  // Vehicle navigation animation
  const vehicleProgress = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Smooth looping along the route
    Animated.loop(
      Animated.sequence([
        Animated.timing(vehicleProgress, {
          toValue: 1,
          duration: 4500,
          useNativeDriver: false,
        }),
        Animated.delay(800),
        Animated.timing(vehicleProgress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Subtle radar pulse for live vehicle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.6,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [vehicleProgress, pulseAnim]);

  // Interpolate coordinates along the Sri Lanka Central Rail/Highway Corridor (Kandy -> Kadugannawa -> Polgahawela -> Ragama -> Colombo Fort)
  const vehicleLeft = vehicleProgress.interpolate({
    inputRange: [0, 0.25, 0.55, 0.8, 1],
    outputRange: ["14%", "34%", "56%", "76%", "88%"],
  });

  const vehicleTop = vehicleProgress.interpolate({
    inputRange: [0, 0.25, 0.55, 0.8, 1],
    outputRange: ["68%", "52%", "46%", "38%", "26%"],
  });

  return (
    <View style={[styles.mapContainer, { height }]}>
      {/* 1. Base Land & Ocean Canvas */}
      <View style={styles.canvas}>
        {/* Ocean Body (West Coast / Colombo Coastal Shelf) */}
        <View style={styles.oceanWaterBody}>
          <Text style={styles.oceanLabel}>INDIAN OCEAN</Text>
        </View>

        {/* Coastal Shoreline Line */}
        <View style={styles.coastlineShore} />

        {/* Lake / Reservoirs (Kandy Lake & Kelani River System) */}
        <View style={styles.kandyLakeBody}>
          <Text style={styles.waterLabelTiny}>Kandy Lake</Text>
        </View>
        <View style={styles.beiraLakeBody} />

        {/* River Paths (Mahaweli & Kelani Rivers) */}
        <View style={styles.kelaniRiverStream1} />
        <View style={styles.kelaniRiverStream2} />

        {/* Green Reserve Zones & National Parks */}
        <View style={styles.botanicalGardensPark}>
          <Text style={styles.parkLabel}>Royal Botanical Gardens</Text>
        </View>
        <View style={styles.centralForestReserve}>
          <Text style={styles.parkLabel}>Udawattakele Reserve</Text>
        </View>

        {/* 2. Realistic City Grids (Secondary Street Blocks) */}
        {/* Kandy Sector Blocks */}
        <View style={styles.kandySectorGrid}>
          <View style={styles.cityBlockA} />
          <View style={styles.cityBlockB} />
          <View style={styles.cityBlockC} />
          <View style={styles.cityBlockD} />
        </View>

        {/* Central Corridor Blocks */}
        <View style={styles.corridorSectorGrid}>
          <View style={styles.cityBlockE} />
          <View style={styles.cityBlockF} />
          <View style={styles.cityBlockG} />
        </View>

        {/* Colombo Urban Blocks */}
        <View style={styles.colomboSectorGrid}>
          <View style={styles.cityBlockH} />
          <View style={styles.cityBlockI} />
          <View style={styles.cityBlockJ} />
        </View>

        {/* 3. Arterial Highway Network (A1 Colombo - Kandy Road & Expressways) */}
        {/* A1 Highway Yellow Ribbon */}
        <View style={styles.highwayA1Underlayer} />
        <View style={styles.highwayA1Asphalt}>
          <Text style={styles.highwayShieldLabel}>A1</Text>
        </View>

        {/* E02 / Expressway Ribbon */}
        <View style={styles.expresswayRibbon} />

        {/* Secondary Cross Streets */}
        <View style={styles.crossAvenue1} />
        <View style={styles.crossAvenue2} />
        <View style={styles.crossAvenue3} />

        {/* 4. Realistic Railway Track (Sleeper Ties & Rail Line) */}
        <View style={styles.railwayBallastTrack} />
        <View style={styles.railwayTiesPattern} />

        {/* 5. Navigation Active Route Line (Glow + Vibrant Path) */}
        <View style={styles.activeRouteAura} />
        <View style={styles.activeRouteCore} />

        {/* Route Chevrons (Direction of Travel) */}
        <View style={[styles.chevronMarker, { left: "26%", top: "58%" }]}>
          <Text style={styles.chevronSymbol}>›</Text>
        </View>
        <View style={[styles.chevronMarker, { left: "48%", top: "46%" }]}>
          <Text style={styles.chevronSymbol}>›</Text>
        </View>
        <View style={[styles.chevronMarker, { left: "70%", top: "40%" }]}>
          <Text style={styles.chevronSymbol}>›</Text>
        </View>

        {/* 6. Realistic Transit Stations with Geographic Tags */}
        {/* Station 1: Kandy (Origin) */}
        <View style={[styles.stationAnchor, { left: "12%", top: "66%" }]}>
          <View style={styles.originCircleHalo} />
          <View style={styles.originCircleCore} />
          <View style={styles.stationLabelBubbleLeft}>
            <Text style={styles.stationNameBold}>Kandy Central</Text>
            <Text style={styles.stationCodeText}>KDY · Origin</Text>
          </View>
        </View>

        {/* Station 2: Peradeniya */}
        <View style={[styles.stationAnchor, { left: "34%", top: "50%" }]}>
          <View style={styles.stationRingOuter}>
            <View style={styles.stationRingCore} />
          </View>
          <Text style={styles.stationSubLabel}>Peradeniya</Text>
        </View>

        {/* Station 3: Polgahawela Junction */}
        <View style={[styles.stationAnchor, { left: "56%", top: "44%" }]}>
          <View style={styles.stationRingOuter}>
            <View style={styles.stationRingCore} />
          </View>
          <Text style={styles.stationSubLabel}>Polgahawela</Text>
        </View>

        {/* Station 4: Ragama */}
        <View style={[styles.stationAnchor, { left: "74%", top: "36%" }]}>
          <View style={styles.stationRingOuter}>
            <View style={styles.stationRingCore} />
          </View>
          <Text style={styles.stationSubLabel}>Ragama Junc.</Text>
        </View>

        {/* Station 5: Colombo Fort (Destination Pin) */}
        <View style={[styles.destinationAnchor, { left: "86%", top: "16%" }]}>
          <View style={styles.destinationPinShadow} />
          <View style={styles.destinationPinBubble}>
            <Text style={styles.destinationPinIcon}>📍</Text>
          </View>
          <View style={styles.destinationLabelTag}>
            <Text style={styles.destinationLabelBold}>Colombo Fort</Text>
            <Text style={styles.destinationCodeText}>FOT · Dest.</Text>
          </View>
        </View>

        {/* 7. Live Animated Navigation Vehicle Puck */}
        {showLiveVehicle && (
          <Animated.View
            style={[
              styles.vehicleNavigationPuck,
              {
                left: vehicleLeft,
                top: vehicleTop,
              },
            ]}
          >
            {/* Pulsing Radar Aura */}
            <Animated.View
              style={[
                styles.vehicleRadarPulse,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            {/* Core Vehicle Icon Ring */}
            <View style={styles.vehicleCoreBadge}>
              <Text style={styles.vehicleEmojiIcon}>
                {vehicleType === "train" ? "🚆" : "🚌"}
              </Text>
            </View>

            {/* Floating Live Telemetry Tooltip */}
            <View style={styles.vehicleTelemetryTag}>
              <View style={styles.telemetryLiveDot} />
              <Text style={styles.telemetryText}>
                {speedText} · {statusText}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* 8. Map UI Overlays (North Compass, Scale, GIS Watermark) */}
        <View style={styles.mapCompass}>
          <Text style={styles.compassNeedle}>▲</Text>
          <Text style={styles.compassNorth}>N</Text>
        </View>

        <View style={styles.mapScaleBar}>
          <View style={styles.scaleRuler} />
          <Text style={styles.scaleText}>25 km</Text>
        </View>

        <View style={styles.gisWatermarkPill}>
          <Text style={styles.gisWatermarkText}>© OpenStreetMap · BestRoute</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#EDF2F7",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    position: "relative",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.08)",
      },
      default: {
        elevation: 3,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
      },
    }),
  },
  canvas: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    position: "relative",
    overflow: "hidden",
  },

  /* 1. Water & Environmental Features */
  oceanWaterBody: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "14%",
    backgroundColor: "#DCEEFE",
    borderLeftWidth: 1.5,
    borderLeftColor: "#BAE6FD",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  oceanLabel: {
    fontSize: 7,
    fontWeight: "800",
    color: "#60A5FA",
    letterSpacing: 1.2,
    transform: [{ rotate: "90deg" }],
    width: 90,
    textAlign: "center",
  },
  coastlineShore: {
    position: "absolute",
    right: "13.5%",
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#E2F0FE",
    zIndex: 2,
  },
  kandyLakeBody: {
    position: "absolute",
    left: "13%",
    top: "76%",
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#BAE6FD",
    borderWidth: 1,
    borderColor: "#93C5FD",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  waterLabelTiny: {
    fontSize: 6.5,
    fontWeight: "700",
    color: "#1E40AF",
  },
  beiraLakeBody: {
    position: "absolute",
    left: "85%",
    top: "20%",
    width: 28,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#BAE6FD",
    borderWidth: 1,
    borderColor: "#93C5FD",
    zIndex: 2,
  },
  kelaniRiverStream1: {
    position: "absolute",
    left: "45%",
    top: "60%",
    width: 120,
    height: 3,
    backgroundColor: "#BAE6FD",
    borderRadius: 2,
    transform: [{ rotate: "-18deg" }],
    zIndex: 2,
  },
  kelaniRiverStream2: {
    position: "absolute",
    left: "62%",
    top: "35%",
    width: 80,
    height: 2.5,
    backgroundColor: "#BAE6FD",
    borderRadius: 2,
    transform: [{ rotate: "12deg" }],
    zIndex: 2,
  },
  botanicalGardensPark: {
    position: "absolute",
    left: "30%",
    top: "65%",
    width: 60,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 2,
    zIndex: 2,
  },
  centralForestReserve: {
    position: "absolute",
    left: "8%",
    top: "44%",
    width: 65,
    height: 30,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: 2,
    zIndex: 2,
  },
  parkLabel: {
    fontSize: 6,
    fontWeight: "700",
    color: "#166534",
    lineHeight: 8,
  },

  /* 2. City Block Grid Textures */
  kandySectorGrid: {
    position: "absolute",
    left: "6%",
    top: "54%",
    width: 80,
    height: 50,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    zIndex: 1,
  },
  corridorSectorGrid: {
    position: "absolute",
    left: "40%",
    top: "28%",
    width: 100,
    height: 46,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    zIndex: 1,
  },
  colomboSectorGrid: {
    position: "absolute",
    left: "70%",
    top: "14%",
    width: 65,
    height: 55,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    zIndex: 1,
  },
  cityBlockA: { width: 34, height: 20, backgroundColor: "#EAEFF6", borderRadius: 4 },
  cityBlockB: { width: 38, height: 20, backgroundColor: "#E6ECF5", borderRadius: 4 },
  cityBlockC: { width: 38, height: 22, backgroundColor: "#E6ECF5", borderRadius: 4 },
  cityBlockD: { width: 34, height: 22, backgroundColor: "#EAEFF6", borderRadius: 4 },
  cityBlockE: { width: 44, height: 18, backgroundColor: "#EAEFF6", borderRadius: 4 },
  cityBlockF: { width: 46, height: 18, backgroundColor: "#E6ECF5", borderRadius: 4 },
  cityBlockG: { width: 92, height: 18, backgroundColor: "#EAEFF6", borderRadius: 4 },
  cityBlockH: { width: 28, height: 22, backgroundColor: "#EAEFF6", borderRadius: 4 },
  cityBlockI: { width: 30, height: 22, backgroundColor: "#E6ECF5", borderRadius: 4 },
  cityBlockJ: { width: 60, height: 24, backgroundColor: "#EAEFF6", borderRadius: 4 },

  /* 3. Highway Ribbons (A1 Highway & Secondary Avenues) */
  highwayA1Underlayer: {
    position: "absolute",
    left: "12%",
    right: "12%",
    top: "53%",
    height: 5,
    backgroundColor: "#FDE047",
    borderRadius: 2.5,
    transform: [{ rotate: "-15deg" }],
    zIndex: 3,
  },
  highwayA1Asphalt: {
    position: "absolute",
    left: "12%",
    right: "12%",
    top: "53.5%",
    height: 3,
    backgroundColor: "#FEF08A",
    borderRadius: 1.5,
    transform: [{ rotate: "-15deg" }],
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  highwayShieldLabel: {
    fontSize: 5.5,
    fontWeight: "900",
    color: "#854D0E",
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 2,
    borderRadius: 2,
  },
  expresswayRibbon: {
    position: "absolute",
    left: "58%",
    right: "12%",
    top: "30%",
    height: 3,
    backgroundColor: "#CBD5E1",
    borderRadius: 1.5,
    transform: [{ rotate: "-10deg" }],
    zIndex: 3,
  },
  crossAvenue1: {
    position: "absolute",
    left: "26%",
    top: "30%",
    height: 70,
    width: 2.5,
    backgroundColor: "#E2E8F0",
    transform: [{ rotate: "18deg" }],
    zIndex: 2,
  },
  crossAvenue2: {
    position: "absolute",
    left: "52%",
    top: "20%",
    height: 80,
    width: 2.5,
    backgroundColor: "#E2E8F0",
    transform: [{ rotate: "24deg" }],
    zIndex: 2,
  },
  crossAvenue3: {
    position: "absolute",
    left: "80%",
    top: "10%",
    height: 70,
    width: 2.5,
    backgroundColor: "#E2E8F0",
    transform: [{ rotate: "15deg" }],
    zIndex: 2,
  },

  /* 4. Realistic Railway Track */
  railwayBallastTrack: {
    position: "absolute",
    left: "10%",
    right: "10%",
    top: "48%",
    height: 2,
    backgroundColor: "#64748B",
    zIndex: 4,
  },
  railwayTiesPattern: {
    position: "absolute",
    left: "10%",
    right: "10%",
    top: "47.5%",
    height: 3,
    borderWidth: 1,
    borderColor: "#475569",
    borderStyle: "dashed",
    zIndex: 5,
  },

  /* 5. Navigation Active Route Line */
  activeRouteAura: {
    position: "absolute",
    left: "13%",
    right: "13%",
    top: "47%",
    height: 7,
    backgroundColor: "rgba(59, 130, 246, 0.25)",
    borderRadius: 3.5,
    zIndex: 6,
  },
  activeRouteCore: {
    position: "absolute",
    left: "14%",
    right: "14%",
    top: "47.5%",
    height: 3.5,
    backgroundColor: "#1D64EC",
    borderRadius: 2,
    zIndex: 7,
  },
  chevronMarker: {
    position: "absolute",
    zIndex: 8,
    marginTop: -8,
  },
  chevronSymbol: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  /* 6. Stations & Pins */
  stationAnchor: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  originCircleHalo: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(29, 100, 236, 0.25)",
    top: -3,
    left: -3,
  },
  originCircleCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1D64EC",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  stationLabelBubbleLeft: {
    position: "absolute",
    top: 18,
    left: -18,
    backgroundColor: "rgba(15, 23, 42, 0.88)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    minWidth: 70,
    alignItems: "center",
  },
  stationNameBold: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },
  stationCodeText: {
    color: "#93C5FD",
    fontSize: 6.5,
    fontWeight: "700",
  },
  stationRingOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  stationRingCore: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#1D64EC",
  },
  stationSubLabel: {
    fontSize: 7.5,
    fontWeight: "700",
    color: "#334155",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 3,
    borderRadius: 3,
    marginTop: 2,
  },
  destinationAnchor: {
    position: "absolute",
    alignItems: "center",
    zIndex: 15,
  },
  destinationPinShadow: {
    position: "absolute",
    bottom: 2,
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(15, 23, 42, 0.3)",
  },
  destinationPinBubble: {
    alignItems: "center",
  },
  destinationPinIcon: {
    fontSize: 18,
  },
  destinationLabelTag: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: "center",
    marginTop: -2,
  },
  destinationLabelBold: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },
  destinationCodeText: {
    color: "#FCA5A5",
    fontSize: 6.5,
    fontWeight: "700",
  },

  /* 7. Animated Navigation Puck */
  vehicleNavigationPuck: {
    position: "absolute",
    zIndex: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleRadarPulse: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(29, 100, 236, 0.28)",
  },
  vehicleCoreBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#1D64EC",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      },
      default: {
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
  vehicleEmojiIcon: {
    fontSize: 12,
  },
  vehicleTelemetryTag: {
    position: "absolute",
    top: -18,
    backgroundColor: "#0F172A",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minWidth: 78,
  },
  telemetryLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
  },
  telemetryText: {
    color: "#FFFFFF",
    fontSize: 7.5,
    fontWeight: "700",
  },

  /* 8. Map Overlays */
  mapCompass: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    zIndex: 10,
  },
  compassNeedle: {
    fontSize: 8,
    color: "#DC2626",
    fontWeight: "900",
    marginTop: -2,
  },
  compassNorth: {
    fontSize: 6,
    fontWeight: "900",
    color: "#334155",
    marginTop: -3,
  },
  mapScaleBar: {
    position: "absolute",
    bottom: 6,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 10,
  },
  scaleRuler: {
    width: 28,
    height: 2,
    backgroundColor: "#475569",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#1E293B",
  },
  scaleText: {
    fontSize: 7,
    fontWeight: "700",
    color: "#475569",
  },
  gisWatermarkPill: {
    position: "absolute",
    bottom: 4,
    right: 6,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
    zIndex: 10,
  },
  gisWatermarkText: {
    fontSize: 7,
    color: "#64748B",
    fontWeight: "600",
  },
});
