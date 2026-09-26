import React from "react";
import { View, StyleSheet, useWindowDimensions, Platform } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  style?: any;
}

export default function ResponsiveContainer({
  children,
  maxWidth = 540,
  style,
}: ResponsiveContainerProps) {
  const { width } = useWindowDimensions();
  const { isDarkMode, colors } = useTheme();

  const isWide = width > maxWidth;

  return (
    <View
      style={[
        styles.outerWrapper,
        { backgroundColor: isWide ? (isDarkMode ? "#0B132B" : "#F1F5F9") : colors.screenBg },
      ]}
    >
      <View
        style={[
          styles.innerContainer,
          { backgroundColor: colors.screenBg },
          isWide && [
            styles.wideScreenFrame,
            {
              maxWidth,
              borderColor: isDarkMode ? "#1E293B" : "#CBD5E1",
            },
          ],
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    flex: 1,
    width: "100%",
  },
  wideScreenFrame: {
    maxHeight: "100%",
    height: "100%",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)",
      },
      default: {
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
    }),
  },
});
