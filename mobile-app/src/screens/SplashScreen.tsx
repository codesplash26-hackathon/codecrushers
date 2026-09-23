import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Splash"
>;

interface Props {
  navigation?: SplashScreenNavigationProp;
}

export default function SplashScreen({ navigation }: Props) {
  // Animation values
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.88)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Staggered animated values for the three loading dots
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  const dot1Scale = useRef(new Animated.Value(0.85)).current;
  const dot2Scale = useRef(new Animated.Value(0.85)).current;
  const dot3Scale = useRef(new Animated.Value(0.85)).current;

  const navigateNext = () => {
    if (navigation) {
      navigation.replace("Onboarding");
    }
  };

  useEffect(() => {
    // 1. Entrance animation for Logo & Content
    Animated.parallel([
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Subtle ambient pulse behind the logo
    const ambientLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.96,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );
    ambientLoop.start();

    // 3. Staggered fluid bouncing dots animation
    const animateDot = (
      opacityVal: Animated.Value,
      scaleVal: Animated.Value,
      delayMs: number
    ) => {
      return Animated.sequence([
        Animated.delay(delayMs),
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(opacityVal, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(scaleVal, {
                toValue: 1.35,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(opacityVal, {
                toValue: 0.3,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(scaleVal, {
                toValue: 0.85,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            Animated.delay(300),
          ])
        ),
      ]);
    };

    const dot1Sequence = animateDot(dot1Anim, dot1Scale, 0);
    const dot2Sequence = animateDot(dot2Anim, dot2Scale, 200);
    const dot3Sequence = animateDot(dot3Anim, dot3Scale, 400);

    dot1Sequence.start();
    dot2Sequence.start();
    dot3Sequence.start();

    // 4. Auto navigation after ~3.6s
    const timer = setTimeout(() => {
      navigateNext();
    }, 3600);

    return () => {
      clearTimeout(timer);
      ambientLoop.stop();
      dot1Sequence.stop();
      dot2Sequence.stop();
      dot3Sequence.stop();
    };
  }, []);

  return (
    <Pressable
      style={styles.pressableContainer}
      onPress={navigateNext}
    >
      <StatusBar style="light" />

      {/* Main Multi-stop Background Gradient */}
      <LinearGradient
        colors={["#0B3E9E", "#114FB8", "#1763D5", "#0E75D8", "#0284C7"]}
        locations={[0, 0.22, 0.5, 0.78, 1.0]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient background glowing orbs */}
      <View style={styles.ambientTopRightOrb} />
      <View style={styles.ambientBottomLeftOrb} />
      <View style={styles.ambientBottomRightOrb} />

      {/* Abstract Background Design: Concentric Radar Range Rings */}
      <View style={styles.radarContainer} pointerEvents="none">
        <View style={[styles.radarRing, styles.radarRingInner]} />
        <View style={[styles.radarRing, styles.radarRingMid]} />
        <View style={[styles.radarRing, styles.radarRingOuter]} />
        <View style={[styles.radarRing, styles.radarRingExtra]} />

        {/* Diagonal Dashed Journey / Route Trajectory Line */}
        <View style={styles.dashedRouteLine} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Central Brand Unit */}
        <View style={styles.brandCenterContainer}>
          {/* Logo container with ambient glow */}
          <View style={styles.logoWrapper}>
            {/* Ambient Logo Glow */}
            <Animated.View
              style={[
                styles.glowBackdrop,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: logoFadeAnim,
                },
              ]}
            />

            {/* BestRoute Official Emblem */}
            <Animated.View
              style={{
                opacity: logoFadeAnim,
                transform: [{ scale: logoScaleAnim }],
              }}
            >
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Typography & Animated Pulse Indicator */}
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: contentFadeAnim,
              },
            ]}
          >
            {/* Tagline */}
            <Text style={styles.taglineText}>
              Your journey. Optimized.
            </Text>

            {/* Three Bouncing / Pulsing Loading Dots */}
            <View style={styles.dotsContainer}>
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot1Anim,
                    transform: [{ scale: dot1Scale }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot2Anim,
                    transform: [{ scale: dot2Scale }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: dot3Anim,
                    transform: [{ scale: dot3Scale }],
                  },
                ]}
              />
            </View>

            {/* Loading Status Subtitle */}
            <Text style={styles.subtitleText}>
              Optimizing your travel experience...
            </Text>
          </Animated.View>
        </View>

        {/* Multimodal Journey Optimization Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Multimodal Journey Optimization
          </Text>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    flex: 1,
    backgroundColor: "#0B3E9E",
  },
  safeArea: {
    flex: 1,
  },
  // Ambient glow orbs
  ambientTopRightOrb: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(59, 130, 246, 0.25)",
  },
  ambientBottomLeftOrb: {
    position: "absolute",
    bottom: -100,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(14, 165, 233, 0.35)",
  },
  ambientBottomRightOrb: {
    position: "absolute",
    bottom: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(37, 99, 235, 0.25)",
  },
  // Radar & abstract route trajectory
  radarContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  radarRing: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 1,
  },
  radarRingInner: {
    width: 260,
    height: 260,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  radarRingMid: {
    width: 390,
    height: 390,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  radarRingOuter: {
    width: 530,
    height: 530,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  radarRingExtra: {
    width: 680,
    height: 680,
    borderColor: "rgba(255, 255, 255, 0.035)",
  },
  dashedRouteLine: {
    position: "absolute",
    width: SCREEN_HEIGHT * 1.4,
    height: 0,
    borderTopWidth: 1.5,
    borderTopColor: "rgba(255, 255, 255, 0.18)",
    borderStyle: "dashed",
    transform: [{ rotate: "-38deg" }],
  },
  // Brand Center Container
  brandCenterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    width: "100%",
  },
  // Logo presentation
  logoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  glowBackdrop: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(96, 165, 250, 0.22)",
  },
  logoImage: {
    width: Math.min(SCREEN_WIDTH * 0.58, 220),
    maxWidth: 220,
    height: Math.min(SCREEN_WIDTH * 0.58, 220),
    maxHeight: 220,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 6,
  },
  taglineText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.3,
    textAlign: "center",
    marginTop: 14,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 4,
  },
  subtitleText: {
    color: "rgba(224, 242, 254, 0.95)",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.2,
    textAlign: "center",
    maxWidth: 280,
  },
  footerContainer: {
    paddingBottom: Platform.OS === "ios" ? 14 : 20,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.1,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
