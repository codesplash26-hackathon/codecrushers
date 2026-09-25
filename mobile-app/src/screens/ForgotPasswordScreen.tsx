import React, { useState, useEffect, useRef } from "react";
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

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ForgotPassword"
>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

type Step = "email" | "otp" | "reset" | "success";

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(45);

  const otpInputRefs = useRef<Array<TextInput | null>>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "otp" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timerSeconds]);

  const handleBack = () => {
    if (step === "email" || step === "success") {
      navigation.goBack();
    } else if (step === "otp") {
      setStep("email");
    } else if (step === "reset") {
      setStep("otp");
    }
  };

  // Step 1: Send OTP to email
  const handleSendEmail = async () => {
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.requestPasswordResetOtp(email);
      if (res.success) {
        setTimerSeconds(45);
        setStep("otp");
        Alert.alert("Code Sent", res.message);
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP box input & verification
  const handleOtpChange = (value: string, index: number) => {
    const updated = [...otpCode];
    updated[index] = value;
    setOtpCode(updated);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullCode = otpCode.join("");
    if (fullCode.length < 6) {
      Alert.alert("Incomplete Code", "Please enter the complete 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.verifyOtp(fullCode);
      if (res.success) {
        setStep("reset");
      } else {
        Alert.alert("Verification Failed", res.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timerSeconds > 0) return;
    try {
      setLoading(true);
      const res = await authService.requestPasswordResetOtp(email);
      setTimerSeconds(45);
      Alert.alert("Code Resent", res.message);
    } catch (err: any) {
      Alert.alert("Error", "Could not resend code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Missing Fields", "Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match. Please re-enter.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword(newPassword);
      if (res.success) {
        setStep("success");
      } else {
        Alert.alert("Error", res.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to reset password.");
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
        {/* Top Header with Back Navigation and Theme Toggle in Top Right Corner */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
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
          {/* STEP 1: ENTER EMAIL */}
          {step === "email" && (
            <View>
              <Text
                style={[
                  styles.title,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Forgot password?
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Enter your registered email address and we'll send a 6-digit
                verification code to reset your password.
              </Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text
                    style={[
                      styles.label,
                      isDarkMode && { color: colors.textSecondary },
                    ]}
                  >
                    EMAIL ADDRESS
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
                    placeholder="your@email.com"
                    placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSendEmail}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Send Code</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Remember your password?{" "}
                  <Text
                    style={styles.footerLink}
                    onPress={() => navigation.navigate("Login")}
                  >
                    Log In
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === "otp" && (
            <View>
              <Text
                style={[
                  styles.title,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Enter verification code
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                We've sent a 6-digit verification code to{"\n"}
                <Text style={styles.highlightText}>{email}</Text>
              </Text>

              <View style={styles.form}>
                <Text
                  style={[
                    styles.label,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                >
                  6-DIGIT CODE
                </Text>
                {/* 6 Individual Code Digit Cells */}
                <View style={styles.otpContainer}>
                  {otpCode.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      style={[
                        styles.otpBox,
                        isDarkMode && {
                          backgroundColor: colors.inputBg,
                          borderColor: colors.inputBorder,
                          color: colors.textPrimary,
                        },
                        digit.length > 0 && styles.otpBoxFilled,
                      ]}
                      value={digit}
                      onChangeText={(val) => handleOtpChange(val, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>

                {/* Resend Code Section */}
                <View style={styles.resendRow}>
                  {timerSeconds > 0 ? (
                    <Text
                      style={[
                        styles.resendTimerText,
                        isDarkMode && { color: colors.textSecondary },
                      ]}
                    >
                      Resend code in{" "}
                      <Text style={styles.boldTimerText}>
                        0:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                      </Text>
                    </Text>
                  ) : (
                    <TouchableOpacity
                      onPress={handleResendOtp}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.resendActionText}>
                        Didn't receive code? Resend
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Verify Code</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: CREATE NEW PASSWORD */}
          {step === "reset" && (
            <View>
              <Text
                style={[
                  styles.title,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Create new password
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Your new password must be at least 6 characters and different
                from previously used passwords.
              </Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text
                    style={[
                      styles.label,
                      isDarkMode && { color: colors.textSecondary },
                    ]}
                  >
                    NEW PASSWORD
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
                    placeholder="••••••••"
                    placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text
                    style={[
                      styles.label,
                      isDarkMode && { color: colors.textSecondary },
                    ]}
                  >
                    CONFIRM PASSWORD
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
                    placeholder="••••••••"
                    placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.88}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      Reset Password
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === "success" && (
            <View style={styles.successContainer}>
              <View style={styles.successBadge}>
                <Text style={styles.successCheck}>✓</Text>
              </View>

              <Text
                style={[
                  styles.successTitle,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Password Reset Complete!
              </Text>
              <Text
                style={[
                  styles.successSubtitle,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Your password has been changed successfully. You can now log in
                with your new credentials.
              </Text>

              <TouchableOpacity
                style={[styles.primaryButton, { width: "100%", marginTop: 32 }]}
                onPress={() => navigation.replace("Login")}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryButtonText}>Back to Log In</Text>
              </TouchableOpacity>
            </View>
          )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 26,
  },
  highlightText: {
    color: "#2563EB",
    fontWeight: "600",
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  otpBox: {
    width: 48,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  otpBoxFilled: {
    borderColor: "#1D64EC",
    backgroundColor: "#F8FAFC",
  },
  resendRow: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },
  resendTimerText: {
    fontSize: 13,
    color: "#64748B",
  },
  boldTimerText: {
    fontWeight: "700",
    color: "#1D64EC",
  },
  resendActionText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#2563EB",
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
  successContainer: {
    alignItems: "center",
    paddingTop: 36,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#10B981",
  },
  successCheck: {
    fontSize: 40,
    color: "#059669",
    fontWeight: "900",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
});
