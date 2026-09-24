import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import authService from "../services/authService";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormFilled =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const isButtonActive = isFormFilled && agreedToTerms;

  const handleRegister = async () => {
    if (!isFormFilled) {
      Alert.alert("Missing Information", "Please fill in all the required fields.");
      return;
    }

    if (!agreedToTerms) {
      Alert.alert(
        "Terms Required",
        "Please accept the Terms of Service and Privacy Policy to create an account."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Your password must be at least 6 characters long."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await authService.register(fullName, email, password);
      if (res.success) {
        Alert.alert(
          "Account Created!",
          "Welcome to BestRoute! Your account has been created successfully.",
          [
            {
              text: "Continue to App",
              onPress: () => navigation.replace("Home"),
            },
          ]
        );
      } else {
        Alert.alert("Registration Failed", res.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.screenBg }]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* Top Header with Back Navigation and Theme Toggle */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text
              style={[
                styles.backText,
                isDarkMode && { color: colors.primaryLight },
              ]}
            >
              Back
            </Text>
          </TouchableOpacity>
          {/* Dark Mode Change Button Displayed in Top Right Corner */}
          <ThemeToggle variant="solid" size={38} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Titles */}
          <Text
            style={[
              styles.title,
              isDarkMode && { color: colors.textPrimary },
            ]}
          >
            Create your account
          </Text>
          <Text
            style={[
              styles.subtitle,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            Start planning smarter journeys
          </Text>

          {/* Form */}
          <View style={styles.form}>
            {/* FULL NAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Alex Fernando"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Terms of Service & Privacy Policy Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  agreedToTerms && styles.checkboxSelected,
                ]}
              >
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    Alert.alert(
                      "Terms of Service",
                      "BestRoute multimodal transit terms and routing conditions."
                    )
                  }
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    Alert.alert(
                      "Privacy Policy",
                      "We respect and protect your transit location and personal data."
                    )
                  }
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Create Account Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                isButtonActive
                  ? styles.primaryButtonActive
                  : styles.primaryButtonInactive,
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text
                style={styles.footerLink}
                onPress={() => navigation.navigate("Login")}
              >
                Log In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  backChevron: {
    fontSize: 26,
    color: "#3B82F6",
    marginRight: 4,
    marginTop: -2,
    fontWeight: "300",
  },
  backText: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "500",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    color: "#64748B",
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#0F172A",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 22,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: "#1D64EC",
    borderColor: "#1D64EC",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  linkText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonInactive: {
    backgroundColor: "#94A3B8", // Matches the muted slate-blue button in mockup
  },
  primaryButtonActive: {
    backgroundColor: "#1D64EC", // Vibrant primary blue
    ...Platform.select({
      ios: {
        shadowColor: "#1D64EC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0px 4px 14px rgba(29, 100, 236, 0.3)",
      },
    }),
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  footer: {
    marginTop: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 13.5,
    color: "#64748B",
  },
  footerLink: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
