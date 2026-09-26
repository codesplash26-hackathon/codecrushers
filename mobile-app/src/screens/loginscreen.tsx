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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import authService from "../services/authService";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

interface Props {
  navigation?: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [isGoogleModalVisible, setIsGoogleModalVisible] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string | null>(null);

  React.useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      document.title = "BestRoute | Login";
    }
  }, []);

  const googleAccounts = [
    { name: "Malith Perera", email: "malith.perera@gmail.com", avatar: "M" },
    { name: "CodeCrushers User", email: "user.codecrushers@gmail.com", avatar: "C" },
  ];

  const handleLogin = async () => {
    setErrorBanner(null);
    if (!username.trim() || !password.trim()) {
      const msg = "Please enter your username/email and password.";
      setErrorBanner(msg);
      Alert.alert("Missing Information", msg);
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login(username, password);
      if (res.success) {
        setErrorBanner(null);
        if (navigation) {
          navigation.replace("Home");
        } else {
          Alert.alert("Success", "Logged in successfully!");
        }
      } else {
        const errorMsg = res.message || "Invalid username/email or password. Please check your credentials and try again.";
        setErrorBanner(errorMsg);
        Alert.alert("Login Failed ⚠️", errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Invalid credentials or network failure. Please try again.";
      setErrorBanner(errorMsg);
      Alert.alert("Authentication Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGoogleModal = () => {
    setIsGoogleModalVisible(true);
  };

  const handleSelectGoogleAccount = async (email: string, name: string) => {
    setSelectedGoogleAccount(email);
    try {
      setLoading(true);
      const res = await authService.login(email, "google_oauth_pass");
      setIsGoogleModalVisible(false);
      if (navigation) {
        navigation.replace("Home");
      }
    } catch (err: any) {
      Alert.alert("Error", "Google sign-in could not be completed.");
    } finally {
      setLoading(false);
      setSelectedGoogleAccount(null);
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Dark Mode Change Button Displayed in Top Right Corner */}
          <View style={styles.topRightBar}>
            <ThemeToggle variant="solid" size={38} />
          </View>

          {/* Brand Logo Header */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <Text
            style={[
              styles.title,
              isDarkMode && { color: colors.textPrimary },
            ]}
          >
            Welcome back
          </Text>
          <Text
            style={[
              styles.subtitle,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            Plan smarter. Travel better.
          </Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Invalid Credentials Notification Banner */}
            {errorBanner ? (
              <View
                style={[
                  styles.errorNotificationBanner,
                  isDarkMode && {
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    borderColor: "rgba(239, 68, 68, 0.4)",
                  },
                ]}
              >
                <Text style={styles.errorNotificationIcon}>⚠️</Text>
                <Text
                  style={[
                    styles.errorNotificationText,
                    isDarkMode && { color: "#FCA5A5" },
                  ]}
                >
                  {errorBanner}
                </Text>
              </View>
            ) : null}

            {/* USERNAME / EMAIL */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                USERNAME OR EMAIL
              </Text>
              <TextInput
                style={[
                  styles.input,
                  isDarkMode && {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Enter email or username"
                placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordHeaderRow}>
                <Text
                  style={[
                    styles.label,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  PASSWORD
                </Text>
                <TouchableOpacity
                  onPress={() => navigation?.navigate("ForgotPassword")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { flex: 1 },
                    isDarkMode && {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.textPrimary,
                    },
                  ]}
                  placeholder="Enter password"
                  placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIconBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.eyeIconText, isDarkMode && { color: colors.textSecondary }]}>
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </Text>
                </TouchableOpacity>
              </View>
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
              <View
                style={[
                  styles.dividerLine,
                  isDarkMode && { backgroundColor: colors.cardBorder },
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                or
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  isDarkMode && { backgroundColor: colors.cardBorder },
                ]}
              />
            </View>

            {/* Continue with Google */}
            <TouchableOpacity
              style={[
                styles.googleButton,
                isDarkMode && {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                },
              ]}
              onPress={handleOpenGoogleModal}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.googleIconContainer,
                  isDarkMode && {
                    backgroundColor: colors.subtleBg,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                {/* Google multi-colored G badge representation */}
                <Text style={styles.googleLetter}>G</Text>
              </View>
              <Text
                style={[
                  styles.googleButtonText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
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

      {/* Google Account Selection Modal */}
      <Modal
        visible={isGoogleModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsGoogleModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsGoogleModalVisible(false)}
        >
          <TouchableOpacity
            style={[
              styles.googleModalCard,
              isDarkMode && { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
            ]}
            activeOpacity={1}
          >
            <View style={styles.googleModalHeader}>
              <Text style={styles.googleBadgeIcon}>G</Text>
              <Text style={[styles.googleModalTitle, isDarkMode && { color: colors.textPrimary }]}>
                Choose an account
              </Text>
              <Text style={[styles.googleModalSubtitle, isDarkMode && { color: colors.textSecondary }]}>
                to continue to BestRoute
              </Text>
            </View>

            {googleAccounts.map((acc, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.googleAccountRow,
                  isDarkMode && { borderColor: colors.cardBorder },
                ]}
                onPress={() => handleSelectGoogleAccount(acc.email, acc.name)}
                disabled={loading}
                activeOpacity={0.8}
              >
                <View style={styles.googleAvatarCircle}>
                  <Text style={styles.googleAvatarLetter}>{acc.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.googleAccountName, isDarkMode && { color: colors.textPrimary }]}>
                    {acc.name}
                  </Text>
                  <Text style={[styles.googleAccountEmail, isDarkMode && { color: colors.textSecondary }]}>
                    {acc.email}
                  </Text>
                </View>
                {loading && selectedGoogleAccount === acc.email ? (
                  <ActivityIndicator color="#1D64EC" size="small" />
                ) : (
                  <Text style={{ fontSize: 18, color: "#94A3B8" }}>›</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.googleCancelBtn, isDarkMode && { backgroundColor: colors.subtleBg }]}
              onPress={() => setIsGoogleModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.googleCancelText, isDarkMode && { color: colors.textPrimary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    paddingTop: 8,
    paddingBottom: 28,
    justifyContent: "center",
  },
  topRightBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 4,
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
  errorNotificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  errorNotificationIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  errorNotificationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#991B1B",
    lineHeight: 18,
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
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIconBtn: {
    position: "absolute",
    right: 12,
    padding: 8,
    zIndex: 10,
  },
  eyeIconText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  googleModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  googleModalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  googleBadgeIcon: {
    fontSize: 28,
    fontWeight: "900",
    color: "#EA4335",
    marginBottom: 6,
  },
  googleModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  googleModalSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  googleAccountRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 12,
  },
  googleAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1D64EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  googleAvatarLetter: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  googleAccountName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  googleAccountEmail: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 2,
  },
  googleCancelBtn: {
    marginTop: 18,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  googleCancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
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
  demoFillContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  demoChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  demoChipText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#1D4ED8",
  },
});