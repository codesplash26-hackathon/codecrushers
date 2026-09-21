import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
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

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation?: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login(username, password);
      if (res.success) {
        if (navigation) {
          navigation.replace("Home");
        } else {
          Alert.alert("Success", "Logged in successfully!");
        }
      } else {
        Alert.alert("Login Failed", res.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const res = await authService.login("google_user", "google_oauth_pass");
      if (navigation) {
        navigation.replace("Home");
      }
    } catch (err: any) {
      Alert.alert("Error", "Google sign-in could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Logo Header */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Plan smarter. Travel better.</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* USERNAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={styles.input}
                placeholder="user"
                placeholderTextColor="#94A3B8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeaderRow}>
                <Text style={styles.label}>PASSWORD</Text>
                <TouchableOpacity
                  onPress={() => navigation?.navigate("ForgotPassword")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
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

            {/* Log In Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Continue with Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              activeOpacity={0.85}
            >
              <View style={styles.googleIconContainer}>
                {/* Google multi-colored G badge representation */}
                <Text style={styles.googleLetter}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{" "}
              <Text
                style={styles.footerLink}
                onPress={() => navigation?.navigate("Register")}
              >
                Sign Up
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  logoImage: {
    width: 140,
    height: 110,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14.5,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 28,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  passwordHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#2563EB",
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
  primaryButton: {
    backgroundColor: "#1D64EC",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  googleLetter: {
    fontSize: 14,
    fontWeight: "900",
    color: "#EA4335",
  },
  googleButtonText: {
    fontSize: 14.5,
    fontWeight: "600",
    color: "#1E293B",
  },
  footer: {
    marginTop: 32,
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