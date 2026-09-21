import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  // Animation References
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const radarScale = useRef(new Animated.Value(1)).current;
  const radarOpacity = useRef(new Animated.Value(0.6)).current;

  // Staggered dots animation
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. Entrance animation for Logo and Content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== 'web' ? true : false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: Platform.OS !== 'web' ? true : false,
      }),
    ]).start();

    // 2. Subtle continuous pulsing for the concentric radar rings
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(radarScale, {
            toValue: 1.05,
            duration: 2600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web' ? true : false,
          }),
          Animated.timing(radarOpacity, {
            toValue: 0.9,
            duration: 2600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web' ? true : false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(radarScale, {
            toValue: 1.0,
            duration: 2600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web' ? true : false,
          }),
          Animated.timing(radarOpacity, {
            toValue: 0.6,
            duration: 2600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web' ? true : false,
          }),
        ]),
      ])
    ).start();

    // 3. Staggered Wave Loading Dots
    const createDotPulse = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web' ? true : false,
          }),
          Animated.timing(dot, {
            toValue: 0.35,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web' ? true : false,
          }),
          Animated.delay(800 - delay),
        ])
      );
    };

    const pulse1 = createDotPulse(dot1Anim, 0);
    const pulse2 = createDotPulse(dot2Anim, 200);
    const pulse3 = createDotPulse(dot3Anim, 400);

    pulse1.start();
    pulse2.start();
    pulse3.start();

    // Optional finish callback after a duration if requested
    let timer;
    if (onFinish) {
      timer = setTimeout(() => {
        onFinish();
      }, 3500);
    }

    return () => {
      pulse1.stop();
      pulse2.stop();
      pulse3.stop();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#07215E', '#0D4BB8', '#1669E4', '#0B3F9E', '#062668']}
        locations={[0, 0.28, 0.58, 0.82, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Ambient background soft glow waves & curves */}
      <View style={styles.ambientTopRight} />
      <View style={styles.ambientBottomLeft} />
      <View style={styles.ambientBottomRightCurve} />

      {/* Concentric Transit Radar Circles & Diagonal Guide Paths */}
      <Animated.View
        style={[
          styles.radarContainer,
          {
            opacity: radarOpacity,
            transform: [{ scale: radarScale }],
          },
        ]}
        pointerEvents="none"
      >
        <Svg height="640" width="640" viewBox="0 0 640 640">
          <Defs>
            <RadialGradient id="radarGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
              <Stop offset="50%" stopColor="#1E69DE" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#0B3C95" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Central Radial Ambient Glow */}
          <Circle cx="320" cy="320" r="300" fill="url(#radarGlow)" />

          {/* Concentric Circular Transit Lines */}
          <Circle
            cx="320"
            cy="320"
            r="105"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1.2"
            fill="none"
          />
          <Circle
            cx="320"
            cy="320"
            r="170"
            stroke="rgba(255, 255, 255, 0.10)"
            strokeWidth="1.2"
            fill="none"
          />
          <Circle
            cx="320"
            cy="320"
            r="245"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="1"
            fill="none"
          />
          <Circle
            cx="320"
            cy="320"
            r="315"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            fill="none"
          />

          {/* Primary Diagonal Transit Trajectory Dashed Line */}
          <Line
            x1="120"
            y1="580"
            x2="520"
            y2="60"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1.5"
            strokeDasharray="6, 6"
          />
          {/* Secondary parallel transit dashed line */}
          <Line
            x1="60"
            y1="500"
            x2="450"
            y2="30"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="1"
            strokeDasharray="4, 8"
          />
        </Svg>
      </Animated.View>

      {/* Main Content Area */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Card with Drop Glow */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Your journey. Optimized.</Text>

        {/* Animated 3-dot Loading Wave */}
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot1Anim,
                transform: [
                  {
                    scale: dot1Anim.interpolate({
                      inputRange: [0.35, 1],
                      outputRange: [0.8, 1.25],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot2Anim,
                transform: [
                  {
                    scale: dot2Anim.interpolate({
                      inputRange: [0.35, 1],
                      outputRange: [0.8, 1.25],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dot3Anim,
                transform: [
                  {
                    scale: dot3Anim.interpolate({
                      inputRange: [0.35, 1],
                      outputRange: [0.8, 1.25],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Status Message */}
        <Text style={styles.statusText}>Optimizing your travel experience...</Text>
      </Animated.View>

      {/* Bottom Subtitle / Branding */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Multimodal Journey Optimization</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07215E',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientTopRight: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
    ...(Platform.OS === 'web' ? { filter: 'blur(70px)' } : {}),
  },
  ambientBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -120,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(26, 115, 232, 0.28)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    ...(Platform.OS === 'web' ? { filter: 'blur(30px)' } : {}),
  },
  ambientBottomRightCurve: {
    position: 'absolute',
    bottom: -100,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0, 196, 140, 0.12)',
    ...(Platform.OS === 'web' ? { filter: 'blur(45px)' } : {}),
  },
  radarContainer: {
    position: 'absolute',
    width: 640,
    height: 640,
    top: '50%',
    left: '50%',
    marginTop: -320,
    marginLeft: -320,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 24,
    marginTop: -20,
  },
  logoWrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    // Soft glow behind the logo
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 25,
    elevation: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    height: 20,
  },
  dot: {
    width: 8.5,
    height: 8.5,
    borderRadius: 4.25,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 3,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  statusText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#A0C4FF',
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 38,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 10,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#76A9F5',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
