import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import api from "../services/api";
import authService, { AuthUser } from "../services/authService";

type DriverRegistrationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  any
>;

interface Props {
  navigation: DriverRegistrationScreenNavigationProp;
}

export default function DriverRegistrationScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();
  // Step 1: Personal Info, Step 2: Vehicle Info, Step 3: Application Status
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // User Profile
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<
    "Pending" | "Approved" | "Rejected" | null
  >(null);
  const [isCheckingLive, setIsCheckingLive] = useState(false);

  // Form State: Step 1 (Personal Info) - default blank for new applicant
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseUploaded, setLicenseUploaded] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // Form State: Step 2 (Vehicle Info)
  const [vehicleType, setVehicleType] = useState<"Taxi" | "Tuk-tuk">("Taxi");
  const [registration, setRegistration] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [vehicleDocsUploaded, setVehicleDocsUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check initial application status on mount
  useEffect(() => {
    const fetchCurrentStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        if (user?.name) setFullName(user.name);
        if (user?.driverDetails?.phone) setPhone(user.driverDetails.phone);
        if (user?.driverDetails?.vehicleNo) setRegistration(user.driverDetails.vehicleNo);
        if (user?.driverDetails?.vehicleModel) setModel(user.driverDetails.vehicleModel);
        if (user?.driverDetails?.vehicleType) {
          setVehicleType(user.driverDetails.vehicleType as any);
        }

        // Only query application if user is logged in
        if (user && (user.driverStatus === "pending" || user.driverStatus === "approved" || user.role === "driver")) {
          const res = await api.getMyDriverApplicationStatus({
            phone: user.driverDetails?.phone,
            email: user.email,
            userId: user.id,
          });

          if (
            res &&
            res.success &&
            res.data &&
            res.data.hasApplication &&
            (res.data._id || res.data.applicationId)
          ) {
            const app = (res.data as any)?.data || res.data;
            const rawStatus = app?.status || (res.data as any)?.driverStatus || "";
            const isApproved =
              rawStatus.toLowerCase() === "approved" ||
              (res.data as any)?.userRole === "driver" ||
              user?.role === "driver";
            const isPending = rawStatus.toLowerCase() === "pending";

            if (isApproved) {
              setApplicationStatus("Approved");
              setCurrentStep(3);
              await authService.updateUserSession({
                role: "driver",
                driverStatus: "approved",
                driverDetails: {
                  vehicleType: app?.vehicleType || vehicleType,
                  vehicleNo: app?.vehicleNo || registration,
                  vehicleModel: app?.vehicleModel || model,
                  phone: app?.phone || phone,
                  isOnline: true,
                },
              });
            } else if (isPending) {
              setApplicationStatus("Pending");
              setCurrentStep(3);
            }
          } else {
            // No real application found for user in DB -> stay on Step 1
            setCurrentStep(1);
            setApplicationStatus(null);
          }
        } else {
          // New user / not yet applied -> ALWAYS stay on Step 1
          setCurrentStep(1);
          setApplicationStatus(null);
        }
      } catch {
        // stay on Step 1
        setCurrentStep(1);
      }
    };

    fetchCurrentStatus();
  }, []);

  // Poll status while on Step 3 until approved or rejected
  useEffect(() => {
    if (currentStep !== 3 || applicationStatus === "Approved") return;

    let isMounted = true;
    const interval = setInterval(async () => {
      // 1. Check local storage sync (cross-tab in browser)
      try {
        if (Platform.OS === "web" && typeof localStorage !== "undefined") {
          const localSub = localStorage.getItem("bestroute_latest_driver_app");
          if (localSub) {
            const parsed = JSON.parse(localSub);
            if (parsed.status === "Approved") {
              if (isMounted) {
                setApplicationStatus("Approved");
                await authService.updateUserSession({
                  role: "driver",
                  driverStatus: "approved",
                  driverDetails: {
                    vehicleType,
                    vehicleNo: registration,
                    vehicleModel: model,
                    phone,
                    isOnline: true,
                  },
                });
                return;
              }
            }
          }
        }
      } catch {
        // ignore
      }

      // 2. Check backend API
      try {
        const res = await api.getMyDriverApplicationStatus({
          phone,
          email: currentUser?.email,
          userId: currentUser?.id,
        });
        if (isMounted && res && res.success && res.data) {
          const app = (res.data as any)?.data || res.data;
          const rawStatus = app?.status || (res.data as any)?.driverStatus || "";
          const isApproved =
            rawStatus.toLowerCase() === "approved" ||
            (res.data as any)?.userRole === "driver";

          if (isApproved) {
            setApplicationStatus("Approved");
            await authService.updateUserSession({
              role: "driver",
              driverStatus: "approved",
              driverDetails: {
                vehicleType: app?.vehicleType || vehicleType,
                vehicleNo: app?.vehicleNo || registration,
                vehicleModel: app?.vehicleModel || model,
                phone: app?.phone || phone,
                isOnline: true,
              },
            });
          } else if (rawStatus.toLowerCase() === "pending") {
            setApplicationStatus("Pending");
          } else if (rawStatus.toLowerCase() === "rejected") {
            setApplicationStatus("Rejected");
          }
        }
      } catch {
        // silent
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentStep, applicationStatus, phone, currentUser]);

  const handleManualRefresh = async () => {
    setIsCheckingLive(true);
    // Check localStorage
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        const localSub = localStorage.getItem("bestroute_latest_driver_app");
        if (localSub) {
          const parsed = JSON.parse(localSub);
          if (parsed.status === "Approved") {
            setApplicationStatus("Approved");
            await authService.updateUserSession({
              role: "driver",
              driverStatus: "approved",
              driverDetails: {
                vehicleType,
                vehicleNo: registration,
                vehicleModel: model,
                phone,
                isOnline: true,
              },
            });
            setIsCheckingLive(false);
            return;
          }
        }
      }
    } catch {}

    try {
      const res = await api.getMyDriverApplicationStatus({
        phone,
        email: currentUser?.email,
        userId: currentUser?.id,
      });
      if (res && res.success && res.data) {
        const app = (res.data as any)?.data || res.data;
        const rawStatus = app?.status || (res.data as any)?.driverStatus || "";
        const isApproved =
          rawStatus.toLowerCase() === "approved" ||
          (res.data as any)?.userRole === "driver";

        if (isApproved) {
          setApplicationStatus("Approved");
          await authService.updateUserSession({
            role: "driver",
            driverStatus: "approved",
            driverDetails: {
              vehicleType: app?.vehicleType || vehicleType,
              vehicleNo: app?.vehicleNo || registration,
              vehicleModel: app?.vehicleModel || model,
              phone: app?.phone || phone,
              isOnline: true,
            },
          });
        } else if (rawStatus.toLowerCase() === "pending") {
          setApplicationStatus("Pending");
        } else if (rawStatus.toLowerCase() === "rejected") {
          setApplicationStatus("Rejected");
        }
      }
    } finally {
      setIsCheckingLive(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!fullName.trim()) {
      Alert.alert("Missing Name", "Please enter your Full Name.");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Missing Phone", "Please enter your Phone Number.");
      return;
    }
    if (!registration.trim()) {
      Alert.alert(
        "Missing Vehicle Number",
        "Please enter your Vehicle Registration Number (e.g., WP CAB-1234)."
      );
      return;
    }

    setIsSubmitting(true);

    const newAppData = {
      _id: `dar_${Date.now()}`,
      applicationId: `DAR0${Math.floor(Math.random() * 5) + 5}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      nic: nic.trim() || "N/A",
      licenseNumber: licenseNumber.trim() || "N/A",
      vehicleType,
      vehicleNo: registration.trim(),
      vehicleModel: model.trim() || "Standard",
      color: color.trim() || "Silver",
      status: "Pending",
      submitted: new Date().toISOString().split("T")[0],
    };

    // Instant local storage sync for cross-tab web preview
    try {
      if (Platform.OS === "web" && typeof localStorage !== "undefined") {
        localStorage.setItem("bestroute_latest_driver_app", JSON.stringify(newAppData));
      }
    } catch {
      // ignore
    }

    try {
      const res = await api.submitDriverApplication({
        fullName: fullName.trim(),
        phone: phone.trim(),
        nic: nic.trim(),
        licenseNumber: licenseNumber.trim(),
        vehicleType,
        vehicleNo: registration.trim(),
        vehicleModel: model.trim() || "Standard",
        color: color.trim() || "Silver",
        email: currentUser?.email,
        userId: currentUser?.id,
      });

      if (res && res.success && res.data) {
        if (Platform.OS === "web" && typeof localStorage !== "undefined") {
          localStorage.setItem("bestroute_latest_driver_app", JSON.stringify(res.data));
        }
      }
    } catch (err: any) {
      console.warn("Driver application submit fallback:", err?.message);
    } finally {
      setApplicationStatus("Pending");
      await authService.updateUserSession({
        driverStatus: "pending",
        driverDetails: {
          vehicleType,
          vehicleNo: registration.trim(),
          vehicleModel: model.trim() || "Standard",
          phone: phone.trim(),
        },
      });
      setIsSubmitting(false);
      setCurrentStep(3);
    }
  };

  // STEP 3: APPLICATION STATUS SCREEN (Photos 2 & 3)
  if (currentStep === 3) {
    const isApproved = applicationStatus === "Approved";
    const isRejected = applicationStatus === "Rejected";

    return (
      <View
        style={[
          styles.statusScreenContainer,
          { backgroundColor: colors.screenBg },
        ]}
      >
        <StatusBar style={isDarkMode ? "light" : "dark"} />

        {/* Minimal Top Bar */}
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
            onPress={() => {
              if (isApproved) {
                navigation.goBack();
              } else {
                setCurrentStep(1);
              }
            }}
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
          {/* Status Icon Container */}
          <View style={styles.hourglassWrapper}>
            <View
              style={[
                styles.hourglassCard,
                isApproved
                  ? {
                      backgroundColor: isDarkMode
                        ? "rgba(16, 185, 129, 0.2)"
                        : "#DCFCE7",
                      borderColor: "#16A34A",
                    }
                  : isRejected
                  ? {
                      backgroundColor: isDarkMode
                        ? "rgba(239, 68, 68, 0.2)"
                        : "#FEE2E2",
                      borderColor: "#DC2626",
                    }
                  : isDarkMode && {
                      backgroundColor: "rgba(245, 158, 11, 0.18)",
                      borderColor: "rgba(245, 158, 11, 0.35)",
                      borderWidth: 1,
                    },
              ]}
            >
              <Text style={styles.hourglassEmoji}>
                {isApproved ? "✅" : isRejected ? "❌" : "⏳"}
              </Text>
            </View>
          </View>

          {/* Heading & Notice */}
          <Text
            style={[
              styles.pendingTitle,
              isApproved
                ? { color: "#16A34A" }
                : isRejected
                ? { color: "#DC2626" }
                : isDarkMode && { color: "#FBBF24" },
            ]}
          >
            {isApproved
              ? "Application Approved!"
              : isRejected
              ? "Application Rejected"
              : "Application Pending"}
          </Text>
          <Text
            style={[
              styles.pendingSubtitle,
              isDarkMode && { color: colors.textSecondary },
            ]}
          >
            {isApproved
              ? "Congratulations! You are officially verified as a BestRoute driver partner. You can now accept passenger ride requests."
              : isRejected
              ? "Your driver application was not approved. Please review your documents or contact admin."
              : "Your driver application is waiting for admin review.\nThis usually takes 1–2 business days."}
          </Text>

          {/* Real-time Status Sync Banner */}
          {!isApproved && !isRejected && (
            <TouchableOpacity
              style={[
                styles.liveSyncBanner,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(37, 99, 235, 0.15)"
                    : "#EFF6FF",
                  borderColor: isDarkMode
                    ? "rgba(37, 99, 235, 0.3)"
                    : "#BFDBFE",
                },
              ]}
              onPress={handleManualRefresh}
              activeOpacity={0.7}
            >
              {isCheckingLive ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <Text style={styles.livePulseDot}>🔵</Text>
              )}
              <Text
                style={[
                  styles.liveSyncText,
                  { color: isDarkMode ? "#93C5FD" : "#1D4ED8" },
                ]}
              >
                Checking for live admin approval... Tap to refresh
              </Text>
            </TouchableOpacity>
          )}

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
                style={
                  isApproved
                    ? styles.greenCheckCircle
                    : [
                        styles.grayEmptyCircle,
                        isDarkMode && {
                          borderColor: colors.cardBorder,
                          backgroundColor: colors.cardSecondaryBg,
                        },
                      ]
                }
              >
                {isApproved && <Text style={styles.greenCheckText}>✓</Text>}
              </View>
              <Text
                style={
                  isApproved
                    ? [
                        styles.progressItemTextActive,
                        isDarkMode && { color: colors.textPrimary },
                      ]
                    : [
                        styles.progressItemTextInactive,
                        isDarkMode && { color: colors.textMuted },
                      ]
                }
              >
                Background check
              </Text>
            </View>

            {/* Step 4: Admin approval */}
            <View style={styles.progressItemRow}>
              <View
                style={
                  isApproved
                    ? styles.greenCheckCircle
                    : [
                        styles.grayEmptyCircle,
                        isDarkMode && {
                          borderColor: colors.cardBorder,
                          backgroundColor: colors.cardSecondaryBg,
                        },
                      ]
                }
              >
                {isApproved && <Text style={styles.greenCheckText}>✓</Text>}
              </View>
              <Text
                style={
                  isApproved
                    ? [
                        styles.progressItemTextActive,
                        isDarkMode && { color: colors.textPrimary },
                      ]
                    : [
                        styles.progressItemTextInactive,
                        isDarkMode && { color: colors.textMuted },
                      ]
                }
              >
                Admin approval
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions Bar */}
        <View
          style={[
            styles.statusBottomBar,
            isDarkMode && {
              backgroundColor: colors.headerBg,
              borderTopColor: colors.cardBorder,
            },
          ]}
        >
          {isApproved ? (
            /* Open Driver Console Button */
            <TouchableOpacity
              style={styles.openDriverConsoleBtn}
              onPress={() => navigation.navigate("DriverDashboard")}
              activeOpacity={0.85}
            >
              <Text style={styles.openDriverConsoleBtnText}>
                Open Driver Console 🚖
              </Text>
            </TouchableOpacity>
          ) : (
            /* Edit / Fill Form Button */
            <TouchableOpacity
              style={[
                styles.editFormBtn,
                isDarkMode && {
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  borderColor: "#3B82F6",
                },
              ]}
              onPress={() => setCurrentStep(1)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.editFormBtnText,
                  isDarkMode && { color: "#60A5FA" },
                ]}
              >
                ✎ {isRejected ? "Re-submit Application ➔" : "Edit / Change Application Details"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.backPassengerBtn,
              isDarkMode && {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
            onPress={() => navigation.navigate("Home")}
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
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[
                  styles.sectionHeading,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                PERSONAL INFORMATION
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setFullName("Kasun Perera");
                  setPhone("+94 77 123 4567");
                  setNic("982345678V");
                  setLicenseNumber("B 1234567");
                  setLicenseUploaded(true);
                  setPhotoUploaded(true);
                  setRegistration("WP CAB-1234");
                  setModel("Toyota Prius");
                  setColor("Silver");
                  setVehicleDocsUploaded(true);
                }}
                style={styles.sampleDataBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.sampleDataBtnText}>⚡ Fill Demo</Text>
              </TouchableOpacity>
            </View>

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
                placeholder="e.g. Kasun Perera"
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
                placeholder="e.g. +94 77 123 4567"
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
                placeholder="e.g. 982345678V"
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
                placeholder="e.g. B 1234567"
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
                  ? "Driving_License_Verified.pdf"
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
              onPress={() => {
                if (!fullName.trim() || !phone.trim()) {
                  Alert.alert(
                    "Required Information",
                    "Please enter your Full Name and Phone Number to continue."
                  );
                  return;
                }
                setCurrentStep(2);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>Next: Vehicle Info ➔</Text>
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
                placeholder="e.g. WP CAB-1234"
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
                placeholder="e.g. Toyota Prius or Bajaj RE"
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
                placeholder="e.g. Silver, White, Red"
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
    gap: 10,
  },
  openDriverConsoleBtn: {
    width: "100%",
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    ...Platform.select({
      web: { boxShadow: "0 4px 14px rgba(22, 163, 74, 0.35)" },
      default: { elevation: 3 },
    }),
  },
  openDriverConsoleBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
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
  editFormBtn: {
    width: "100%",
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#3B82F6",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  editFormBtnText: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sampleDataBtn: {
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sampleDataBtnText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "700",
  },
  liveSyncBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 8,
  },
  livePulseDot: {
    fontSize: 10,
  },
  liveSyncText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
