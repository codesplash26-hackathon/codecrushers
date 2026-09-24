import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LIGHT_COLORS, DARK_COLORS, ThemeColors } from "../constants/theme";

const THEME_STORAGE_KEY = "@bestroute_theme_preference";

export type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  isDarkMode: false,
  colors: LIGHT_COLORS,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>("light");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === "dark" || savedTheme === "light") {
          setThemeState(savedTheme);
        } else if (systemColorScheme === "dark") {
          setThemeState("dark");
        }
      } catch (e) {
        // Fallback silently if storage read fails
        console.warn("Error loading theme preference:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Error saving theme preference:", e);
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeType = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const isDarkMode = theme === "dark";
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        colors,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
