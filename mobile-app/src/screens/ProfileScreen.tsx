import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
  Switch,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Profile"
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
  // Modal states
  const [isPreferencesVisible, setIsPreferencesVisible] = useState(false);
  const [isLanguageVisible, setIsLanguageVisible] = useState(false);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isSupportVisible, setIsSupportVisible] = useState(false);
  const [isPrivacyVisible, setIsPrivacyVisible] = useState(false);

  // Preference states
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Sinhala" | "Tamil">("English");
  const [preferBus, setPreferBus] = useState(true);
  const [preferTrain, setPreferTrain] = useState(true);
  const [preferTuk, setPreferTuk] = useState(true);
  const [avoidCrowded, setAvoidCrowded] = useState(false);
  const [ecoFriendly, setEcoFriendly] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your BestRoute account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            navigation.replace("Login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Profile Header Banner with Gradient */}
        <LinearGradient
          colors={["#0B3E9E", "#1763D5", "#1D64EC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={["top"]} style={styles.safeHeader}>
            <View style={styles.profileHeaderContent}>
              {/* Avatar container */}
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarEmoji}>👨‍💼</Text>
                </View>
                <View style={styles.avatarBadgeDot} />
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  Alex Perera
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  alex@example.com
                </Text>
                <View style={styles.memberTagRow}>
                  <View style={styles.activeGreenDot} />
                  <Text style={styles.memberTagText}>
                    24 journeys · Member since 2024
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Floating Quick Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statColumn}>
            <Text style={styles.statNumberBlue}>24</Text>
            <Text style={styles.statLabel}>Journeys</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statColumn}>
            <Text style={styles.statNumberGreen}>Rs.1.2k</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statColumn}>
            <Text style={styles.statNumberAmber}>4.8★</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Section 1: Travel & Activity */}
        <View style={styles.menuGroup}>
          {/* My Journeys */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Journeys")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🗺️</Text>
              <Text style={styles.menuTitle}>My Journeys</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.itemSeparator} />

          {/* Favourite Routes */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate("Journeys", { initialTab: "saved" })
            }
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>💖</Text>
              <Text style={styles.menuTitle}>Favourite Routes</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.itemSeparator} />

          {/* Travel Preferences */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsPreferencesVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuTitle}>Travel Preferences</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.itemSeparator} />

          {/* Become a Driver */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("DriverRegistration")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🚖</Text>
              <Text style={styles.menuTitle}>Become a Driver</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Section 2: Preferences & Security */}
        <View style={styles.menuGroup}>
          {/* Notifications */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Notifications")}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuTitle}>Notifications</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.itemSeparator} />

          {/* Language */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsLanguageVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🌐</Text>
              <Text style={styles.menuTitle}>Language</Text>
            </View>
            <View style={styles.menuRightInfo}>
              <Text style={styles.menuCurrentSetting}>{selectedLanguage}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.itemSeparator} />

          {/* Privacy */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsPrivacyVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🔒</Text>
              <Text style={styles.menuTitle}>Privacy</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Help & Log Out */}
        <View style={styles.menuGroup}>
          {/* Help & Support */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsSupportVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={styles.menuTitle}>Help & Support</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.itemSeparator} />

          {/* About BestRoute */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsAboutVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>ℹ️</Text>
              <Text style={styles.menuTitle}>About BestRoute</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.itemSeparator} />

          {/* Log Out */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>🚪</Text>
              <Text style={[styles.menuTitle, styles.logoutText]}>Log Out</Text>
            </View>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Version Stamp */}
        <View style={styles.footerStamp}>
          <Text style={styles.versionText}>BestRoute Mobile v1.0.4</Text>
          <Text style={styles.copyrightText}>
            Multimodal Transit Network of Sri Lanka
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, styles.navIconInactive]}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Home</Text>
        </TouchableOpacity>

        {/* Journeys Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Journeys")}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, styles.navIconInactive]}>🗺️</Text>
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Journeys</Text>
        </TouchableOpacity>

        {/* Alerts Tab */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Notifications")}
          activeOpacity={0.7}
        >
          <View style={styles.alertIconWrapper}>
            <Text style={[styles.navIcon, styles.navIconInactive]}>🔔</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </View>
          <Text style={[styles.navLabel, styles.navLabelInactive]}>Alerts</Text>
        </TouchableOpacity>

        {/* Profile Tab (Active) */}
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Text style={[styles.navIcon, styles.navIconActive]}>👤</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
      </View>

      {/* ================= TRAVEL PREFERENCES MODAL ================= */}
      <Modal
        visible={isPreferencesVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsPreferencesVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsPreferencesVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Travel Preferences</Text>
            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setIsPreferencesVisible(false)}
            >
              <Text style={styles.modalDoneText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.prefSectionTitle}>Preferred Transit Modes</Text>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Public & Highway Buses</Text>
                <Text style={styles.switchSub}>SLTB & Private Bus Network</Text>
              </View>
              <Switch
                value={preferBus}
                onValueChange={setPreferBus}
                trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                thumbColor={preferBus ? "#1D64EC" : "#94A3B8"}
              />
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Sri Lanka Railways Trains</Text>
                <Text style={styles.switchSub}>Main Line & Coastal Express</Text>
              </View>
              <Switch
                value={preferTrain}
                onValueChange={setPreferTrain}
                trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                thumbColor={preferTrain ? "#1D64EC" : "#94A3B8"}
              />
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Three-Wheelers (Tuks) & Taxis</Text>
                <Text style={styles.switchSub}>Last-mile connector rides</Text>
              </View>
              <Switch
                value={preferTuk}
                onValueChange={setPreferTuk}
                trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                thumbColor={preferTuk ? "#1D64EC" : "#94A3B8"}
              />
            </View>

            <Text style={[styles.prefSectionTitle, { marginTop: 24 }]}>
              Optimization Rules
            </Text>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Prioritize Eco-friendly Routes</Text>
                <Text style={styles.switchSub}>Minimizes carbon footprint</Text>
              </View>
              <Switch
                value={ecoFriendly}
                onValueChange={setEcoFriendly}
                trackColor={{ false: "#E2E8F0", true: "#BBF7D0" }}
                thumbColor={ecoFriendly ? "#16A34A" : "#94A3B8"}
              />
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Avoid Overcrowded Trains/Buses</Text>
                <Text style={styles.switchSub}>Suggests alternative departure times</Text>
              </View>
              <Switch
                value={avoidCrowded}
                onValueChange={setAvoidCrowded}
                trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                thumbColor={avoidCrowded ? "#1D64EC" : "#94A3B8"}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= LANGUAGE MODAL ================= */}
      <Modal
        visible={isLanguageVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsLanguageVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsLanguageVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Select Language</Text>
            <View style={{ width: 32 }} />
          </View>

          <View style={styles.languageModalBody}>
            {(["English", "Sinhala", "Tamil"] as const).map((lang) => {
              const nativeLabels = {
                English: "English (US)",
                Sinhala: "සිංහල (Sinhala)",
                Tamil: "தமிழ் (Tamil)",
              };
              const isSelected = selectedLanguage === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.langOptionCard,
                    isSelected && styles.langOptionCardActive,
                  ]}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setIsLanguageVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      isSelected && styles.langOptionTextActive,
                    ]}
                  >
                    {nativeLabels[lang]}
                  </Text>
                  {isSelected && <Text style={styles.langCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </Modal>

      {/* ================= BECOME A DRIVER MODAL ================= */}
      <Modal
        visible={isDriverModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsDriverModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsDriverModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Partner with BestRoute</Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.driverBannerBox}>
              <Text style={styles.driverBigEmoji}>🚖</Text>
              <Text style={styles.driverBannerTitle}>
                Drive with Sri Lanka's Smart Transit Network
              </Text>
              <Text style={styles.driverBannerSub}>
                Connect daily commuters with last-mile tuk and taxi rides at train
                stations and bus terminals.
              </Text>
            </View>

            <View style={styles.driverPerksBox}>
              <Text style={styles.driverPerkItem}>
                💰 Instant daily payouts with 0% commission introductory offer
              </Text>
              <Text style={styles.driverPerkItem}>
                📍 Guaranteed high-demand passenger pickups at railway hubs
              </Text>
              <Text style={styles.driverPerkItem}>
                🛡️ In-ride safety monitoring and GPS live tracking
              </Text>
            </View>

            <TouchableOpacity
              style={styles.driverRegisterBtn}
              onPress={() => {
                setIsDriverModalVisible(false);
                navigation.navigate("DriverRegistration");
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.driverRegisterBtnText}>
                Register as a Transit Partner
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= ABOUT MODAL ================= */}
      <Modal
        visible={isAboutVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsAboutVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsAboutVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>About BestRoute</Text>
            <View style={{ width: 32 }} />
          </View>

          <View style={styles.aboutContent}>
            <Text style={styles.aboutLogoEmoji}>🌐</Text>
            <Text style={styles.aboutAppName}>BestRoute</Text>
            <Text style={styles.aboutTagline}>Your journey. Optimized.</Text>
            <Text style={styles.aboutDesc}>
              BestRoute is Sri Lanka's pioneering multimodal transit optimization
              platform, unifying buses, trains, three-wheelers, and walking into
              seamless, eco-conscious commutes.
            </Text>
            <View style={styles.aboutVersionBadge}>
              <Text style={styles.aboutVersionText}>Version 1.0.4 (Build 42)</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ================= HELP & SUPPORT MODAL ================= */}
      <Modal
        visible={isSupportVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsSupportVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsSupportVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Help & Support</Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView style={styles.modalBody}>
            <TouchableOpacity
              style={styles.supportContactCard}
              onPress={() =>
                Alert.alert(
                  "Call Support",
                  "Calling 24/7 Transit Hotline at 1919 (Sri Lanka Government Information Center)..."
                )
              }
              activeOpacity={0.8}
            >
              <Text style={styles.supportIcon}>📞</Text>
              <View>
                <Text style={styles.supportTitle}>24/7 Transit Helpline</Text>
                <Text style={styles.supportSub}>Call 1919 for live assistance</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportContactCard}
              onPress={() =>
                Alert.alert(
                  "Email Support",
                  "An email draft to support@bestroute.lk has been prepared."
                )
              }
              activeOpacity={0.8}
            >
              <Text style={styles.supportIcon}>✉️</Text>
              <View>
                <Text style={styles.supportTitle}>Email Our Team</Text>
                <Text style={styles.supportSub}>support@bestroute.lk</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* ================= PRIVACY MODAL ================= */}
      <Modal
        visible={isPrivacyVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsPrivacyVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsPrivacyVisible(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Privacy & Security</Text>
            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setIsPrivacyVisible(false)}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.prefSectionTitle}>Permissions & Data</Text>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Accurate GPS Location</Text>
                <Text style={styles.switchSub}>
                  Enables live station navigation & nearby bus tracking
                </Text>
              </View>
              <Switch
                value={locationTracking}
                onValueChange={setLocationTracking}
                trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                thumbColor={locationTracking ? "#1D64EC" : "#94A3B8"}
              />
            </View>

            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Push Delay Alerts</Text>
                <Text style={styles.switchSub}>
                  Instant notification when scheduled train/bus is delayed
                </Text>
              </View>
              <Switch
                value={pushAlerts}
                onValueChange={setPushAlerts}
                trackColor={{ false: "#E2E8F0", true: "#BFDBFE" }}
                thumbColor={pushAlerts ? "#1D64EC" : "#94A3B8"}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingBottom: 48,
  },
  safeHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  profileHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarEmoji: {
    fontSize: 32,
  },
  avatarBadgeDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#DBEAFE",
    fontWeight: "500",
    marginBottom: 6,
  },
  memberTagRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  memberTagText: {
    fontSize: 12,
    color: "#BFDBFE",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  // Floating Stats Card
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: -28,
    marginBottom: 16,
    zIndex: 10,
    position: "relative",
    ...Platform.select({
      web: {
        boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
      },
      default: {
        elevation: 4,
        shadowColor: "#1E293B",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
  },
  statColumn: {
    alignItems: "center",
    flex: 1,
  },
  statNumberBlue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 3,
  },
  statNumberGreen: {
    fontSize: 22,
    fontWeight: "800",
    color: "#16A34A",
    marginBottom: 3,
  },
  statNumberAmber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D97706",
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#F1F5F9",
  },
  // Menu Groups
  menuGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#F8FAFC",
    marginLeft: 50,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 18,
    width: 28,
    textAlign: "center",
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  menuRightInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuCurrentSetting: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    marginRight: 6,
  },
  menuChevron: {
    fontSize: 18,
    color: "#CBD5E1",
    fontWeight: "700",
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "700",
  },
  footerStamp: {
    alignItems: "center",
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 2,
  },
  copyrightText: {
    fontSize: 11,
    color: "#CBD5E1",
  },
  // Bottom Navigation Bar
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 22 : 10,
    paddingHorizontal: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navIconActive: {
    color: "#1D64EC",
  },
  navIconInactive: {
    color: "#94A3B8",
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  navLabelActive: {
    color: "#1D64EC",
    fontWeight: "700",
  },
  navLabelInactive: {
    color: "#94A3B8",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -4,
    width: 26,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "#1D64EC",
  },
  alertIconWrapper: {
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  // Modals
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "700",
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalDoneBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalDoneText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
  },
  modalBody: {
    flex: 1,
    padding: 18,
  },
  prefSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  switchSub: {
    fontSize: 12,
    color: "#64748B",
  },
  // Language Modal
  languageModalBody: {
    padding: 18,
  },
  langOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  langOptionCardActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
  },
  langOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
  langOptionTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  langCheck: {
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "800",
  },
  // Driver Partner Box
  driverBannerBox: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  driverBigEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  driverBannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#92400E",
    textAlign: "center",
    marginBottom: 6,
  },
  driverBannerSub: {
    fontSize: 13,
    color: "#B45309",
    textAlign: "center",
    lineHeight: 18,
  },
  driverPerksBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginBottom: 24,
  },
  driverPerkItem: {
    fontSize: 13.5,
    color: "#334155",
    lineHeight: 22,
    marginBottom: 8,
    fontWeight: "500",
  },
  driverRegisterBtn: {
    backgroundColor: "#D97706",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  driverRegisterBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  // About Content
  aboutContent: {
    alignItems: "center",
    padding: 28,
  },
  aboutLogoEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  aboutAppName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  aboutTagline: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
    marginBottom: 14,
  },
  aboutDesc: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutVersionBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  aboutVersionText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  // Support Cards
  supportContactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 12,
  },
  supportIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  supportSub: {
    fontSize: 13,
    color: "#64748B",
  },
});
