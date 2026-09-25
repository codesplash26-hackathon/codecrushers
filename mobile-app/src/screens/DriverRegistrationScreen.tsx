import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import api, { apiRequest } from "../services/api";

type DriverRegistrationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DriverRegistration"
>;

interface Props {
  navigation: DriverRegistrationScreenNavigationProp;
}

export default function DriverRegistrationScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();
  // Step 1: Personal Info, Step 2: Vehicle Info, Step 3: Application Status Pending
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State: Step 1 (Personal Info)
  const [fullName, setFullName] = useState("Kasun Perera");
  const [phone, setPhone] = useState("+94 77 123 4567");
  const [nic, setNic] = useState("982345678V");
  const [licenseNumber, setLicenseNumber] = useState("B 1234567");
  const [licenseUploaded, setLicenseUploaded] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // Form State: Step 2 (Vehicle Info)
  const [vehicleType, setVehicleType] = useState<"Taxi" | "Tuk-tuk">("Taxi");
  const [registration, setRegistration] = useState("WP CAB-1234");
  const [model, setModel] = useState("Toyota Prius");
  const [color, setColor] = useState("Silver");
  const [vehicleDocsUploaded, setVehicleDocsUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest("/services", {
        method: "POST",
        body: {
          name: fullName,
          phone,
          nic,
          licenseNumber,
          type: vehicleType === "Tuk-tuk" ? "tuk" : "taxi",
          plateNumber: registration,
          vehicleModel: model,
          color,
          status: "pending",
        },
      });
    } catch {
      // Proceed to status screen regardless
    } finally {
      setIsSubmitting(false);
      setCurrentStep(3);
    }
  };

  // STEP 3: APPLICATION STATUS SCREEN
  if (currentStep === 3) {
    return (
      <View style={[styles.statusScreenContainer, { backgroundColor: colors.screenBg }]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />

        {/* Minimal White Top Bar */}
        <View
          style={[
            styles.statusTopBar,
            isDarkMode && {
              backgroundColor: colors.headerBg,
              borderBottomColor: colors.cardBorder,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.statusBackButton,
              isDarkMode && { backgroundColor: colors.cardSecondaryBg },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.statusBackArrow,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              ‹
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.statusTopBarTitle,
              isDarkMode && { color: colors.textPrimary },
            ]}
          >
            Application Status
          </Text>
          {/* Dark Mode Change Button Displayed in Top Right Corner */}
          <ThemeToggle variant="solid" size={36} />
        </View>

        <ScrollView
          style={[
            styles.statusScrollArea,
            isDarkMode && { backgroundColor: colors.screenBg },
          ]}
          contentContainerStyle={styles.statusContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Hourglass Icon Container */}
          <View style={styles.hourglassWrapper}>
            <View
              style={[
                styles.hourglassCard,
                isDarkMode && {
                  backgroundColor: "rgba(245, 158, 11, 0.18)",
                  borderColor: "rgba(245, 158, 11, 0.35)",
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={styles.hourglassEmoji}>⏳</Text>
            </View>
          </View>

          {/* Heading & Notice */}
          <Text
            style={[
              styles.pendingTitle,
              isDarkMode && { color: "#FBBF24" },
            ]}
          >
            Application Pending
          </Text>
          <Text
            style={[
              styles.pendingSubtitle,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            Your driver application is waiting for admin review.{"\n"}
            This usually takes 1–2 business days.
          </Text>

          {/* Application Progress Card */}
          <View
            style={[
              styles.progressCard,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.progressCardHeading,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              APPLICATION PROGRESS
            </Text>

            {/* Step 1: Application submitted */}
            <View style={styles.progressItemRow}>
              <View style={styles.greenCheckCircle}>
                <Text style={styles.greenCheckText}>✓</Text>
              </View>
              <Text
                style={[
                  styles.progressItemTextActive,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Application submitted
              </Text>
            </View>

            {/* Step 2: Document review */}
            <View style={styles.progressItemRow}>
              <View style={styles.greenCheckCircle}>
                <Text style={styles.greenCheckText}>✓</Text>
              </View>
              <Text
                style={[
                  styles.progressItemTextActive,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Document review
              </Text>
            </View>

            {/* Step 3: Background check */}
            <View style={styles.progressItemRow}>
              <View
                style={[
                  styles.grayEmptyCircle,
                  isDarkMode && {
                    borderColor: colors.cardBorder,
                    backgroundColor: colors.cardSecondaryBg,
                  },
                ]}
              />
              <Text
                style={[
                  styles.progressItemTextInactive,
                  isDarkMode && { color: colors.textMuted },
                ]}
              >
                Background check
              </Text>
            </View>

            {/* Step 4: Admin approval */}
            <View style={styles.progressItemRow}>
              <View
                style={[
                  styles.grayEmptyCircle,
                  isDarkMode && {
                    borderColor: colors.cardBorder,
                    backgroundColor: colors.cardSecondaryBg,
                  },
                ]}
              />
              <Text
                style={[
                  styles.progressItemTextInactive,
                  isDarkMode && { color: colors.textMuted },
                ]}
              >
                Admin approval
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Back Button */}
        <View
          style={[
            styles.statusBottomBar,
            isDarkMode && {
              backgroundColor: colors.headerBg,
              borderTopColor: colors.cardBorder,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.backPassengerBtn,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.backPassengerBtnText,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              Back to Passenger Mode
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // STEP 1 & 2: REGISTRATION FORMS
  return (
    <View style={[styles.screen, { backgroundColor: colors.screenBg }]}>
      <StatusBar style="light" />

      {/* TOP BLUE HEADER */}
      <View style={[styles.header, isDarkMode && { backgroundColor: "#071630" }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={[
              styles.headerBackButton,
              isDarkMode && { backgroundColor: "rgba(255, 255, 255, 0.15)" },
            ]}
            onPress={() => {
              if (currentStep === 2) {
                setCurrentStep(1);
              } else {
                navigation.goBack();
              }
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.headerBackIcon,
                isDarkMode && { color: "#FFFFFF" },
              ]}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <Text style={styles.stepSubtitle}>
              {currentStep === 1 ? "Step 1 of 2" : "Step 2 of 2"}
            </Text>
            <Text style={styles.stepTitle}>Driver Registration</Text>
          </View>

          {/* Dark Mode Change Button Displayed in Top Right Corner */}
          <ThemeToggle variant="glass" size={38} />
        </View>

        {/* Progress Bar Line */}
        <View style={styles.headerProgressTrack}>
          <View
            style={[
              styles.headerProgressBar,
              { width: currentStep === 1 ? "50%" : "100%" },
            ]}
          />
        </View>
      </View>

      {/* BODY CONTENT FORM */}
      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 ? (
          /* STEP 1: PERSONAL INFORMATION */
          <View>
            <Text
              style={[
                styles.sectionHeading,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              PERSONAL INFORMATION
            </Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                FULL NAME
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isDarkMode && {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Kasun Perera"
                placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                PHONE NUMBER
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isDarkMode && {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                value={phone}
                onChangeText={setPhone}
                placeholder="+94 77 123 4567"
                placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                keyboardType="phone-pad"
              />
            </View>

            {/* NIC / National ID */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                NIC / NATIONAL ID
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isDarkMode && {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                value={nic}
                onChangeText={setNic}
                placeholder="982345678V"
                placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                autoCapitalize="characters"
              />
            </View>

            {/* Driving License Number */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                DRIVING LICENSE NUMBER
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isDarkMode && {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                placeholder="B 1234567"
                placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                autoCapitalize="characters"
              />
            </View>

            {/* Documents Section */}
            <Text
              style={[
                styles.sectionHeading,
                { marginTop: 14 },
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              DOCUMENTS
            </Text>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                isDarkMode && !licenseUploaded && {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                },
                licenseUploaded &&
                  (isDarkMode
                    ? {
                        backgroundColor: "rgba(22, 163, 74, 0.18)",
                        borderColor: "rgba(22, 163, 74, 0.35)",
                      }
                    : styles.uploadButtonSuccess),
              ]}
              onPress={() => setLicenseUploaded(!licenseUploaded)}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadIcon}>
                {licenseUploaded ? "✓" : "📎"}
              </Text>
              <Text
                style={[
                  styles.uploadText,
                  isDarkMode &&
                    !licenseUploaded && { color: colors.textPrimary },
                  licenseUploaded && styles.uploadTextSuccess,
                ]}
              >
                {licenseUploaded
                  ? "Driving_License_Kasun.pdf"
                  : "Upload Driving License"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                isDarkMode && !photoUploaded && {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                },
                photoUploaded &&
                  (isDarkMode
                    ? {
                        backgroundColor: "rgba(22, 163, 74, 0.18)",
                        borderColor: "rgba(22, 163, 74, 0.35)",
                      }
                    : styles.uploadButtonSuccess),
              ]}
              onPress={() => setPhotoUploaded(!photoUploaded)}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadIcon}>
                {photoUploaded ? "✓" : "📎"}
              </Text>
              <Text
                style={[
                  styles.uploadText,
                  isDarkMode &&
                    !photoUploaded && { color: colors.textPrimary },
                  photoUploaded && styles.uploadTextSuccess,
                ]}
              >
                {photoUploaded
                  ? "Profile_Photo_Verified.jpg"
                  : "Upload Profile Photo"}
              </Text>
            </TouchableOpacity>

            {/* Next: Vehicle Info Button */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setCurrentStep(2)}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>Next: Vehicle Info</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* STEP 2: VEHICLE INFORMATION */
          <View>
            <Text
              style={[
                styles.sectionHeading,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              VEHICLE INFORMATION
            </Text>

            {/* Vehicle Type Selection */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                VEHICLE TYPE
              </Text>
              <View style={styles.vehicleTypeRow}>
                {/* Taxi Option */}
                <TouchableOpacity
                  style={[
                    styles.vehicleTypeOption,
                    isDarkMode && {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                    },
                    vehicleType === "Taxi" &&
                      (isDarkMode
                        ? {
                            borderColor: "#3B82F6",
                            borderWidth: 1.5,
                            backgroundColor: "rgba(37, 99, 235, 0.25)",
                          }
                        : styles.vehicleTypeOptionActive),
                  ]}
                  onPress={() => setVehicleType("Taxi")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.vehicleTypeOptionText,
                      isDarkMode && { color: colors.textPrimary },
                      vehicleType === "Taxi" &&
                        isDarkMode && { color: "#60A5FA" },
                    ]}
                  >
                    🚕 Taxi
                  </Text>
                </TouchableOpacity>

                {/* Tuk-tuk Option */}
                <TouchableOpacity
                  style={[
                    styles.vehicleTypeOption,
                    isDarkMode && {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                    },
                    vehicleType === "Tuk-tuk" &&
                      (isDarkMode
                        ? {
                            borderColor: "#3B82F6",
                            borderWidth: 1.5,
                            backgroundColor: "rgba(37, 99, 235, 0.25)",
                          }
                        : styles.vehicleTypeOptionActive),
                  ]}
                  onPress={() => setVehicleType("Tuk-tuk")}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.vehicleTypeOptionText,
                      isDarkMode && { color: colors.textPrimary },
                      vehicleType === "Tuk-tuk" &&
                        isDarkMode && { color: "#60A5FA" },
                    ]}
                  >
                    🛺 Tuk-tuk
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Vehicle Registration */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                VEHICLE REGISTRATION
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isDarkMode && {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                value={registration}
                onChangeText={setRegistration}
                placeholder="WP CAB-1234"
                placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
                autoCapitalize="characters"
              />
            </View>

            {/* Vehicle Model */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                VEHICLE MODEL
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isDarkMode && {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                value={model}
                onChangeText={setModel}
                placeholder="Toyota Prius"
                placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
              />
            </View>

            {/* Vehicle Color */}
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.inputLabel,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                VEHICLE COLOR
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  isDarkMode && {
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.textPrimary,
                  },
                ]}
                value={color}
                onChangeText={setColor}
                placeholder="Silver"
                placeholderTextColor={isDarkMode ? "#64748B" : "#94A3B8"}
              />
            </View>

            {/* Upload Vehicle Documents */}
            <TouchableOpacity
              style={[
                styles.uploadButton,
                isDarkMode && !vehicleDocsUploaded && {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                },
                vehicleDocsUploaded &&
                  (isDarkMode
                    ? {
                        backgroundColor: "rgba(22, 163, 74, 0.18)",
                        borderColor: "rgba(22, 163, 74, 0.35)",
                      }
                    : styles.uploadButtonSuccess),
                { marginTop: 10, marginBottom: 24 },
              ]}
              onPress={() => setVehicleDocsUploaded(!vehicleDocsUploaded)}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadIcon}>
                {vehicleDocsUploaded ? "✓" : "📎"}
              </Text>
              <Text
                style={[
                  styles.uploadText,
                  isDarkMode &&
                    !vehicleDocsUploaded && { color: colors.textPrimary },
                  vehicleDocsUploaded && styles.uploadTextSuccess,
                ]}
              >
                {vehicleDocsUploaded
                  ? "Vehicle_Revenue_Insurance.pdf"
                  : "Upload Vehicle Documents"}
              </Text>
            </TouchableOpacity>

            {/* Bottom Actions Row: Back & Submit Application */}
            <View style={styles.step2ActionsRow}>
              <TouchableOpacity
                style={[
                  styles.step2BackBtn,
                  isDarkMode && {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  },
                ]}
                onPress={() => setCurrentStep(1)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.step2BackBtnText,
                    isDarkMode && { color: colors.textPrimary },
                  ]}
                >
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.step2SubmitBtn}
                onPress={handleSubmitApplication}
                activeOpacity={0.85}
              >
                <Text style={styles.step2SubmitBtnText}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* HEADER */
  header: {
    backgroundColor: "#1D4ED8",
    paddingTop: Platform.OS === "ios" ? 52 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerBackButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 2px 6px rgba(0,0,0,0.12)" },
      default: { elevation: 3 },
    }),
  },
  headerBackIcon: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "700",
    color: "#1E293B",
  },
  headerTitleCol: {
    flex: 1,
    marginLeft: 12,
  },
  stepSubtitle: {
    fontSize: 11.5,
    color: "#BFDBFE",
    fontWeight: "500",
    marginBottom: 1,
  },
  stepTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  headerProgressTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 2,
    overflow: "hidden",
  },
  headerProgressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },

  /* FORM BODY */
  formScroll: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#64748B",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },

  /* Vehicle Type Selection */
  vehicleTypeRow: {
    flexDirection: "row",
    gap: 12,
  },
  vehicleTypeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleTypeOptionActive: {
    borderColor: "#2563EB",
    borderWidth: 1.5,
    backgroundColor: "#EFF6FF",
  },
  vehicleTypeOptionText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
  },

  /* Upload Buttons */
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 13,
    marginBottom: 12,
  },
  uploadButtonSuccess: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  uploadIcon: {
    fontSize: 15,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  uploadTextSuccess: {
    color: "#16A34A",
    fontWeight: "700",
  },

  /* Step 1 Next Button */
  nextButton: {
    backgroundColor: "#1D64EC",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 14,
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(29, 100, 236, 0.3)" },
      default: { elevation: 3 },
    }),
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },

  /* Step 2 Bottom Actions Row */
  step2ActionsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  step2BackBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  step2BackBtnText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
  step2SubmitBtn: {
    flex: 1.6,
    backgroundColor: "#1D64EC",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(29, 100, 236, 0.3)" },
      default: { elevation: 3 },
    }),
  },
  step2SubmitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  /* ================= STEP 3: APPLICATION STATUS SCREEN ================= */
  statusScreenContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  statusTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 48 : 36,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  statusBackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  statusBackArrow: {
    fontSize: 22,
    fontWeight: "700",
    color: "#334155",
  },
  statusTopBarTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  statusScrollArea: {
    flex: 1,
  },
  statusContentContainer: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  hourglassWrapper: {
    marginBottom: 20,
  },
  hourglassCard: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: "#FEF9C3",
    borderWidth: 1,
    borderColor: "#FEF08A",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 4px 14px rgba(202, 138, 4, 0.15)" },
      default: { elevation: 2 },
    }),
  },
  hourglassEmoji: {
    fontSize: 36,
  },
  pendingTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D97706",
    marginBottom: 8,
  },
  pendingSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  progressCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 18,
    ...Platform.select({
      web: { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
      default: { elevation: 1 },
    }),
  },
  progressCardHeading: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  progressItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  greenCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#DCFCE7",
    borderWidth: 1.5,
    borderColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
  },
  greenCheckText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#16A34A",
  },
  grayEmptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
  },
  progressItemTextActive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  progressItemTextInactive: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
  },

  /* Bottom Passenger Mode Button */
  statusBottomBar: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    paddingTop: 10,
  },
  backPassengerBtn: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  backPassengerBtnText: {
    color: "#334155",
    fontSize: 13.5,
    fontWeight: "700",
  },
});
