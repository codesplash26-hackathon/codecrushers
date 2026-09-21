import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './src/screens/SplashScreen';

export default function App() {
  const { width, height } = useWindowDimensions();
  const isWebDesktop = Platform.OS === 'web' && width > 600;
  const [deviceFrame, setDeviceFrame] = useState(true);
  const [splashKey, setSplashKey] = useState(0);

  const restartSplash = () => {
    setSplashKey((prev) => prev + 1);
  };

  // If on web desktop and frame mode is active, render inside iPhone mockup shell matching the user reference
  if (isWebDesktop && deviceFrame) {
    return (
      <View style={styles.webBackdrop}>
        <StatusBar style="light" />

        {/* Floating Top Control Toolbar for testing & evaluation */}
        <View style={styles.webToolbar}>
          <View style={styles.brandingBadge}>
            <Text style={styles.brandingText}>BestRoute Mobile App Preview</Text>
          </View>
          <View style={styles.toolbarButtons}>
            <TouchableOpacity
              style={styles.toolbarBtn}
              onPress={restartSplash}
              activeOpacity={0.8}
            >
              <Text style={styles.toolbarBtnText}>↻ Replay Animation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toolbarBtn, styles.toolbarBtnSecondary]}
              onPress={() => setDeviceFrame(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.toolbarBtnText}>Toggle Full Screen</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* iPhone Smartphone Frame */}
        <View style={styles.phoneCasing}>
          {/* Metallic / Glass Outer Bezel */}
          <View style={styles.phoneScreenWrapper}>
            {/* Dynamic Island Pill Notch */}
            <View style={styles.dynamicIslandContainer}>
              <View style={styles.dynamicIsland}>
                <View style={styles.cameraLens} />
                <View style={styles.sensorDot} />
              </View>
            </View>

            {/* In-app Splash Screen */}
            <SplashScreen key={splashKey} />

            {/* iOS Home Indicator Bar */}
            <View style={styles.homeIndicatorContainer}>
              <View style={styles.homeIndicator} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Native iOS / Android or Fullscreen Web
  return (
    <View style={styles.rootContainer}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.safeArea}>
        <SplashScreen key={splashKey} />
      </SafeAreaView>

      {/* Quick toggle if in fullscreen web */}
      {Platform.OS === 'web' && (
        <TouchableOpacity
          style={styles.floatingWebToggle}
          onPress={() => setDeviceFrame(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingWebToggleText}>📱 Show Phone Mockup</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#07215E',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#07215E',
  },
  webBackdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0B1120',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  webToolbar: {
    position: 'absolute',
    top: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
    maxWidth: 900,
    zIndex: 50,
  },
  brandingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  brandingText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  toolbarButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  toolbarBtn: {
    backgroundColor: '#1664D9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#1664D9',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  toolbarBtnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0,
  },
  toolbarBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
  phoneCasing: {
    width: 390,
    height: 800,
    maxHeight: '90vh',
    borderRadius: 52,
    backgroundColor: '#1E293B',
    padding: 10,
    borderWidth: 3.5,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.65,
    shadowRadius: 35,
    elevation: 25,
    marginTop: 35,
  },
  phoneScreenWrapper: {
    flex: 1,
    borderRadius: 44,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#07215E',
  },
  dynamicIslandContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    alignItems: 'center',
    zIndex: 100,
  },
  dynamicIsland: {
    width: 116,
    height: 32,
    backgroundColor: '#000000',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
  cameraLens: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    marginRight: 6,
  },
  sensorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1E293B',
  },
  homeIndicatorContainer: {
    position: 'absolute',
    bottom: 8,
    width: '100%',
    alignItems: 'center',
    zIndex: 100,
  },
  homeIndicator: {
    width: 135,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  floatingWebToggle: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 999,
  },
  floatingWebToggleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
