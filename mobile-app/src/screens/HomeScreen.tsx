import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const transitModes = [
    { name: "Bus", icon: "🚌", desc: "Local & Intercity" },
    { name: "Train", icon: "🚆", desc: "Express & Commuter" },
    { name: "Taxi", icon: "🚕", desc: "On-demand Cabs" },
    { name: "Tuk-Tuk", icon: "🛺", desc: "Quick First/Last Mile" },
    { name: "Walk", icon: "🚶", desc: "Pedestrian Routes" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>BestRoute</Text>
        <Text style={styles.subtitle}>Multimodal Journey Planner</Text>
      </View>

      <View style={styles.searchCard}>
        <Text style={styles.cardTitle}>Where are you going?</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>Current Location</Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputPlaceholder}>Enter Destination</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Find Optimal Routes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Supported Transit Modes</Text>
      <View style={styles.grid}>
        {transitModes.map((mode) => (
          <View key={mode.name} style={styles.modeCard}>
            <Text style={styles.modeIcon}>{mode.icon}</Text>
            <Text style={styles.modeName}>{mode.name}</Text>
            <Text style={styles.modeDesc}>{mode.desc}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingTop: 48,
  },
  header: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  inputBox: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  inputText: {
    fontSize: 14,
    color: "#334155",
  },
  inputPlaceholder: {
    fontSize: 14,
    color: "#94A3B8",
  },
  searchButton: {
    backgroundColor: "#0284C7",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modeCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  modeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  modeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  modeDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  logoutButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 32,
  },
  logoutButtonText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
