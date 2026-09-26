import { useWindowDimensions, Platform } from "react-native";

export const MAX_MOBILE_WIDTH = 540;

/**
 * Custom hook to obtain responsive layout metrics
 */
export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = width < 360;
  const isPhone = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;

  const contentWidth = isPhone ? width : Math.min(width, MAX_MOBILE_WIDTH);
  const horizontalPadding = isSmallPhone ? 12 : isPhone ? 16 : 24;

  return {
    windowWidth: width,
    windowHeight: height,
    contentWidth,
    horizontalPadding,
    isSmallPhone,
    isPhone,
    isTablet,
    isDesktop,
    isWeb: Platform.OS === "web",
  };
}
