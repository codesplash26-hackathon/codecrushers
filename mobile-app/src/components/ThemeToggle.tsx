import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  style?: StyleProp<ViewStyle>;
  floating?: boolean;
  size?: number;
  variant?: "glass" | "solid" | "subtle";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  style,
  floating = false,
  size = 38,
  variant = "glass",
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
    };

    if (floating) {
      return [
        styles.floatingContainer,
        {
          top: Math.max(insets.top + 8, 16),
          right: 16,
          ...baseStyle,
        },
        isDarkMode ? styles.floatingDark : styles.floatingLight,
        style,
      ];
    }

    if (variant === "glass") {
      return [
        styles.glassContainer,
        baseStyle,
        isDarkMode ? styles.glassDark : styles.glassLight,
        style,
      ];
    }

    if (variant === "solid") {
      return [
        styles.solidContainer,
        baseStyle,
        isDarkMode ? styles.solidDark : styles.solidLight,
        style,
      ];
    }

    return [
      styles.subtleContainer,
      baseStyle,
      isDarkMode ? styles.subtleDark : styles.subtleLight,
      style,
    ];
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={toggleTheme}
      style={getContainerStyle()}
      accessibilityRole="button"
      accessibilityLabel={
        isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
      }
      accessibilityHint="Toggles between dark and light themes"
    >
      <View style={styles.iconWrapper}>
        <Text
          style={[
            styles.iconText,
            { fontSize: Math.round(size * 0.46) },
            isDarkMode ? styles.sunGlow : styles.moonGlow,
          ]}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)" },
      default: {
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
    }),
  },
  floatingLight: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
  },
  floatingDark: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  glassContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  glassLight: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  glassDark: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  solidContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  solidLight: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  solidDark: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  subtleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  subtleLight: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  subtleDark: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    textAlign: "center",
    includeFontPadding: false,
  },
  sunGlow: {
    ...Platform.select({
      web: { filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))" },
      default: {},
    }),
  },
  moonGlow: {
    ...Platform.select({
      web: { filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))" },
      default: {},
    }),
  },
});

export default ThemeToggle;
